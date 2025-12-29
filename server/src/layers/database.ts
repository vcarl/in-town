import Database from 'better-sqlite3';
import { Effect, Layer } from 'effect';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DatabaseService {
  readonly db: Database.Database;
}

export const DatabaseService = Effect.gen(function* () {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/contacts.db');
  
  // Create data directory if it doesn't exist
  const fs = yield* Effect.promise(() => import('fs'));
  const dataDir = path.dirname(dbPath);
  
  yield* Effect.promise(() => 
    fs.promises.mkdir(dataDir, { recursive: true })
  );
  
  const db = new Database(dbPath);
  
  // Initialize database schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      birthday TEXT,
      address TEXT,
      relationship TEXT,
      phone TEXT,
      email TEXT,
      instagram TEXT,
      twitter TEXT,
      facebook TEXT,
      swipe_status TEXT NOT NULL DEFAULT 'pending' CHECK(swipe_status IN ('pending', 'left', 'right')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_swipe_status ON contacts(swipe_status);
  `);
  
  return { db } as const;
});

export const DatabaseServiceLive = Layer.effect(
  Effect.Tag<DatabaseService>(),
  DatabaseService
);
