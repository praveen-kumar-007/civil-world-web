import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import EducationalModel from "../components/EducationalModel";
import { useContent } from "../context/ContentContext";
import { defaultContent } from "../data/defaultContent.js";

function toYouTubeEmbedUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[shortsIndex + 1]}`;
      }

      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function HomePage() {
  const { content } = useContent();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(-1);
  const [wordIndex, setWordIndex] = useState(0);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const typedWords = Array.isArray(content?.home?.typedWords)
    ? content.home.typedWords
    : ["clarity"];
  const updates = Array.isArray(content?.home?.updates)
    ? content.home.updates
    : [];
  const stats = Array.isArray(content?.data?.stats) ? content.data.stats : [];
  const testimonials = Array.isArray(content?.data?.testimonials)
    ? content.data.testimonials
    : [];
  const faqItems = Array.isArray(content?.data?.faqItems)
    ? content.data.faqItems
    : [];
  const [displayStats, setDisplayStats] = useState(stats.map(() => 0));

  const pageCards = useMemo(
    () =>
      Array.isArray(content?.home?.pageCards) &&
      content.home.pageCards.length > 0
        ? content.home.pageCards
        : [
            { title: "Mentor Story", to: "/about" },
            { title: "Courses", to: "/courses" },
            { title: "Resources", to: "/resources" },
            { title: "Gallery", to: "/gallery" },
            { title: "Contact", to: "/contact" },
          ],
    [content?.home?.pageCards],
  );

  const featureHighlights =
    Array.isArray(content?.home?.featureHighlights) &&
    content.home.featureHighlights.length > 0
      ? content.home.featureHighlights
      : defaultContent.home.featureHighlights;
  const featureSectionEyebrow =
    content?.home?.featureSection?.eyebrow ||
    defaultContent.home.featureSection.eyebrow;
  const featureSectionTitle =
    content?.home?.featureSection?.title ||
    defaultContent.home.featureSection.title;
  const channelBand = Array.isArray(content?.home?.channelBand)
    ? content.home.channelBand
    : [
        "Live Classes",
        "Premium Notes",
        "Rapid Revision",
        "Test Series",
        "Mentor Feedback",
        "Career Guidance",
      ];
  const civilShowcase = [
    {
      code: "SV",
      title: "Surveying",
      text: "Leveling, contouring, chain survey, and field practice focus.",
    },
    {
      code: "RCC",
      title: "RCC Design",
      text: "Beam, slab, and column design walkthroughs with solved examples.",
    },
    {
      code: "SOIL",
      title: "Soil Mechanics",
      text: "Compaction, shear strength, and permeability concept mastery.",
    },
    {
      code: "EST",
      title: "Estimation",
      text: "Quantity takeoff, BOQ basics, and site-style calculation drills.",
    },
  ];
  const freeResources = content?.home?.freeResources || {};
  const freeResourceItems = Array.isArray(freeResources?.items)
    ? freeResources.items
    : [];
  const youtubeLinks = Array.isArray(freeResources?.youtubeLinks)
    ? freeResources.youtubeLinks
    : [];
  const hsbteResultPortal =
    content?.home?.hsbteResultPortal || defaultContent.home.hsbteResultPortal;
  const hsbteDetails = Array.isArray(hsbteResultPortal?.details)
    ? hsbteResultPortal.details
    : [];

  useEffect(() => {
    const ticker = setInterval(() => {
      setWordIndex((current) => (current + 1) % Math.max(1, typedWords.length));
    }, 1700);
    return () => clearInterval(ticker);
  }, [typedWords.length]);

  useEffect(() => {
    const slider = setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % Math.max(1, testimonials.length),
      );
    }, 5000);
    return () => clearInterval(slider);
  }, [testimonials.length]);

  useEffect(() => {
    setDisplayStats(stats.map(() => 0));
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
  }, [stats]);

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
        eyebrow={content?.home?.eyebrow || "Haryana's Trusted Mentor"}
        title={(content?.home?.titleTemplate || "Master with {word}.").replace(
          "{word}",
          typedWords[wordIndex] || "confidence",
        )}
        subtitle={
          content?.home?.subtitle ||
          "Civil World delivers concept-first teaching and exam-ready training."
        }
      >
        <div className="hero-layout">
          <div>
            <div className="hero-cta">
              <a
                className="btn btn-primary"
                href={
                  content?.home?.freeResources?.youtubeLinks?.[0]?.url ||
                  "https://www.youtube.com/"
                }
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
              {(content?.home?.heroBadges || []).map((item) => (
                <span key={item}>{item}</span>
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
          <p className="eyebrow">{featureSectionEyebrow}</p>
          <h2>{featureSectionTitle}</h2>
        </div>
        <div className="feature-grid">
          {featureHighlights.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-head">
          <p className="eyebrow">Explore Civil World</p>
          <h2>Your complete learning ecosystem</h2>
        </div>
        <div className="pages-grid">
          {pageCards.map((card) => (
            <Link key={card.title} className="page-card" to={card.to}>
              <h3>{card.title}</h3>
              <p>Discover what we offer in {card.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="container channel-band"
        aria-label="Channel strengths"
      >
        <div className="channel-band-inner">
          {channelBand.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section
        className="container civil-showcase"
        aria-label="Civil engineering focus areas"
      >
        <div className="section-head">
          <p className="eyebrow">Civil Engineering Focus</p>
          <h2>Built for B.Tech Civil and Polytechnic Civil students</h2>
        </div>
        <div className="civil-showcase-grid">
          {civilShowcase.map((item) => (
            <article key={item.title} className="civil-focus-card">
              <div className="civil-icon-badge" aria-hidden="true">
                {item.code}
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="container hsbte-result-block"
        aria-label="HSBTE result portal"
      >
        <div className="hsbte-result-card">
          <div className="hsbte-brand">
            <img
              src={hsbteResultPortal?.logo || "/images/hsbte-logo.png"}
              alt="HSBTE logo"
              className="hsbte-logo"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/hsbte-logo.png";
              }}
            />
            <div>
              <p className="eyebrow">
                {hsbteResultPortal?.heading || "Haryana Polytechnic Results"}
              </p>
              <h2>{hsbteResultPortal?.title || "HSBTE Result Portal"}</h2>
            </div>
          </div>

          <p>
            {hsbteResultPortal?.description ||
              "Check semester results from the official HSBTE portal."}
          </p>

          {hsbteDetails.length ? (
            <ul className="hsbte-details-list">
              {hsbteDetails.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          ) : null}

          <a
            className="btn btn-primary"
            href={hsbteResultPortal?.url || "https://hsbte.org.in/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hsbteResultPortal?.ctaLabel || "Check HSBTE Result"}
          </a>
        </div>
      </section>

      <section className="container home-free-resources">
        <div className="section-head">
          <p className="eyebrow">
            {freeResources?.heading || "Free Resources"}
          </p>
          <h2>
            {freeResources?.subtitle ||
              "Download practical notes and revision sheets curated by admin."}
          </h2>
        </div>

        <div className="home-resource-grid">
          {freeResourceItems.length ? (
            freeResourceItems.map((item) => (
              <article key={item.id || item.url} className="resource-item">
                <h3>{item.title || "Study resource"}</h3>
                <p>
                  {item.category
                    ? `Category: ${item.category}`
                    : "Google Drive link"}
                </p>
                <a
                  className="btn btn-outline"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Drive Link
                </a>
              </article>
            ))
          ) : (
            <article className="resource-item resource-empty">
              <h3>No resources yet</h3>
              <p>Admin-added downloadable resources will appear here.</p>
            </article>
          )}
        </div>

        <div className="youtube-links-list">
          <h3>{freeResources?.youtubeHeading || "YouTube Learning Videos"}</h3>
          {youtubeLinks.length ? (
            <div className="youtube-video-grid">
              {youtubeLinks.map((video, index) => {
                const embedUrl = toYouTubeEmbedUrl(video?.url);

                if (!embedUrl) {
                  return (
                    <article
                      key={video.id || video.url || index}
                      className="youtube-fallback-card"
                    >
                      <p>{video?.title || `Video ${index + 1}`}</p>
                      <a
                        href={video?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open on YouTube
                      </a>
                    </article>
                  );
                }

                return (
                  <article
                    key={video.id || video.url || index}
                    className="youtube-video-card"
                  >
                    <h4>{video?.title || `Video ${index + 1}`}</h4>
                    <div className="youtube-frame-wrap">
                      <iframe
                        src={embedUrl}
                        title={`Home YouTube video ${index + 1}`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="muted">No YouTube links added yet.</p>
          )}
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">
              {content?.home?.testimonialsTitle || "Student Results"}
            </p>
            <h2>What learners are saying</h2>
          </div>
          <div className="slider">
            {testimonials.length > 0 ? (
              <article className="slide active">
                <p>"{testimonials[activeSlide].quote}"</p>
                <h4>- {testimonials[activeSlide].author}</h4>
              </article>
            ) : null}
            <div className="slider-controls">
              <button
                type="button"
                disabled={testimonials.length === 0}
                onClick={() =>
                  setActiveSlide(
                    (current) =>
                      (current - 1 + Math.max(1, testimonials.length)) %
                      Math.max(1, testimonials.length),
                  )
                }
              >
                Prev
              </button>
              <button
                type="button"
                disabled={testimonials.length === 0}
                onClick={() =>
                  setActiveSlide(
                    (current) =>
                      (current + 1) % Math.max(1, testimonials.length),
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
          <h2>{content?.home?.faqTitle || "Quick answers for students"}</h2>
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
          <p className="eyebrow">
            {content?.home?.newsletter?.eyebrow || "Weekly Updates"}
          </p>
          <h2>
            {content?.home?.newsletter?.title ||
              "Get classes and notes in your inbox."}
          </h2>
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
            setNewsletterMessage("Thanks — weekly updates signup noted.");
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
          <h2>
            {content?.home?.cta?.title || "Ready to level up your preparation?"}
          </h2>
          <p>
            {content?.home?.cta?.text || "Start with structured mentorship."}
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/contact">
              Book a Mentorship Call
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
