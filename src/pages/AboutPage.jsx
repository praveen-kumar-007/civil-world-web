import PageHero from "../components/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Mentor Story"
        title="Teaching Political Science in a practical, result-first style"
        subtitle="Civil World is built to simplify difficult concepts and help students write high-scoring answers."
      />

      <section className="container about-grid">
        <article className="about-card">
          <h3>Concept Clarity First</h3>
          <p>
            Every topic starts with relatable examples, then moves into exam
            language and frameworks.
          </p>
        </article>
        <article className="about-card">
          <h3>Answer Writing Method</h3>
          <p>
            Students learn intros, body structure, and conclusion templates for
            faster scoring answers.
          </p>
        </article>
        <article className="about-card">
          <h3>Current Affairs Integration</h3>
          <p>
            Daily political updates are linked with syllabus so learning remains
            fresh and exam-relevant.
          </p>
        </article>
      </section>
    </>
  );
}
