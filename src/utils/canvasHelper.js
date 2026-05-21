// Canvas constants for photo strip rendering
// Based on standard photobooth 2x6 inch @ 300 DPI

// Strip dimensions (600x1800px = 2x6 inch @ 300 DPI)
export const STRIP = {
  WIDTH: 600,
  HEIGHT: 1800,
  PADDING: 20,
  GAP: 14, // gap between photos
  FOOTER_H: 120, // footer height
}

// Calculate photo dimensions
export const PHOTO = {
  WIDTH: STRIP.WIDTH - STRIP.PADDING * 2, // 560px
  HEIGHT: (STRIP.HEIGHT - STRIP.FOOTER_H - STRIP.PADDING * 5 - STRIP.GAP * 3) / 4, // ~374px
}

// Footer position
export const FOOTER = {
  Y: STRIP.HEIGHT - STRIP.FOOTER_H, // 1680px
  HEIGHT: STRIP.FOOTER_H,
}

// Crop marks (registration marks for cutting)
export const CROP_MARK = {
  SIZE: 12, // length of mark line
  OFFSET: 6, // distance from corner
  WIDTH: 0.5, // line thickness
}

// Helper: Calculate Y position for photo at index
export function getPhotoY(index) {
  return STRIP.PADDING + index * (PHOTO.HEIGHT + STRIP.GAP)
}

// Helper: Get crop mark positions for all 4 corners
export function getCropMarkPositions() {
  const { SIZE, OFFSET } = CROP_MARK
  return [
    // Top-left
    { x1: OFFSET, y1: OFFSET + SIZE, x2: OFFSET, y2: OFFSET },
    { x1: OFFSET, y1: OFFSET, x2: OFFSET + SIZE, y2: OFFSET },
    // Top-right
    { x1: STRIP.WIDTH - OFFSET - SIZE, y1: OFFSET, x2: STRIP.WIDTH - OFFSET, y2: OFFSET },
    { x1: STRIP.WIDTH - OFFSET, y1: OFFSET, x2: STRIP.WIDTH - OFFSET, y2: OFFSET + SIZE },
    // Bottom-left
    { x1: OFFSET, y1: STRIP.HEIGHT - OFFSET - SIZE, x2: OFFSET, y2: STRIP.HEIGHT - OFFSET },
    { x1: OFFSET, y1: STRIP.HEIGHT - OFFSET, x2: OFFSET + SIZE, y2: STRIP.HEIGHT - OFFSET },
    // Bottom-right
    { x1: STRIP.WIDTH - OFFSET - SIZE, y1: STRIP.HEIGHT - OFFSET, x2: STRIP.WIDTH - OFFSET, y2: STRIP.HEIGHT - OFFSET },
    { x1: STRIP.WIDTH - OFFSET, y1: STRIP.HEIGHT - OFFSET - SIZE, x2: STRIP.WIDTH - OFFSET, y2: STRIP.HEIGHT - OFFSET },
  ]
}
