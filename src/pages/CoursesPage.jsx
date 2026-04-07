import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import { courses } from "../data/siteData";
import "./CoursesPage.css";

export default function CoursesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add simple reveal animation logic
    const cards = document.querySelectorAll(".premium-course-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="courses-page-wrapper">
      <div className="course-blurred-bg course-bg-1"></div>
      <div className="course-blurred-bg course-bg-2"></div>
      
      <PageHero
        eyebrow="Premium Programs"
        title="Elevate Your Engineering Path"
        subtitle="Discover our meticulously crafted courses spanning from foundation batches to advanced programming and mastery tracks. Transform your learning experience with our dynamic curriculum."
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
                  src={course.image}
                  alt={course.title}
                  className="premium-course-thumb"
                  loading="lazy"
                />
                <div className="course-overlay">
                  <button className="preview-btn">View Syllabus</button>
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
                    onClick={() => navigate('/contact')}
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
