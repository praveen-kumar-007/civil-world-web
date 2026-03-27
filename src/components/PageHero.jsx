export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="page-hero container">
      <div className="page-hero-shell">
        <div className="page-hero-glow" aria-hidden="true" />
        <div className="hero-brand-badge" aria-label="Civil World branding">
          <img src="/logo.png" alt="Civil World logo" />
          <span>Civil World</span>
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-sub">{subtitle}</p>
        <div className="hero-dot-strip" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        {children}
      </div>
    </section>
  );
}
