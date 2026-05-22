import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { useCapture } from '../hooks/useCapture'
import { useEventStore } from '../store/eventStore'
import LivePreview from '../components/LivePreview'
import CountdownOverlay from '../components/CountdownOverlay'

function BoothPage() {
  const navigate = useNavigate()
  const { stream, error } = useCamera()
  const { countdownDuration } = useEventStore()
  const videoRef = useRef(null)
  const [showFlash, setShowFlash] = useState(false)

  // Capture hook with completion callback
  const {
    isCapturing,
    currentCount,
    photosTaken,
    capturedPhotos,
    captureState,
    startCapture,
    resetCapture,
    cleanup,
  } = useCapture({
    totalPhotos: 4,
    initialCountdown: countdownDuration,
    captureInterval: countdownDuration,
    onCaptureComplete: (photos) => {
      console.log('Capture complete! Photos:', photos.length)
      // Navigate to result page after a short delay
      setTimeout(() => {
        navigate('/result', { state: { photos } })
      }, 1500)
    },
  })

  // Get video element reference from LivePreview
  useEffect(() => {
    // Find video element in the DOM
    const videoElement = document.querySelector('video')
    if (videoElement) {
      videoRef.current = videoElement
    }
  }, [stream])

  // Flash effect when photo is taken
  useEffect(() => {
    if (captureState === 'capturing' && currentCount === 0) {
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 300)
    }
  }, [captureState, currentCount])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  const handleStartSession = () => {
    if (!videoRef.current) {
      console.error('Video element not found')
      return
    }

    if (!stream) {
      console.error('No camera stream available')
      return
    }

    // Start the capture sequence
    startCapture(videoRef.current)
  }

  const handleBackToSetup = () => {
    if (isCapturing) {
      // Confirm before leaving during capture
      if (window.confirm('Capture in progress. Are you sure you want to go back?')) {
        resetCapture()
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }

  const handleCancelCapture = () => {
    resetCapture()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Live Preview - Full Screen */}
      <LivePreview stream={stream} mirror={true} aspectRatio="16:9" />

      {/* Countdown Overlay */}
      <CountdownOverlay
        isActive={isCapturing}
        captureState={captureState}
        currentCount={currentCount}
        photosTaken={photosTaken}
        totalPhotos={4}
        showFlash={showFlash}
      />

      {/* Header - Floating Top Left */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping mr-2"></span>
            📸 Booth Session
          </span>
          <div className="w-px h-5 bg-slate-800"></div>
          <button
            onClick={handleBackToSetup}
            disabled={isCapturing}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition duration-200"
          >
            <span>← Exit Setup</span>
          </button>
        </div>
      </div>

      {/* Error Display - Bottom Center */}
      {error && !isCapturing && (
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4">
          <div className="p-4 bg-red-950/45 border border-red-500/25 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center space-x-3 text-red-200">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold">Camera Error</p>
              <p className="text-xs text-red-300/80 mt-0.5">{error}. Please return to setup.</p>
            </div>
          </div>
        </div>
      )}

      {/* Start Button - Bottom Center */}
      {!isCapturing && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 text-center w-full max-w-sm px-6">
          <button
            onClick={handleStartSession}
            disabled={!stream || !!error}
            className={`w-full group relative overflow-hidden rounded-2xl p-px font-bold text-white shadow-2xl transition duration-300 ${
              stream && !error 
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.03] active:scale-[0.98] cursor-pointer' 
                : 'bg-slate-900 border border-slate-800/80 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center space-x-3 rounded-2xl bg-slate-950/70 group-hover:bg-transparent px-8 py-4.5 transition duration-300">
              <svg className="w-5.5 h-5.5 text-indigo-300 group-hover:text-white transition duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base tracking-wider uppercase font-semibold">
                {stream && !error ? 'Start Capturing' : 'Connecting Camera...'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Cancel Button (during capture) - Bottom Center */}
      {isCapturing && captureState !== 'complete' && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-6">
          <button
            onClick={handleCancelCapture}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold py-4 px-6 rounded-2xl text-sm transition-all duration-300 shadow-xl backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel Session
          </button>
        </div>
      )}

      {/* Live Reel Preview - Bottom Right */}
      {isCapturing && capturedPhotos.length > 0 && (
        <div className="fixed right-6 bottom-24 z-50 flex flex-col space-y-3 bg-slate-950/65 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 shadow-2xl animate-fade-in w-24">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-850 pb-2">Feed</p>
          <div className="flex flex-col space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {capturedPhotos.map((photo, idx) => (
              <div key={idx} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-700/60 shadow-md transition duration-200 hover:scale-105">
                <img src={photo} className="w-full h-full object-cover" alt={`Snapped ${idx+1}`} />
                <div className="absolute top-1 left-1 bg-emerald-500/90 text-[8px] font-extrabold text-white px-1.5 py-0.5 rounded-sm">
                  #{idx+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions - Bottom Center (only when not capturing and no error) */}
      {stream && !error && !isCapturing && (
        <div className="fixed bottom-26 left-1/2 transform -translate-x-1/2 z-50 text-center w-full px-4 select-none">
          <p className="text-slate-300 text-sm font-semibold tracking-wider uppercase">
            Press the trigger below to begin
          </p>
          <p className="text-slate-500 text-xs mt-1">
            4 shots will be captured automatically with countdown intervals.
          </p>
        </div>
      )}
    </div>
  )
}

export default BoothPage
