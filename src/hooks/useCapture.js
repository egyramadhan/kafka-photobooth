import { useState, useRef, useCallback } from 'react'

export function useCapture({
  totalPhotos = 4,
  initialCountdown = 5,
  captureInterval = 3,
  onCaptureComplete = null,
} = {}) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const [photosTaken, setPhotosTaken] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [captureState, setCaptureState] = useState('idle') // idle, countdown, capturing, complete

  const timerRef = useRef(null)
  const videoRefForCapture = useRef(null)

  // Capture a single frame from video element
  const captureFrame = useCallback((videoElement) => {
    if (!videoElement || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
      console.error('Video element not ready for capture')
      return null
    }

    try {
      // Create canvas with video dimensions
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      // Convert to dataURL (PNG format)
      const dataURL = canvas.toDataURL('image/png')
      return dataURL
    } catch (err) {
      console.error('Error capturing frame:', err)
      return null
    }
  }, [])

  // Start the capture sequence
  const startCapture = useCallback((videoElement) => {
    if (!videoElement) {
      console.error('Video element is required for capture')
      return
    }

    videoRefForCapture.current = videoElement
    setIsCapturing(true)
    setCaptureState('countdown')
    setCurrentCount(initialCountdown)
    setPhotosTaken(0)
    setCapturedPhotos([])

    // Start initial countdown
    let countdown = initialCountdown
    timerRef.current = setInterval(() => {
      countdown -= 1
      setCurrentCount(countdown)

      if (countdown === 0) {
        clearInterval(timerRef.current)
        // Start capturing photos
        startPhotoCapture()
      }
    }, 1000)
  }, [initialCountdown])

  // Capture photos with intervals
  const startPhotoCapture = useCallback(() => {
    setCaptureState('capturing')
    let photoCount = 0
    const localPhotos = [] // Local array to collect all photos

    const capturePhoto = () => {
      if (!videoRefForCapture.current) {
        console.error('Video reference lost')
        stopCapture()
        return
      }

      // Capture the frame
      const dataURL = captureFrame(videoRefForCapture.current)
      
      if (dataURL) {
        photoCount += 1
        localPhotos.push(dataURL) // Add to local array
        setPhotosTaken(photoCount)
        setCapturedPhotos(prev => [...prev, dataURL])

        // Check if we've captured all photos
        if (photoCount >= totalPhotos) {
          clearInterval(timerRef.current)
          setCaptureState('complete')
          setIsCapturing(false)
          
          // Call completion callback with local array (not stale state)
          if (onCaptureComplete) {
            onCaptureComplete(localPhotos)
          }
        } else {
          // Set countdown for next photo
          setCurrentCount(captureInterval)
        }
      } else {
        console.error('Failed to capture photo')
      }
    }

    // Capture first photo immediately
    capturePhoto()

    // Set interval for remaining photos
    if (totalPhotos > 1) {
      let intervalCountdown = captureInterval
      
      timerRef.current = setInterval(() => {
        intervalCountdown -= 1
        setCurrentCount(intervalCountdown)

        if (intervalCountdown === 0) {
          capturePhoto()
          intervalCountdown = captureInterval
        }
      }, 1000)
    }
  }, [totalPhotos, captureInterval, captureFrame, onCaptureComplete])

  // Stop/cancel capture sequence
  const stopCapture = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsCapturing(false)
    setCaptureState('idle')
    setCurrentCount(0)
  }, [])

  // Reset capture state
  const resetCapture = useCallback(() => {
    stopCapture()
    setPhotosTaken(0)
    setCapturedPhotos([])
    setCaptureState('idle')
  }, [stopCapture])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  return {
    // State
    isCapturing,
    currentCount,
    photosTaken,
    capturedPhotos,
    captureState,
    
    // Actions
    startCapture,
    stopCapture,
    resetCapture,
    cleanup,
  }
}
