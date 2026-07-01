import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import { Navbar, Sidebar } from '../components/dashboard'
import { ratingsData, RATING_SCORE } from '../data/mockData'
import Skeleton from '../components/ui/Skeleton'
import { cn } from '../lib/cn'
import useTheme from '../hooks/useTheme'
import { statusColors, tierColors } from '../lib/chartColors'

// ─── Data aggregation ────────────────────────────────────────
const RATING_TIERS = [
  { label: 'AAA – AA',  ratings: ['AAA','AA+','AA','AA-'],              color: '#16A34A', bg: 'bg-green-500'  },
  { label: 'A+ – A-',   ratings: ['A+','A','A-'],                       color: '#0052CC', bg: 'bg-blue-600'   },
  { label: 'BBB',       ratings: ['BBB+','BBB','BBB-'],                 color: '#D97706', bg: 'bg-yellow-500' },
  { label: 'BB – B',    ratings: ['BB+','BB','BB-','B+','B','B-'],      color: '#DC2626', bg: 'bg-red-500'    },
  { label: 'CCC & below', ratings: ['CCC','CC','C','D'],                color: '#7C3AED', bg: 'bg-purple-600' },
]

function buildIndustryData(data) {
  const map = {}
  data.forEach(c => {
    if (!map[c.industry]) map[c.industry] = { industry: c.industry, total: 0, Upgrade: 0, Downgrade: 0, Stable: 0, scores: [] }
    map[c.industry].total++
    map[c.industry][c.status]++
    map[c.industry].scores.push(RATING_SCORE[c.currentRating] ?? 0)
  })
  return Object.values(map)
    .map(d => ({ ...d, avgScore: +(d.scores.reduce((a, b) => a + b, 0) / d.scores.length).toFixed(1) }))
    .sort((a, b) => b.total - a.total)
}

function buildTierData(data) {
  return RATING_TIERS.map(t => ({
    label:  t.label,
    count:  data.filter(c => t.ratings.includes(c.currentRating)).length,
    color:  t.color,
    bg:     t.bg,
  }))
}

// ─── Sub-components ──────────────────────────────────────────
function SummaryCard({ icon: Icon, iconClass, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
        <span className={cn('p-1.5 rounded-md', iconClass)}>
          <Icon size={15} />
        </span>
      </div>
      <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  )
}

function SortIcon({ col, sortKey, sortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-neutral-400" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-blue-600" />
    : <ChevronDown size={13} className="text-blue-600" />
}

function MiniBar({ value, max, colorClass }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums w-4 text-right text-neutral-500">{value}</span>
    </div>
  )
}

const CUSTOM_TOOLTIP = (nameMap) => ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 shadow-lg text-xs">
      <p className="text-neutral-300 font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span style={{ color: p.fill }}>●</span>
          <span className="text-neutral-300">{nameMap[p.dataKey] ?? p.dataKey}</span>
          <span className="font-bold text-white ml-auto pl-4">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────
