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

function normalizeDbManagedContent(source) {
  const freeResources = source?.home?.freeResources || {};

  return {
    home: {
      freeResources: {
        heading:
          typeof freeResources.heading === "string"
            ? freeResources.heading
            : defaultContent.home.freeResources.heading,
        subtitle:
          typeof freeResources.subtitle === "string"
            ? freeResources.subtitle
            : defaultContent.home.freeResources.subtitle,
        youtubeHeading:
          typeof freeResources.youtubeHeading === "string"
            ? freeResources.youtubeHeading
            : defaultContent.home.freeResources.youtubeHeading,
        categories: Array.isArray(freeResources.categories)
          ? freeResources.categories
          : defaultContent.home.freeResources.categories,
        items: Array.isArray(freeResources.items)
          ? freeResources.items
          : defaultContent.home.freeResources.items,
        youtubeLinks: Array.isArray(freeResources.youtubeLinks)
          ? freeResources.youtubeLinks
          : defaultContent.home.freeResources.youtubeLinks,
      },
    },
  };
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION);

    if (req.method === "GET") {
      const doc = await collection.findOne({ _id: DOC_ID });
      if (doc?.content) {
        const normalized = normalizeDbManagedContent(doc.content);

        await collection.updateOne(
          { _id: DOC_ID },
          {
            $set: {
              content: normalized,
              updatedAt: new Date().toISOString(),
            },
          },
        );

        return send(res, 200, { content: normalized });
      }

      const defaultManaged = normalizeDbManagedContent(defaultContent);
      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            content: defaultManaged,
            updatedAt: new Date().toISOString(),
            source: "auto-seeded-default",
          },
        },
        { upsert: true },
      );

      return send(res, 200, { content: defaultManaged });
    }

    if (req.method === "PUT") {
      const body = parseBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return send(res, 400, { error: "Invalid JSON body." });
      }

      const normalizedBody = normalizeDbManagedContent(body);

      await collection.updateOne(
        { _id: DOC_ID },
        {
          $set: {
            content: normalizedBody,
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
