import { useContent } from "../context/ContentContext";
import { defaultContent } from "../data/defaultContent.js";

export default function ContentGate({ children }) {
  const { content, isHydratingContent, contentLoadError } = useContent();
  const brand = defaultContent.meta.brandName;

  if (isHydratingContent) {
    return (
      <section className="container content-gate" aria-busy="true">
        <div className="section-head">
          <p className="eyebrow">{brand}</p>
          <h2>Loading resources…</h2>
          <p className="content-gate-hint">
            Preparing hardcoded pages and syncing latest resource links.
          </p>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section className="container content-gate">
        <div className="section-head">
          <p className="eyebrow">{brand}</p>
          <h2>Content unavailable</h2>
          <p className="content-gate-hint">
            {contentLoadError ||
              "Could not load site content. Please refresh and try again."}
          </p>
        </div>
      </section>
    );
  }

  return children;
}
