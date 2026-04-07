import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import EducationalModel from "../components/EducationalModel";
import { faqItems, stats, testimonials } from "../data/siteData";
import { useContent } from "../context/ContentContext";

const typedWords = ["clarity", "strategy", "confidence", "high scores"];
const updates = [
  "New Batch Starts Monday",
  "Live Doubt Solving Every Saturday",
  "Free Engineering Workshop This Week",
  "34K+ YouTube Learning Community",
  "Diploma + Engineering Exam Strategy Sessions",
];

export default function HomePage() {
  const { content } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(-1);
  const [wordIndex, setWordIndex] = useState(0);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [displayStats, setDisplayStats] = useState(stats.map(() => 0));

  const freeResources = content?.home?.freeResources;
  const freeResourceItems = Array.isArray(freeResources?.items)
    ? freeResources.items
    : [];

  const pageCards = useMemo(
    () => [
      { title: "Mentor Story", to: "/about" },
      { title: "Courses", to: "/courses" },
      { title: "Resources", to: "/resources" },
      { title: "Gallery", to: "/gallery" },
      { title: "Contact", to: "/contact" },
    ],
    [],
  );

  useEffect(() => {
    const ticker = setInterval(() => {
      setWordIndex((current) => (current + 1) % typedWords.length);
    }, 1700);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const slider = setInterval(() => {
      setActiveSlide((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(slider);
  }, []);

  useEffect(() => {
    const timers = stats.map((item, index) => {
      let value = 0;
      const step = Math.max(1, Math.ceil(item.value / 80));
      return setInterval(() => {
        value += step;
        setDisplayStats((prev) => {
          const clone = [...prev];
          clone[index] = Math.min(item.value, value);
          return clone;
        });
      }, 18);
    });

    const stop = setTimeout(
      () => timers.forEach((timer) => clearInterval(timer)),
      1800,
    );
    return () => {
      timers.forEach((timer) => clearInterval(timer));
      clearTimeout(stop);
    };
  }, []);

  return (
    <>
      <section className="announcement-strip" aria-label="Latest updates">
        <div className="announcement-track">
          {[...updates, ...updates].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <PageHero
        eyebrow="Haryana's Trusted Polytechnic and B.Tech Mentor"
        title={`Master Polytechnic and B.Tech subjects with ${typedWords[wordIndex]}.`}
        subtitle="Civil World delivers concept-first teaching, practical problem-solving strategy, and exam-ready training."
      >
        <div className="hero-layout">
          <div>
            <div className="hero-cta">
              <a
                className="btn btn-primary"
                href="https://www.youtube.com/results?search_query=civil+world+polytechnic+btech"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
              <Link className="btn btn-outline" to="/courses">
                Explore Courses
              </Link>
              <Link className="btn btn-outline" to="/contact">
                Join Next Batch
              </Link>
              <a className="btn btn-outline" href="#free-resources">
                Free Resources
              </a>
              <Link className="btn btn-outline" to="/admin/resources">
                Admin Access
              </Link>
            </div>

            <div className="hero-badges">
              <span>Answer Writing Mastery</span>
              <span>Live Mentorship</span>
              <span>Hindi + English Support</span>
            </div>
          </div>

          <aside
            className="hero-visual 3d-hero-visual"
            aria-label="Educational 3D Model"
          >
            <EducationalModel />
          </aside>
        </div>
      </PageHero>

      <section className="stats container">
        <div className="stats-grid">
          {stats.map((item, index) => (
            <article key={item.label} className="stat-card">
              <h3>
                {displayStats[index].toLocaleString()}
                {item.suffix}
              </h3>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <p className="eyebrow">Why Civil World</p>
          <h2>Designed like a top education channel experience</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Topic-to-Answer Workflow</h3>
            <p>
              Every concept is mapped to exam questions so you know exactly how
              to write scoring answers.
            </p>
          </article>
          <article className="feature-card">
            <h3>Weekly Performance Analytics</h3>
            <p>
              Track strengths, weaknesses, and improvement areas through
              structured tests and insights.
            </p>
          </article>
          <article className="feature-card">
            <h3>Current Affairs Integration</h3>
            <p>
              Dynamic examples from real technical use-cases make concepts
              practical and memorable.
            </p>
          </article>
          <article className="feature-card">
            <h3>Community-Based Learning</h3>
            <p>
              Join discussions, mentor support, and peer learning challenges for
              consistent progress.
            </p>
          </article>
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <p className="eyebrow">All Pages</p>
          <h2>Multi-page React website navigation</h2>
        </div>
        <div className="pages-grid">
          {pageCards.map((card) => (
            <Link key={card.title} className="page-card" to={card.to}>
              <h3>{card.title}</h3>
              <p>Open {card.title} page</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="container channel-band"
        aria-label="Channel strengths"
      >
        <div className="channel-band-inner">
          <p>Live Classes</p>
          <p>Premium Notes</p>
          <p>Rapid Revision</p>
          <p>Test Series</p>
          <p>Mentor Feedback</p>
          <p>Career Guidance</p>
        </div>
      </section>

      <section className="container hsbte-desk" aria-label="HSBTE Board Desk">
        <article className="hsbte-card">
          <div className="hsbte-head">
            <img
              src="https://hsbte.org.in/assets/img/logo/HSBTEb2.png"
              alt="HSBTE logo"
              className="hsbte-logo"
              loading="lazy"
            />
            <div>
              <p className="eyebrow">Haryana Board Desk</p>
              <h2>HSBTE Student Result & Notice Access</h2>
            </div>
          </div>

          <p>
            As a teacher from Haryana Board, I have added this quick board desk
            so students can directly visit HSBTE for latest results, notices,
            and official updates.
          </p>

          <div className="hero-cta">
            <a
              className="btn btn-primary"
              href="https://hsbte.org.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open HSBTE Portal
            </a>
            <a
              className="btn btn-outline"
              href="https://hsbte.org.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check Results & Notices
            </a>
          </div>
        </article>
      </section>

      <section className="container" id="free-resources">
        <div className="section-head">
          <p className="eyebrow">Free Download Zone</p>
          <h2>{freeResources?.heading || "Free Resources"}</h2>
          <p>
            {freeResources?.subtitle ||
              "Access free learning files uploaded by the mentor."}
          </p>
        </div>

        <div className="resources-grid">
          {freeResourceItems.length === 0 ? (
            <article className="resource-item">
              <h3>No free resources uploaded yet</h3>
              <p>Please check again soon.</p>
            </article>
          ) : (
            freeResourceItems.map((item) => (
              <article key={item.id || item.title} className="resource-item">
                <h3>
                  <a
                    className="resource-heading-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title || "Free Resource"}
                  </a>
                </h3>
                <p>Google Drive Resource</p>
                <a
                  className="btn btn-primary"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Drive Link
                </a>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Student Results</p>
            <h2>What learners are saying</h2>
          </div>
          <div className="slider">
            <article className="slide active">
              <p>"{testimonials[activeSlide].quote}"</p>
              <h4>- {testimonials[activeSlide].author}</h4>
            </article>
            <div className="slider-controls">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (current) =>
                      (current - 1 + testimonials.length) % testimonials.length,
                  )
                }
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (current) => (current + 1) % testimonials.length,
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Quick answers for students</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((faq, index) => (
            <article key={faq.question} className="faq-item">
              <button
                type="button"
                className="faq-question"
                aria-expanded={activeFaq === index}
                onClick={() =>
                  setActiveFaq((current) => (current === index ? -1 : index))
                }
              >
                {faq.question}
              </button>
              <div
                className={`faq-answer ${activeFaq === index ? "open" : ""}`}
              >
                <p>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter container">
        <div>
          <p className="eyebrow">Weekly Updates</p>
          <h2>Get classes and notes in your inbox.</h2>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email") || "").trim();
            if (!email) {
              setNewsletterMessage("Please enter a valid email.");
              return;
            }
            localStorage.setItem("civilWorldSubscriber", email);
            setNewsletterMessage("Subscribed successfully for weekly updates.");
            event.currentTarget.reset();
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
        <p className="status-text">{newsletterMessage}</p>
      </section>

      <section className="container cta-pro">
        <div className="cta-pro-card">
          <h2>Ready to level up your Polytechnic and B.Tech preparation?</h2>
          <p>
            Start with structured mentorship, practice systems, and smart exam
            strategy.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/contact">
              Book a Guidance Call
            </Link>
            <Link className="btn btn-outline" to="/courses">
              Compare Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
