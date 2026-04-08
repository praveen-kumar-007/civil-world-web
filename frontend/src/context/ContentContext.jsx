import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";

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

function extractDbManagedContent(source) {
  const freeResources = source?.home?.freeResources || {};

  return {
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
  };
}

function composeAppContent(managed) {
  return {
    ...defaultContent,
    home: {
      ...defaultContent.home,
      freeResources: {
        ...defaultContent.home.freeResources,
        heading: managed.heading,
        subtitle: managed.subtitle,
        youtubeHeading: managed.youtubeHeading,
        categories: managed.categories,
        items: managed.items,
        youtubeLinks: managed.youtubeLinks,
      },
    },
  };
}

function buildManagedPayload(managed) {
  return {
    home: {
      freeResources: {
        heading: managed.heading,
        subtitle: managed.subtitle,
        youtubeHeading: managed.youtubeHeading,
        categories: managed.categories,
        items: managed.items,
        youtubeLinks: managed.youtubeLinks,
      },
    },
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
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

        const payload = await response.json();
        if (!isMounted) {
          return;
        }

        const managed = extractDbManagedContent(payload?.content || {});
        setContent(composeAppContent(managed));
      } catch (error) {
        if (isMounted) {
          setContent(defaultContent);
          setContentLoadError(
            error instanceof Error
              ? `Using hardcoded site content. ${error.message}`
              : "Using hardcoded site content. Failed to load DB-managed resources/videos.",
          );
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
        const managed = extractDbManagedContent(nextContent || {});
        setContent(composeAppContent(managed));

        const contentUrl = getApiUrl("/api/content");
        const response = await fetch(contentUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildManagedPayload(managed)),
        });

        if (!response.ok) {
          setContentLoadError("Saved in app state, but server save failed.");
          throw new Error("Failed to save content/resources/videos to server.");
        }

        setContentLoadError(null);
      },
      resetContentFromAdmin: async () => {
        const managedDefaults = extractDbManagedContent(defaultContent);

        const contentUrl = getApiUrl("/api/content");
        const response = await fetch(contentUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildManagedPayload(managedDefaults)),
        });

        if (!response.ok) {
          throw new Error("Failed to reset DB-managed content on server.");
        }

        setContent(composeAppContent(managedDefaults));
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
