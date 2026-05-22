import { useCamera } from '../../hooks/useCamera'

function CameraSelector() {
  const { devices, selectedId, setSelectedId, error, isLoading, refreshDevices } = useCamera()

  const handleSelectCamera = (deviceId) => {
    setSelectedId(deviceId)
    // Save to localStorage for persistence
    localStorage.setItem('selectedCameraId', deviceId)
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">Camera Selection</h2>
        </div>
        <button
          onClick={refreshDevices}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 rounded-xl transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
          </svg>
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-200">
          <svg className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-300">Camera Error</h3>
            <p className="text-sm text-red-300/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-900/30 border border-slate-800/40 rounded-xl">
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
            <div className="absolute rounded-full h-6 w-6 border-l-2 border-r-2 border-indigo-300/50 animate-pulse"></div>
          </div>
          <span className="mt-4 text-sm text-slate-400 font-medium tracking-wide">Loading cameras...</span>
        </div>
      )}

      {!isLoading && !error && devices.length === 0 && (
        <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start space-x-4 text-amber-200">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-300">No cameras detected</h3>
            <p className="text-sm text-amber-300/70 mt-1 leading-relaxed">
              Please connect a camera device or grant browser permissions to start taking photos.
            </p>
          </div>
        </div>
      )}

      {!isLoading && devices.length > 0 && (
        <div className="space-y-3">
          {devices.map((device) => {
            const isSelected = device.deviceId === selectedId
            return (
              <button
                key={device.deviceId}
                onClick={() => handleSelectCamera(device.deviceId)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 border ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-950/20 text-white'
                    : 'bg-slate-900/30 hover:bg-slate-900/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl transition duration-300 ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800/80 text-slate-400'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm tracking-wide text-slate-100">
                        {device.label || `Camera ${devices.indexOf(device) + 1}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        ID: {device.deviceId.substring(0, 18)}...
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                      Active
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {devices.length > 0 && (
        <p className="mt-4 text-xs text-slate-500 font-medium">
          {devices.length} camera{devices.length > 1 ? 's' : ''} detected & ready
        </p>
      )}
    </div>
  )
}

export default CameraSelector
