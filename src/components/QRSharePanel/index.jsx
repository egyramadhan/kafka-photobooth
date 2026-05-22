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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
      {/* Decorative Orb */}
      <div className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 p-2 rounded-xl transition duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div className="text-center mt-2 mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center justify-center space-x-2">
            <span>Photo is Ready!</span>
            <span className="animate-bounce">🎉</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
            Scan this QR code to download the photo strip directly to your phone.
          </p>
        </div>

        {/* QR Code Display */}
        {error ? (
          <div className="bg-red-950/20 border border-red-500/25 rounded-2xl p-6 mb-6">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        ) : qrCode ? (
          <div className="bg-white p-4 rounded-2xl mb-6 flex items-center justify-center shadow-lg w-fit mx-auto border border-slate-800 relative group">
            <img src={qrCode} alt="QR Code" className="w-52 h-52 select-none" />
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none rounded-2xl"></div>
          </div>
        ) : (
          <div className="bg-slate-950/20 border border-slate-800/40 p-6 rounded-2xl mb-6 flex flex-col items-center justify-center h-60">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
            </div>
            <p className="text-slate-400 text-xs mt-4">Generating QR code...</p>
          </div>
        )}

        {/* URL Display */}
        <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 mb-5 flex items-center justify-between space-x-3">
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Download Link</p>
            <p className="text-xs text-indigo-300 font-medium truncate mt-0.5 max-w-[240px] font-mono">{url}</p>
          </div>
          <div className="w-px h-6 bg-slate-850 flex-shrink-0"></div>
          <button 
            onClick={handleCopyLink}
            className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider flex-shrink-0 transition duration-200"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950/20"
        >
          {copied ? (
            <>
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Full Link</span>
            </>
          )}
        </button>

        {/* Auto-hide notice with elegant animated progress bar */}
        {autoHideDelay && (
          <div className="mt-6">
            <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-mono">
              Auto-closing in {Math.round(autoHideDelay / 1000)}s
            </p>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full animate-progress"
                style={{ animationDuration: `${autoHideDelay}ms` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Styles for animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: shrink linear forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}

export default QRSharePanel
