import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function DownloadPage() {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState(null)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Extract Cloudinary URL from fileId or construct it
    // For now, we assume fileId is the full Cloudinary URL or public_id
    if (fileId) {
      try {
        // Check if it's a full URL or just a public_id
        if (fileId.startsWith('http')) {
          setImageUrl(fileId)
        } else {
          // Construct Cloudinary URL from public_id
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          if (cloudName) {
            setImageUrl(`https://res.cloudinary.com/${cloudName}/image/upload/${fileId}`)
          } else {
            setError('Cloudinary not configured')
          }
        }

        // Check expiration (24 hours)
        // Extract timestamp from fileId if it follows our naming convention
        // Format: photobooth-strips/[timestamp]-[randomId]
        const timestampMatch = fileId.match(/(\d{13})/)
        if (timestampMatch) {
          const timestamp = parseInt(timestampMatch[1])
          const now = Date.now()
          const hoursPassed = (now - timestamp) / (1000 * 60 * 60)
          
          if (hoursPassed > 24) {
            setIsExpired(true)
          }
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Error processing fileId:', err)
        setError('Invalid file ID')
        setIsLoading(false)
      }
    } else {
      setError('No file ID provided')
      setIsLoading(false)
    }
  }, [fileId])

  const handleDownload = () => {
    if (imageUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `photobooth-${Date.now()}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your photo...</p>
        </div>
      </div>
    )
  }

  if (error || isExpired) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold mb-4">
            {isExpired ? 'Link Expired' : 'Error'}
          </h1>
          <p className="text-gray-400 mb-8">
            {isExpired 
              ? 'This photo link has expired (24 hours limit). Please contact the event organizer for a new copy.'
              : error || 'Unable to load photo. Please check the link and try again.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Go to Photobooth
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">📸 Photobooth</h1>
          <p className="text-sm text-gray-400">Your photo is ready!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Photo Strip</h2>
          <p className="text-gray-400">Tap the button below to download</p>
        </div>

        {/* Photo Preview */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Photo Strip" 
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '70vh' }}
            />
          ) : (
            <div className="text-gray-500 py-20">No preview available</div>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-xl transition shadow-lg flex items-center justify-center"
        >
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Photo
        </button>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This link will expire 24 hours after creation</p>
          <p className="mt-2">Powered by Photobooth App</p>
        </div>
      </div>
    </div>
  )
}

export default DownloadPage
