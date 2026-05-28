import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sessionsRouter from './routes/sessions.js'
import { closeDatabase } from './db.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API routes
app.use('/api/sessions', sessionsRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Kafka Photobooth API Server                     ║
║                                                       ║
║   Port:        ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   Database:    ${process.env.DB_NAME || 'photobooth'}                         ║
║                                                       ║
║   Endpoints:                                          ║
║   • GET    /health                                    ║
║   • GET    /api/sessions                              ║
║   • GET    /api/sessions/stats                        ║
║   • GET    /api/sessions/events                       ║
║   • POST   /api/sessions                              ║
║   • PATCH  /api/sessions/:id                          ║
║   • DELETE /api/sessions/:id                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(async () => {
    console.log('HTTP server closed')
    await closeDatabase()
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server')
  server.close(async () => {
    console.log('HTTP server closed')
    await closeDatabase()
    process.exit(0)
  })
})

export default app
