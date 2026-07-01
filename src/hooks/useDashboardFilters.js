import { useMemo, useState } from 'react'

const PAGE_SIZE = 10

export function useDashboardFilters(ratingsData, monthlyRatingsData) {
  const [search, setSearch]               = useState('')
  const [filters, setFilters]             = useState({ industry: 'All', rating: 'All', status: 'All' })
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [dateFrom, setDateFrom]           = useState('')
  const [dateTo, setDateTo]               = useState('')
  const [page, setPage]                   = useState(1)
  const [prevFilteredData, setPrevFilteredData] = useState(null)

  const hasActiveFilters =
    search !== '' ||
    filters.industry !== 'All' ||
    filters.rating   !== 'All' ||
    filters.status   !== 'All' ||
    selectedMonth !== null ||
    dateFrom !== '' ||
    dateTo   !== ''

  const clearFilters = () => {
    setSearch('')
    setFilters({ industry: 'All', rating: 'All', status: 'All' })
    setSelectedMonth(null)
    setDateFrom('')
    setDateTo('')
  }

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }))
    setSelectedMonth(null)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setSelectedMonth(null)
  }

  const handleChartClick = (month, status) => {
    if (selectedMonth?.month === month && selectedMonth?.status === status) {
      setSelectedMonth(null)
    } else {
      setSelectedMonth({ month, status })
      setFilters(prev => ({ ...prev, status: 'All' }))
    }
  }

  // KPI card click — maps to a status preset
  const handleKpiFilter = (statusValue) => {
    setFilters({ industry: 'All', rating: 'All', status: statusValue })
    setSelectedMonth(null)
    setDateFrom('')
    setDateTo('')
    setSearch('')
  }

  const filteredData = useMemo(() => {
    if (selectedMonth) {
      const ids = monthlyRatingsData[selectedMonth.month]?.[selectedMonth.status] || []
      return ratingsData.filter(row => ids.includes(row.id))
    }
    return ratingsData.filter(row => {
      const matchesSearch    = row.company.toLowerCase().includes(search.toLowerCase())
      const matchesIndustry  = filters.industry === 'All' || row.industry      === filters.industry
      const matchesRating    = filters.rating   === 'All' || row.currentRating === filters.rating
      const matchesStatus    = filters.status   === 'All' || row.status        === filters.status
      const matchesDateFrom  = !dateFrom || row.date >= dateFrom
      const matchesDateTo    = !dateTo   || row.date <= dateTo
      return matchesSearch && matchesIndustry && matchesRating && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [search, filters, selectedMonth, dateFrom, dateTo, ratingsData, monthlyRatingsData])

  // Reset to page 1 whenever the filtered set changes, so the cursor never
  // gets stuck on a page that no longer exists. Adjusted during render
  // (React's recommended pattern) rather than in an effect, to avoid an
  // extra render pass.
  if (filteredData !== prevFilteredData) {
    setPrevFilteredData(filteredData)
    if (page !== 1) setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const rangeStart = filteredData.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd   = Math.min(safePage * PAGE_SIZE, filteredData.length)
  const pagedData  = filteredData.slice(rangeStart === 0 ? 0 : rangeStart - 1, rangeEnd)

  return {
    search, setSearch,
    filters, handleFilterChange,
    selectedMonth,
    dateFrom, setDateFrom,
    dateTo,   setDateTo,
    hasActiveFilters,
    clearFilters,
    handleStatusFilter,
    handleChartClick,
    handleKpiFilter,
    filteredData,
    page: safePage, setPage,
    totalPages,
    rangeStart, rangeEnd,
    pagedData,
  }
}
