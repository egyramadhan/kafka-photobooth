import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { updateSession } from '../services/api'

function DownloadPage() {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [imageUrl, setImageUrl] = useState(null)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (fileId) {
      try {
        // Construct or set image URL
        if (fileId.startsWith('http')) {
          setImageUrl(fileId)
        } else {
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dja393kzo'
          setImageUrl(`https://res.cloudinary.com/${cloudName}/image/upload/${fileId}`)
        }

        // Check expiration (24 hours) from timestamp in filename
        const timestampMatch = fileId.match(/(\d{13})/)
        if (timestampMatch) {
          const timestamp = parseInt(timestampMatch[1])
          const now = Date.now()
          const hoursPassed = (now - timestamp) / (1000 * 60 * 60)
          
          if (hoursPassed > 24) {
            setIsExpired(true)
          }
        }

        // Track QR scan if session ID is present
        const sessionId = searchParams.get('session')
        if (sessionId) {
          updateSession(sessionId, { qr_scanned: true })
            .then(() => console.log('QR scan tracked'))
            .catch(err => console.error('Failed to track QR scan:', err))
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Error processing fileId:', err)
        setError('Invalid file ID format')
        setIsLoading(false)
      }
    } else {
      setError('No download identifier found')
      setIsLoading(false)
    }
  }, [fileId, searchParams])

  const handleDownload = async () => {
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `photobooth-${fileId || Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-[90px] pointer-events-none"></div>

      <div className="relative max-w-sm w-full mx-auto z-10 text-center flex flex-col justify-between py-4">
        {/* Header Branding */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-indigo-300 uppercase mb-3">
            <span>✨ Kafka Photo Cloud</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Your Photo Strip</h1>
        </div>

        {/* Dynamic State Loading & Errors */}
        {isLoading ? (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center h-[360px] mb-6">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-indigo-400"></div>
            <p className="text-slate-400 text-xs mt-4">Retrieving photo strip...</p>
          </div>
        ) : error || isExpired ? (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center h-[360px] mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4.5 shadow-lg shadow-red-950/20 animate-bounce">
              <svg className="w-6.5 h-6.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">
              {isExpired ? 'Link Expired' : 'Unable to Retrieve'}
            </h2>
            <p className="text-slate-400 text-xs px-2 leading-relaxed">
              {isExpired 
                ? 'This photo download link has expired (active for 24 hours). Please generate a new share link.' 
                : error || 'The link is invalid or the storage service returned an error.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 font-semibold py-2.5 px-5 rounded-xl text-xs transition duration-200"
            >
              Start Photobooth
            </button>
          </div>
        ) : (
          /* Stitched Preview Frame */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center mb-6">
            <div className="relative group overflow-hidden rounded-xl border border-slate-950/50">
              <div className="max-h-[380px] overflow-y-auto rounded-xl scrollbar-thin">
                <img 
                  src={imageUrl} 
                  alt="Stitched Photo Strip" 
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
              <div className="absolute inset-0 bg-slate-950/5 pointer-events-none rounded-xl"></div>
            </div>
          </div>
        )}

        {/* Call to Actions */}
        {!isLoading && !error && !isExpired && imageUrl && (
          <div className="space-y-4 w-full">
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 shadow-xl shadow-indigo-950/20"
            >
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm tracking-wider uppercase font-semibold">Save to Device</span>
            </button>

            <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-2xl text-left shadow-inner">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">💡 Mobile Tip</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If the download button doesn't trigger on your mobile browser, simply <strong>press & hold the image</strong> in the preview card above to save it directly to your Photos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DownloadPage
