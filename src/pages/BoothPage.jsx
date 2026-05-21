import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { useCapture } from '../hooks/useCapture'
import LivePreview from '../components/LivePreview'
import CountdownOverlay from '../components/CountdownOverlay'

function BoothPage() {
  const navigate = useNavigate()
  const { stream, error } = useCamera()
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
    initialCountdown: 5,
    captureInterval: 3,
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
    <div className="min-h-screen bg-black text-white">
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

      {/* Header - Top Left */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <h1 className="text-2xl font-bold mr-6">Photobooth</h1>
        <button
          onClick={handleBackToSetup}
          disabled={isCapturing}
          className="px-4 py-2 bg-gray-900/80 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition backdrop-blur-sm"
        >
          ← Back to Setup
        </button>
      </div>

      {/* Error Display - Bottom Center */}
      {error && !isCapturing && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4">
          <div className="p-4 bg-red-900/80 border border-red-700 rounded-lg backdrop-blur-sm">
            <p className="text-red-200 text-center">{error}</p>
            <p className="text-red-300 text-sm text-center mt-2">
              Please go back to setup and select a camera
            </p>
          </div>
        </div>
      )}

      {/* Start Button - Bottom Center */}
      {!isCapturing && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <button
            onClick={handleStartSession}
            disabled={!stream || !!error}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-full text-2xl transition shadow-2xl backdrop-blur-sm"
          >
            {stream && !error ? 'Start Session' : 'Waiting for Camera...'}
          </button>
        </div>
      )}

      {/* Cancel Button (during capture) - Bottom Center */}
      {isCapturing && captureState !== 'complete' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleCancelCapture}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full text-xl transition shadow-2xl backdrop-blur-sm"
          >
            Cancel Session
          </button>
        </div>
      )}

      {/* Instructions - Bottom Center (only when not capturing and no error) */}
      {stream && !error && !isCapturing && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <p className="text-gray-300 text-lg">
            Press "Start Session" to begin taking photos
          </p>
          <p className="text-gray-400 text-sm mt-2">
            4 photos will be taken automatically with countdown
          </p>
        </div>
      )}
    </div>
  )
}

export default BoothPage
