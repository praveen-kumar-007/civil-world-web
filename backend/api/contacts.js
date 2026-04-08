import { getDb } from "./_lib/mongodb.js";

const COLLECTION = "contacts";

const REQUIRED_FIELDS = [
  "name",
  "email",
  "phone",
  "city",
  "studentType",
  "program",
  "learningMode",
  "message",
];

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

function asTrimmedText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+\-()\s]{7,20}$/.test(phone);
}

function buildValidatedContact(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Invalid contact payload." };
  }

  const contact = {
    id: asTrimmedText(payload.id) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: asTrimmedText(payload.createdAt) || new Date().toISOString(),
    status: "new",
  };

  for (const field of REQUIRED_FIELDS) {
    contact[field] = asTrimmedText(payload[field]);
    if (!contact[field]) {
      return { error: `Missing required field: ${field}` };
    }
  }

  if (!isValidEmail(contact.email)) {
    return { error: "Invalid email format." };
  }

  if (!isValidPhone(contact.phone)) {
    return { error: "Invalid phone format." };
  }

  return { contact };
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
      const { contact, error } = buildValidatedContact(payload);

      if (error) {
        return send(res, 400, { error });
      }

      await collection.insertOne(contact);
      return send(res, 201, { ok: true });
    }

    if (req.method === "PATCH") {
      const payload = parseBody(req);
      const id = asTrimmedText(payload?.id);
      const status = asTrimmedText(payload?.status).toLowerCase();

      if (!id || !status) {
        return send(res, 400, { error: "id and status are required." });
      }

      if (status !== "new" && status !== "read") {
        return send(res, 400, { error: "status must be either 'new' or 'read'." });
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
