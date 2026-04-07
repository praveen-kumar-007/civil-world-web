export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="page-hero container">
      <div className="page-hero-shell">
        <div className="hero-brand-badge" aria-label="Civil World branding">
          <img src="/logo.png" alt="Civil World logo" />
          <span>Civil World</span>
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-sub">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
