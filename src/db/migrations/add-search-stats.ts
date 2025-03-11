import { sql } from '@vercel/postgres';

async function main() {
  console.log('Running migration: add-search-stats');

  try {
    // Check if the search_stats table already exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'search_stats'
      );
    `;

    if (tableExists.rows[0].exists) {
      console.log('Table search_stats already exists, skipping creation');
      return;
    }

    // Create the search_stats table
    await sql`
      CREATE TABLE search_stats (
        id SERIAL PRIMARY KEY,
        politician_id INTEGER NOT NULL REFERENCES politicians(id),
        search_count INTEGER NOT NULL DEFAULT 0,
        last_searched TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Create an index on politician_id for faster lookups
    await sql`
      CREATE INDEX idx_search_stats_politician_id ON search_stats(politician_id);
    `;

    // Create an index on search_count for faster sorting
    await sql`
      CREATE INDEX idx_search_stats_search_count ON search_stats(search_count DESC);
    `;

    console.log('Successfully created search_stats table and indexes');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default main; 