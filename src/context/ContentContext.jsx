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
    const requestedYoutubeLinks = [
      {
        id: "yt-res-1",
        url: "https://youtu.be/E-qCrzcvPbM?si=83_mb2JBMlSsWTIe",
      },
      {
        id: "yt-res-2",
        url: "https://youtu.be/ZCypdX6wf-I?si=hZgn51MfJIfvM3nq",
      },
    ];

    // Migrate older stored home text so frontend shows updated Polytechnic + B.Tech messaging.
    if (merged.home.titleTemplate === "Master Political Science with {word}.") {
      merged.home.titleTemplate =
        "Master Polytechnic and B.Tech subjects with {word}.";
    }

    if (
      merged.home.titleTemplate ===
      "Master Political Science and all B.Tech subjects with {word}."
    ) {
      merged.home.titleTemplate =
        "Master Polytechnic and B.Tech subjects with {word}.";
    }

    if (
      merged.home.subtitle ===
      "Visual learning systems, live mentoring, and exam-ready training for school, competitive, and B.Tech students in Haryana."
    ) {
      merged.home.subtitle =
        "Visual learning systems, live mentoring, and exam-ready training for Polytechnic and B.Tech students across major engineering subjects in Haryana.";
    }

    if (
      merged.home.subtitle ===
      "Visual learning systems, live mentoring, and exam-ready training for school, competitive, and B.Tech students across all major subjects in Haryana."
    ) {
      merged.home.subtitle =
        "Visual learning systems, live mentoring, and exam-ready training for Polytechnic and B.Tech students across major engineering subjects in Haryana.";
    }

    if (Array.isArray(merged.home.heroBadges)) {
      merged.home.heroBadges = merged.home.heroBadges.map((badge) =>
        badge === "B.Tech Support in Haryana"
          ? "Polytechnic + B.Tech Subjects"
          : badge === "All B.Tech Subjects"
            ? "Polytechnic + B.Tech Subjects"
            : badge,
      );
    }

    // Keep public stats aligned with current real values even on stale devices.
    if (Array.isArray(merged.data?.stats)) {
      merged.data.stats = merged.data.stats.map((item) => {
        if (item?.label === "YouTube Subscribers") {
          return { ...item, value: 34000, suffix: "+" };
        }

        if (
          item?.label === "School + B.Tech Students Mentored" ||
          item?.label === "Polytechnic + B.Tech Students Mentored"
        ) {
          return { ...item, value: 5000, suffix: "+" };
        }

        if (item?.label === "Years Experience") {
          return { ...item, value: 8, suffix: "+" };
        }

        if (item?.label === "Satisfaction") {
          return { ...item, value: 95, suffix: "%" };
        }

        return item;
      });
    }

    if (Array.isArray(merged.about?.profileHighlights)) {
      merged.about.profileHighlights = merged.about.profileHighlights.map(
        (item) => {
          if (item?.subtitle === "YouTube Learners") {
            return { ...item, title: "34K+" };
          }
          return item;
        },
      );
    }

    if (!Array.isArray(merged.home?.freeResources?.youtubeLinks)) {
      merged.home.freeResources.youtubeLinks = requestedYoutubeLinks;
    } else {
      const urls = merged.home.freeResources.youtubeLinks.map(
        (item) => item?.url,
      );
      const hasLegacyDefault = urls.includes(
        "https://www.youtube.com/watch?v=rfscVS0vtbw",
      );
      const hasRequestedLinks =
        urls.includes("https://youtu.be/E-qCrzcvPbM?si=83_mb2JBMlSsWTIe") ||
        urls.includes("https://youtu.be/ZCypdX6wf-I?si=hZgn51MfJIfvM3nq");

      if (hasLegacyDefault && !hasRequestedLinks) {
        merged.home.freeResources.youtubeLinks = requestedYoutubeLinks;
      }
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
