-- Database schema for Kafka Photobooth
-- PostgreSQL 16.x

-- Create database (run manually first):
-- CREATE DATABASE photobooth;

-- Sessions table: tracks all photobooth sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  photos_taken INT DEFAULT 4,
  downloaded BOOLEAN DEFAULT FALSE,
  pdf_exported BOOLEAN DEFAULT FALSE,
  qr_scanned BOOLEAN DEFAULT FALSE,
  template_id TEXT,
  
  -- Additional metadata
  session_duration INT, -- in seconds
  footer_text TEXT,
  
  -- Indexes for common queries
  INDEX idx_created_at (created_at DESC),
  INDEX idx_event_name (event_name),
  INDEX idx_template_id (template_id)
);

-- Create indexes separately for compatibility
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_event_name ON sessions(event_name);
CREATE INDEX IF NOT EXISTS idx_sessions_template_id ON sessions(template_id);

-- Sample query examples:
-- Get today's sessions:
-- SELECT * FROM sessions WHERE DATE(created_at) = CURRENT_DATE;

-- Get sessions by event:
-- SELECT * FROM sessions WHERE event_name = 'Wedding 2026';

-- Get download rate:
-- SELECT 
--   COUNT(*) as total_sessions,
--   SUM(CASE WHEN downloaded THEN 1 ELSE 0 END) as downloads,
--   ROUND(100.0 * SUM(CASE WHEN downloaded THEN 1 ELSE 0 END) / COUNT(*), 2) as download_rate
-- FROM sessions;
