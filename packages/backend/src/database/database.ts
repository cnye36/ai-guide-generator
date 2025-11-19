import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Handle both ESM and CommonJS
const getMigrationsDir = () => {
  try {
    // ESM
    if (import.meta.url) {
      return join(dirname(fileURLToPath(import.meta.url)), 'migrations');
    }
  } catch {
    // CommonJS fallback
  }
  // Fallback to __dirname for CommonJS
  return join(__dirname, 'migrations');
};

const DB_PATH = join(process.cwd(), 'data', 'guides.db');
const MIGRATIONS_DIR = getMigrationsDir();

let dbInstance: Database.Database | null = null;

/**
 * Get or create the database instance
 */
export function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists
  const dbDir = join(process.cwd(), 'data');
  try {
    mkdirSync(dbDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }

  dbInstance = new Database(DB_PATH);
  
  // Enable foreign keys and WAL mode for better performance
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  // Run migrations
  runMigrations();

  return dbInstance;
}

/**
 * Run all pending migrations
 */
function runMigrations(): void {
  const db = dbInstance!;
  
  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    )
  `);

  // Get list of applied migrations
  const appliedMigrations = new Set(
    db.prepare('SELECT name FROM migrations').all().map((row: any) => row.name)
  );

  // Read migration files
  try {
    const migrationFiles = readdirSync(MIGRATIONS_DIR)
      .filter((file: string) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      if (!appliedMigrations.has(file)) {
        console.log(`Running migration: ${file}`);
        const migrationSQL = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
        
        db.transaction(() => {
          db.exec(migrationSQL);
          db.prepare('INSERT INTO migrations (name, applied_at) VALUES (?, ?)').run(
            file,
            Date.now()
          );
        })();
        
        console.log(`Migration ${file} applied successfully`);
      }
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

