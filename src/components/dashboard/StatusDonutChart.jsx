import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import useTheme from '../../hooks/useTheme'
import { statusColors } from '../../lib/chartColors'

function StatusDonutChart({ data }) {
  const { theme } = useTheme()
  const COLORS = statusColors(theme === 'dark')

  const chartData = useMemo(() => {
    const counts = { Upgrade: 0, Downgrade: 0, Stable: 0 }
    data.forEach(d => { if (counts[d.status] !== undefined) counts[d.status]++ })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data])

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0">
        <h2 className="text-base font-semibold text-neutral-800 dark:text-white">Status Distribution</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Breakdown of {total} companies
        </p>
      </div>

      {/* Donut */}
      <div className="relative mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="38%"
              outerRadius="58%"
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map(entry => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const { name, value } = payload[0].payload
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs shadow-lg">
                    <span style={{ color: COLORS[name] }}>● </span>
                    <span className="text-white font-medium">{name}</span>
                    <span className="text-neutral-400 ml-2">{value} ({pct}%)</span>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label — absolutely positioned over the donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-neutral-800 dark:text-white">{total}</span>
          <span className="text-xs text-neutral-400">total</span>
        </div>
      </div>

      {/* Legend — pinned at bottom */}
      <div className="shrink-0 flex flex-col gap-2 mt-4">
        {chartData.map(({ name, value }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <div key={name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[name] }} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 flex-1">{name}</span>
              <span className="text-sm font-semibold text-neutral-800 dark:text-white">{value}</span>
              <span className="text-xs text-neutral-400 tabular-nums w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default StatusDonutChart
