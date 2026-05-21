import { getCloudinaryConfig, validateCloudinaryConfig } from '../lib/cloudinary'

/**
 * Generate unique filename for photo strip
 * @returns {string} Unique filename
 */
function generateUniqueFilename() {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 9)
  return `photobooth-strips/${timestamp}-${randomId}.png`
}

/**
 * Upload photo strip to Cloudinary
 * @param {string} dataURL - Base64 encoded image data
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadStrip(dataURL, onProgress = null) {
  // Validate Cloudinary configuration
  if (!validateCloudinaryConfig()) {
    throw new Error('Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local')
  }

  const config = getCloudinaryConfig()
  const filename = generateUniqueFilename()

  // Prepare form data
  const formData = new FormData()
  formData.append('file', dataURL)
  formData.append('upload_preset', config.uploadPreset)
  formData.append('public_id', filename)
  formData.append('folder', 'photobooth-strips')

  // Cloudinary upload URL
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`

  try {
    // Upload with progress tracking
    const response = await uploadWithProgress(uploadUrl, formData, onProgress)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`)
    }

    const data = await response.json()

    // Return secure URL
    return data.secure_url
  } catch (error) {
    console.error('Upload error:', error)

    // Handle specific error types
    if (error.message.includes('quota')) {
      throw new Error('Cloudinary storage quota exceeded. Please upgrade your plan or delete old files.')
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.')
    } else if (error.message.includes('unauthorized')) {
      throw new Error('Cloudinary authentication failed. Please check your upload preset configuration.')
    } else {
      throw new Error(`Upload failed: ${error.message}`)
    }
  }
}

/**
 * Upload with progress tracking using XMLHttpRequest
 * @param {string} url - Upload URL
 * @param {FormData} formData - Form data to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Response>} Fetch response
 */
function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          onProgress(percentComplete)
        }
      })
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      // Convert XHR response to fetch-like Response object
      const response = {
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        json: async () => JSON.parse(xhr.responseText),
      }
      resolve(response)
    })

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred during upload'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'))
    })

    // Send request
    xhr.open('POST', url)
    xhr.send(formData)
  })
}

/**
 * Delete uploaded image from Cloudinary (requires authenticated API)
 * Note: This requires backend API with Cloudinary credentials
 * @param {string} publicId - Public ID of image to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteStrip(publicId) {
  // This would require a backend endpoint with Cloudinary API credentials
  // For now, we rely on Cloudinary's auto-delete policies or manual cleanup
  console.warn('Delete functionality requires backend API implementation')
  return false
}
