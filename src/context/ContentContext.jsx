import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";

const STORAGE_KEY = "cw_content_v1";
const ADMIN_SESSION_KEY = "cw_admin_session_v1";
const CONTACT_INBOX_KEY = "cw_contact_inbox_v1";

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

function loadStoredContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultContent;
    }

    const parsed = JSON.parse(raw);
    const merged = deepMerge(defaultContent, parsed);

    // Migrate older stored home text so frontend shows updated B.Tech messaging.
    if (merged.home.titleTemplate === "Master Political Science with {word}.") {
      merged.home.titleTemplate =
        "Master Political Science and all B.Tech subjects with {word}.";
    }

    if (
      merged.home.subtitle ===
      "Visual learning systems, live mentoring, and exam-ready training for school, competitive, and B.Tech students in Haryana."
    ) {
      merged.home.subtitle =
        "Visual learning systems, live mentoring, and exam-ready training for school, competitive, and B.Tech students across all major subjects in Haryana.";
    }

    if (Array.isArray(merged.home.heroBadges)) {
      merged.home.heroBadges = merged.home.heroBadges.map((badge) =>
        badge === "B.Tech Support in Haryana" ? "All B.Tech Subjects" : badge,
      );
    }

    return merged;
  } catch {
    return defaultContent;
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadStoredContent);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContentFromAdmin: (nextContent) => {
        setContent(deepMerge(defaultContent, nextContent));
      },
      resetContentFromAdmin: () => {
        localStorage.removeItem(STORAGE_KEY);
        setContent(defaultContent);
      },
      storageKey: STORAGE_KEY,
      adminSessionKey: ADMIN_SESSION_KEY,
      contactInboxKey: CONTACT_INBOX_KEY,
    }),
    [content],
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
