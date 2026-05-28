import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/**
 * TemplateBreakdownChart Component
 * Displays template usage as a bar chart
 */
function TemplateBreakdownChart({ data = [] }) {
  // Template display names
  const templateNames = {
    'classic-black': 'Classic Black',
    'classic-white': 'Classic White',
    'elegant-gold': 'Elegant Gold',
    'modern-blue': 'Modern Blue',
  }

  // Template colors
  const templateColors = {
    'classic-black': '#1e293b',
    'classic-white': '#f1f5f9',
    'elegant-gold': '#fbbf24',
    'modern-blue': '#3b82f6',
  }

  // Transform data for recharts
  const chartData = data.map(item => ({
    template: templateNames[item.template_id] || item.template_id || 'Unknown',
    count: parseInt(item.count) || 0,
    color: templateColors[item.template_id] || '#6366f1',
  }))

  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span>Template Usage</span>
        </h3>
        <p className="text-slate-400 text-xs mt-1">Most popular photo strip designs</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p className="text-sm">No template data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="template" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              domain={[0, maxCount + 2]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '12px' }}
              itemStyle={{ color: '#a78bfa', fontSize: '12px' }}
              cursor={{ fill: '#1e293b', opacity: 0.3 }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color, opacity: 0.8 }}
              ></div>
              <span className="text-xs text-slate-400">
                {item.template}: <span className="font-semibold text-slate-300">{item.count}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateBreakdownChart
