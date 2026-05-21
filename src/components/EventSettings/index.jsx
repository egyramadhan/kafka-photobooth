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
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Event Settings</h2>
      
      <div className="space-y-4">
        {/* Event Name Input */}
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium mb-2">
            Event Name
          </label>
          <input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., John & Jane's Wedding"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            maxLength={50}
          />
          <p className="text-xs text-gray-400 mt-1">
            {eventName.length}/50 characters
          </p>
        </div>

        {/* Footer Text Input */}
        <div>
          <label htmlFor="footerText" className="block text-sm font-medium mb-2">
            Footer Text
          </label>
          <input
            id="footerText"
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="e.g., Thank you for celebrating with us!"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            maxLength={60}
          />
          <p className="text-xs text-gray-400 mt-1">
            {footerText.length}/60 characters
          </p>
        </div>

        {/* Date Display */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Date
          </label>
          <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300">
            {currentDate}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Auto-generated from current date
          </p>
        </div>

        {/* Template Selector */}
        <div>
          <label htmlFor="template" className="block text-sm font-medium mb-2">
            Template Style
          </label>
          <select
            id="template"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Choose the visual style for your photo strip
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventSettings
