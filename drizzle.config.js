import 'dotenv/config'

/**
 * Drizzle ORM Configuration
 * 
 * Used by drizzle-kit for:
 * - Generating migrations
 * - Pushing schema changes
 * - Introspecting database
 */
export default {
  schema: './server/db/schema.js',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'photobooth',
  },
}
