import { useNavigate } from 'react-router-dom'
import CameraSelector from '../components/CameraSelector'
import EventSettings from '../components/EventSettings'

function SetupPage() {
  const navigate = useNavigate()

  const handleStartBooth = () => {
    navigate('/booth')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Setup Photobooth</h1>
        
        <div className="space-y-6">
          <CameraSelector />

          <EventSettings />

          <button 
            onClick={handleStartBooth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition"
          >
            Start Booth
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
