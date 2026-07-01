import { cn } from '../../lib/cn'

const selectClass = 'text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors'

function FilterPanel({ filters, onChange, industries, ratings, statuses, dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <div className="flex flex-wrap gap-4 items-end">

      {/* Industry */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Industry
        </label>
        <select
          value={filters.industry}
          onChange={(e) => onChange({ ...filters, industry: e.target.value })}
          className={selectClass}
        >
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => onChange({ ...filters, rating: e.target.value })}
          className={selectClass}
        >
          {ratings.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className={selectClass}
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Date From */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          From
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className={cn(selectClass, 'cursor-pointer')}
        />
      </div>

      {/* Date To */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          To
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className={cn(selectClass, 'cursor-pointer')}
        />
      </div>

    </div>
  )
}

export default FilterPanel
