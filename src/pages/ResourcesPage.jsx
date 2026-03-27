import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function ResourcesPage() {
  const { content } = useContent();
  const { resourcesPage } = content;
  const resources = content.data.resources;
  const topics = resourcesPage.topics;

  const [filter, setFilter] = useState("all");

  const filteredResources = useMemo(() => {
    if (filter === "all") {
      return resources;
    }
    return resources.filter((item) => item.topic === filter);
  }, [filter]);

  return (
    <>
      <PageHero
        eyebrow={resourcesPage.eyebrow}
        title={resourcesPage.title}
        subtitle={resourcesPage.subtitle}
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
            <article
              key={item.title}
              className="resource-item visual-resource-item"
            >
              <h3>{item.title}</h3>
              <p>{item.topic}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
