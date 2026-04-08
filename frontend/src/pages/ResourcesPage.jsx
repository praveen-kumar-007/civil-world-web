import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

function toYouTubeEmbedUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`;
      }

      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function ResourcesPage() {
  const { content } = useContent();
  const [filter, setFilter] = useState("all");
  const resources = Array.isArray(content?.data?.resources)
    ? content.data.resources
    : [];
  const freeResources = content?.home?.freeResources || {};
  const freeResourceItems = Array.isArray(freeResources?.items)
    ? freeResources.items
    : [];
  const youtubeLinks = Array.isArray(freeResources?.youtubeLinks)
    ? freeResources.youtubeLinks
    : [];
  const topics = Array.isArray(content?.resourcesPage?.topics)
    ? content.resourcesPage.topics
    : ["all"];

  const filteredResources = useMemo(() => {
    if (filter === "all") {
      return resources;
    }
    return resources.filter((item) => item.topic === filter);
  }, [filter, resources]);

  return (
    <>
      <PageHero
        eyebrow={content?.resourcesPage?.eyebrow || "Resources"}
        title={
          content?.resourcesPage?.title || "Topic-wise notes and revision material"
        }
        subtitle={
          content?.resourcesPage?.subtitle ||
          "Filter resources by topic and focus on what matters for your exam this week."
        }
      />

      <section className="container">
        <div className="filter-row">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              className={`filter-btn ${filter === topic ? "active" : ""}`}
              onClick={() => setFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="resources-grid">
          {filteredResources.map((item) => (
            <article key={item.title} className="resource-item">
              <h3>{item.title}</h3>
              <p>Topic: {item.topic}</p>
            </article>
          ))}

          {!filteredResources.length && (
            <article className="resource-item resource-empty">
              <h3>No resources found</h3>
              <p>Try another topic filter to view available study material.</p>
            </article>
          )}
        </div>

        <section className="admin-resources-block">
          <div className="section-head">
            <p>{freeResources?.heading || "Free Resources"}</p>
            <h2>
              {freeResources?.subtitle ||
                "Admin-curated downloadable material for students."}
            </h2>
          </div>

          <div className="admin-links-grid">
            {freeResourceItems.map((item) => (
              <article key={item.id || item.url} className="resource-item admin-link-item">
                <h3>{item.title || "Study resource"}</h3>
                <p>{item.category ? `Category: ${item.category}` : "Open in Google Drive"}</p>
                <a
                  className="btn btn-outline"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Drive Link
                </a>
              </article>
            ))}

            {!freeResourceItems.length && (
              <article className="resource-item resource-empty">
                <h3>No free links yet</h3>
                <p>New downloadable resources will appear here after admin updates.</p>
              </article>
            )}
          </div>

          <div className="youtube-links-list">
            <h3>{freeResources?.youtubeHeading || "YouTube Learning Videos"}</h3>
            {youtubeLinks.length ? (
              <div className="youtube-video-grid">
                {youtubeLinks.map((video, index) => {
                  const embedUrl = toYouTubeEmbedUrl(video?.url);

                  if (!embedUrl) {
                    return (
                      <article
                        key={video.id || video.url || index}
                        className="youtube-fallback-card"
                      >
                        <p>{video?.title || `Video ${index + 1}`}</p>
                        <a href={video?.url} target="_blank" rel="noreferrer">
                          Open on YouTube
                        </a>
                      </article>
                    );
                  }

                  return (
                    <article
                      key={video.id || video.url || index}
                      className="youtube-video-card"
                    >
                      <h4>{video?.title || `Video ${index + 1}`}</h4>
                      <div className="youtube-frame-wrap">
                        <iframe
                          src={embedUrl}
                          title={`YouTube video ${index + 1}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="muted">No YouTube links added yet.</p>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
