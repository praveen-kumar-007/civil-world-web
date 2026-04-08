import { getDb } from "./_lib/mongodb.js";

const COLLECTION = "app_state";
const DOC_ID = "content";

function send(res, status, payload) {
  res.status(status).json(payload);
}

function parseBody(req) {
  if (!req.body) {
    return null;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return req.body;
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION);

    if (req.method === "GET") {
      const doc = await collection.findOne({ _id: DOC_ID });
      return send(res, 200, { content: doc?.content || null });
    }

    if (req.method === "PUT") {
      const body = parseBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return send(res, 400, { error: "Invalid JSON body." });
      }

      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            content: body,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      );

      return send(res, 200, { ok: true });
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return send(res, 405, { error: "Method not allowed." });
  } catch {
    return send(res, 500, { error: "Server error while handling content." });
  }
}
