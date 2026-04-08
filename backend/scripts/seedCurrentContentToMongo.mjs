import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) {
      process.env[key] = value;
    }
  }
}

async function run() {
  loadEnvFile();
  const { defaultContent } = await import("../data/defaultContent.js");
  const { getDb } = await import("../api/_lib/mongodb.js");

  const db = await getDb();
  await db.collection("app_state").updateOne(
    { _id: "content" },
    {
      $set: {
        content: defaultContent,
        updatedAt: new Date().toISOString(),
        source: "seed-current-web-content",
      },
    },
    { upsert: true },
  );

  const doc = await db.collection("app_state").findOne({ _id: "content" });
  const freeResources = doc?.content?.home?.freeResources?.items?.length || 0;
  const youtubeLinks =
    doc?.content?.home?.freeResources?.youtubeLinks?.length || 0;
  const courses = doc?.content?.data?.courses?.length || 0;

  console.log(
    JSON.stringify({
      ok: true,
      db: db.databaseName,
      seeded: true,
      freeResources,
      youtubeLinks,
      courses,
    }),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
