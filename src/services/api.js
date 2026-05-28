/**
 * API Service for Kafka Photobooth Backend
 * Handles all communication with Express/PostgreSQL backend
 */

import { isOnline, queueAPICall } from '../utils/offlineHelper'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

/**
 * Create a new session record
 * @param {Object} sessionData - Session information
 * @returns {Promise<Object>} Created session
 */
export async function createSession(sessionData) {
  try {
    // If offline, queue the request
    if (!isOnline()) {
      queueAPICall('/api/sessions', 'POST', sessionData)
      console.log('Session creation queued (offline)')
      return null
    }

    const response = await fetchAPI('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
    return response.session
  } catch (error) {
    console.error('Failed to create session:', error)
    // Queue for retry if it was a network error
    queueAPICall('/api/sessions', 'POST', sessionData)
    return null
  }
}

/**
 * Update session with user actions (download, PDF export, QR scan)
 * @param {string} sessionId - UUID of the session
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated session
 */
export async function updateSession(sessionId, updates) {
  try {
    // If offline, queue the request
    if (!isOnline()) {
      queueAPICall(`/api/sessions/${sessionId}`, 'PATCH', updates)
      console.log('Session update queued (offline)')
      return null
    }

    const response = await fetchAPI(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    return response.session
  } catch (error) {
    console.error('Failed to update session:', error)
    // Queue for retry if it was a network error
    queueAPICall(`/api/sessions/${sessionId}`, 'PATCH', updates)
    return null
  }
}

/**
 * Get all sessions with optional filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Array>} List of sessions
 */
export async function getSessions(filters = {}) {
  const params = new URLSearchParams(filters)
  const response = await fetchAPI(`/api/sessions?${params}`)
  return response.sessions
}

/**
 * Get statistics for dashboard
 * @param {Object} options - Query options (event_name, period)
 * @returns {Promise<Object>} Statistics data
 */
export async function getStats(options = {}) {
  const params = new URLSearchParams(options)
  const response = await fetchAPI(`/api/sessions/stats?${params}`)
  return response
}

/**
 * Get list of unique event names
 * @returns {Promise<Array>} List of event names
 */
export async function getEvents() {
  const response = await fetchAPI('/api/sessions/events')
  return response.events
}

/**
 * Delete a session (admin only)
 * @param {string} sessionId - UUID of the session
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSession(sessionId) {
  const response = await fetchAPI(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  })
  return response.success
}

/**
 * Check if backend API is available
 * @returns {Promise<boolean>} True if API is reachable
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.warn('Backend API is not available:', error.message)
    return false
  }
}

/**
 * Session tracking helper - stores session ID in localStorage
 */
export const SessionTracker = {
  /**
   * Store current session ID
   */
  setCurrentSession(sessionId) {
    if (sessionId) {
      localStorage.setItem('current_session_id', sessionId)
    }
  },

  /**
   * Get current session ID
   */
  getCurrentSession() {
    return localStorage.getItem('current_session_id')
  },

  /**
   * Clear current session
   */
  clearCurrentSession() {
    localStorage.removeItem('current_session_id')
  },

  /**
   * Track session action (download, PDF, QR scan)
   */
  async trackAction(action) {
    const sessionId = this.getCurrentSession()
    if (!sessionId) {
      console.warn('No active session to track')
      return
    }

    const updates = {}
    if (action === 'download') updates.downloaded = true
    if (action === 'pdf') updates.pdf_exported = true
    if (action === 'qr_scan') updates.qr_scanned = true

    await updateSession(sessionId, updates)
  },
}
