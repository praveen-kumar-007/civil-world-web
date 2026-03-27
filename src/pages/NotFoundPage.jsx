import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

export default function NotFoundPage() {
  const { content } = useContent();

  return (
    <section className="container not-found">
      <div className="not-found-card">
        <h1>{content.notFound.title}</h1>
        <p>{content.notFound.subtitle}</p>
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
