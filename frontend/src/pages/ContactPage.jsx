import { useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

const CONTACT_INBOX_KEY = "cw_contact_inbox_v1";
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

export default function ContactPage() {
  const { content } = useContent();
  const [status, setStatus] = useState("");

  const cp = content?.contactPage || {};
  const studentTypes = Array.isArray(cp.studentTypes) ? cp.studentTypes : [];
  const programTypes = Array.isArray(cp.programTypes) ? cp.programTypes : [];
  const learningModes = Array.isArray(cp.learningModes) ? cp.learningModes : [];

  function saveContactEnquiryLocal(payload) {
    try {
      const raw = localStorage.getItem(CONTACT_INBOX_KEY);
      const current = Array.isArray(JSON.parse(raw || "[]"))
        ? JSON.parse(raw || "[]")
        : [];
      const next = [payload, ...current].slice(0, 300);
      localStorage.setItem(CONTACT_INBOX_KEY, JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  }

  async function saveContactEnquiry(payload) {
    try {
      const response = await fetch(getApiUrl("/api/contacts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return { mode: "server" };
      }

      if (response.status >= 400 && response.status < 500) {
        const data = await response.json().catch(() => ({}));
        return {
          mode: "rejected",
          message:
            typeof data?.error === "string"
              ? data.error
              : "Submission rejected by server validation.",
        };
      }
    } catch {
      // Fall back to local backup below.
    }

    if (saveContactEnquiryLocal(payload)) {
      return { mode: "local" };
    }

    return { mode: "failed" };
  }

  return (
    <>
      <PageHero
        eyebrow={cp.eyebrow || "Contact"}
        title={cp.title || "Ask your batch and course questions"}
        subtitle={
          cp.subtitle ||
          "Fill the form and your message will open in your default email app for direct connection."
        }
      />

      <section className="container">
        <form
          className="contact-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.checkValidity()) {
              setStatus("Please fill all required fields.");
              return;
            }

            const data = new FormData(form);
            const name = String(data.get("name") || "").trim();
            const email = String(data.get("email") || "").trim();
            const phone = String(data.get("phone") || "").trim();
            const city = String(data.get("city") || "").trim();
            const studentType = String(data.get("studentType") || "").trim();
            const program = String(data.get("program") || "").trim();
            const learningMode = String(data.get("learningMode") || "").trim();
            const message = String(data.get("message") || "").trim();

            const saveResult = await saveContactEnquiry({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              name,
              email,
              phone,
              city,
              studentType,
              program,
              learningMode,
              message,
              status: "new",
            });

            if (saveResult.mode === "rejected") {
              setStatus(
                saveResult.message ||
                  "Please check and complete all fields correctly.",
              );
              return;
            }

            if (saveResult.mode === "server") {
              setStatus("Saved successfully.");
            } else if (saveResult.mode === "local") {
              setStatus("Server unavailable. Saved locally.");
            } else {
              setStatus("Could not save your enquiry. Please try again.");
            }

            form.reset();
          }}
        >
          <label>
            Name
            <input
              name="name"
              type="text"
              required
              placeholder="Enter your name"
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              required
              pattern="[0-9+\-() ]{7,20}"
              placeholder="Enter your phone number"
            />
          </label>
          <label>
            City
            <input
              name="city"
              type="text"
              required
              placeholder="Enter your city"
            />
          </label>
          <label>
            Student Type
            <select name="studentType" required defaultValue="">
              <option value="" disabled>
                Select student type
              </option>
              {studentTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Program
            <select name="program" required defaultValue="">
              <option value="" disabled>
                Select program
              </option>
              {programTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Learning Mode
            <select name="learningMode" required defaultValue="">
              <option value="" disabled>
                Select learning mode
              </option>
              {learningModes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Tell us your query"
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Send Message
          </button>
          <p className="status-text">{status}</p>
        </form>
      </section>
    </>
  );
}
