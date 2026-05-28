import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CameraSelector from '../components/CameraSelector'
import EventSettings from '../components/EventSettings'

function SetupPage() {
  const navigate = useNavigate()
  const [isKioskMode, setIsKioskMode] = useState(false)
  const [escapeCount, setEscapeCount] = useState(0)

  // Handle escape key presses for kiosk mode exit
  useEffect(() => {
    if (!isKioskMode) return

    let escapeTimer = null

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEscapeCount(prev => {
          const newCount = prev + 1
          
          // Exit kiosk mode after 3 escape presses
          if (newCount >= 3) {
            exitKioskMode()
            return 0
          }
          
          return newCount
        })

        // Reset counter after 2 seconds
        clearTimeout(escapeTimer)
        escapeTimer = setTimeout(() => {
          setEscapeCount(0)
        }, 2000)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(escapeTimer)
    }
  }, [isKioskMode])

  const enterKioskMode = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsKioskMode(true)
      console.log('Kiosk mode activated')
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
      alert('Fullscreen mode is not supported or was denied. Please allow fullscreen access.')
    }
  }

  const exitKioskMode = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    setIsKioskMode(false)
    setEscapeCount(0)
    console.log('Kiosk mode deactivated')
  }

  const handleStartBooth = () => {
    navigate('/booth')
  }

  return (
    <div className="relative min-h-screen p-6 md:p-12 overflow-hidden flex items-center justify-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-4xl w-full mx-auto z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-300 uppercase mb-4">
            <span>✨ Professional Edition</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Kafka Photobooth
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto">
            Configure your camera, style options, and launch an engaging interactive photography session.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <CameraSelector />
            <EventSettings />
          </div>

          <button 
            onClick={handleStartBooth}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px font-bold text-white shadow-xl shadow-indigo-950/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-[0.99] mt-2"
          >
            <div className="flex items-center justify-center space-x-3 rounded-2xl bg-slate-950/65 hover:bg-transparent px-6 py-4.5 transition duration-300">
              <svg className="w-5.5 h-5.5 text-indigo-300 group-hover:text-white transition duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-base tracking-wider uppercase font-semibold">Start Session</span>
            </div>
          </button>

          {/* Kiosk Mode Toggle */}
          <div className="mt-6 pt-6 border-t border-slate-800/50">
            {!isKioskMode ? (
              <button
                onClick={enterKioskMode}
                className="w-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-semibold py-3 px-5 rounded-xl text-sm transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Activate Kiosk Mode</span>
              </button>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-emerald-300 mb-2">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-sm">Kiosk Mode Active</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300 font-mono">Esc</kbd> three times to exit
                </p>
                {escapeCount > 0 && (
                  <div className="text-xs text-amber-400 font-semibold animate-pulse">
                    {escapeCount}/3 - Press Esc {3 - escapeCount} more time{3 - escapeCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
