import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, getEvents } from '../services/api'
import { isOnline, addOnlineListener, cacheDashboardData, getCachedDashboardData, processQueue } from '../utils/offlineHelper'
import StatCard from '../components/StatCard'
import HourlySessionsChart from '../components/HourlySessionsChart'
import TemplateBreakdownChart from '../components/TemplateBreakdownChart'

function DashboardPage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!isOnline())
  const [usingCache, setUsingCache] = useState(false)

  // Check authentication
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard_auth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    } else {
      navigate('/dashboard/login')
    }
    setIsLoading(false)
  }, [navigate])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false)
      console.log('Back online - processing queued requests...')
      await processQueue()
      // Refresh data
      window.location.reload()
    }

    const handleOffline = () => {
      setIsOffline(true)
      console.log('Gone offline - will use cached data')
    }

    const removeOnlineListener = addOnlineListener(handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      removeOnlineListener()
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch statistics
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchData = async () => {
      try {
        setError(null)
        setUsingCache(false)

        // If offline, try to use cached data
        if (!isOnline()) {
          const cached = getCachedDashboardData()
          if (cached) {
            setStats(cached)
            setUsingCache(true)
            console.log('Using cached dashboard data (offline)')
            return
          } else {
            setError('No internet connection and no cached data available.')
            return
          }
        }
        
        // Fetch events list
        const eventsList = await getEvents()
        setEvents(eventsList)

        // Fetch stats
        const options = { period: selectedPeriod }
        if (selectedEvent !== 'all') {
          options.event_name = selectedEvent
        }
        
        const statsData = await getStats(options)
        setStats(statsData)

        // Cache the data for offline use
        cacheDashboardData(statsData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        
        // Try to use cached data as fallback
        const cached = getCachedDashboardData()
        if (cached) {
          setStats(cached)
          setUsingCache(true)
          setError('Failed to load fresh data. Showing cached data.')
        } else {
          setError('Failed to load dashboard data. Make sure the backend server is running.')
        }
      }
    }

    fetchData()

    // Auto-refresh every 30 seconds (only if online)
    const interval = setInterval(() => {
      if (isOnline()) {
        fetchData()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, selectedEvent, selectedPeriod])

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    navigate('/dashboard/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wider text-indigo-300 uppercase mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Event Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Analytics & Statistics
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Real-time photobooth session tracking and insights
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate('/')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 border border-slate-800 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-950/20 hover:bg-red-950/40 text-red-300 hover:text-red-200 font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 border border-red-900/30 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 mb-8 flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-300 font-semibold">Error Loading Data</p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!stats && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading statistics...</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && stats.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Sessions */}
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Total Sessions"
              value={stats.stats.total_sessions || 0}
              subtitle={`${selectedPeriod === 'today' ? 'Today' : selectedPeriod === '7days' ? 'Last 7 days' : selectedPeriod === '30days' ? 'Last 30 days' : 'All time'}`}
              color="indigo"
            />

            {/* Total Photos */}
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Photos Taken"
              value={stats.stats.total_photos || 0}
              subtitle="Total captures"
              color="purple"
            />

            {/* Download Rate */}
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
              label="Download Rate"
              value={`${stats.stats.download_rate || 0}%`}
              subtitle={`${stats.stats.downloads || 0} downloads`}
              color="emerald"
            />

            {/* QR Scan Rate */}
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              }
              label="QR Scan Rate"
              value={`${stats.stats.qr_scan_rate || 0}%`}
              subtitle={`${stats.stats.qr_scans || 0} scans`}
              color="amber"
            />
          </div>
        )}

        {/* Charts Section */}
        {stats && (stats.hourly || stats.templates) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Hourly Sessions Chart */}
            {stats.hourly && (
              <HourlySessionsChart data={stats.hourly} />
            )}

            {/* Template Breakdown Chart */}
            {stats.templates && (
              <TemplateBreakdownChart data={stats.templates} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
