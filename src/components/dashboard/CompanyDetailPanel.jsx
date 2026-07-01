import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Badge from '../ui/Badge'
import { cn } from '../../lib/cn'
import useTheme from '../../hooks/useTheme'
import { statusColors } from '../../lib/chartColors'

const STATUS_VARIANT  = { Upgrade: 'success', Downgrade: 'danger', Stable: 'default' }
const OUTLOOK_VARIANT = { Positive: 'success', Negative: 'danger',  Stable: 'default' }
const RATING_COLOR    = { Upgrade: 'text-green-600 dark:text-green-400', Downgrade: 'text-red-600 dark:text-red-400', Stable: 'text-blue-600 dark:text-blue-400' }

function DetailRow({ label, value, valueClass }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
      <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className={cn('text-sm font-medium text-neutral-800 dark:text-white', valueClass)}>{value}</span>
    </div>
  )
}

function CompanyDetailPanel({ company, onClose }) {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const tickColor = isDark ? '#94A3B8' : '#64748B'
  const AREA_COLOR = statusColors(isDark)
  if (!company) return null

  const color = AREA_COLOR[company.status]
  const history = company.history ?? []

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-105 bg-white dark:bg-neutral-800 shadow-xl z-40 flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
          <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Company Detail</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Hero */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white truncate">{company.company}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{company.industry} · {company.country}</p>
            </div>
            <div className="flex flex-col gap-1.5 items-end shrink-0">
              <Badge label={company.status}  variant={STATUS_VARIANT[company.status]} />
              <Badge label={`Outlook: ${company.outlook}`} variant={OUTLOOK_VARIANT[company.outlook]} />
            </div>
          </div>

          {/* Rating change */}
          <div className="px-6 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 text-center">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Previous</p>
                <p className="text-2xl font-bold text-neutral-500 dark:text-neutral-300">{company.previousRating}</p>
              </div>
              <span className="text-neutral-400 text-lg shrink-0">→</span>
              <div className="flex-1 bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 text-center">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Current</p>
                <p className={cn('text-2xl font-bold', RATING_COLOR[company.status])}>{company.currentRating}</p>
              </div>
            </div>
          </div>

          {/* Sparkline */}
          {history.length > 0 && (
            <div className="px-6 pb-5">
              <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                6-Month Rating Trend
              </p>
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={color} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white shadow">
                            {label}: <span style={{ color }}>{payload[0].value}</span>
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#grad-${company.id})`}
                      dot={false}
                      activeDot={{ r: 4, fill: color }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Analyst note */}
          {company.analystNote && (
            <div className="px-6 pb-5">
              <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                Analyst Note
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {company.analystNote}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="px-6 pb-6">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
              Details
            </p>
            <DetailRow label="Analyst"         value={company.analyst} />
            <DetailRow label="Last Review"      value={company.date} />
            <DetailRow label="Market Cap Tier"  value={company.marketCapTier} />
            <DetailRow label="Country"          value={company.country} />
            <DetailRow label="Industry"         value={company.industry} />
            <DetailRow
              label="Current Rating"
              value={company.currentRating}
              valueClass={RATING_COLOR[company.status]}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-md transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </>
  )
}

export default CompanyDetailPanel
