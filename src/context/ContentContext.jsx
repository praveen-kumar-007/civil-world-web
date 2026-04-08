import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";

const ADMIN_SESSION_KEY = "cw_admin_session_v1";

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

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [isHydratingContent, setIsHydratingContent] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromServer() {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!isMounted || !payload?.content) {
          return;
        }

        setContent(deepMerge(defaultContent, payload.content));
      } catch {
        // API-only persistence is required; keep default content on failures.
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
      saveContentToServer: async (nextContent) => {
        const normalized = deepMerge(defaultContent, nextContent);
        const response = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized),
        });

        if (!response.ok) {
          throw new Error("Failed to save content to server.");
        }

        setContent(normalized);
      },
      resetContentFromAdmin: async () => {
        const response = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultContent),
        });

        if (!response.ok) {
          throw new Error("Failed to reset content on server.");
        }

        setContent(defaultContent);
      },
      adminSessionKey: ADMIN_SESSION_KEY,
    }),
    [content, isHydratingContent],
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
