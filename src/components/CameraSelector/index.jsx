import { useCamera } from '../../hooks/useCamera'

function CameraSelector() {
  const { devices, selectedId, setSelectedId, error, isLoading, refreshDevices } = useCamera()

  const handleSelectCamera = (deviceId) => {
    setSelectedId(deviceId)
    // Save to localStorage for persistence
    localStorage.setItem('selectedCameraId', deviceId)
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Camera Selection</h2>
        <button
          onClick={refreshDevices}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-gray-400">Loading cameras...</span>
        </div>
      )}

      {!isLoading && !error && devices.length === 0 && (
        <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
          <p className="text-yellow-200 mb-2">No cameras detected</p>
          <p className="text-yellow-300 text-sm">
            Please connect a camera or check your browser permissions.
          </p>
        </div>
      )}

      {!isLoading && devices.length > 0 && (
        <div className="space-y-2">
          {devices.map((device) => {
            const isSelected = device.deviceId === selectedId
            return (
              <button
                key={device.deviceId}
                onClick={() => handleSelectCamera(device.deviceId)}
                className={`w-full p-4 rounded-lg text-left transition ${
                  isSelected
                    ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400'
                    : 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {device.label || `Camera ${devices.indexOf(device) + 1}`}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {device.deviceId.substring(0, 20)}...
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {devices.length > 0 && (
        <p className="mt-4 text-sm text-gray-400">
          {devices.length} camera{devices.length > 1 ? 's' : ''} detected
        </p>
      )}
    </div>
  )
}

export default CameraSelector