function Portfolio() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor   = isDark ? '#334155' : '#E2E8F0'
  const tickColor   = isDark ? '#94A3B8' : '#64748B'
  const legendColor = isDark ? '#94A3B8' : '#475569'
  const C  = statusColors(isDark)
  const TC = tierColors(isDark)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading]         = useState(true)
  const [sortKey, setSortKey]         = useState('total')
  const [sortDir, setSortDir]         = useState('desc')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const industryData = useMemo(() => buildIndustryData(ratingsData), [])
  const tierData     = useMemo(() => buildTierData(ratingsData),    [])

  const sorted = useMemo(() => {
    return [...industryData].sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      const cmp = typeof av === 'number' ? av - bv : av.toString().localeCompare(bv.toString())
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [industryData, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const totalCompanies   = ratingsData.length
  const investmentGrade  = ratingsData.filter(c => (RATING_SCORE[c.currentRating] ?? 0) >= 14).length
  const upgradeCount     = ratingsData.filter(c => c.status === 'Upgrade').length
  const downgradeCount   = ratingsData.filter(c => c.status === 'Downgrade').length
  const maxTotal         = Math.max(...industryData.map(d => d.total))

  const COLUMNS = [
    { key: 'industry',  label: 'Industry',   sortable: true  },
    { key: 'total',     label: 'Total',      sortable: true  },
    { key: 'Upgrade',   label: 'Upgrades',   sortable: true  },
    { key: 'Downgrade', label: 'Downgrades', sortable: true  },
    { key: 'Stable',    label: 'Stable',     sortable: true  },
    { key: 'avgScore',  label: 'Avg Score',  sortable: true  },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 sm:p-6 flex flex-col gap-6 min-w-0">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">Portfolio Overview</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Aggregate view across all monitored companies
              </p>
            </div>
          </div>

          {/* Summary KPIs */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5 flex flex-col gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard icon={Minus}        iconClass="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"   label="Total Companies"   value={totalCompanies}  sub="across all industries" />
              <SummaryCard icon={TrendingUp}   iconClass="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" label="Investment Grade"  value={investmentGrade} sub={`${Math.round(investmentGrade / totalCompanies * 100)}% of portfolio`} />
              <SummaryCard icon={TrendingUp}   iconClass="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" label="Upgrades (YTD)"    value={upgradeCount}    sub="rating improvements" />
              <SummaryCard icon={TrendingDown} iconClass="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"         label="Downgrades (YTD)" value={downgradeCount}  sub="rating deteriorations" />
            </div>
          )}

          {/* Charts */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[320, 280].map((h, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-56 mb-5" />
                  <Skeleton className={`w-full`} style={{ height: h }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Industry stacked bar */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Companies by Industry</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-4">Stacked by rating action</p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={industryData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="industry" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={CUSTOM_TOOLTIP({ Upgrade: 'Upgrades', Downgrade: 'Downgrades', Stable: 'Stable' })} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: legendColor }} />
                    <Bar dataKey="Upgrade"   stackId="a" fill={C.Upgrade}   radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Downgrade" stackId="a" fill={C.Downgrade} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Stable"    stackId="a" fill={C.Stable}    radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Rating tier distribution */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Rating Tier Distribution</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-4">Companies per credit quality tier</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tierData} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                    <Tooltip content={CUSTOM_TOOLTIP({ count: 'Companies' })} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {tierData.map((entry, i) => (
                        <Cell key={entry.label} fill={TC[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Tier legend with counts */}
                <div className="mt-4 flex flex-col gap-2">
                  {tierData.map(t => (
                    <div key={t.label} className="flex items-center gap-2">
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', t.bg)} />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 flex-1">{t.label}</span>
                      <span className="text-sm font-semibold text-neutral-800 dark:text-white">{t.count}</span>
                      <span className="text-xs text-neutral-400 tabular-nums w-8 text-right">
                        {totalCompanies > 0 ? Math.round(t.count / totalCompanies * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Industry breakdown table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Industry Breakdown</h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{industryData.length} industries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-700/50 text-left">
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        onClick={col.sortable ? () => handleSort(col.key) : undefined}
                        className={cn(
                          'px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap',
                          col.sortable && 'cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 select-none'
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.sortable && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-48">
                      Distribution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-neutral-100 dark:border-neutral-700">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        ))}
                      </tr>
                    ))
                    : sorted.map(row => (
                      <tr key={row.industry} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white whitespace-nowrap">{row.industry}</td>
                        <td className="px-6 py-4 font-semibold text-neutral-800 dark:text-white">{row.total}</td>
                        <td className="px-6 py-4 text-green-600 dark:text-green-400 font-medium">{row.Upgrade}</td>
                        <td className="px-6 py-4 text-red-600 dark:text-red-400 font-medium">{row.Downgrade}</td>
                        <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">{row.Stable}</td>
                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 font-medium">{row.avgScore}</td>
                        <td className="px-6 py-4 w-48">
                          <div className="flex flex-col gap-1">
                            <MiniBar value={row.Upgrade}   max={maxTotal} colorClass="bg-green-500" />
                            <MiniBar value={row.Downgrade} max={maxTotal} colorClass="bg-red-500"   />
                            <MiniBar value={row.Stable}    max={maxTotal} colorClass="bg-blue-500"  />
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Portfolio
