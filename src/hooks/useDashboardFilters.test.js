import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDashboardFilters } from './useDashboardFilters'

const STATUSES = ['Upgrade', 'Downgrade', 'Stable']
const INDUSTRIES = ['Technology', 'Finance']

const ratingsData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  company: `Company ${i + 1}`,
  industry: INDUSTRIES[i % 2],
  currentRating: 'A',
  status: STATUSES[i % 3],
  date: '2025-06-01',
}))

const monthlyRatingsData = {
  Jan: { Upgrade: [1, 4, 7], Downgrade: [2, 5] },
}

function setup() {
  return renderHook(() => useDashboardFilters(ratingsData, monthlyRatingsData))
}

describe('useDashboardFilters', () => {
  it('returns all rows and the first page by default', () => {
    const { result } = setup()
    expect(result.current.filteredData).toHaveLength(25)
    expect(result.current.pagedData).toHaveLength(10)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('filters by search text case-insensitively', () => {
    const { result } = setup()
    act(() => result.current.setSearch('company 1'))
    // matches "Company 1", "Company 10".."Company 19"
    expect(result.current.filteredData.every(r => r.company.toLowerCase().includes('company 1'))).toBe(true)
    expect(result.current.filteredData.length).toBeGreaterThan(0)
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it('filters by industry via handleFilterChange and clears any month selection', () => {
    const { result } = setup()
    act(() => result.current.handleChartClick('Jan', 'Upgrade'))
    expect(result.current.selectedMonth).toEqual({ month: 'Jan', status: 'Upgrade' })

    act(() => result.current.handleFilterChange({ industry: 'Finance', rating: 'All', status: 'All' }))
    expect(result.current.selectedMonth).toBeNull()
    expect(result.current.filteredData.every(r => r.industry === 'Finance')).toBe(true)
  })

  it('drills down via handleChartClick and toggles off on repeat click', () => {
    const { result } = setup()
    act(() => result.current.handleChartClick('Jan', 'Upgrade'))
    expect(result.current.filteredData.map(r => r.id).sort()).toEqual([1, 4, 7])

    act(() => result.current.handleChartClick('Jan', 'Upgrade'))
    expect(result.current.selectedMonth).toBeNull()
    expect(result.current.filteredData).toHaveLength(25)
  })

  it('handleKpiFilter resets other filters and applies a single status', () => {
    const { result } = setup()
    act(() => result.current.setSearch('Company 1'))
    act(() => result.current.handleKpiFilter('Downgrade'))
    expect(result.current.search).toBe('')
    expect(result.current.filters.status).toBe('Downgrade')
    expect(result.current.filteredData.every(r => r.status === 'Downgrade')).toBe(true)
  })

  it('clearFilters resets every filter atom', () => {
    const { result } = setup()
    act(() => {
      result.current.setSearch('Company 1')
      result.current.handleFilterChange({ industry: 'Finance', rating: 'All', status: 'Upgrade' })
      result.current.setDateFrom('2025-01-01')
      result.current.setDateTo('2025-12-31')
    })
    expect(result.current.hasActiveFilters).toBe(true)

    act(() => result.current.clearFilters())
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.filteredData).toHaveLength(25)
  })

  it('resets to page 1 when the filtered set changes after paging forward', () => {
    const { result } = setup()
    act(() => result.current.setPage(3))
    expect(result.current.page).toBe(3)

    act(() => result.current.handleKpiFilter('Downgrade'))
    expect(result.current.page).toBe(1)
  })
})
