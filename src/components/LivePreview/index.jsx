import { useEffect, useRef, useState } from 'react'

function LivePreview({ stream, mirror = true, aspectRatio = '16:9' }) {
  const videoRef = useRef(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [error, setError] = useState(null)

  // Setup video stream
  useEffect(() => {
    if (!videoRef.current) return

    if (stream) {
      try {
        videoRef.current.srcObject = stream
        setError(null)
      } catch (err) {
        console.error('Error setting video stream:', err)
        setError('Failed to display camera feed')
      }
    } else {
      videoRef.current.srcObject = null
      setIsVideoReady(false)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  // Handle video ready state
  const handleVideoReady = () => {
    setIsVideoReady(true)
  }

  // Handle video errors
  const handleVideoError = (e) => {
    console.error('Video element error:', e)
    setError('Camera feed error. Please check your camera connection.')
    setIsVideoReady(false)
  }

  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3]'
      case '16:9':
        return 'aspect-video'
      case '1:1':
        return 'aspect-square'
      default:
        return 'aspect-video'
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <div className={`relative w-full h-full ${getAspectRatioClass()} flex items-center justify-center`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoReady}
            onError={handleVideoError}
            className={`w-full h-full object-cover ${mirror ? 'scale-x-[-1]' : ''}`}
          />

        {/* Loading State */}
        {!isVideoReady && !error && stream && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading camera feed...</p>
            </div>
          </div>
        )}

        {/* No Stream State */}
        {!stream && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400">No camera selected</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-10">
            <div className="text-center p-6">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Active Indicator */}
        {isVideoReady && !error && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-full z-10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">LIVE</span>
          </div>
        )}

        {/* Mirror Indicator */}
        {mirror && isVideoReady && (
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-full z-10">
            <span className="text-white text-sm">Mirror Mode</span>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default LivePreview
