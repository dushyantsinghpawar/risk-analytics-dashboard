import { useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { ratingTrendsData } from '../../data/mockData'
import useTheme from '../../hooks/useTheme'
import { statusColors } from '../../lib/chartColors'

const STATUS_MAP = {
  upgrades: 'Upgrade',
  downgrades: 'Downgrade',
  stable: 'Stable',
}

const DOT_KEYS = ['upgrades', 'downgrades', 'stable']

function getDotOffset(dataKey, payload) {
  if (!payload) return 0
  const val = payload[dataKey]
  const conflicts = DOT_KEYS.filter(k => payload[k] === val)
  if (conflicts.length === 1) return 0
  const idx = conflicts.indexOf(dataKey)
  const step = 9
  return -(conflicts.length - 1) * step / 2 + idx * step
}

function RatingTrendsChart({ onStatusFilter, activeStatus, onChartClick, selectedMonth }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor   = isDark ? '#334155' : '#E2E8F0'
  const tickColor   = isDark ? '#94A3B8' : '#64748B'
  const legendColor = isDark ? '#94A3B8' : '#475569'
  const C = statusColors(isDark)

  const handleLegendClick = useCallback((e) => {
    const mapped = STATUS_MAP[e.value]
    if (!mapped) return
    onStatusFilter(activeStatus === mapped ? 'All' : mapped)
  }, [activeStatus, onStatusFilter])

  const handleLineClick = useCallback((dataKey, dotProps) => {
    const month = dotProps?.payload?.month
    if (!month) return
    onChartClick(month, STATUS_MAP[dataKey])
  }, [onChartClick])

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">

      <div className="mb-2">
        <h2 className="text-base font-semibold text-neutral-800 dark:text-white">
          Rating Trends
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Click a dot on the chart to filter the table by month and status
        </p>
      </div>

      {/* Active filter pill */}
      {(activeStatus !== 'All' || selectedMonth) && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
            {selectedMonth
              ? `${selectedMonth.status} in ${selectedMonth.month}`
              : `Filtering by: ${activeStatus}`}
          </span>
          <button
            onClick={() => onStatusFilter('All')}
            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            ✕ Clear
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
            data={ratingTrendsData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: tickColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: tickColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            isAnimationActive={false}
            position={{ y: 0 }}
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null
              return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 shadow-lg">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  {payload.map((item) => (
                    <div
                      key={item.dataKey}
                      className="flex items-center gap-2 text-sm py-0.5"
                    >
                      <span style={{ color: item.color }}>●</span>
                      <span className="text-gray-300 capitalize">{item.dataKey}</span>
                      <span className="font-semibold text-white ml-auto pl-4">{item.value}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">Click a dot to filter table</p>
                </div>
              )
            }}
            cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '13px', paddingTop: '16px', cursor: 'pointer', color: legendColor }}
            onClick={handleLegendClick}
            formatter={(value) => {
              const mapped = STATUS_MAP[value]
              const isActive = activeStatus === mapped
              const isDimmed = activeStatus !== 'All' && !isActive
              return (
                <span style={{ color: isDimmed ? '#64748B' : legendColor }}>
                  {value} {isActive ? '✓' : ''}
                </span>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="upgrades"
            stroke={C.Upgrade}
            strokeWidth={activeStatus === 'Upgrade' ? 3 : 2}
            strokeOpacity={activeStatus !== 'All' && activeStatus !== 'Upgrade' ? 0.3 : 1}
            dot={(props) => {
              const o = getDotOffset('upgrades', props.payload)
              return <circle key={props.key} cx={props.cx} cy={props.cy + o} r={4} fill={C.Upgrade} style={{ cursor: 'pointer' }} />
            }}
            activeDot={(props) => {
              const o = getDotOffset('upgrades', props.payload)
              return <circle cx={props.cx} cy={props.cy + o} r={7} fill={C.Upgrade} style={{ cursor: 'pointer' }}
                onClick={() => handleLineClick('upgrades', props)} />
            }}
          />
          <Line
            type="monotone"
            dataKey="downgrades"
            stroke={C.Downgrade}
            strokeWidth={activeStatus === 'Downgrade' ? 3 : 2}
            strokeOpacity={activeStatus !== 'All' && activeStatus !== 'Downgrade' ? 0.3 : 1}
            dot={(props) => {
              const o = getDotOffset('downgrades', props.payload)
              return <circle key={props.key} cx={props.cx} cy={props.cy + o} r={4} fill={C.Downgrade} style={{ cursor: 'pointer' }} />
            }}
            activeDot={(props) => {
              const o = getDotOffset('downgrades', props.payload)
              return <circle cx={props.cx} cy={props.cy + o} r={7} fill={C.Downgrade} style={{ cursor: 'pointer' }}
                onClick={() => handleLineClick('downgrades', props)} />
            }}
          />
          <Line
            type="monotone"
            dataKey="stable"
            stroke={C.Stable}
            strokeWidth={activeStatus === 'Stable' ? 3 : 2}
            strokeOpacity={activeStatus !== 'All' && activeStatus !== 'Stable' ? 0.3 : 1}
            dot={(props) => {
              const o = getDotOffset('stable', props.payload)
              return <circle key={props.key} cx={props.cx} cy={props.cy + o} r={4} fill={C.Stable} style={{ cursor: 'pointer' }} />
            }}
            activeDot={(props) => {
              const o = getDotOffset('stable', props.payload)
              return <circle cx={props.cx} cy={props.cy + o} r={7} fill={C.Stable} style={{ cursor: 'pointer' }}
                onClick={() => handleLineClick('stable', props)} />
            }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

export default RatingTrendsChart