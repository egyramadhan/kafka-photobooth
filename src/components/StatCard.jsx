/**
 * StatCard Component
 * Displays a single statistic with icon, value, and label
 */

function StatCard({ icon, label, value, subtitle, color = 'indigo', trend = null }) {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-300',
      iconBg: 'bg-indigo-500/20',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-300',
      iconBg: 'bg-purple-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-300',
      iconBg: 'bg-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-300',
      iconBg: 'bg-amber-500/20',
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'text-pink-300',
      iconBg: 'bg-pink-500/20',
    },
  }

  const colors = colorClasses[color] || colorClasses.indigo

  return (
    <div className={`${colors.bg} backdrop-blur-xl border ${colors.border} rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 ${colors.iconBg} rounded-xl ${colors.text}`}>
              {icon}
            </div>
            {trend && (
              <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                trend > 0 
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                  : trend < 0 
                  ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                  : 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
              }`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <div className="text-3xl font-bold text-white tracking-tight">
              {value !== null && value !== undefined ? value : '—'}
            </div>
          </div>
          
          <div className="text-sm font-semibold text-slate-300 mb-1">
            {label}
          </div>
          
          {subtitle && (
            <div className="text-xs text-slate-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard
