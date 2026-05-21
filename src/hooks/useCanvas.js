import { useRef, useCallback } from 'react'
import jsPDF from 'jspdf'

export function useCanvas() {
  const stageRef = useRef(null)

  // Load image from dataURL (required for Konva)
  const loadImage = useCallback((dataURL) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
      img.src = dataURL
    })
  }, [])

  // Load multiple images from dataURLs
  const loadImages = useCallback(async (dataURLs) => {
    try {
      const imagePromises = dataURLs.map(url => loadImage(url))
      const images = await Promise.all(imagePromises)
      return images
    } catch (err) {
      console.error('Error loading images:', err)
      return []
    }
  }, [loadImage])

  // Export canvas to PNG with high resolution
  const exportPNG = useCallback((filename = null) => {
    if (!stageRef.current) {
      console.error('Stage ref not available')
      return null
    }

    try {
      // Export with 3x pixel ratio for high quality
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 3,
        mimeType: 'image/png',
      })

      // Trigger download
      const link = document.createElement('a')
      link.download = filename || `photobooth-${Date.now()}.png`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return dataURL
    } catch (err) {
      console.error('Error exporting PNG:', err)
      return null
    }
  }, [])

  // Export canvas to PDF
  const exportPDF = useCallback((filename = null) => {
    if (!stageRef.current) {
      console.error('Stage ref not available')
      return false
    }

    try {
      // Get high-res image from canvas
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 3,
        mimeType: 'image/png',
      })

      // Standard photobooth strip size: 2x6 inches
      const widthMM = 50.8   // 2 inches in mm
      const heightMM = 152.4  // 6 inches in mm

      // Create PDF with custom size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMM, heightMM],
      })

      // Add image to PDF (fill entire page)
      pdf.addImage(
        dataURL,
        'PNG',
        0,        // x position
        0,        // y position
        widthMM,  // width
        heightMM, // height
      )

      // Save PDF
      pdf.save(filename || `photobooth-${Date.now()}.pdf`)

      return true
    } catch (err) {
      console.error('Error exporting PDF:', err)
      return false
    }
  }, [])

  // Get canvas as dataURL (for sharing/uploading)
  const getDataURL = useCallback((pixelRatio = 3) => {
    if (!stageRef.current) {
      console.error('Stage ref not available')
      return null
    }

    try {
      return stageRef.current.toDataURL({
        pixelRatio,
        mimeType: 'image/png',
      })
    } catch (err) {
      console.error('Error getting dataURL:', err)
      return null
    }
  }, [])

  return {
    stageRef,
    loadImage,
    loadImages,
    exportPNG,
    exportPDF,
    getDataURL,
  }
}
