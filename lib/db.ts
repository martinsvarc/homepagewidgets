import { createPool, Pool, QueryResult } from '@vercel/postgres';

let pool: Pool | null = null;

// Define our own client interface
interface DatabaseClient {
  query: any;
  release: () => void;
  lastQuery?: any;
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = createPool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
  const pool = await getPool();
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function getClient(): Promise<DatabaseClient> {
  const pool = await getPool();
  const client = await pool.connect() as DatabaseClient;
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args: any[]) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };

  return client;
}
