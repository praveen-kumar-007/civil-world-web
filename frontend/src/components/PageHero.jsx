export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="page-hero container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-sub">{subtitle}</p>
      {children}
    </section>
  );
}
