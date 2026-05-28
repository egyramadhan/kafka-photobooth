import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useEventStore } from '../store/eventStore'
import { uploadStrip } from '../utils/uploadHelper'
import { printStrip } from '../utils/printHelper'
import { createSession, updateSession } from '../services/api'
import { isOnline } from '../utils/offlineHelper'
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

  // Custom print layout states
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [printLayout, setPrintLayout] = useState('standard-single') // 'thermal', 'standard-single', 'standard-double'

  // Session tracking
  const [sessionId, setSessionId] = useState(null)

  // Get photos from navigation state
  const photos = location.state?.photos || []
  
  // Get event settings from store
  const { eventName, footerText, selectedTemplate } = useEventStore()
  const date = new Date().toLocaleDateString()

  // Create session record when component mounts
  useEffect(() => {
    const initSession = async () => {
      if (photos.length === 0) return

      try {
        const session = await createSession({
          event_name: eventName || 'Untitled Event',
          photos_taken: photos.length,
          template_id: selectedTemplate,
          footer_text: footerText,
        })

        if (session?.id) {
          setSessionId(session.id)
          console.log('Session created:', session.id)
        }
      } catch (error) {
        console.error('Failed to create session:', error)
        // Don't block UI if tracking fails
      }
    }

    initSession()
  }, []) // Run once on mount

  const handleExportPNG = async () => {
    exportPNG(`photobooth-${Date.now()}.png`)
    
    // Track download action
    if (sessionId) {
      try {
        await updateSession(sessionId, { downloaded: true })
        console.log('Download tracked')
      } catch (error) {
        console.error('Failed to track download:', error)
      }
    }
  }

  const handleExportPDF = async () => {
    exportPDF(`photobooth-${Date.now()}.pdf`)
    
    // Track PDF export action
    if (sessionId) {
      try {
        await updateSession(sessionId, { pdf_exported: true })
        console.log('PDF export tracked')
      } catch (error) {
        console.error('Failed to track PDF export:', error)
      }
    }
  }

  const handleNewSession = () => {
    navigate('/booth')
  }

  const handleBackToSetup = () => {
    navigate('/')
  }

  const handleShareQR = async () => {
    // Check if online
    if (!isOnline()) {
      setUploadError('No internet connection. QR sharing requires an active connection. Please use local download instead.')
      return
    }

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

      // Append session ID to URL for tracking QR scans
      const urlWithSession = sessionId ? `${url}?session=${sessionId}` : url
      setUploadUrl(urlWithSession)
      setIsUploading(false)
    } catch (error) {
      console.error('Share error:', error)
      setUploadError(error.message)
      setIsUploading(false)
    }
  }

  const handlePrintClick = () => {
    setShowPrintModal(true)
  }

  const executePrint = async () => {
    try {
      setShowPrintModal(false)
      // Get high-res dataURL from canvas
      const dataURL = getDataURL(3)
      if (!dataURL) {
        alert('Failed to prepare image for printing')
        return
      }

      // Open print dialog with chosen layout style
      await printStrip(dataURL, {
        layout: printLayout,
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative">
        {/* Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative text-center max-w-sm z-10 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">No Photos Found</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            It looks like there are no active captures in this session. Please record some photos first.
          </p>
          <button
            onClick={handleBackToSetup}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition duration-200 shadow-md shadow-indigo-950/20"
          >
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wider text-emerald-300 uppercase mb-4">
            <span>🎉 Session Complete</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Your Photo Strip
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Beautifully generated from your session photos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          {/* Photo Strip Preview */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative group">
            <div className="absolute top-4 left-4 bg-indigo-500/10 border border-indigo-500/25 px-3.5 py-1.5 rounded-xl text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
              ✨ Print Layout
            </div>
            <div className="transform hover:scale-[1.01] transition-transform duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden mt-6">
              <PhotoStrip
                photos={photos}
                template={selectedTemplate}
                eventName={eventName}
                footerText={footerText}
                date={date}
                stageRef={stageRef}
              />
            </div>
          </div>

          {/* Export Options Panel */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Save & Share</h2>
              <p className="text-slate-400 text-xs mt-1">Download or share your high-res stitched strip below.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Download PNG */}
              <button 
                onClick={handleExportPNG}
                className="flex items-center space-x-4 p-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-left rounded-xl transition duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300 group-hover:scale-110 transition duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">Download PNG</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">High-resolution image</p>
                </div>
              </button>

              {/* Export PDF */}
              <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-4 p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 text-left rounded-xl transition duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 group-hover:scale-110 transition duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">Export PDF</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Print-ready document</p>
                </div>
              </button>

              {/* Print Photo Strip */}
              <button 
                onClick={handlePrintClick}
                className="flex items-center space-x-4 p-4 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/20 hover:border-amber-500/40 text-left rounded-xl transition duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300 group-hover:scale-110 transition duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">Print Strip</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Send to connected printer</p>
                </div>
              </button>

              {/* Share QR */}
              <button 
                onClick={handleShareQR}
                disabled={isUploading}
                className="flex items-center space-x-4 p-4 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 hover:border-emerald-500/40 text-left rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] group w-full"
              >
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300 group-hover:scale-110 transition duration-300 flex-shrink-0">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{isUploading ? 'Uploading...' : 'Share via QR'}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Download instantly to mobile</p>
                </div>
              </button>
            </div>

            {uploadError && (
              <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center space-x-2 animate-pulse">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{uploadError}</span>
              </div>
            )}

            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleNewSession}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                <span>New Session</span>
              </button>
              
              <button 
                onClick={handleBackToSetup}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition duration-200 border border-slate-850 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span>Setup Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Layout Settings Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="absolute w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 p-2 rounded-xl transition duration-200"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="mb-6 mt-2">
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Print Settings</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-normal">Layout</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Choose the best paper and layout option for your printer.
              </p>
            </div>

            {/* Layout Options Grid */}
            <div className="space-y-3 mb-6">
              {/* Option 1: Thermal Printer (2x6") */}
              <button
                type="button"
                onClick={() => setPrintLayout('thermal')}
                className={`w-full group p-4 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between ${
                  printLayout === 'thermal'
                    ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-950/20'
                    : 'border-slate-800/60 bg-slate-950/20 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border transition duration-200 ${
                    printLayout === 'thermal' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-100 group-hover:text-amber-300 transition duration-200 font-sans">Thermal Roll Strip (2×6")</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-medium">Dye-sub photobooth printer (DNP, Citizen, Hiti)</p>
                  </div>
                </div>
                {printLayout === 'thermal' && (
                  <div className="bg-amber-500 text-white rounded-full p-0.5 shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Option 2: Standard A4/Letter (Single Copy) */}
              <button
                type="button"
                onClick={() => setPrintLayout('standard-single')}
                className={`w-full group p-4 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between ${
                  printLayout === 'standard-single'
                    ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-950/20'
                    : 'border-slate-800/60 bg-slate-950/20 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border transition duration-200 ${
                    printLayout === 'standard-single' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-100 group-hover:text-amber-300 transition duration-200 font-sans">Standard Paper (A4 / Letter) — Single</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-medium">Centers a large copy in the middle of standard paper</p>
                  </div>
                </div>
                {printLayout === 'standard-single' && (
                  <div className="bg-amber-500 text-white rounded-full p-0.5 shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Option 3: Standard A4/Letter (Double Copy Side-by-Side) */}
              <button
                type="button"
                onClick={() => setPrintLayout('standard-double')}
                className={`w-full group p-4 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between ${
                  printLayout === 'standard-double'
                    ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-950/20'
                    : 'border-slate-800/60 bg-slate-950/20 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border transition duration-200 ${
                    printLayout === 'standard-double' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M9 21h6M4 10h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v3a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-100 group-hover:text-amber-300 transition duration-200 font-sans">Standard Paper (A4 / Letter) — Double</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-medium">Prints 2 strips side-by-side (Perfect to cut & share!)</p>
                  </div>
                </div>
                {printLayout === 'standard-double' && (
                  <div className="bg-amber-500 text-white rounded-full p-0.5 shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* Hint alert */}
            <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-2xl text-[10px] text-slate-400 leading-relaxed mb-6 flex items-start space-x-2.5">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="text-slate-300">Important Instruction:</strong> In the browser print dialog that opens next, check <strong>More settings</strong>, ensure Margins is set to <strong>"None"</strong>, and <strong>uncheck "Headers and footers"</strong> for a completely borderless professional cut.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white font-semibold py-3 px-5 rounded-xl text-xs transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePrint}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-5 rounded-xl text-xs transition duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-950/20"
              >
                Open Print
              </button>
            </div>
          </div>
        </div>
      )}

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
