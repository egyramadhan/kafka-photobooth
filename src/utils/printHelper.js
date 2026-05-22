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
    layout = 'thermal', // 'thermal', 'standard-single', 'standard-double'
    title = 'Photobooth Strip',
  } = options

  return new Promise((resolve, reject) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=900')
      
      if (!printWindow) {
        reject(new Error('Failed to open print window. Please allow popups for this site.'))
        return
      }

      // Generate page styles and markup based on chosen layout
      let layoutStyles = ''
      let layoutMarkup = ''

      if (layout === 'thermal') {
        layoutStyles = `
          @page {
            size: 2in 6in;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          .print-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .print-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
          .print-instructions {
            display: none;
          }
        `
        layoutMarkup = `
          <div class="print-container">
            <img src="${dataURL}" alt="Photo Strip" class="print-image" />
          </div>
        `
      } else if (layout === 'standard-single') {
        layoutStyles = `
          @page {
            size: auto;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          .print-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          .print-image {
            height: 96vh;
            width: auto;
            object-fit: contain;
            display: block;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          @media print {
            .print-image {
              box-shadow: none;
            }
            .print-instructions {
              display: none;
            }
          }
          .print-instructions {
            position: absolute;
            bottom: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 10px;
            color: #64748b;
          }
        `
        layoutMarkup = `
          <div class="print-container">
            <img src="${dataURL}" alt="Photo Strip" class="print-image" />
            <div class="print-instructions">
              <p>Classic Single Layout Centered — Kafka Photobooth</p>
            </div>
          </div>
        `
      } else if (layout === 'standard-double') {
        layoutStyles = `
          @page {
            size: auto;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          .print-double-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12%;
            padding: 40px;
          }
          .print-image {
            height: 94vh;
            width: auto;
            object-fit: contain;
            display: block;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          @media print {
            .print-image {
              box-shadow: none;
            }
            .print-instructions {
              display: none;
            }
          }
          .print-instructions {
            position: absolute;
            bottom: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 10px;
            color: #64748b;
            text-align: center;
            width: 100%;
          }
        `
        layoutMarkup = `
          <div class="print-double-container">
            <img src="${dataURL}" alt="Photo Strip 1" class="print-image" />
            <img src="${dataURL}" alt="Photo Strip 2" class="print-image" />
          </div>
          <div class="print-instructions">
            <p>Double Strip Side-by-Side Layout — Perfect for Guestbooks</p>
          </div>
        `
      }

      // Write layout-focused DOM structure
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
            ${layoutStyles}
          </style>
        </head>
        <body>
          ${layoutMarkup}
        </body>
        </html>
      `)

      printWindow.document.close()

      // Wait for image loading
      const imgs = printWindow.document.querySelectorAll('.print-image')
      let loadedCount = 0

      const onImageLoad = () => {
        loadedCount++
        if (loadedCount === imgs.length) {
          setTimeout(() => {
            printWindow.focus()
            printWindow.print()
            setTimeout(() => {
              printWindow.close()
              resolve(true)
            }, 1000)
          }, 600)
        }
      }

      imgs.forEach(img => {
        if (img.complete) {
          onImageLoad()
        } else {
          img.onload = onImageLoad
          img.onerror = () => {
            printWindow.close()
            reject(new Error('Failed to load image for printing'))
          }
        }
      })

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
