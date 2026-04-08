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

export default function Layout({ children, appValue }) {
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
            <span className="brand-badge">CW</span>
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
            <li>
              <button
                className="theme-toggle"
                type="button"
                onClick={appValue.toggleTheme}
              >
                {appValue.theme === "night" ? "Day" : "Night"}
              </button>
            </li>
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
          <button
            className="theme-toggle"
            type="button"
            onClick={appValue.toggleTheme}
          >
            Toggle Theme
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>Civil World</h3>
            <p>
              Haryana based Political Science teaching platform with clear
              concepts, strategy, and exam-ready mentorship.
            </p>
          </div>
          <div>
            <h4>Social Media</h4>
            <ul className="social-list">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Mobile App</h4>
            <a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="playstore-link"
            >
              Open on Google Play
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
