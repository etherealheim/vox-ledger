import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Create a singleton instance of the database connection
let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Get the database connection instance
 * This ensures we reuse the same connection throughout the application
 */
export function getDb() {
  if (!_db) {
    try {
      _db = drizzle(sql, { schema });
      console.log('Database connection established');
    } catch (error) {
      console.error('Failed to establish database connection:', error);
      throw new Error('Database connection failed');
    }
  }
  return _db;
}

// Export the db instance for backward compatibility
export const db = getDb();

// Export a function to explicitly close the connection if needed
export async function closeDbConnection() {
  _db = null;
  console.log('Database connection closed');
}
