import { useState, useEffect, useCallback, useMemo } from 'react'
import { Download, Printer } from 'lucide-react'
import { Navbar, Sidebar, KpiCard, RatingsTable, SearchBar, FilterPanel, RatingTrendsChart } from '../components/dashboard'
import CompanyDetailPanel from '../components/dashboard/CompanyDetailPanel'
import StatusDonutChart from '../components/dashboard/StatusDonutChart'
import { kpiData, ratingsData, industries, ratingsList, statusList, monthlyRatingsData } from '../data/mockData'
import { useDashboardFilters } from '../hooks/useDashboardFilters'
import { useToast } from '../hooks/useToast'
import { exportToCsv } from '../lib/exportCsv'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

// Maps each KPI card id to the status filter it triggers (null = no filter)
const KPI_FILTER_MAP = {
  1: null,          // Portfolio Risk Score — no drill-down
  2: 'All',         // Companies Monitored  — show all
  3: 'Upgrade',     // Rating Changes       — show upgrades
  4: 'Downgrade',   // Active Alerts        — show downgrades
}

function KpiSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col gap-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
  )
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loading, setLoading]             = useState(true)

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }), [])

  const toast = useToast()

  const {
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
    page, setPage,
    totalPages,
    rangeStart, rangeEnd,
    pagedData,
  } = useDashboardFilters(ratingsData, monthlyRatingsData)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const handleRowClick = useCallback((row) => {
    setSelectedCompany(row)
    toast(`Viewing ${row.company}`, 'info', 2500)
  }, [toast])

  const handleClearFilters = useCallback(() => {
    clearFilters()
    toast('Filters cleared', 'success', 2000)
  }, [clearFilters, toast])

  const handleExport = useCallback(() => {
    exportToCsv(filteredData, 'moodys-ratings.csv')
    toast(`Exported ${filteredData.length} companies`, 'success', 2500)
  }, [filteredData, toast])

  const handleKpiClick = useCallback((kpiId) => {
    const statusValue = KPI_FILTER_MAP[kpiId]
    if (statusValue === null) return
    handleKpiFilter(statusValue)
    toast(`Filtered by: ${statusValue === 'All' ? 'All companies' : statusValue}`, 'info', 2000)
  }, [handleKpiFilter, toast])

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">

      <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 flex flex-col gap-6 min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">
                Welcome back, John
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {todayLabel}
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
              : kpiData.map(kpi => (
                <KpiCard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  trend={kpi.trend}
                  trendDirection={kpi.trendDirection}
                  onClick={KPI_FILTER_MAP[kpi.id] !== null ? () => handleKpiClick(kpi.id) : undefined}
                  active={
                    KPI_FILTER_MAP[kpi.id] === filters.status ||
                    (KPI_FILTER_MAP[kpi.id] === 'All' && filters.status === 'All' && !hasActiveFilters)
                  }
                />
              ))
            }
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch print:hidden">
            <div className="lg:col-span-2">
              <RatingTrendsChart
                onStatusFilter={handleStatusFilter}
                activeStatus={filters.status}
                onChartClick={handleChartClick}
                selectedMonth={selectedMonth}
              />
            </div>
            <StatusDonutChart data={filteredData} />
          </div>

          {/* Search + Filters */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col gap-4 print:hidden">
            <SearchBar value={search} onChange={setSearch} />
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              industries={industries}
              ratings={ratingsList}
              statuses={statusList}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
            />
          </div>

          {/* Count row */}
          <div className="flex items-center justify-between -mb-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {filteredData.length === 0 ? (
                <>No companies found</>
              ) : (
                <>
                  Showing{' '}
                  <span className="font-medium text-neutral-800 dark:text-white">{rangeStart}–{rangeEnd}</span>
                  {' '}of{' '}
                  <span className="font-medium text-neutral-800 dark:text-white">{filteredData.length}</span>
                  {' '}companies
                  {selectedMonth && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                      — {selectedMonth.status} in {selectedMonth.month}
                    </span>
                  )}
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                leftIcon={<Download size={13} />}
                disabled={filteredData.length === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer size={13} />}
                className="print:hidden"
              >
                Print
              </Button>
            </div>
          </div>

          <RatingsTable
            data={pagedData}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onRowClick={handleRowClick}
            loading={loading}
            search={search}
          />

        </main>
      </div>

      {selectedCompany && (
        <CompanyDetailPanel
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

    </div>
  )
}

export default Dashboard
