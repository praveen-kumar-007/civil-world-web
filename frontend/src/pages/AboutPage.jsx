import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";
import { defaultContent } from "../data/defaultContent.js";

function sanitizeAboutText(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallback;
  }

  const lower = raw.toLowerCase();
  const looksLikeLegacyTitle =
    lower.includes("teaching") &&
    lower.includes("science") &&
    lower.includes("practical") &&
    lower.includes("result-first");

  if (looksLikeLegacyTitle) {
    return fallback;
  }

  return raw;
}

export default function AboutPage() {
  const { content } = useContent();
  const aboutCards =
    Array.isArray(content?.about?.aboutCards) &&
    content.about.aboutCards.length > 0
      ? content.about.aboutCards
      : defaultContent.about.aboutCards;
  const aboutTitle = sanitizeAboutText(
    content?.about?.title,
    "Teaching Civil Engineering in a practical, result-first style",
  );
  const aboutSubtitle = sanitizeAboutText(
    content?.about?.subtitle,
    "Civil World is built to simplify difficult concepts and help students write high-scoring answers.",
  );

  return (
    <>
      <PageHero
        eyebrow={content?.about?.eyebrow || "Mentor Story"}
        title={aboutTitle}
        subtitle={aboutSubtitle}
      />

      <section className="container about-grid">
        {aboutCards.map((item) => (
          <article key={item.title} className="about-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
