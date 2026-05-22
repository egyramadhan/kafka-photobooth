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
      countdownDuration: 3,
      
      // Actions
      setEventName: (name) => set({ eventName: name }),
      setFooterText: (text) => set({ footerText: text }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setCountdownDuration: (duration) => set({ countdownDuration: duration }),
      
      // Reset all settings
      resetSettings: () => set({
        eventName: '',
        footerText: '',
        selectedTemplate: 'classic-black',
        countdownDuration: 3,
      }),
    }),
    {
      name: 'photobooth-event-settings',
    }
  )
)
