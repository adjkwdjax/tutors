import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined
}

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool
}

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
  })

if (!globalForPg.pgPool) {
  globalForPg.pgPool = pool
}