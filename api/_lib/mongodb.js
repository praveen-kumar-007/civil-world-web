import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "civilworld";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

let cachedClient = globalThis.__cw_mongo_client__;
let cachedClientPromise = globalThis.__cw_mongo_client_promise__;

if (!cachedClient) {
  cachedClient = new MongoClient(MONGODB_URI);
  cachedClientPromise = cachedClient.connect();
  globalThis.__cw_mongo_client__ = cachedClient;
  globalThis.__cw_mongo_client_promise__ = cachedClientPromise;
}

export async function getDb() {
  await cachedClientPromise;
  return cachedClient.db(MONGODB_DB);
}
