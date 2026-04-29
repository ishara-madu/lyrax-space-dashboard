import { MongoClient, ServerApiVersion } from "mongodb";
import { unstable_cache } from "next/cache";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Fetches launch documents from MongoDB and caches the result across requests.
 * Revalidates every hour (3600 seconds).
 */
export const getLaunchesFromDB = unstable_cache(
  async () => {
    try {
      const client = await clientPromise;
      const db = client.db("spacedash");
      return await db.collection("launches").find({}).toArray();
    } catch (error) {
      console.warn("MongoDB connection failed, proceeding with empty result.", error);
      return [];
    }
  },
  ["launches-list"],
  { revalidate: 3600, tags: ["launches"] }
);

export default clientPromise;

