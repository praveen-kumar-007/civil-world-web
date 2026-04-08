import { useState } from "react";
import PageHero from "../components/PageHero";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Ask your batch and course questions"
        subtitle="Fill the form and your message will open in your default email app for direct connection."
      />

      <section className="container">
        <form
          className="contact-form"
          onSubmit={(event) => {
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

            const subject = encodeURIComponent("Civil World - Course Enquiry");
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            );
            window.location.href = `mailto:civilworld.edu@example.com?subject=${subject}&body=${body}`;
            setStatus("Opening email app with your pre-filled message...");
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
