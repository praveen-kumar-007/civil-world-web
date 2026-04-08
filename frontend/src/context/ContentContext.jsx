import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";

const STORAGE_KEY = "cw_content_v1";
const ADMIN_SESSION_KEY = "cw_admin_session_v1";
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").trim();

function getApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const baseWithoutApi = /\/api$/i.test(trimmedBase)
    ? trimmedBase.slice(0, -4)
    : trimmedBase;

  return `${baseWithoutApi}${normalizedPath}`;
}

const ContentContext = createContext(null);

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (isPlainObject(base)) {
    const result = { ...base };
    const entries = isPlainObject(override) ? Object.entries(override) : [];

    entries.forEach(([key, value]) => {
      if (key in base) {
        result[key] = deepMerge(base[key], value);
      }
    });

    return result;
  }

  return override === undefined ? base : override;
}

function extractDbManagedContent(source) {
  const freeResources = source?.home?.freeResources || {};
  const data = source?.data || {};

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
    data: {
      courses: Array.isArray(data.courses)
        ? data.courses
        : defaultContent.data.courses,
      resources: Array.isArray(data.resources)
        ? data.resources
        : defaultContent.data.resources,
    },
  };
}

function composeAppContent(source) {
  return deepMerge(defaultContent, extractDbManagedContent(source));
}

function loadLocalContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return composeAppContent(parsed);
  } catch {
    return null;
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => loadLocalContent());
  const [isHydratingContent, setIsHydratingContent] = useState(true);
  const [contentLoadError, setContentLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromServer() {
      setContentLoadError(null);
      try {
        const contentUrl = getApiUrl("/api/content");
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`Content API returned ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const rawBody = await response.text();
        if (!contentType.toLowerCase().includes("application/json")) {
          throw new Error(
            "API route /api/content is not returning JSON. Run with Vercel serverless API enabled (for example `vercel dev`) or deploy backend API.",
          );
        }

        let payload;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          throw new Error("Content API returned invalid JSON.");
        }

        if (!isMounted) {
          return;
        }

        if (!payload?.content) {
          throw new Error("No content document in database.");
        }

        const dbManaged = extractDbManagedContent(payload.content);
        const normalized = composeAppContent(payload.content);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        setContent(normalized);

        // Migrate older full-content documents to the restricted DB shape.
        if (JSON.stringify(payload.content) !== JSON.stringify(dbManaged)) {
          await fetch(contentUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dbManaged),
          });
        }
      } catch (error) {
        const localBackup = loadLocalContent();
        if (isMounted) {
          if (localBackup) {
            setContent(localBackup);
            setContentLoadError(
              "Server unavailable. Loaded last saved local content.",
            );
          } else {
            setContent(defaultContent);
            setContentLoadError(
              error instanceof Error
                ? error.message
                : "Failed to load content.",
            );
          }
        }
      } finally {
        if (isMounted) {
          setIsHydratingContent(false);
        }
      }
    }

    hydrateFromServer();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      content,
      isHydratingContent,
      contentLoadError,
      saveContentToServer: async (nextContent) => {
        const dbManaged = extractDbManagedContent(nextContent);
        const normalized = composeAppContent(nextContent);
        setContent(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        const contentUrl = getApiUrl("/api/content");
        const response = await fetch(contentUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbManaged),
        });

        if (!response.ok) {
          setContentLoadError("Saved locally, but server save failed.");
          throw new Error("Failed to save content to server.");
        }

        setContentLoadError(null);
      },
      resetContentFromAdmin: async () => {
        localStorage.removeItem(STORAGE_KEY);
        const dbManagedDefaults = extractDbManagedContent(defaultContent);

        const contentUrl = getApiUrl("/api/content");
        const response = await fetch(contentUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbManagedDefaults),
        });

        if (!response.ok) {
          throw new Error("Failed to reset content on server.");
        }

        setContent(defaultContent);
        setContentLoadError(null);
      },
      adminSessionKey: ADMIN_SESSION_KEY,
    }),
    [content, isHydratingContent, contentLoadError],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) {
    throw new Error("useContent must be used inside ContentProvider");
  }
  return value;
}
