import QRCode from 'qrcode'

/**
 * Generate QR code from URL
 * @param {string} url - URL to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} QR code as dataURL
 */
export async function generateQR(url, options = {}) {
  if (!url) {
    throw new Error('URL is required to generate QR code')
  }

  const defaultOptions = {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'M', // 15% error correction
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    ...options,
  }

  try {
    const qrDataURL = await QRCode.toDataURL(url, defaultOptions)
    return qrDataURL
  } catch (error) {
    console.error('QR code generation error:', error)
    throw new Error(`Failed to generate QR code: ${error.message}`)
  }
}

/**
 * Generate QR code as canvas element
 * @param {string} url - URL to encode
 * @param {HTMLCanvasElement} canvas - Canvas element to render to
 * @param {Object} options - QR code options
 * @returns {Promise<void>}
 */
export async function generateQRToCanvas(url, canvas, options = {}) {
  if (!url) {
    throw new Error('URL is required to generate QR code')
  }

  if (!canvas) {
    throw new Error('Canvas element is required')
  }

  const defaultOptions = {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'M',
    ...options,
  }

  try {
    await QRCode.toCanvas(canvas, url, defaultOptions)
  } catch (error) {
    console.error('QR code canvas generation error:', error)
    throw new Error(`Failed to generate QR code to canvas: ${error.message}`)
  }
}
