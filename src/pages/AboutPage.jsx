import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function AboutPage() {
  const { content } = useContent();
  const { about } = content;

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        subtitle={about.subtitle}
      />

      <section className="container mentor-profile-grid">
        {about.profileHighlights.map((item) => (
          <article key={item.title} className="mentor-profile-card">
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </article>
        ))}
      </section>

      <section className="container about-grid">
        {about.visualCards.map((item) => (
          <article key={item} className="about-card visual-about-card">
            <h3>{item}</h3>
          </article>
        ))}
      </section>
    </>
  );
}
