import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const { default: contentHandler } = await import("./api/content.js");
const { default: contactsHandler } = await import("./api/contacts.js");

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrls = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser and same-origin requests with no Origin header.
      if (!origin) return callback(null, true);
      if (frontendUrls.length === 0) return callback(null, true);
      if (frontendUrls.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"), false);
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "civil-world-backend",
    message:
      "Backend is running. Use /api/health, /api/content, or /api/contacts.",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "civil-world-backend" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "civil-world-backend" });
});

app.all("/api/content", (req, res) => contentHandler(req, res));
app.all("/api/contacts", (req, res) => contactsHandler(req, res));

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
    path: req.originalUrl,
    hint: "Try /api/health, /api/content, or /api/contacts.",
  });
});

app.listen(port, () => {
  console.log(`Civil World backend running on http://localhost:${port}`);
});
