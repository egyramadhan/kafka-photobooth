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
        <div className="text-center animate-bounce">
          <div className="text-9xl font-bold mb-4 animate-pulse">
            {currentCount}
          </div>
          <p className="text-3xl font-semibold">Get Ready!</p>
        </div>
      )
    }

    if (captureState === 'capturing') {
      if (currentCount === 0) {
        return (
          <div className="text-center">
            <div className="text-8xl font-bold mb-4 animate-pulse">
              📸
            </div>
            <p className="text-4xl font-bold text-yellow-400">Smile!</p>
          </div>
        )
      } else {
        return (
          <div className="text-center">
            <div className="text-7xl font-bold mb-4">
              {currentCount}
            </div>
            <p className="text-2xl font-semibold">Next photo...</p>
          </div>
        )
      }
    }

    if (captureState === 'complete') {
      return (
        <div className="text-center animate-bounce">
          <div className="text-6xl font-bold mb-4">✓</div>
          <p className="text-3xl font-bold text-green-400">All Done!</p>
          <p className="text-xl mt-2">Preparing your photos...</p>
        </div>
      )
    }

    return null
  }

  // Render progress indicator (dots)
  const renderProgressIndicator = () => {
    if (captureState === 'idle') return null

    return (
      <div className="flex items-center justify-center space-x-3 mt-8">
        {Array.from({ length: totalPhotos }).map((_, index) => {
          const isTaken = index < photosTaken
          const isCurrent = index === photosTaken && captureState === 'capturing'
          
          return (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                isTaken
                  ? 'w-4 h-4 bg-green-500'
                  : isCurrent
                  ? 'w-5 h-5 bg-yellow-400 animate-pulse'
                  : 'w-4 h-4 bg-gray-600'
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-[60] pointer-events-none">
        {/* Countdown Display */}
        <div className="text-white">
          {renderCountdownDisplay()}
        </div>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Photo Counter */}
        {captureState === 'capturing' && (
          <div className="mt-6 text-white text-xl font-semibold">
            Photo {photosTaken} of {totalPhotos}
          </div>
        )}
      </div>

      {/* Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[55] pointer-events-none animate-flash" />
      )}

      {/* CSS Animation for Flash */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default CountdownOverlay
