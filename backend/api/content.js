import { getDb } from "./_lib/mongodb.js";
import { defaultContent } from "../data/defaultContent.js";

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

function sanitizeLegacyTerms(value) {
  if (typeof value === "string") {
    return value
      .replace(/political\s+science/gi, "polytechnic civil engineering")
      .replace(/political\s+theory/gi, "polytechnic engineering")
      .replace(/political/gi, "polytechnic");
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLegacyTerms(item));
  }

  if (value && typeof value === "object") {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      output[key] = sanitizeLegacyTerms(item);
    }
    return output;
  }

  return value;
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION);

    if (req.method === "GET") {
      const doc = await collection.findOne({ _id: DOC_ID });
      if (doc?.content) {
        const sanitized = sanitizeLegacyTerms(doc.content);

        await collection.updateOne(
          { _id: DOC_ID },
          {
            $set: {
              content: sanitized,
              updatedAt: new Date().toISOString(),
            },
          },
        );

        return send(res, 200, { content: sanitized });
      }

      const sanitizedDefault = sanitizeLegacyTerms(defaultContent);
      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            content: sanitizedDefault,
            updatedAt: new Date().toISOString(),
            source: "auto-seeded-default",
          },
        },
        { upsert: true },
      );

      return send(res, 200, { content: sanitizedDefault });
    }

    if (req.method === "PUT") {
      const body = parseBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return send(res, 400, { error: "Invalid JSON body." });
      }

      const sanitizedBody = sanitizeLegacyTerms(body);

      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            content: sanitizedBody,
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
