import { useNavigate } from 'react-router-dom'
import CameraSelector from '../components/CameraSelector'
import EventSettings from '../components/EventSettings'

function SetupPage() {
  const navigate = useNavigate()

  const handleStartBooth = () => {
    navigate('/booth')
  }

  return (
    <div className="relative min-h-screen p-6 md:p-12 overflow-hidden flex items-center justify-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-4xl w-full mx-auto z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-300 uppercase mb-4">
            <span>✨ Professional Edition</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Kafka Photobooth
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto">
            Configure your camera, style options, and launch an engaging interactive photography session.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <CameraSelector />
            <EventSettings />
          </div>

          <button 
            onClick={handleStartBooth}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px font-bold text-white shadow-xl shadow-indigo-950/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-[0.99] mt-2"
          >
            <div className="flex items-center justify-center space-x-3 rounded-2xl bg-slate-950/65 hover:bg-transparent px-6 py-4.5 transition duration-300">
              <svg className="w-5.5 h-5.5 text-indigo-300 group-hover:text-white transition duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-base tracking-wider uppercase font-semibold">Start Session</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
