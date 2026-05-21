import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Event settings store
export const useEventStore = create(
  persist(
    (set) => ({
      // Event settings
      eventName: '',
      footerText: '',
      selectedTemplate: 'classic-black',
      
      // Actions
      setEventName: (name) => set({ eventName: name }),
      setFooterText: (text) => set({ footerText: text }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      
      // Reset all settings
      resetSettings: () => set({
        eventName: '',
        footerText: '',
        selectedTemplate: 'classic-black',
      }),
    }),
    {
      name: 'photobooth-event-settings',
    }
  )
)
