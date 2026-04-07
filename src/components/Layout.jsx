import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { playStoreLink, socialLinks } from "../data/siteData";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/resources", label: "Resources" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

function getSocialIcon(name) {
  const key = String(name || "").toLowerCase();

  if (key.includes("youtube")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23 12a34.3 34.3 0 0 0-.35-4.83 3.2 3.2 0 0 0-2.23-2.26C18.52 4.33 12 4.33 12 4.33s-6.52 0-8.42.58A3.2 3.2 0 0 0 1.35 7.17 34.3 34.3 0 0 0 1 12c0 1.62.12 3.24.35 4.83a3.2 3.2 0 0 0 2.23 2.26c1.9.58 8.42.58 8.42.58s6.52 0 8.42-.58a3.2 3.2 0 0 0 2.23-2.26c.23-1.59.35-3.2.35-4.83Zm-13.01 3.99V8.01L16.5 12l-6.51 3.99Z" />
      </svg>
    );
  }

  if (key.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm9.1 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
      </svg>
    );
  }

  if (key.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H7.2v3h2.9v8h3.4Z" />
      </svg>
    );
  }

  if (key === "x" || key.includes("twitter")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.3-8.3L3 2h6.2l4.4 5.8L18.9 2Zm-1.1 18h1.7L8.2 3.9H6.4L17.8 20Z" />
      </svg>
    );
  }

  if (key.includes("telegram")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.4 3.5a1 1 0 0 0-1-.1L2.3 10.6a1 1 0 0 0 .1 1.9l4.1 1.4 1.6 5.2a1 1 0 0 0 1.7.4l2.3-2.4 4.4 3.2a1 1 0 0 0 1.6-.6l3.4-15.1a1 1 0 0 0-.1-1.1ZM9.4 15.8l-.8 1.8-.9-3 10.6-7.2-8.9 8.4Z" />
      </svg>
    );
  }

  if (key.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8.5A1.8 1.8 0 1 1 5 5a1.8 1.8 0 0 1 0 3.5ZM3.4 9.8h3.2V20H3.4V9.8Zm5.3 0h3.1v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.9V20h-3.2v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V20H8.7V9.8Z" />
      </svg>
    );
  }

  if (key.includes("whatsapp")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A11.3 11.3 0 0 0 2.9 17.2L2 22l4.9-1.3a11.3 11.3 0 0 0 5 .9h.1A11.3 11.3 0 0 0 20.5 3.5Zm-8.5 16.2a9.2 9.2 0 0 1-4.6-1.2l-.3-.2-2.9.8.8-2.8-.2-.3a9.2 9.2 0 1 1 7.2 3.7Zm5.1-6.8c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2s-.8.9-1 .9c-.2.1-.4.1-.7-.1a7.5 7.5 0 0 1-2.2-2c-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5L10.5 7c-.2-.4-.4-.3-.6-.3h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.3 1 2.7 1.1 2.9c.1.2 2 3.2 5 4.4.7.3 1.2.4 1.6.5.7.1 1.3.1 1.8 0 .6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.4 13.3h-3.1a6.4 6.4 0 0 0 2.6-5.1h-1.8a4.6 4.6 0 1 1-9.2 0H5.1a6.4 6.4 0 0 0 2.6 5.1H5.6A8.2 8.2 0 0 1 12 3.8Z" />
    </svg>
  );
}

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setProgress(Math.min(100, ratio));
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="site-header">
        <nav className="nav container" aria-label="Primary navigation">
          <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img
              className="brand-logo"
              src="/logo.png"
              alt="Civil World logo"
            />
            <span className="brand-text">Civil World</span>
          </NavLink>

          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col-card footer-brand-block">
            <div className="footer-brand-head">
              <img
                className="footer-brand-logo"
                src="/logo.png"
                alt="Civil World logo"
              />
              <h3>Civil World</h3>
            </div>
            <p>
              Haryana based teaching platform for Polytechnic and B.Tech
              students with clear concepts, strategy, and exam-ready mentorship.
            </p>
            <p className="footer-note">
              Guided by a Haryana board educator for practical learning,
              semester progress, and career-focused support.
            </p>
          </div>

          <div className="footer-col-card">
            <h4>Quick Access</h4>
            <ul className="footer-link-list">
              <li>
                <NavLink to="/courses">Courses</NavLink>
              </li>
              <li>
                <NavLink to="/resources">Resources</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Admissions</NavLink>
              </li>
              <li>
                <NavLink to="/admin/resources">Admin Panel</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-col-card">
            <h4>Student Help Desk</h4>
            <ul className="footer-link-list">
              <li>
                <a
                  href="https://hsbte.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HSBTE Results & Notices
                </a>
              </li>
              <li>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <a href="mailto:civilworld.edu@example.com">civilworld.edu@example.com</a>
              </li>
              <li>
                <span className="footer-plain-text">Mon-Sat: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="footer-col-card">
            <h4>Social Media</h4>
            <ul className="social-list">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={item.name}
                  >
                    <span className="social-icon">{getSocialIcon(item.name)}</span>
                    <span className="social-name">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="footer-subheading">Mobile App</h4>
            <a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="playstore-link app-link-card"
            >
              <img
                className="android-app-logo"
                src="/logo.png"
                alt="Civil World Android app logo"
              />
              <span className="playstore-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 2.8v18.4c0 .7.7 1.1 1.3.8l10.8-9.2L4.3 2c-.6-.3-1.3.1-1.3.8Z" fill="#00d26a" />
                  <path d="M15.1 12 19.6 8.2c.6-.5.4-1.5-.4-1.8L12.3 3.9 8 8.2 15.1 12Z" fill="#00a6ff" />
                  <path d="m8 15.8 4.3 4.3 6.9-2.5c.8-.3 1-1.3.4-1.8L15.1 12 8 15.8Z" fill="#ff3f4d" />
                  <path d="M8 8.2v7.6L15.1 12 8 8.2Z" fill="#ffd83d" />
                </svg>
              </span>
              <span>
                <strong>Android App</strong>
                <small>Open on Google Play</small>
              </span>
            </a>
          </div>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Civil World. All rights reserved.
        </p>
      </footer>

      <button
        type="button"
        className={`back-to-top ${showTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        Top
      </button>
    </>
  );
}
