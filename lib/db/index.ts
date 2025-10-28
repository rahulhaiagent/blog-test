/**
 * Database Connection - SQLite with Drizzle ORM
 * Optimized for performance and Google crawling
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'database', 'blog.db');

// Create SQLite connection
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for use in queries
export { schema };

// Export database instance for raw queries if needed
export { sqlite };

