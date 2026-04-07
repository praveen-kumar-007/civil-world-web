import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

const PRESET_RESOURCE_CATEGORIES = [
  "B.Tech",
  "Diploma",
  "Programming",
  "Others",
];

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [resourceHeading, setResourceHeading] = useState(
    () => content?.home?.freeResources?.heading || "Free Resources",
  );
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("B.Tech");
  const [newCategory, setNewCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isSavingResource, setIsSavingResource] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [contactInbox, setContactInbox] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(adminSessionKey) === "ok",
  );

  const freeResources = Array.isArray(content?.home?.freeResources?.items)
    ? content.home.freeResources.items
    : [];

  const resourceCategories =
    Array.isArray(content?.home?.freeResources?.categories) &&
    content.home.freeResources.categories.length > 0
      ? content.home.freeResources.categories
      : PRESET_RESOURCE_CATEGORIES;

  const youtubeResources = Array.isArray(
    content?.home?.freeResources?.youtubeLinks,
  )
    ? content.home.freeResources.youtubeLinks
    : [];

  const pathSegment = location.pathname.split("/")[2] || "";
  const adminSection =
    pathSegment === "contacts" ||
    pathSegment === "resources" ||
    pathSegment === "videos" ||
    pathSegment === "content"
      ? pathSegment
      : "contacts";

  useEffect(() => {
    setEditorValue(JSON.stringify(content, null, 2));
    setResourceHeading(
      content?.home?.freeResources?.heading || "Free Resources",
    );
    setSelectedCategory(
      Array.isArray(content?.home?.freeResources?.categories) &&
        content.home.freeResources.categories[0]
        ? content.home.freeResources.categories[0]
        : PRESET_RESOURCE_CATEGORIES[0],
    );
  }, [content]);

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/contacts", { replace: true });
      return;
    }

    const panel = new URLSearchParams(location.search).get("panel");
    if (panel === "resources") {
      navigate("/admin/resources", { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

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

  function setFreeResources({
    nextItems = freeResources,
    heading = resourceHeading,
    categories = resourceCategories,
    youtubeLinks = youtubeResources,
  }) {
    const nextContent = {
      ...content,
      home: {
        ...content.home,
        freeResources: {
          ...content.home?.freeResources,
          heading: heading.trim() || "Free Resources",
          categories,
          youtubeLinks,
          items: nextItems,
        },
      },
    };

    setContentFromAdmin(nextContent);
  }

  function handleSaveHeading() {
    setFreeResources({ heading: resourceHeading });
    setStatus("Free resources heading updated.");
  }

  function handleAddCategory() {
    const category = newCategory.trim();
    if (!category) {
      setStatus("Please enter a filter name.");
      return;
    }

    const exists = resourceCategories.some(
      (item) => item.toLowerCase() === category.toLowerCase(),
    );

    if (exists) {
      setStatus("This filter already exists.");
      return;
    }

    const nextCategories = [...resourceCategories, category];
    setFreeResources({ categories: nextCategories });
    setSelectedCategory(category);
    setNewCategory("");
    setStatus("New filter created successfully.");
  }

  function handleDeleteCategory(categoryToDelete) {
    const remaining = resourceCategories.filter(
      (item) => item !== categoryToDelete,
    );

    const nextCategories =
      remaining.length > 0 ? remaining : [PRESET_RESOURCE_CATEGORIES[3]];

    const fallbackCategory = nextCategories.includes("Others")
      ? "Others"
      : nextCategories[0];

    const nextItems = freeResources.map((item) =>
      item.category === categoryToDelete
        ? { ...item, category: fallbackCategory }
        : item,
    );

    setFreeResources({ nextItems, categories: nextCategories });
    setSelectedCategory((current) =>
      current === categoryToDelete ? fallbackCategory : current,
    );
    setStatus(`Filter "${categoryToDelete}" removed.`);
  }

  async function handleAddFreeResource(event) {
    event.preventDefault();

    const title = resourceTitle.trim();
    const link = resourceLink.trim();
    if (!title) {
      setStatus("Please enter a heading/title for the free resource.");
      return;
    }

    if (!link) {
      setStatus("Please provide a Google Drive link.");
      return;
    }

    setIsSavingResource(true);

    try {
      let parsedUrl;
      try {
        parsedUrl = new URL(link);
      } catch {
        setStatus("Please enter a valid Google Drive link.");
        setIsSavingResource(false);
        return;
      }

      const host = parsedUrl.hostname.toLowerCase();
      const isDriveLink =
        host.includes("drive.google.com") || host.includes("docs.google.com");

      if (!isDriveLink) {
        setStatus("Only Google Drive links are allowed.");
        setIsSavingResource(false);
        return;
      }

      const nextItems = [
        {
          id:
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : String(Date.now()),
          title,
          url: link,
          category: selectedCategory,
          createdAt: new Date().toISOString(),
        },
        ...freeResources,
      ];

      setFreeResources({ nextItems });
      setResourceTitle("");
      setResourceLink("");
      setStatus("Drive link added and published successfully.");
    } catch {
      setStatus("Could not add drive link. Please try again.");
    } finally {
      setIsSavingResource(false);
    }
  }

  function handleDeleteFreeResource(resourceToDelete) {
    const nextItems = freeResources.filter((item) => {
      const sameId = resourceToDelete?.id && item?.id === resourceToDelete.id;
      const sameUrl =
        resourceToDelete?.url && item?.url === resourceToDelete.url;
      const sameTitle =
        resourceToDelete?.title && item?.title === resourceToDelete.title;
      return !(sameId || (sameUrl && sameTitle));
    });

    setFreeResources({ nextItems });
    setStatus("Resource entry deleted.");
  }

  function handleClearAllResources() {
    setFreeResources({ nextItems: [] });
    setStatus("All resource entries deleted.");
  }

  function handleAddYoutubeLink(event) {
    event.preventDefault();

    const url = youtubeLink.trim();

    if (!url) {
      setStatus("Please enter a YouTube link.");
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      setStatus("Please enter a valid YouTube URL.");
      return;
    }

    const host = parsedUrl.hostname.toLowerCase();
    const isYoutube = host.includes("youtube.com") || host.includes("youtu.be");

    if (!isYoutube) {
      setStatus("Only YouTube links are allowed here.");
      return;
    }

    const nextYoutube = [
      {
        id:
          typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `yt-${Date.now()}`,
        url,
      },
      ...youtubeResources,
    ];

    setFreeResources({ youtubeLinks: nextYoutube });
    setYoutubeLink("");
    setStatus("YouTube learning frame added.");
  }

  function handleDeleteYoutubeLink(videoId) {
    const nextYoutube = youtubeResources.filter((item) => item.id !== videoId);
    setFreeResources({ youtubeLinks: nextYoutube });
    setStatus("YouTube link removed.");
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
        title="Professional Admin Workspace"
        subtitle="Manage contacts, resources, and videos from dedicated admin pages."
      />

      <section className="container admin-panel-grid">
        <aside className="admin-overview-card">
          <h3>Dashboard</h3>
          <p>
            Navigate dedicated admin pages for contacts, resources, and video
            content.
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
              <strong>{freeResources.length}</strong>
              <span>Drive resources</span>
            </article>
            <article role="listitem" className="admin-metric-item">
              <strong>{youtubeResources.length}</strong>
              <span>YouTube links</span>
            </article>
          </div>

          <div className="admin-panel-switch" aria-label="Admin sections">
            <Link
              className={`admin-switch-link ${adminSection === "contacts" ? "active" : ""}`}
              to="/admin/contacts"
            >
              Contact Page
            </Link>
            <Link
              className={`admin-switch-link ${adminSection === "resources" ? "active" : ""}`}
              to="/admin/resources"
            >
              Resource Page
            </Link>
            <Link
              className={`admin-switch-link ${adminSection === "videos" ? "active" : ""}`}
              to="/admin/videos"
            >
              Video Page
            </Link>
            <Link
              className={`admin-switch-link ${adminSection === "content" ? "active" : ""}`}
              to="/admin/content"
            >
              Content JSON
            </Link>
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

        {adminSection === "contacts" ? (
          <article className="admin-editor-card">
            <div className="admin-editor-top">
              <h3>Contact Page Entries</h3>
              <div className="admin-actions">
                <button
                  type="button"
                  className={`btn btn-outline ${enquiryFilter === "all" ? "admin-filter-active" : ""}`}
                  onClick={() => setEnquiryFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn btn-outline ${enquiryFilter === "new" ? "admin-filter-active" : ""}`}
                  onClick={() => setEnquiryFilter("new")}
                >
                  New
                </button>
                <button
                  type="button"
                  className={`btn btn-outline ${enquiryFilter === "read" ? "admin-filter-active" : ""}`}
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
        ) : adminSection === "content" ? (
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
        ) : adminSection === "resources" ? (
          <article className="admin-editor-card">
            <div className="admin-editor-top">
              <h3>Resource Page Manager</h3>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClearAllResources}
                  disabled={freeResources.length === 0}
                >
                  Delete All Entries
                </button>
              </div>
            </div>

            <div className="admin-resource-heading">
              <label>
                Section Heading
                <input
                  type="text"
                  value={resourceHeading}
                  onChange={(event) => setResourceHeading(event.target.value)}
                  placeholder="Free Resources"
                />
              </label>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleSaveHeading}
              >
                Save Heading
              </button>
            </div>

            <form
              className="admin-resource-form"
              onSubmit={handleAddFreeResource}
            >
              <label>
                Resource Category
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {resourceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Resource Title
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(event) => setResourceTitle(event.target.value)}
                  placeholder="e.g. Network Theory Notes"
                  required
                />
              </label>
              <label>
                Google Drive Link
                <input
                  type="url"
                  value={resourceLink}
                  onChange={(event) => setResourceLink(event.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  required
                />
              </label>
              <p className="admin-upload-hint">
                Only Google Drive links are allowed.
              </p>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingResource}
              >
                {isSavingResource ? "Saving..." : "Add Drive Resource"}
              </button>
            </form>

            <div className="admin-resource-heading">
              <label>
                Create New Filter
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="e.g. Civil Engineering"
                />
              </label>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAddCategory}
              >
                Add Filter
              </button>
            </div>

            <div className="admin-filter-chip-row">
              {resourceCategories.map((category) => (
                <div key={category} className="admin-filter-chip">
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category)}
                    aria-label={`Delete ${category} filter`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="admin-resource-list">
              {freeResources.length === 0 ? (
                <p className="admin-empty-inbox">
                  No free resources uploaded yet.
                </p>
              ) : (
                freeResources.map((item) => (
                  <article
                    key={item.id || item.title}
                    className="admin-enquiry-item read"
                  >
                    <header>
                      <h4>{item.title || "Untitled"}</h4>
                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "No date"}
                      </span>
                    </header>
                    <p>
                      <strong>Category:</strong> {item.category || "Others"}
                    </p>
                    <p>
                      <strong>Drive Link:</strong> {item.url || "-"}
                    </p>
                    <div className="admin-actions">
                      <a
                        className="btn btn-outline"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => handleDeleteFreeResource(item)}
                      >
                        Delete Entry
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>
        ) : (
          <article className="admin-editor-card">
            <div className="admin-editor-top">
              <h3>Video Page Manager</h3>
            </div>

            <form
              className="admin-resource-form"
              onSubmit={handleAddYoutubeLink}
            >
              <h4>Add YouTube Learning Frame</h4>
              <label>
                YouTube Link
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(event) => setYoutubeLink(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add YouTube Frame
              </button>
            </form>

            <div className="admin-resource-list">
              {youtubeResources.length === 0 ? (
                <p className="admin-empty-inbox">No YouTube links added yet.</p>
              ) : (
                youtubeResources.map((video) => (
                  <article key={video.id} className="admin-enquiry-item read">
                    <header>
                      <h4>{video.title || "YouTube Video"}</h4>
                    </header>
                    <p>
                      <strong>YouTube:</strong> {video.url}
                    </p>
                    <div className="admin-actions">
                      <a
                        className="btn btn-outline"
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => handleDeleteYoutubeLink(video.id)}
                      >
                        Delete Entry
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
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
