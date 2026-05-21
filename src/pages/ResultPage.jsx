import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useEventStore } from '../store/eventStore'
import { uploadStrip } from '../utils/uploadHelper'
import { printStrip } from '../utils/printHelper'
import PhotoStrip from '../components/PhotoStrip'
import QRSharePanel from '../components/QRSharePanel'

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { stageRef, exportPNG, exportPDF, getDataURL } = useCanvas()

  // Upload state for QR sharing
  const [uploadUrl, setUploadUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  // Get photos from navigation state
  const photos = location.state?.photos || []
  
  // Get event settings from store
  const { eventName, footerText, selectedTemplate } = useEventStore()
  const date = new Date().toLocaleDateString()

  const handleExportPNG = () => {
    exportPNG(`photobooth-${Date.now()}.png`)
  }

  const handleExportPDF = () => {
    exportPDF(`photobooth-${Date.now()}.pdf`)
  }

  const handleNewSession = () => {
    navigate('/booth')
  }

  const handleBackToSetup = () => {
    navigate('/')
  }

  const handleShareQR = async () => {
    try {
      setIsUploading(true)
      setUploadError(null)
      setUploadUrl(null)

      // Get high-res dataURL from canvas
      const dataURL = getDataURL(3)
      if (!dataURL) {
        throw new Error('Failed to get canvas data')
      }

      // Upload to Cloudinary with progress tracking
      const url = await uploadStrip(dataURL, (progress) => {
        console.log(`Upload progress: ${progress}%`)
      })

      setUploadUrl(url)
      setIsUploading(false)
    } catch (error) {
      console.error('Share error:', error)
      setUploadError(error.message)
      setIsUploading(false)
    }
  }

  const handlePrint = async () => {
    try {
      // Get high-res dataURL from canvas
      const dataURL = getDataURL(3)
      if (!dataURL) {
        alert('Failed to prepare image for printing')
        return
      }

      // Open print dialog
      await printStrip(dataURL, {
        paperWidth: '2in',
        paperHeight: '6in',
        title: `Photobooth - ${eventName || 'Photo Strip'}`,
      })
    } catch (error) {
      console.error('Print error:', error)
      alert(`Print failed: ${error.message}`)
    }
  }

  // Redirect if no photos
  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Photos Found</h1>
          <p className="text-gray-400 mb-8">Please take photos first</p>
          <button
            onClick={handleBackToSetup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Photo Strip</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Photo Strip Preview */}
          <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center">
            <PhotoStrip
              photos={photos}
              template={selectedTemplate}
              eventName={eventName}
              footerText={footerText}
              date={date}
              stageRef={stageRef}
            />
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Download Options</h2>
            
            <button 
              onClick={handleExportPNG}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </button>

            <button 
              onClick={handleExportPDF}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export PDF
            </button>

            <button 
              onClick={handlePrint}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Photo Strip
            </button>

            <button 
              onClick={handleShareQR}
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Share via QR Code
                </>
              )}
            </button>

            {uploadError && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">{uploadError}</p>
              </div>
            )}

            <button 
              disabled
              className="w-full bg-gray-700 text-gray-500 font-bold py-4 px-6 rounded-lg cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Share via QR Code (Coming Soon)
            </button>

            <div className="pt-4 border-t border-gray-700">
              <button 
                onClick={handleNewSession}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition"
              >
                Take More Photos
              </button>
              
              <button 
                onClick={handleBackToSetup}
                className="w-full mt-2 text-gray-400 hover:text-white transition py-2"
              >
                Back to Setup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Share Panel */}
      {uploadUrl && (
        <QRSharePanel
          url={uploadUrl}
          onClose={() => setUploadUrl(null)}
          autoHideDelay={60000}
        />
      )}
    </div>
  )
}

export default ResultPage
