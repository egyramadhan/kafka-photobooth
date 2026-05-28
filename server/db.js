import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema.js'

/**
 * PostgreSQL Database Connection with Drizzle ORM
 * 
 * Uses postgres.js driver for optimal performance
 * Drizzle provides type-safe queries and schema management
 */

// Create postgres connection
const connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'photobooth'}`

// PostgreSQL client configuration
const client = postgres(connectionString, {
  max: 20, // maximum number of connections in the pool
  idle_timeout: 30, // close idle connections after 30 seconds
  connect_timeout: 2, // connection timeout in seconds
  onnotice: () => {}, // suppress notices
})

// Create Drizzle instance with schema
export const db = drizzle(client, { schema })

// Test connection on startup
try {
  await client`SELECT 1`
  console.log('✅ Connected to PostgreSQL database (Drizzle ORM)')
} catch (error) {
  console.error('❌ Failed to connect to PostgreSQL database:', error.message)
  process.exit(1)
}

/**
 * Graceful shutdown - close database connection
 */
export async function closeDatabase() {
  try {
    await client.end()
    console.log('PostgreSQL connection closed')
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}

// Export schema for use in routes
export { schema }

export default db
