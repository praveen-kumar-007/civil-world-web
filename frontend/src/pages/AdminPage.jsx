import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

const PRESET_RESOURCE_CATEGORIES = [
  "B.Tech",
  "Diploma",
  "Programming",
  "Others",
];

const ADMIN_SECTIONS = [
  "dashboard",
  "contacts",
  "resources",
  "videos",
  "safety",
];

const SECTION_META = {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Overview of contacts, resources, and publishing status.",
  },
  contacts: {
    title: "Contact Inbox",
    subtitle: "Review and manage all student enquiries.",
  },
  resources: {
    title: "Resource Manager",
    subtitle: "Maintain drive links, categories, and section texts.",
  },
  videos: {
    title: "Video Manager",
    subtitle: "Publish and organize YouTube learning videos.",
  },
  safety: {
    title: "Safety Controls",
    subtitle: "High-impact operations protected with confirmations.",
  },
};

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").trim();

function getApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) {
    return normalizedPath;
  }

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const baseWithoutApi = /\/api$/i.test(trimmedBase)
    ? trimmedBase.slice(0, -4)
    : trimmedBase;

  return `${baseWithoutApi}${normalizedPath}`;
}

function normalizePathSegment(pathname) {
  const segment = pathname.split("/")[2] || "";
  return ADMIN_SECTIONS.includes(segment) ? segment : "dashboard";
}

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    content,
    saveContentToServer,
    resetContentFromAdmin,
    adminSessionKey,
  } = useContent();

  const adminId = import.meta.env.VITE_ADMIN_ID;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const isEnvReady = Boolean(adminId && adminPassword);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [resetPhrase, setResetPhrase] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("B.Tech");
  const [newCategory, setNewCategory] = useState("");

  const [youtubeTitle, setYoutubeTitle] = useState("");
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

  const adminSection = normalizePathSegment(location.pathname);
  const sectionMeta = SECTION_META[adminSection];

  useEffect(() => {
    setSelectedCategory(
      Array.isArray(content?.home?.freeResources?.categories) &&
        content.home.freeResources.categories[0]
        ? content.home.freeResources.categories[0]
        : PRESET_RESOURCE_CATEGORIES[0],
    );
  }, [content]);

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
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

    async function loadInbox() {
      const response = await fetch(getApiUrl("/api/contacts"));
      if (!response.ok) {
        throw new Error("Server inbox request failed");
      }
      const payload = await response.json();
      setContactInbox(Array.isArray(payload?.items) ? payload.items : []);
    }

    loadInbox().catch(() => {
      setStatus("Could not load contacts from server.");
      setContactInbox([]);
    });
  }, [isLoggedIn]);

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

  const quickLinks = useMemo(
    () => [
      { to: "/admin/contacts", label: "Open Contacts", value: totalEnquiries },
      {
        to: "/admin/resources",
        label: "Open Resources",
        value: freeResources.length,
      },
      {
        to: "/admin/videos",
        label: "Open Videos",
        value: youtubeResources.length,
      },
    ],
    [totalEnquiries, freeResources.length, youtubeResources.length],
  );

  async function persistInbox(nextInbox) {
    setContactInbox(nextInbox);
  }

  async function markAsRead(id) {
    const nextInbox = contactInbox.map((item) =>
      item.id === id ? { ...item, status: "read" } : item,
    );
    await persistInbox(nextInbox);

    const response = await fetch(getApiUrl("/api/contacts"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "read" }),
    });

    if (!response.ok) {
      setStatus("Could not update enquiry status on server.");
    }
  }

  async function deleteEnquiry(id) {
    const shouldDelete = window.confirm("Delete this enquiry permanently?");
    if (!shouldDelete) {
      return;
    }

    const nextInbox = contactInbox.filter((item) => item.id !== id);
    await persistInbox(nextInbox);

    const response = await fetch(getApiUrl("/api/contacts"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setStatus("Could not delete enquiry on server.");
      return;
    }

    setStatus("Enquiry deleted.");
  }

  async function clearAllEnquiries() {
    const shouldClear = window.confirm("Clear all enquiries from inbox?");
    if (!shouldClear) {
      return;
    }

    await persistInbox([]);

    const response = await fetch(getApiUrl("/api/contacts"), {
      method: "DELETE",
    });

    if (!response.ok) {
      setStatus("Could not clear enquiries on server.");
      return;
    }

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
    setStatus("Logged in. You can now manage all features.");
    setPassword("");
    navigate("/admin/dashboard", { replace: true });
  }

  async function setFreeResources({
    nextItems = freeResources,
    categories = resourceCategories,
    youtubeLinks = youtubeResources,
  }) {
    const nextContent = {
      home: {
        freeResources: {
          categories,
          youtubeLinks,
          items: nextItems,
        },
      },
    };

    try {
      await saveContentToServer(nextContent);
    } catch {
      setStatus("Could not save changes to MongoDB.");
    }
  }

  async function handleAddCategory() {
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
    await setFreeResources({ categories: nextCategories });
    setSelectedCategory(category);
    setNewCategory("");
    setStatus("New filter created successfully.");
  }

  async function handleDeleteCategory(categoryToDelete) {
    if (resourceCategories.length <= 1) {
      setStatus("At least one filter is required.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete filter "${categoryToDelete}"? Its resources will be moved to fallback category.`,
    );
    if (!shouldDelete) {
      return;
    }

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

    await setFreeResources({ nextItems, categories: nextCategories });
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

    const duplicateLink = freeResources.some((item) => item.url === link);
    if (duplicateLink) {
      setStatus("This drive link already exists.");
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

      await setFreeResources({ nextItems });
      setResourceTitle("");
      setResourceLink("");
      setStatus("Drive link added and published successfully.");
    } catch {
      setStatus("Could not add drive link. Please try again.");
    } finally {
      setIsSavingResource(false);
    }
  }

  async function handleDeleteFreeResource(resourceToDelete) {
    const shouldDelete = window.confirm(
      "Delete this resource entry permanently?",
    );
    if (!shouldDelete) {
      return;
    }

    const nextItems = freeResources.filter((item) => {
      const sameId = resourceToDelete?.id && item?.id === resourceToDelete.id;
      const sameUrl =
        resourceToDelete?.url && item?.url === resourceToDelete.url;
      const sameTitle =
        resourceToDelete?.title && item?.title === resourceToDelete.title;
      return !(sameId || (sameUrl && sameTitle));
    });

    await setFreeResources({ nextItems });
    setStatus("Resource entry deleted.");
  }

  async function handleClearAllResources() {
    const shouldDelete = window.confirm("Delete all resource entries?");
    if (!shouldDelete) {
      return;
    }

    await setFreeResources({ nextItems: [] });
    setStatus("All resource entries deleted.");
  }

  async function handleAddYoutubeLink(event) {
    event.preventDefault();

    const url = youtubeLink.trim();
    if (!url) {
      setStatus("Please enter a YouTube link.");
      return;
    }

    const duplicateLink = youtubeResources.some((item) => item.url === url);
    if (duplicateLink) {
      setStatus("This YouTube link already exists.");
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
        title: youtubeTitle.trim(),
        url,
      },
      ...youtubeResources,
    ];

    await setFreeResources({ youtubeLinks: nextYoutube });
    setYoutubeTitle("");
    setYoutubeLink("");
    setStatus("YouTube learning frame added.");
  }

  async function handleDeleteYoutubeLink(videoId) {
    const shouldDelete = window.confirm("Delete this YouTube entry?");
    if (!shouldDelete) {
      return;
    }

    const nextYoutube = youtubeResources.filter((item) => item.id !== videoId);
    await setFreeResources({ youtubeLinks: nextYoutube });
    setStatus("YouTube link removed.");
  }

  async function handleReset() {
    if (resetPhrase !== "RESET") {
      setStatus("Type RESET to clear saved resources/videos.");
      return;
    }

    const shouldReset = window.confirm(
      "This will reset saved resources and YouTube links to default values. Continue?",
    );
    if (!shouldReset) {
      return;
    }

    try {
      await resetContentFromAdmin();
      setResetPhrase("");
      setStatus("Saved resources/videos reset to default values.");
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setStatus("Could not reset resources/videos in MongoDB.");
    }
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
          title="Professional Control Center Login"
          subtitle="Securely login to manage contacts, resources, videos, and content."
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
        title="Dedicated Admin Workspace"
        subtitle="Each module has its own page for safer and easier content operations."
      />

      <section className="container admin-shell">
        <aside className="admin-nav-card">
          <h3>Control Menu</h3>
          <p>Use dedicated pages to avoid accidental changes.</p>

          <div
            className="admin-metric-grid"
            role="list"
            aria-label="Admin metrics"
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

          <nav className="admin-nav-links" aria-label="Admin sections">
            <Link
              className={`admin-nav-link ${adminSection === "dashboard" ? "active" : ""}`}
              to="/admin/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className={`admin-nav-link ${adminSection === "contacts" ? "active" : ""}`}
              to="/admin/contacts"
            >
              Contacts
            </Link>
            <Link
              className={`admin-nav-link ${adminSection === "resources" ? "active" : ""}`}
              to="/admin/resources"
            >
              Resources
            </Link>
            <Link
              className={`admin-nav-link ${adminSection === "videos" ? "active" : ""}`}
              to="/admin/videos"
            >
              Videos
            </Link>
            <Link
              className={`admin-nav-link ${adminSection === "safety" ? "active" : ""}`}
              to="/admin/safety"
            >
              Safety
            </Link>
          </nav>

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
        </aside>

        <main className="admin-main-card">
          <header className="admin-main-head">
            <div>
              <p className="eyebrow">{adminSection}</p>
              <h2>{sectionMeta.title}</h2>
              <p className="hero-sub">{sectionMeta.subtitle}</p>
            </div>
            {status ? <p className="admin-status-pill">{status}</p> : null}
          </header>

          {adminSection === "dashboard" ? (
            <section className="admin-work-block">
              <div className="admin-shortcuts-grid">
                {quickLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="admin-shortcut-card"
                  >
                    <h4>{item.label}</h4>
                    <p>{item.value}</p>
                  </Link>
                ))}
              </div>

              <article className="admin-guidance-card">
                <h4>Professional workflow</h4>
                <ul>
                  <li>
                    Review Contacts first and mark old queries as reviewed.
                  </li>
                  <li>Update Resources and Videos using validated links.</li>
                  <li>
                    Use Safety page for reset operations with confirmation.
                  </li>
                </ul>
              </article>
            </section>
          ) : null}

          {adminSection === "contacts" ? (
            <section className="admin-work-block">
              <div className="admin-editor-top">
                <h3>Student enquiries</h3>
                <div className="admin-actions">
                  <button
                    type="button"
                    className={`btn btn-outline ${enquiryFilter === "all" ? "admin-filter-active" : ""}`}
                    onClick={() => setEnquiryFilter("all")}
                  >
                    All ({totalEnquiries})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline ${enquiryFilter === "new" ? "admin-filter-active" : ""}`}
                    onClick={() => setEnquiryFilter("new")}
                  >
                    New ({newEnquiries})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline ${enquiryFilter === "read" ? "admin-filter-active" : ""}`}
                    onClick={() => setEnquiryFilter("read")}
                  >
                    Reviewed ({readEnquiries})
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
                        <span>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "No date"}
                        </span>
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
                        <strong>Learning Mode:</strong>{" "}
                        {item.learningMode || "-"}
                      </p>
                      <p>
                        <strong>Preferred Start:</strong>{" "}
                        {item.startMonth || "-"}
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
            </section>
          ) : null}

          {adminSection === "resources" ? (
            <section className="admin-work-block">
              <div className="admin-editor-top">
                <h3>Resource links</h3>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClearAllResources}
                  disabled={freeResources.length === 0}
                >
                  Delete All Entries
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
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
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
                      disabled={resourceCategories.length <= 1}
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
            </section>
          ) : null}

          {adminSection === "videos" ? (
            <section className="admin-work-block">
              <form
                className="admin-resource-form"
                onSubmit={handleAddYoutubeLink}
              >
                <h3>Add YouTube Learning Frame</h3>
                <label>
                  Video Title (optional)
                  <input
                    type="text"
                    value={youtubeTitle}
                    onChange={(event) => setYoutubeTitle(event.target.value)}
                    placeholder="e.g. Engineering Mechanics Marathon"
                  />
                </label>
                <label>
                  YouTube Link
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(event) => setYoutubeLink(event.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  Add YouTube Frame
                </button>
              </form>

              <div className="admin-resource-list">
                {youtubeResources.length === 0 ? (
                  <p className="admin-empty-inbox">
                    No YouTube links added yet.
                  </p>
                ) : (
                  youtubeResources.map((video, index) => (
                    <article
                      key={video.id || video.url || index}
                      className="admin-enquiry-item read"
                    >
                      <header>
                        <h4>{video.title || `YouTube Video ${index + 1}`}</h4>
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
            </section>
          ) : null}

          {adminSection === "safety" ? (
            <section className="admin-work-block">
              <article className="admin-safety-card">
                <h3>Reset Resource Storage</h3>
                <p>
                  This action resets only DB-managed resources and YouTube links
                  back to default values. Website copy/layout remains hardcoded.
                </p>
                <label>
                  Type RESET to confirm
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
                  Clear Saved Resources/Videos
                </button>
              </article>
            </section>
          ) : null}
        </main>
      </section>
    </>
  );
}
