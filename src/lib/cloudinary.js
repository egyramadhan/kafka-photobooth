import { Cloudinary } from 'cloudinary-core'

// Initialize Cloudinary instance
const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  secure: true,
})

/**
 * Get Cloudinary configuration
 * @returns {Object} Cloudinary config
 */
export function getCloudinaryConfig() {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  }
}

/**
 * Generate Cloudinary URL for uploaded image
 * @param {string} publicId - Public ID of uploaded image
 * @param {Object} options - Transformation options
 * @returns {string} Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  })
}

/**
 * Validate Cloudinary configuration
 * @returns {boolean} True if config is valid
 */
export function validateCloudinaryConfig() {
  const config = getCloudinaryConfig()
  return !!(config.cloudName && config.uploadPreset)
}

export default cloudinary
