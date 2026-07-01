import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Navbar, Sidebar } from '../components/dashboard'
import { Badge } from '../components/ui'
import Skeleton from '../components/ui/Skeleton'
import { ratingsData } from '../data/mockData'
import { cn } from '../lib/cn'
import { getSeverity } from '../lib/severity'

const SEVERITY_VARIANT = { High: 'danger', Medium: 'warning', Low: 'info' }
const SEVERITY_ORDER   = { High: 0, Medium: 1, Low: 2 }

const SEVERITY_BAR = {
  High:   'bg-red-500',
  Medium: 'bg-yellow-500',
  Low:    'bg-blue-400',
}

function SortIcon({ col, sortKey, sortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-neutral-400" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-blue-600" />
    : <ChevronDown size={13} className="text-blue-600" />
}

function Alerts() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading]         = useState(true)
  const [sortKey, setSortKey]         = useState('severity')
  const [sortDir, setSortDir]         = useState('asc')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750)
    return () => clearTimeout(t)
  }, [])

  const downgrades = useMemo(() =>
    ratingsData
      .filter(r => r.status === 'Downgrade')
      .map(r => ({ ...r, severity: getSeverity(r.previousRating, r.currentRating) })),
    []
  )

  const sorted = useMemo(() => {
    return [...downgrades].sort((a, b) => {
      if (sortKey === 'severity') {
        const cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
        return sortDir === 'asc' ? cmp : -cmp
      }
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = av.toString().localeCompare(bv.toString())
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [downgrades, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const highCount   = downgrades.filter(d => d.severity === 'High').length
  const medCount    = downgrades.filter(d => d.severity === 'Medium').length
  const lowCount    = downgrades.filter(d => d.severity === 'Low').length

  const COLUMNS = [
    { key: 'company',        label: 'Company',         sortable: true },
    { key: 'industry',       label: 'Industry',        sortable: true },
    { key: 'previousRating', label: 'From',            sortable: false },
    { key: 'currentRating',  label: 'To',              sortable: true  },
    { key: 'severity',       label: 'Severity',        sortable: true  },
    { key: 'analyst',        label: 'Analyst',         sortable: true  },
    { key: 'date',           label: 'Date',            sortable: true  },
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
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-neutral-800 dark:text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Active Alerts
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Companies with recent rating downgrades
              </p>
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm flex flex-col gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-12" />
                </div>
              ))
              : [
                  { label: 'Total Downgrades', value: downgrades.length, color: 'text-neutral-800 dark:text-white',     bar: 'bg-neutral-400' },
                  { label: 'High Severity',    value: highCount,         color: 'text-red-600 dark:text-red-400',       bar: 'bg-red-500'     },
                  { label: 'Medium Severity',  value: medCount,          color: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500'  },
                  { label: 'Low Severity',     value: lowCount,          color: 'text-blue-600 dark:text-blue-400',     bar: 'bg-blue-400'    },
                ].map(({ label, value, color, bar }) => (
                  <div key={label} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm overflow-hidden relative">
                    <div className={cn('absolute top-0 left-0 right-0 h-1', bar)} />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{label}</p>
                    <p className={cn('text-3xl font-bold mt-1', color)}>{value}</p>
                  </div>
                ))
            }
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Downgrade Details</h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{sorted.length} companies</span>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 7 }).map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : sorted.map(row => (
                    <tr key={row.id} className="hover:bg-red-50/40 dark:hover:bg-neutral-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={cn('w-1.5 h-6 rounded-full shrink-0', SEVERITY_BAR[row.severity])} />
                          {row.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{row.industry}</td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 font-medium">{row.previousRating}</td>
                      <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400">{row.currentRating}</td>
                      <td className="px-6 py-4">
                        <Badge label={row.severity} variant={SEVERITY_VARIANT[row.severity]} />
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{row.analyst}</td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Alerts
