import { getDb } from "./_lib/mongodb.js";

const COLLECTION = "contacts";

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
      const items = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(300)
        .toArray();
      return send(res, 200, { items });
    }

    if (req.method === "POST") {
      const payload = parseBody(req);
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return send(res, 400, { error: "Invalid contact payload." });
      }

      await collection.insertOne(payload);
      return send(res, 201, { ok: true });
    }

    if (req.method === "PATCH") {
      const payload = parseBody(req);
      const id = payload?.id;
      const status = payload?.status;

      if (!id || !status) {
        return send(res, 400, { error: "id and status are required." });
      }

      await collection.updateOne({ id }, { $set: { status } });
      return send(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      const payload = parseBody(req) || {};
      const id = payload?.id;

      if (id) {
        await collection.deleteOne({ id });
        return send(res, 200, { ok: true });
      }

      await collection.deleteMany({});
      return send(res, 200, { ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return send(res, 405, { error: "Method not allowed." });
  } catch {
    return send(res, 500, { error: "Server error while handling contacts." });
  }
}
