import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";
import { courses as fallbackCourses } from "../data/siteData";
import "./CoursesPage.css";

export default function CoursesPage() {
  const navigate = useNavigate();
  const { content } = useContent();
  const courses =
    Array.isArray(content?.data?.courses) && content.data.courses.length > 0
      ? content.data.courses
      : fallbackCourses;

  useEffect(() => {
    const cards = document.querySelectorAll(".premium-course-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [courses.length]);

  return (
    <div className="courses-page-wrapper">
      <div className="course-blurred-bg course-bg-1" />
      <div className="course-blurred-bg course-bg-2" />

      <PageHero
        eyebrow={content?.coursesPage?.eyebrow || "Programs"}
        title={content?.coursesPage?.title || "Choose your learning path"}
        subtitle={
          content?.coursesPage?.subtitle ||
          "Live mentorship programs designed for board students and competitive aspirants."
        }
      />

      <section className="container premium-courses-container">
        <div className="premium-course-grid">
          {courses.map((course, idx) => (
            <article
              key={course.title}
              className="premium-course-card"
              style={{ transitionDelay: `${idx * 0.05}s` }}
            >
              <div className="course-image-wrapper">
                <img
                  src={course.image || "/logo.png"}
                  alt={course.title}
                  className="premium-course-thumb"
                  loading="lazy"
                />
                <div className="course-overlay">
                  <button className="preview-btn" type="button">
                    View Syllabus
                  </button>
                </div>
              </div>

              <div className="course-content">
                <div className="course-header">
                  <span className="premium-pill">{course.tag}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-footer">
                  <button
                    className="enroll-btn"
                    type="button"
                    onClick={() => navigate("/contact")}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
