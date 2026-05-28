import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * HourlySessionsChart Component
 * Displays sessions per hour as a line chart
 */
function HourlySessionsChart({ data = [] }) {
  // Transform data for recharts
  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const hourData = data.find(d => parseInt(d.hour) === hour)
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sessions: hourData ? parseInt(hourData.count) : 0,
    }
  })

  const maxSessions = Math.max(...chartData.map(d => d.sessions), 1)

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span>Sessions Per Hour</span>
        </h3>
        <p className="text-slate-400 text-xs mt-1">Activity distribution throughout the day</p>
      </div>

      {chartData.every(d => d.sessions === 0) ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No session data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="hour" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              domain={[0, maxSessions + 2]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '12px' }}
              itemStyle={{ color: '#818cf8', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#818cf8" 
              strokeWidth={3}
              dot={{ fill: '#818cf8', r: 4 }}
              activeDot={{ r: 6, fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default HourlySessionsChart
