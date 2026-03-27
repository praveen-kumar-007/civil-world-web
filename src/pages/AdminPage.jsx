import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function AdminPage() {
  const {
    content,
    setContentFromAdmin,
    resetContentFromAdmin,
    adminSessionKey,
    contactInboxKey,
  } = useContent();

  const adminId = import.meta.env.VITE_ADMIN_ID;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const isEnvReady = Boolean(adminId && adminPassword);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [resetPhrase, setResetPhrase] = useState("");
  const [editorValue, setEditorValue] = useState(() =>
    JSON.stringify(content, null, 2),
  );
  const [activePanel, setActivePanel] = useState("inbox");
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [contactInbox, setContactInbox] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(adminSessionKey) === "ok",
  );

  useEffect(() => {
    setEditorValue(JSON.stringify(content, null, 2));
  }, [content]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const raw = localStorage.getItem(contactInboxKey) || "[]";
      const parsed = JSON.parse(raw);
      setContactInbox(Array.isArray(parsed) ? parsed : []);
    } catch {
      setContactInbox([]);
    }
  }, [contactInboxKey, isLoggedIn]);

  const totalEnquiries = contactInbox.length;
  const newEnquiries = contactInbox.filter(
    (item) => item.status !== "read",
  ).length;
  const readEnquiries = totalEnquiries - newEnquiries;

  const filteredEnquiries = contactInbox.filter((item) => {
    if (enquiryFilter === "new") {
      return item.status !== "read";
    }
    if (enquiryFilter === "read") {
      return item.status === "read";
    }
    return true;
  });

  function persistInbox(nextInbox) {
    setContactInbox(nextInbox);
    localStorage.setItem(contactInboxKey, JSON.stringify(nextInbox));
  }

  function markAsRead(id) {
    const nextInbox = contactInbox.map((item) =>
      item.id === id ? { ...item, status: "read" } : item,
    );
    persistInbox(nextInbox);
  }

  function deleteEnquiry(id) {
    const nextInbox = contactInbox.filter((item) => item.id !== id);
    persistInbox(nextInbox);
  }

  function clearAllEnquiries() {
    persistInbox([]);
    setStatus("All contact enquiries were cleared.");
  }

  function handleLogin(event) {
    event.preventDefault();

    if (!isEnvReady) {
      setStatus(
        "Admin credentials are not configured in environment variables.",
      );
      return;
    }

    if (username !== adminId || password !== adminPassword) {
      setStatus("Invalid admin credentials.");
      return;
    }

    localStorage.setItem(adminSessionKey, "ok");
    setIsLoggedIn(true);
    setStatus("Logged in. You can now manage full app content.");
    setPassword("");
  }

  function handleSave() {
    try {
      const parsed = JSON.parse(editorValue);
      setContentFromAdmin(parsed);
      setStatus("Content saved. Changes persist after refresh.");
    } catch {
      setStatus("Invalid JSON. Please fix format before saving.");
    }
  }

  function handleReset() {
    if (resetPhrase !== "RESET") {
      setStatus("Type RESET to clear saved content.");
      return;
    }

    resetContentFromAdmin();
    setResetPhrase("");
    setStatus("Saved content cleared by admin permission.");
  }

  function handleLogout() {
    localStorage.removeItem(adminSessionKey);
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setStatus("Logged out from admin panel.");
  }

  if (!isLoggedIn) {
    return (
      <>
        <PageHero
          eyebrow="Admin"
          title="Content Management Login"
          subtitle="Login to manage full app content JSON."
        />

        <section className="container">
          <form className="admin-login-card" onSubmit={handleLogin}>
            {!isEnvReady ? (
              <p className="admin-warning">
                VITE_ADMIN_ID or VITE_ADMIN_PASSWORD is missing. Add both in
                .env or Vercel Project Settings, then restart the app.
              </p>
            ) : null}
            <label>
              Admin ID
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isEnvReady}
            >
              Login
            </button>
            <p className="status-text">{status}</p>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Full Website Content Manager"
        subtitle="Edit JSON, save, and publish content changes without backend."
      />

      <section className="container admin-panel-grid">
        <aside className="admin-overview-card">
          <h3>Dashboard</h3>
          <p>
            Track contact activity and manage live website content from one
            place.
          </p>

          <div
            className="admin-metric-grid"
            role="list"
            aria-label="Contact metrics"
          >
            <article role="listitem" className="admin-metric-item">
              <strong>{totalEnquiries}</strong>
              <span>Total enquiries</span>
            </article>
            <article role="listitem" className="admin-metric-item">
              <strong>{newEnquiries}</strong>
              <span>New enquiries</span>
            </article>
            <article role="listitem" className="admin-metric-item">
              <strong>{readEnquiries}</strong>
              <span>Reviewed enquiries</span>
            </article>
          </div>

          <div
            className="admin-panel-switch"
            role="tablist"
            aria-label="Admin sections"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "inbox"}
              className={`admin-switch-btn ${activePanel === "inbox" ? "active" : ""}`}
              onClick={() => setActivePanel("inbox")}
            >
              Contact Inbox
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "content"}
              className={`admin-switch-btn ${activePanel === "content" ? "active" : ""}`}
              onClick={() => setActivePanel("content")}
            >
              Content JSON
            </button>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
            <Link className="btn btn-primary" to="/">
              Back to Website
            </Link>
          </div>
          <p className="status-text">{status}</p>
        </aside>

        {activePanel === "inbox" ? (
          <article className="admin-editor-card">
            <div className="admin-editor-top">
              <h3>Who is trying to contact</h3>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEnquiryFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEnquiryFilter("new")}
                >
                  New
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEnquiryFilter("read")}
                >
                  Reviewed
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={clearAllEnquiries}
                  disabled={totalEnquiries === 0}
                >
                  Clear Inbox
                </button>
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <p className="admin-empty-inbox">
                No enquiries found for this filter yet.
              </p>
            ) : (
              <div className="admin-enquiry-list">
                {filteredEnquiries.map((item) => (
                  <article
                    key={item.id}
                    className={`admin-enquiry-item ${item.status === "read" ? "read" : "new"}`}
                  >
                    <header>
                      <h4>{item.name || "Unnamed student"}</h4>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </header>
                    <p>
                      <strong>Email:</strong> {item.email || "-"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {item.phone || "-"}
                    </p>
                    <p>
                      <strong>City:</strong> {item.city || "-"}
                    </p>
                    <p>
                      <strong>Student Type:</strong> {item.studentType || "-"}
                    </p>
                    <p>
                      <strong>Program:</strong> {item.program || "-"}
                    </p>
                    <p>
                      <strong>Learning Mode:</strong> {item.learningMode || "-"}
                    </p>
                    <p>
                      <strong>Preferred Start:</strong> {item.startMonth || "-"}
                    </p>
                    <p>
                      <strong>Message:</strong> {item.message || "-"}
                    </p>

                    <div className="admin-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => markAsRead(item.id)}
                        disabled={item.status === "read"}
                      >
                        Mark as Reviewed
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => deleteEnquiry(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        ) : (
          <article className="admin-editor-card">
            <div className="admin-editor-top">
              <h3>Content JSON</h3>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setEditorValue(JSON.stringify(content, null, 2))
                  }
                >
                  Reload Current
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save Content
                </button>
              </div>
            </div>
            <textarea
              className="admin-json-editor"
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              spellCheck="false"
            />
          </article>
        )}

        <aside className="admin-sidebar-card">
          <h3>Safety Controls</h3>
          <p>
            Saved content stays in browser local storage and remains after
            refresh. Only admin reset will clear it in this app.
          </p>
          <label>
            Type RESET to clear saved content
            <input
              type="text"
              value={resetPhrase}
              onChange={(event) => setResetPhrase(event.target.value)}
              placeholder="RESET"
            />
          </label>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
          >
            Clear Saved Content
          </button>
        </aside>
      </section>
    </>
  );
}
