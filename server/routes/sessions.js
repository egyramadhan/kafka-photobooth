import express from 'express'
import { eq, desc, and, gte, lte, sql, count, sum } from 'drizzle-orm'
import { db, schema } from '../db.js'

const { sessions } = schema
const router = express.Router()

// GET /api/sessions - Get all sessions with optional filters
router.get('/', async (req, res) => {
  try {
    const { event_name, date_from, date_to, limit = 100 } = req.query
    
    // Build where conditions
    const conditions = []
    
    if (event_name) {
      conditions.push(eq(sessions.eventName, event_name))
    }
    
    if (date_from) {
      conditions.push(gte(sessions.createdAt, new Date(date_from)))
    }
    
    if (date_to) {
      conditions.push(lte(sessions.createdAt, new Date(date_to)))
    }
    
    // Execute query
    const result = await db
      .select()
      .from(sessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(sessions.createdAt))
      .limit(parseInt(limit))
    
    res.json({
      success: true,
      count: result.length,
      sessions: result,
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
      message: error.message,
    })
  }
})

// GET /api/sessions/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const { event_name, period = 'today' } = req.query
    
    // Build date filter
    let dateCondition
    if (period === 'today') {
      dateCondition = sql`DATE(${sessions.createdAt}) = CURRENT_DATE`
    } else if (period === '7days') {
      dateCondition = sql`${sessions.createdAt} >= NOW() - INTERVAL '7 days'`
    } else if (period === '30days') {
      dateCondition = sql`${sessions.createdAt} >= NOW() - INTERVAL '30 days'`
    }
    
    // Build where conditions
    const conditions = []
    if (dateCondition) conditions.push(dateCondition)
    if (event_name) conditions.push(eq(sessions.eventName, event_name))
    
    // Overall statistics
    const statsResult = await db
      .select({
        totalSessions: count(),
        totalPhotos: sum(sessions.photosTaken),
        downloads: sql`SUM(CASE WHEN ${sessions.downloaded} THEN 1 ELSE 0 END)`.mapWith(Number),
        pdfExports: sql`SUM(CASE WHEN ${sessions.pdfExported} THEN 1 ELSE 0 END)`.mapWith(Number),
        qrScans: sql`SUM(CASE WHEN ${sessions.qrScanned} THEN 1 ELSE 0 END)`.mapWith(Number),
        downloadRate: sql`ROUND(100.0 * SUM(CASE WHEN ${sessions.downloaded} THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2)`.mapWith(Number),
        qrScanRate: sql`ROUND(100.0 * SUM(CASE WHEN ${sessions.qrScanned} THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2)`.mapWith(Number),
      })
      .from(sessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    // Sessions per hour (for today)
    const hourlyConditions = [sql`DATE(${sessions.createdAt}) = CURRENT_DATE`]
    if (event_name) hourlyConditions.push(eq(sessions.eventName, event_name))
    
    const hourlyResult = await db
      .select({
        hour: sql`EXTRACT(HOUR FROM ${sessions.createdAt})`.mapWith(Number),
        count: count(),
      })
      .from(sessions)
      .where(and(...hourlyConditions))
      .groupBy(sql`EXTRACT(HOUR FROM ${sessions.createdAt})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${sessions.createdAt})`)
    
    // Template breakdown
    const templateResult = await db
      .select({
        templateId: sessions.templateId,
        count: count(),
      })
      .from(sessions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(sessions.templateId)
      .orderBy(desc(count()))
    
    res.json({
      success: true,
      stats: statsResult[0],
      hourly: hourlyResult,
      templates: templateResult,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message,
    })
  }
})

// GET /api/sessions/events - Get list of unique event names
router.get('/events', async (req, res) => {
  try {
    const result = await db
      .selectDistinct({ eventName: sessions.eventName })
      .from(sessions)
      .where(sql`${sessions.eventName} IS NOT NULL`)
      .orderBy(sessions.eventName)
    
    res.json({
      success: true,
      events: result.map(row => row.eventName),
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error.message,
    })
  }
})

// POST /api/sessions - Create a new session
router.post('/', async (req, res) => {
  try {
    const {
      event_name,
      photos_taken = 4,
      template_id,
      footer_text,
      session_duration,
    } = req.body
    
    const result = await db
      .insert(sessions)
      .values({
        eventName: event_name,
        photosTaken: photos_taken,
        templateId: template_id,
        footerText: footer_text,
        sessionDuration: session_duration,
      })
      .returning()
    
    res.status(201).json({
      success: true,
      session: result[0],
    })
  } catch (error) {
    console.error('Error creating session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
      message: error.message,
    })
  }
})

// PATCH /api/sessions/:id - Update a session
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { downloaded, pdf_exported, qr_scanned } = req.body
    
    // Build update object
    const updates = {}
    
    if (typeof downloaded === 'boolean') {
      updates.downloaded = downloaded
    }
    
    if (typeof pdf_exported === 'boolean') {
      updates.pdfExported = pdf_exported
    }
    
    if (typeof qr_scanned === 'boolean') {
      updates.qrScanned = qr_scanned
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      })
    }
    
    const result = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning()
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }
    
    res.json({
      success: true,
      session: result[0],
    })
  } catch (error) {
    console.error('Error updating session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update session',
      message: error.message,
    })
  }
})

// DELETE /api/sessions/:id - Delete a session (optional, for cleanup)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning()
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Session deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
      message: error.message,
    })
  }
})

export default router
