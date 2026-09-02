import { MongoClient } from "mongodb"

// Do NOT throw at module load time — that crashes next build on Vercel.
// The check is deferred to connectToDatabase() which is called at request time.
const uri = process.env.MONGODB_URI as string

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your Vercel project environment variables."
    )
  }

  if (process.env.NODE_ENV === "development") {
    // In development, reuse across HMR reloads via a global
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    return globalWithMongo._mongoClientPromise
  } else {
    // In production, create once per module instance
    if (!clientPromise) {
      client = new MongoClient(uri)
      clientPromise = client.connect()
    }
    return clientPromise
  }
}

export async function connectToDatabase() {
  const conn = await getClientPromise()
  const db = conn.db()
  return { client: conn, db }
}

export default { getClientPromise }

