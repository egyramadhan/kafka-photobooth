import { useEventStore } from '../../store/eventStore'
import { TEMPLATES } from '../../templates'

function EventSettings() {
  const { 
    eventName, 
    footerText, 
    selectedTemplate,
    setEventName, 
    setFooterText,
    setSelectedTemplate 
  } = useEventStore()

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">Event Settings</h2>
      </div>
      
      <div className="space-y-6">
        {/* Event Name Input */}
        <div>
          <label htmlFor="eventName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Event Name</span>
          </label>
          <div className="relative">
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., John & Jane's Wedding"
              className="w-full pl-4 pr-16 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition-all duration-200 text-sm font-medium"
              maxLength={50}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {eventName.length}/50
            </span>
          </div>
        </div>

        {/* Footer Text Input */}
        <div>
          <label htmlFor="footerText" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>Footer Text</span>
          </label>
          <div className="relative">
            <input
              id="footerText"
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="e.g., Thank you for celebrating with us!"
              className="w-full pl-4 pr-16 py-3 bg-slate-950/40 border border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition-all duration-200 text-sm font-medium"
              maxLength={60}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {footerText.length}/60
            </span>
          </div>
        </div>

        {/* Date & Template Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Date Display */}
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Date</span>
            </label>
            <div className="w-full px-4 py-3 bg-slate-950/20 border border-slate-800/40 rounded-xl text-slate-400 text-sm font-medium">
              {currentDate}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Auto-generated today
            </p>
          </div>

          {/* Template Selector Grid */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Template Style</span>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((template) => {
                const isSelected = selectedTemplate === template.id
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group p-3 rounded-xl text-left border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-950/20'
                        : 'border-slate-800/60 bg-slate-950/20 hover:bg-slate-900/30'
                    }`}
                  >
                    {/* Visual Mini Stripe Mockup on the card */}
                    <div 
                      className="absolute right-2 bottom-0 top-0 w-6 flex flex-col space-y-1 p-1 border-l border-slate-850/60 opacity-90 transition duration-300 group-hover:scale-105" 
                      style={{ backgroundColor: template.bgColor }}
                    >
                      <div className="flex-1 bg-slate-400/25 rounded-sm"></div>
                      <div className="flex-1 bg-slate-400/25 rounded-sm"></div>
                      <div className="flex-1 bg-slate-400/25 rounded-sm"></div>
                      <div className="h-2 bg-slate-400/40 rounded-sm"></div>
                    </div>
                    
                    <div className="z-10 flex flex-col h-full justify-between">
                      <p className="font-semibold text-xs text-slate-100 group-hover:text-indigo-300 transition duration-200">{template.name}</p>
                      <span 
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full inline-block w-fit" 
                        style={{ 
                          backgroundColor: template.bgColor === '#ffffff' ? '#e2e8f0' : 'rgba(30, 41, 59, 0.7)', 
                          color: template.textColor 
                        }}
                      >
                        {template.bgColor === '#ffffff' ? 'LIGHT' : 'DARK'}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-10 bg-indigo-500 text-white rounded-full p-0.5 shadow-md">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventSettings
