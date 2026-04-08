import PageHero from "../components/PageHero";
import { courses } from "../data/siteData";

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Choose your learning path"
        subtitle="Live mentorship programs designed for board students and competitive aspirants."
      />

      <section className="container course-grid">
        {courses.map((course) => (
          <article key={course.title} className="course">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span className="pill">{course.tag}</span>
          </article>
        ))}
      </section>
    </>
  );
}
