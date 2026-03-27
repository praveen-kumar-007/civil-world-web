import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function CoursesPage() {
  const { content } = useContent();
  const { coursesPage } = content;
  const courses = content.data.courses;
  const playStoreLink = content.data.playStoreLink;

  return (
    <>
      <PageHero
        eyebrow={coursesPage.eyebrow}
        title={coursesPage.title}
        subtitle={coursesPage.subtitle}
      />

      <section className="container course-grid">
        {courses.map((course) => (
          <a
            key={course.title}
            className="course visual-course course-link"
            href={playStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${course.title} on Play Store`}
          >
            <h3>{course.title}</h3>
            <p>{course.tag}</p>
            <div className="course-outcome-row">
              {coursesPage.courseOutcomes.map((outcome) => (
                <span key={`${course.title}-${outcome}`}>{outcome}</span>
              ))}
            </div>
            <span className="pill">{course.tag}</span>
          </a>
        ))}
      </section>
    </>
  );
}
