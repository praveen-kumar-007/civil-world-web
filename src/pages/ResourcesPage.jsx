import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

function toYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    return "";
  } catch {
    return "";
  }
}

export default function ResourcesPage() {
  const { content } = useContent();
  const [filter, setFilter] = useState("all");
  const [youtubeTitles, setYoutubeTitles] = useState({});

  const freeResourceConfig = content?.home?.freeResources || {};
  const categories = Array.isArray(freeResourceConfig.categories)
    ? freeResourceConfig.categories
    : ["B.Tech", "Diploma", "Programming", "Others"];
  const resourceItems = Array.isArray(freeResourceConfig.items)
    ? freeResourceConfig.items
    : [];
  const youtubeLinks = Array.isArray(freeResourceConfig.youtubeLinks)
    ? freeResourceConfig.youtubeLinks
    : [];

  const availableFilters = ["all", ...categories];

  const filteredResources = useMemo(() => {
    if (filter === "all") {
      return resourceItems;
    }
    return resourceItems.filter((item) => item.category === filter);
  }, [filter, resourceItems]);

  useEffect(() => {
    let isCancelled = false;

    if (youtubeLinks.length === 0) {
      setYoutubeTitles({});
      return undefined;
    }

    async function loadYoutubeTitles() {
      const pairs = await Promise.all(
        youtubeLinks.map(async (video) => {
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`,
            );
            if (!response.ok) {
              return [video.url, ""];
            }
            const data = await response.json();
            return [video.url, data?.title || ""];
          } catch {
            return [video.url, ""];
          }
        }),
      );

      if (isCancelled) {
        return;
      }

      const map = {};
      pairs.forEach(([url, title]) => {
        if (title) {
          map[url] = title;
        }
      });
      setYoutubeTitles(map);
    }

    loadYoutubeTitles();

    return () => {
      isCancelled = true;
    };
  }, [youtubeLinks]);

  return (
    <>
      <PageHero
        eyebrow={content?.resourcesPage?.eyebrow || "Resources"}
        title={content?.home?.freeResources?.heading || "Resource Hub"}
        subtitle={
          content?.home?.freeResources?.subtitle ||
          "Select a category and open the exact learning resource you need."
        }
      />

      <section className="container">
        <div className="filter-row resource-filter-row">
          {availableFilters.map((topic) => (
            <button
              key={topic}
              type="button"
              className={`filter-btn resource-filter-btn ${filter === topic ? "active" : ""}`}
              onClick={() => setFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="resources-grid resource-hub-grid">
          {filteredResources.length === 0 ? (
            <article className="resource-item">
              <h3>No resources in this category yet</h3>
              <p>Try another filter or check again soon.</p>
            </article>
          ) : (
            filteredResources.map((item) => (
              <article key={item.id || item.title} className="resource-item">
                <p className="resource-chip">{item.category || "Others"}</p>
                <h3>
                  <a
                    className="resource-heading-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                </h3>
                <p>Google Drive Resource</p>
                <a
                  className="btn btn-primary"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource
                </a>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="container resource-video-zone">
        <div className="section-head">
          <p className="eyebrow">Video Frames</p>
          <h2>Watch and revise from curated YouTube lessons</h2>
        </div>

        <div className="resource-video-grid">
          {youtubeLinks.length === 0 ? (
            <article className="resource-item">
              <h3>No YouTube links added yet</h3>
              <p>Admin can add videos from the Free Resources panel.</p>
            </article>
          ) : (
            youtubeLinks.map((video) => {
              const embedUrl = toYoutubeEmbedUrl(video.url);
              const videoTitle =
                youtubeTitles[video.url] || video.title || "YouTube Video";
              return (
                <article
                  key={video.id || video.url}
                  className="video-frame-card"
                >
                  <h3>{videoTitle}</h3>
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={videoTitle}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <p>Invalid YouTube link format.</p>
                  )}
                  <a
                    className="btn btn-outline"
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on YouTube
                  </a>
                </article>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
