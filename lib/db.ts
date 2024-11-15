import { createPool, Pool, QueryResult, QueryResultRow } from '@vercel/postgres';

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

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string, 
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = await getPool();
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function getClient(): Promise<DatabaseClient> {
  const pool = await getPool();
  const client = await pool.connect() as DatabaseClient;
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

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
