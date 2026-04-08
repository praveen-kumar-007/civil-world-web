import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import { resources } from "../data/siteData";

const topics = [
  "all",
  "theory",
  "constitution",
  "relations",
  "practice",
  "current",
];

export default function ResourcesPage() {
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
        eyebrow="Resources"
        title="Topic-wise notes and revision material"
        subtitle="Filter resources by topic and focus on what matters for your exam this week."
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
        </div>
      </section>
    </>
  );
}
