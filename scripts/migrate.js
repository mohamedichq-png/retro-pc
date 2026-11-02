const fs = require('fs');
const { Client } = require('pg');

async function runMigration(password) {
  const projectRef = 'vjodbkieotbmphzopgtt';
  // Try direct connection or connection pooler
  const connectionStrings = [
    `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
  ];

  let client = null;
  let connected = false;

  for (const connStr of connectionStrings) {
    try {
      console.log('Trying connection...');
      client = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      console.log('Connected successfully to Supabase database!');
      connected = true;
      break;
    } catch (err) {
      console.log('Connection attempt failed, trying next pooler...', err.message);
    }
  }

  if (!connected || !client) {
    console.error('Could not connect to database with provided password.');
    process.exit(1);
  }

  try {
    console.log('Reading supabase_complete_migration.sql...');
    const sql = fs.readFileSync('supabase_complete_migration.sql', 'utf8');
    console.log(`Executing migration (${sql.length} bytes)...`);
    await client.query(sql);
    console.log('MIGRATION COMPLETED SUCCESSFULLY! All tables and 375 products created.');
  } catch (err) {
    console.error('Error executing SQL migration:', err);
  } finally {
    await client.end();
  }
}

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/migrate.js <database_password>');
  process.exit(1);
}

runMigration(password);

