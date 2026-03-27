import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import EducationalModel from "../components/EducationalModel";
import { useContent } from "../context/ContentContext";

export default function HomePage() {
  const { content } = useContent();
  const { home } = content;
  const faqItems = content.data.faqItems;
  const stats = content.data.stats;
  const testimonials = content.data.testimonials;
  const socialLinks = content.data.socialLinks;

  const typedWords = home.typedWords.length > 0 ? home.typedWords : ["clarity"];
  const updates = home.updates;
  const visualPrograms = home.visualPrograms;
  const quickJourney = home.quickJourney;
  const youtubeLink =
    socialLinks.find((item) => item.name.toLowerCase() === "youtube")?.url ||
    "https://youtube.com/@civilworld0312";

  const [activeSlide, setActiveSlide] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [displayStats, setDisplayStats] = useState(stats.map(() => 0));

  const pageCards = useMemo(() => home.pageCards, [home.pageCards]);

  useEffect(() => {
    setDisplayStats(stats.map(() => 0));
  }, [stats]);

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
        eyebrow={home.eyebrow}
        title={home.titleTemplate.replace("{word}", typedWords[wordIndex])}
        subtitle={home.subtitle}
      >
        <div className="hero-layout">
          <div>
            <div className="hero-cta">
              <a
                className="btn btn-primary"
                href={youtubeLink}
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
            </div>

            <div className="hero-badges">
              {home.heroBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>

            <div className="journey-strip" aria-label="Student journey">
              {quickJourney.map((item, index) => (
                <div key={item} className="journey-step">
                  <strong>{index + 1}</strong>
                  <span>{item}</span>
                </div>
              ))}
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
          <p className="eyebrow">Programs</p>
          <h2>Visual learning tracks</h2>
        </div>
        <div className="visual-program-grid">
          {visualPrograms.map((item) => (
            <article
              key={item.title}
              className={`visual-program-card glow-${item.glow}`}
            >
              <span className="program-chip">{item.badge}</span>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <p className="eyebrow">All Pages</p>
          <h2>Explore quickly</h2>
        </div>
        <div className="pages-grid">
          {pageCards.map((card) => (
            <Link key={card.title} className="page-card" to={card.to}>
              <h3>{card.title}</h3>
              <p>Open</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="container channel-band"
        aria-label="Channel strengths"
      >
        <div className="channel-band-inner">
          {home.channelBand.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Student Results</p>
            <h2>{home.testimonialsTitle}</h2>
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

      <section className="container faq compact-faq">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>{home.faqTitle}</h2>
        </div>
        <div className="faq-quick-grid">
          {faqItems.map((faq) => (
            <article key={faq.question} className="faq-quick-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="container visual-mosaic"
        aria-label="Learning visuals"
      >
        <div className="mosaic-a mosaic-mini-card">
          <p className="mosaic-mini-label">Live Support</p>
          <h4>{home.channelBand[0] || "Live Classes"}</h4>
          <p>Daily concept sessions with clear board explanations.</p>
        </div>
        <div className="mosaic-b mosaic-mini-card">
          <p className="mosaic-mini-label">Performance System</p>
          <h4>{home.channelBand[3] || "Test Series"}</h4>
          <p>Weekly evaluation to track progress and fill learning gaps.</p>
        </div>
        <div className="mosaic-c">
          <h3>{home.mosaic.title}</h3>
          <p>{home.mosaic.text}</p>
          <div className="mosaic-stat-row">
            {stats.slice(0, 3).map((item) => (
              <div key={item.label} className="mosaic-stat-pill">
                <strong>
                  {item.value.toLocaleString()}
                  {item.suffix}
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mosaic-d mosaic-mini-card">
          <p className="mosaic-mini-label">Mentor Feedback</p>
          <h4>{home.channelBand[4] || "Mentor Feedback"}</h4>
          <p>Answer reviews and practical suggestions for every learner.</p>
        </div>
      </section>

      <section className="newsletter container">
        <div>
          <p className="eyebrow">{home.newsletter.eyebrow}</p>
          <h2>{home.newsletter.title}</h2>
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
          <h2>{home.cta.title}</h2>
          <p>{home.cta.text}</p>
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
