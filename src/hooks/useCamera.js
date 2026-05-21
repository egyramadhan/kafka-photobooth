import { useState, useEffect, useRef } from 'react'

export function useCamera() {
  const [devices, setDevices] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const streamRef = useRef(null)

  // Enumerate available video input devices
  const enumerateDevices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter(device => device.kind === 'videoinput')
      
      setDevices(videoDevices)
      
      // Auto-select first device if none selected
      if (videoDevices.length > 0 && !selectedId) {
        setSelectedId(videoDevices[0].deviceId)
      }
      
      setIsLoading(false)
    } catch (err) {
      console.error('Error enumerating devices:', err)
      setError('Failed to get camera list')
      setIsLoading(false)
    }
  }

  // Start camera stream with selected device
  const startStream = async (deviceId) => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = newStream
      setStream(newStream)
      setIsLoading(false)
      
      return newStream
    } catch (err) {
      console.error('Error starting camera:', err)
      
      // Handle specific error types
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and refresh.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other apps and try again.')
      } else {
        setError(`Camera error: ${err.message}`)
      }
      
      setIsLoading(false)
      return null
    }
  }

  // Stop current stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }

  // Request initial camera permission (triggers browser prompt)
  const requestInitialPermission = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Request basic camera access to trigger permission prompt
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
      
      // Stop the temporary stream immediately
      tempStream.getTracks().forEach(track => track.stop())
      
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Error requesting camera permission:', err)
      
      // Handle specific error types
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and refresh the page.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and refresh.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other apps and try again.')
      } else {
        setError(`Camera error: ${err.message}`)
      }
      
      setIsLoading(false)
      return false
    }
  }

  // Handle device change events (camera plugged/unplugged)
  useEffect(() => {
    const initializeCamera = async () => {
      // Request permission first (triggers browser prompt)
      const permissionGranted = await requestInitialPermission()
      
      // Only enumerate devices if permission was granted
      if (permissionGranted) {
        enumerateDevices()
      }
    }

    const handleDeviceChange = () => {
      enumerateDevices()
    }

    // Initialize camera on mount
    initializeCamera()

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [])

  // Start stream when selectedId changes
  useEffect(() => {
    if (selectedId) {
      startStream(selectedId)
    }

    // Cleanup on unmount or when selectedId changes
    return () => {
      stopStream()
    }
  }, [selectedId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return {
    devices,
    selectedId,
    setSelectedId,
    stream,
    error,
    isLoading,
    refreshDevices: enumerateDevices,
    stopStream,
  }
}
