import { cn } from '../../lib/cn'

function KpiCard({ title, value, trend, trendDirection, onClick, active = false }) {
  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-neutral-800 rounded-lg shadow-sm border p-6 transition-all duration-150',
        isClickable && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        active
          ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/30'
          : 'border-neutral-200 dark:border-neutral-700'
      )}
    >
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {title}
      </p>

      <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
        {value}
      </p>

      {trend && (
        <p className={cn(
          'text-sm mt-2 font-medium',
          trendDirection === 'up'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        )}>
          {trendDirection === 'up' ? '▲' : '▼'} {trend} since last month
        </p>
      )}

      {isClickable && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
          Click to filter
        </p>
      )}
    </div>
  )
}

export default KpiCard
