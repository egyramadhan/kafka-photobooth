import { useEffect, useState } from 'react'
import { Stage, Layer, Image, Rect, Text, Line } from 'react-konva'
import { STRIP, PHOTO, FOOTER, getCropMarkPositions, getPhotoY } from '../../utils/canvasHelper'
import { getTemplateById } from '../../templates'

function PhotoStrip({
  photos = [],
  template = 'classic-black',
  eventName = '',
  footerText = '',
  date = '',
  stageRef = null,
}) {
  const [loadedImages, setLoadedImages] = useState([])
  const templateData = getTemplateById(template)

  // Load images from dataURLs to HTMLImageElement (required for Konva)
  useEffect(() => {
    if (photos.length === 0) {
      setLoadedImages([])
      return
    }

    const loadImages = async () => {
      const imagePromises = photos.map(dataURL => {
        return new Promise((resolve, reject) => {
          const img = new window.Image()
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = dataURL
        })
      })

      try {
        const images = await Promise.all(imagePromises)
        setLoadedImages(images)
      } catch (err) {
        console.error('Error loading images for canvas:', err)
      }
    }

    loadImages()
  }, [photos])

  // Show loading state if images not ready
  if (photos.length > 0 && loadedImages.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Preparing photo strip...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no photos
  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No photos to display</p>
      </div>
    )
  }

  const cropMarks = getCropMarkPositions()

  return (
    <div className="flex justify-center">
      <Stage
        width={STRIP.WIDTH}
        height={STRIP.HEIGHT}
        ref={stageRef}
        className="shadow-2xl"
      >
        <Layer>
          {/* Background */}
          <Rect
            width={STRIP.WIDTH}
            height={STRIP.HEIGHT}
            fill={templateData.bgColor}
          />

          {/* Photos */}
          {loadedImages.map((img, index) => (
            <Image
              key={index}
              image={img}
              x={STRIP.PADDING}
              y={getPhotoY(index)}
              width={PHOTO.WIDTH}
              height={PHOTO.HEIGHT}
            />
          ))}

          {/* Footer Background */}
          <Rect
            x={0}
            y={FOOTER.Y}
            width={STRIP.WIDTH}
            height={FOOTER.HEIGHT}
            fill={templateData.footerBg}
          />

          {/* Event Name */}
          {eventName && (
            <Text
              x={STRIP.PADDING}
              y={FOOTER.Y + 20}
              width={STRIP.WIDTH - STRIP.PADDING * 2}
              text={eventName}
              fontSize={templateData.fontSize.eventName}
              fontFamily={templateData.fontFamily}
              fill={templateData.textColor}
              align="center"
              fontStyle="bold"
            />
          )}

          {/* Footer Text */}
          {footerText && (
            <Text
              x={STRIP.PADDING}
              y={FOOTER.Y + 55}
              width={STRIP.WIDTH - STRIP.PADDING * 2}
              text={footerText}
              fontSize={templateData.fontSize.footerText}
              fontFamily={templateData.fontFamily}
              fill={templateData.textColor}
              align="center"
            />
          )}

          {/* Date */}
          {date && (
            <Text
              x={STRIP.PADDING}
              y={FOOTER.Y + 85}
              width={STRIP.WIDTH - STRIP.PADDING * 2}
              text={date}
              fontSize={templateData.fontSize.date}
              fontFamily={templateData.fontFamily}
              fill={templateData.textColor}
              align="center"
            />
          )}

          {/* Crop Marks */}
          {templateData.showCropMark && cropMarks.map((mark, i) => (
            <Line
              key={i}
              points={[mark.x1, mark.y1, mark.x2, mark.y2]}
              stroke={templateData.cropMarkColor}
              strokeWidth={0.5}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default PhotoStrip
