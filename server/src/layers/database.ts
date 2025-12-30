import Database from 'better-sqlite3';
import { Effect, Layer, Context } from 'effect';
import { Kysely, SqliteDialect } from 'kysely';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define database interface (will expand as needed)
export interface DatabaseSchema {
  // Future tables will go here (e.g., users, sessions)
}

export class DatabaseService extends Context.Tag('DatabaseService')<
  DatabaseService,
  { readonly db: Kysely<DatabaseSchema> }
>() {}

export const DatabaseServiceLive = Layer.effect(
  DatabaseService,
  Effect.gen(function* () {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/app.db');

    // Create data directory if it doesn't exist
    const fs = yield* Effect.promise(() => import('fs'));
    const dataDir = path.dirname(dbPath);

    yield* Effect.promise(() => fs.promises.mkdir(dataDir, { recursive: true }));

    const sqliteDb = new Database(dbPath);

    const db = new Kysely<DatabaseSchema>({
      dialect: new SqliteDialect({
        database: sqliteDb,
      }),
    });

    return { db } as const;
  })
);
