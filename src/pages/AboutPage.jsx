import React from 'react';
import PageHero from "../components/PageHero";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <PageHero
        eyebrow="Mentor Story"
        title="Teaching Polytechnic and B.Tech students in a practical, result-first style"
        subtitle="Civil World is built to simplify difficult technical concepts and help students achieve high scores."
      />
      
      <section className="container instructor-section">
        <div className="instructor-layout">
          <div className="instructor-image-container">
            <img 
              src="/images/civil_world_teacher.png" 
              alt="Civil World Teacher Profile" 
              className="instructor-image"
            />
            <div className="instructor-backdrop"></div>
          </div>
          <div className="instructor-info">
            <h2>Meet Your Mentor</h2>
            <p className="instructor-subtitle">Expert in Polytechnic & B.Tech Education</p>
            <p className="instructor-bio">
              With years of dedicated teaching experience, we have transformed the way engineering subjects are learned. 
              Our teaching methodology moves beyond rote memorization, focusing heavily on concept clarity and practical 
              application to ensure students not only pass their exams but excel in their careers.
            </p>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">8+</span>
                <span className="stat-label">Years Exp.</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5k+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">34k+</span>
                <span className="stat-label">Subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container about-features">
        <div className="about-grid">
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
              Daily industry and technology updates are linked with syllabus so
              learning remains fresh and exam-relevant.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
