/**
 * Offline Detection and Queue Management
 * Handles offline state detection and queues API calls for retry when online
 */

// Check if browser is online
export function isOnline() {
  return navigator.onLine
}

// Listen for online/offline events
export function addOnlineListener(callback) {
  window.addEventListener('online', callback)
  return () => window.removeEventListener('online', callback)
}

export function addOfflineListener(callback) {
  window.addEventListener('offline', callback)
  return () => window.removeEventListener('offline', callback)
}

// Queue management for offline API calls
const QUEUE_KEY = 'offline_api_queue'

/**
 * Add an API call to the offline queue
 */
export function queueAPICall(endpoint, method, data) {
  try {
    const queue = getQueue()
    queue.push({
      id: Date.now() + Math.random(),
      endpoint,
      method,
      data,
      timestamp: Date.now(),
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    console.log('API call queued for offline:', endpoint)
  } catch (error) {
    console.error('Failed to queue API call:', error)
  }
}

/**
 * Get all queued API calls
 */
export function getQueue() {
  try {
    const queue = localStorage.getItem(QUEUE_KEY)
    return queue ? JSON.parse(queue) : []
  } catch (error) {
    console.error('Failed to get queue:', error)
    return []
  }
}

/**
 * Clear the queue
 */
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY)
}

/**
 * Process queued API calls when back online
 */
export async function processQueue(apiClient) {
  const queue = getQueue()
  if (queue.length === 0) return

  console.log(`Processing ${queue.length} queued API calls...`)
  
  const results = []
  for (const call of queue) {
    try {
      // Execute the queued API call
      const response = await fetch(`${call.endpoint}`, {
        method: call.method,
        headers: { 'Content-Type': 'application/json' },
        body: call.data ? JSON.stringify(call.data) : undefined,
      })
      
      results.push({ id: call.id, success: response.ok })
      console.log(`Processed queued call: ${call.endpoint}`, response.ok ? '✓' : '✗')
    } catch (error) {
      console.error(`Failed to process queued call: ${call.endpoint}`, error)
      results.push({ id: call.id, success: false })
    }
  }

  // Clear queue after processing
  clearQueue()
  
  const successCount = results.filter(r => r.success).length
  console.log(`Queue processed: ${successCount}/${queue.length} successful`)
  
  return results
}

// Dashboard cache management
const CACHE_KEY = 'dashboard_cache'

/**
 * Cache dashboard data
 */
export function cacheDashboardData(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
  } catch (error) {
    console.error('Failed to cache dashboard data:', error)
  }
}

/**
 * Get cached dashboard data
 */
export function getCachedDashboardData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    
    // Cache expires after 1 hour
    const age = Date.now() - timestamp
    if (age > 60 * 60 * 1000) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Failed to get cached dashboard data:', error)
    return null
  }
}

/**
 * Clear dashboard cache
 */
export function clearDashboardCache() {
  localStorage.removeItem(CACHE_KEY)
}
