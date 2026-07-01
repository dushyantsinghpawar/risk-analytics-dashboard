import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '../ui'
import Skeleton from '../ui/Skeleton'
import HighlightText from '../ui/HighlightText'
import { cn } from '../../lib/cn'

const STATUS_VARIANT = { Upgrade: 'success', Downgrade: 'danger', Stable: 'default' }

const COLUMNS = [
  { key: 'company',        label: 'Company',        sortable: true,  responsive: ''             },
  { key: 'industry',       label: 'Industry',       sortable: true,  responsive: 'hidden sm:table-cell' },
  { key: 'currentRating',  label: 'Current Rating', sortable: true,  responsive: ''             },
  { key: 'previousRating', label: 'Prev Rating',    sortable: false, responsive: 'hidden md:table-cell' },
  { key: 'status',         label: 'Status',         sortable: true,  responsive: ''             },
  { key: 'country',        label: 'Country',        sortable: true,  responsive: 'hidden lg:table-cell' },
  { key: 'analyst',        label: 'Analyst',        sortable: true,  responsive: 'hidden lg:table-cell' },
]

function SortIcon({ col, sortKey, sortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-neutral-400" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-blue-600" />
    : <ChevronDown size={13} className="text-blue-600" />
}

function RatingsTable({ data, page, setPage, totalPages, onRowClick, loading = false, search = '' }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = av.toString().localeCompare(bv.toString())
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">

      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-base font-semibold text-neutral-800 dark:text-white">
          Recent Rating Changes
        </h2>
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
                    col.sortable && 'cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 select-none',
                    col.responsive
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
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => <Skeleton.Row key={i} />)
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500">
                  No results found.
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className="hover:bg-blue-50/60 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                    <HighlightText text={row.company} query={search} />
                  </td>
                  <td className={cn('px-6 py-4 text-neutral-600 dark:text-neutral-400', 'hidden sm:table-cell')}>{row.industry}</td>
                  <td className="px-6 py-4 font-semibold text-blue-700 dark:text-blue-400">{row.currentRating}</td>
                  <td className={cn('px-6 py-4 text-neutral-500 dark:text-neutral-400', 'hidden md:table-cell')}>{row.previousRating}</td>
                  <td className="px-6 py-4">
                    <Badge label={row.status} variant={STATUS_VARIANT[row.status]} />
                  </td>
                  <td className={cn('px-6 py-4 text-neutral-600 dark:text-neutral-400', 'hidden lg:table-cell')}>{row.country}</td>
                  <td className={cn('px-6 py-4 text-neutral-600 dark:text-neutral-400', 'hidden lg:table-cell')}>{row.analyst}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {!loading && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Page{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{page}</span>
            {' '}of{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-7 h-7 text-xs rounded-md transition-colors',
                  p === page
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default RatingsTable
