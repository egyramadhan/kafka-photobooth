function CountdownOverlay({ 
  isActive = false,
  captureState = 'idle',
  currentCount = 0,
  photosTaken = 0,
  totalPhotos = 4,
  showFlash = false,
}) {
  if (!isActive) return null

  // Render countdown number or message
  const renderCountdownDisplay = () => {
    if (captureState === 'countdown') {
      return (
        <div className="text-center select-none flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)] animate-pulse mb-6">
            <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-indigo-100 to-purple-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {currentCount}
            </div>
          </div>
          <p className="text-2xl font-bold tracking-widest text-indigo-200 uppercase">Get Ready!</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Position yourself in the camera view</p>
        </div>
      )
    }

    if (captureState === 'capturing') {
      if (currentCount === 0) {
        return (
          <div className="text-center select-none flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.25)] mb-6 animate-ping duration-1000">
              <span className="text-6xl animate-bounce">📸</span>
            </div>
            <p className="text-4xl font-extrabold text-amber-400 tracking-wider animate-pulse uppercase">Smile!</p>
          </div>
        )
      } else {
        return (
          <div className="text-center select-none flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-slate-900/60 border border-slate-700/80 flex items-center justify-center shadow-lg mb-6">
              <div className="text-7xl font-bold text-white">
                {currentCount}
              </div>
            </div>
            <p className="text-lg font-semibold tracking-wider text-slate-300 uppercase">Hold still for next photo...</p>
          </div>
        )
      }
    }

    if (captureState === 'complete') {
      return (
        <div className="text-center select-none flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-6">
            <svg className="w-18 h-18 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 tracking-wide uppercase">All Done!</p>
          <p className="text-sm text-slate-400 mt-2 font-medium">Stitching your photo strip...</p>
        </div>
      )
    }

    return null
  }

  // Render progress indicator (dots)
  const renderProgressIndicator = () => {
    if (captureState === 'idle') return null

    return (
      <div className="flex items-center justify-center space-x-4 mt-10">
        {Array.from({ length: totalPhotos }).map((_, index) => {
          const isTaken = index < photosTaken
          const isCurrent = index === photosTaken && captureState === 'capturing'
          
          return (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                isTaken
                  ? 'w-4.5 h-4.5 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400/40'
                  : isCurrent
                  ? 'w-6 h-6 bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] border border-amber-300/40 animate-pulse'
                  : 'w-4 h-4 bg-slate-800 border border-slate-700/60'
              }`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Main Overlay */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-[60] pointer-events-none transition-all duration-300">
        {/* Countdown Display */}
        <div className="text-white">
          {renderCountdownDisplay()}
        </div>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Photo Counter */}
        {captureState === 'capturing' && (
          <div className="mt-6 text-slate-300 text-sm font-semibold tracking-widest uppercase bg-slate-900/50 border border-slate-800/80 px-4.5 py-1.5 rounded-full backdrop-blur-sm">
            Photo {photosTaken + 1} of {totalPhotos}
          </div>
        )}
      </div>

      {/* Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[65] pointer-events-none animate-flash" />
      )}

      {/* CSS Animation for Flash */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          40% { opacity: 0.95; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.35s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </>
  )
}

export default CountdownOverlay
