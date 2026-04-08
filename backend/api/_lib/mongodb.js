import { MongoClient } from "mongodb";

let cachedClient = globalThis.__cw_mongo_client__;
let cachedClientPromise = globalThis.__cw_mongo_client_promise__;

function ensureClient() {
  if (cachedClient && cachedClientPromise) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  cachedClient = new MongoClient(mongoUri);
  cachedClientPromise = cachedClient.connect();
  globalThis.__cw_mongo_client__ = cachedClient;
  globalThis.__cw_mongo_client_promise__ = cachedClientPromise;
}

export async function getDb() {
  ensureClient();
  const mongoDb = process.env.MONGODB_DB || "civilworld";
  await cachedClientPromise;
  return cachedClient.db(mongoDb);
}
