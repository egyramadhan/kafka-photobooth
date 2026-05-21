// Template definitions for photo strip frames
// Each template defines the visual style of the photo strip

export const TEMPLATES = [
  {
    id: 'classic-black',
    name: 'Classic Black',
    bgColor: '#000000',
    footerBg: '#000000',
    textColor: '#ffffff',
    showCropMark: true,
    cropMarkColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      eventName: 24,
      footerText: 16,
      date: 14,
    },
  },
  {
    id: 'classic-white',
    name: 'Classic White',
    bgColor: '#ffffff',
    footerBg: '#ffffff',
    textColor: '#000000',
    showCropMark: true,
    cropMarkColor: '#000000',
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      eventName: 24,
      footerText: 16,
      date: 14,
    },
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    bgColor: '#1a1a1a',
    footerBg: '#2d2416',
    textColor: '#d4af37',
    showCropMark: true,
    cropMarkColor: '#d4af37',
    fontFamily: 'Georgia, serif',
    fontSize: {
      eventName: 26,
      footerText: 16,
      date: 14,
    },
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    bgColor: '#0f172a',
    footerBg: '#1e293b',
    textColor: '#60a5fa',
    showCropMark: true,
    cropMarkColor: '#60a5fa',
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      eventName: 24,
      footerText: 16,
      date: 14,
    },
  },
]

// Get template by ID
export function getTemplateById(id) {
  return TEMPLATES.find(template => template.id === id) || TEMPLATES[0]
}

// Default template
export const DEFAULT_TEMPLATE = TEMPLATES[0]
