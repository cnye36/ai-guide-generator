-- Initial schema for guides table
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  outline TEXT NOT NULL, -- JSON array
  metadata TEXT NOT NULL, -- JSON object
  sources TEXT NOT NULL, -- JSON array
  preferences TEXT NOT NULL, -- JSON object
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guides_created_at ON guides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guides_topic ON guides(topic);

