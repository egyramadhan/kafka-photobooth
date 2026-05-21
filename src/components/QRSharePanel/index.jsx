import { useState, useEffect } from 'react'
import { generateQR } from '../../utils/qrHelper'

function QRSharePanel({ url, onClose, autoHideDelay = 60000 }) {
  const [qrCode, setQrCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  // Generate QR code when URL is provided
  useEffect(() => {
    if (url) {
      generateQR(url)
        .then(setQrCode)
        .catch(err => {
          console.error('QR generation error:', err)
          setError('Failed to generate QR code')
        })
    }
  }, [url])

  // Auto-hide after delay
  useEffect(() => {
    if (autoHideDelay && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [autoHideDelay, onClose])

  // Copy URL to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error('Fallback copy failed:', e)
      }
      document.body.removeChild(textArea)
    }
  }

  if (!url) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Foto Siap Dibagikan! 🎉
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Scan QR code ini untuk download foto ke HP kamu
        </p>

        {/* QR Code Display */}
        {error ? (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        ) : qrCode ? (
          <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
          </div>
        ) : (
          <div className="bg-gray-700 p-6 rounded-xl mb-6 flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Generating QR code...</p>
            </div>
          </div>
        )}

        {/* URL Display */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-400 mb-1">Link Download:</p>
          <p className="text-sm text-white break-all">{url}</p>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link Tersalin!
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Salin Link
            </>
          )}
        </button>

        {/* Auto-hide notice */}
        {autoHideDelay && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Panel ini akan otomatis tertutup dalam {Math.round(autoHideDelay / 1000)} detik
          </p>
        )}
      </div>
    </div>
  )
}

export default QRSharePanel
