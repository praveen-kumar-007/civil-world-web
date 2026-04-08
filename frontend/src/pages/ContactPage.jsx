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
  const mailTo = cp.mailTo || "civilworld.edu@example.com";
  const mailSubject = cp.mailSubject || "Civil World - Course Enquiry";

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
        return "server";
      }
    } catch {
      // Fall back to local backup below.
    }

    if (saveContactEnquiryLocal(payload)) {
      return "local";
    }

    return "failed";
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
            const message = String(data.get("message") || "").trim();

            const savedMode = await saveContactEnquiry({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              name,
              email,
              phone: "",
              city: "",
              studentType: "",
              program: "",
              learningMode: "",
              startMonth: "",
              message,
              status: "new",
            });

            const subject = encodeURIComponent(mailSubject);
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            );
            window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;

            if (savedMode === "server") {
              setStatus(
                "Saved successfully. Opening email app with your message...",
              );
            } else if (savedMode === "local") {
              setStatus(
                "Mongo API unavailable. Saved locally and opening email app now.",
              );
            } else {
              setStatus("Opening email app now. Mongo save was unavailable.");
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
