/**
 * Print helper utilities for photobooth strips
 * Handles browser print dialog with proper sizing and CSS
 */

/**
 * Print photo strip with optimized settings for 2×6 inch paper
 * @param {string} dataURL - Base64 encoded image data
 * @param {Object} options - Print options
 * @returns {Promise<boolean>} Success status
 */
export async function printStrip(dataURL, options = {}) {
  if (!dataURL) {
    throw new Error('Image data is required for printing')
  }

  const {
    paperWidth = '2in',
    paperHeight = '6in',
    title = 'Photobooth Strip',
  } = options

  return new Promise((resolve, reject) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=600,height=800')
      
      if (!printWindow) {
        reject(new Error('Failed to open print window. Please allow popups for this site.'))
        return
      }

      // Write HTML content with print-optimized CSS
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              background: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }

            .print-container {
              text-align: center;
              padding: 20px;
            }

            .print-image {
              max-width: 100%;
              height: auto;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .print-instructions {
              margin-top: 20px;
              font-family: Arial, sans-serif;
              color: #333;
            }

            @media print {
              @page {
                size: ${paperWidth} ${paperHeight};
                margin: 0;
              }

              body {
                background: white;
                margin: 0;
                padding: 0;
              }

              .print-container {
                padding: 0;
                margin: 0;
              }

              .print-image {
                width: 100%;
                height: 100%;
                max-width: none;
                box-shadow: none;
                display: block;
              }

              .print-instructions {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <img src="${dataURL}" alt="Photo Strip" class="print-image" />
            <div class="print-instructions">
              <p><strong>Print Instructions:</strong></p>
              <p>Paper size: ${paperWidth} × ${paperHeight}</p>
              <p>Make sure your printer is set to the correct paper size</p>
              <p>Click Print when ready</p>
            </div>
          </div>
        </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for image to load before printing
      const img = printWindow.document.querySelector('.print-image')
      
      img.onload = () => {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
          
          // Close window after print dialog is closed
          // Note: This may not work in all browsers due to security restrictions
          setTimeout(() => {
            printWindow.close()
            resolve(true)
          }, 1000)
        }, 500)
      }

      img.onerror = () => {
        printWindow.close()
        reject(new Error('Failed to load image for printing'))
      }

    } catch (error) {
      console.error('Print error:', error)
      reject(error)
    }
  })
}

/**
 * Check if browser supports printing
 * @returns {boolean} True if printing is supported
 */
export function isPrintSupported() {
  return typeof window !== 'undefined' && typeof window.print === 'function'
}
