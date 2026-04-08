import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container not-found">
      <h1>Page not found</h1>
      <p>The page you requested does not exist in this React app.</p>
      <Link className="btn btn-primary" to="/">
        Back to Home
      </Link>
    </section>
  );
}
