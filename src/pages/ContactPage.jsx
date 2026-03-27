import { useState } from "react";
import PageHero from "../components/PageHero";
import { useContent } from "../context/ContentContext";

export default function ContactPage() {
  const { content, contactInboxKey } = useContent();
  const { contactPage } = content;

  const studentTypes = contactPage.studentTypes;
  const programTypes = contactPage.programTypes;
  const learningModes = contactPage.learningModes;

  const [status, setStatus] = useState("");
  const [selectedType, setSelectedType] = useState(studentTypes[0]);
  const [selectedProgram, setSelectedProgram] = useState(programTypes[0]);
  const [selectedMode, setSelectedMode] = useState(learningModes[0]);

  function saveContactEnquiry(payload) {
    try {
      const current = JSON.parse(localStorage.getItem(contactInboxKey) || "[]");
      const next = [payload, ...(Array.isArray(current) ? current : [])].slice(
        0,
        200,
      );
      localStorage.setItem(contactInboxKey, JSON.stringify(next));
    } catch {
      setStatus(
        "Your enquiry was prepared for email, but local tracking could not be saved.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        subtitle={contactPage.subtitle}
      />

      <section className="container">
        <div className="contact-top-strip">
          {contactPage.topStrip.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          ))}
        </div>

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
            const phone = String(data.get("phone") || "").trim();
            const city = String(data.get("city") || "").trim();
            const message = String(data.get("message") || "").trim();
            const startMonth = String(data.get("startMonth") || "").trim();

            saveContactEnquiry({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              name,
              email,
              phone,
              city,
              message,
              startMonth,
              studentType: selectedType,
              program: selectedProgram,
              learningMode: selectedMode,
              status: "new",
            });

            const subject = encodeURIComponent(contactPage.mailSubject);
            const body = encodeURIComponent(
              `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nStudent Type: ${selectedType}\nProgram: ${selectedProgram}\nMode: ${selectedMode}\nPreferred Start: ${startMonth}\n\nMessage:\n${message}`,
            );
            window.location.href = `mailto:${contactPage.mailTo}?subject=${subject}&body=${body}`;
            setStatus(
              "Enquiry submitted and saved for admin review. Opening your email app...",
            );
            form.reset();
          }}
        >
          <div className="advanced-form-grid">
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
                placeholder="Enter your phone"
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
              Preferred Start Month
              <input name="startMonth" type="month" required />
            </label>
          </div>

          <div className="choice-block">
            <p>Student Type</p>
            <div className="choice-row">
              {studentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`choice-btn ${selectedType === type ? "active" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="choice-block">
            <p>Program</p>
            <div className="choice-row">
              {programTypes.map((program) => (
                <button
                  key={program}
                  type="button"
                  className={`choice-btn ${selectedProgram === program ? "active" : ""}`}
                  onClick={() => setSelectedProgram(program)}
                >
                  {program}
                </button>
              ))}
            </div>
          </div>

          <div className="choice-block">
            <p>Learning Mode</p>
            <div className="choice-row">
              {learningModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`choice-btn ${selectedMode === mode ? "active" : ""}`}
                  onClick={() => setSelectedMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <label>
            Message
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Tell us your learning goal"
            />
          </label>

          <label className="consent-check">
            <input type="checkbox" required /> I confirm these details are
            correct.
          </label>

          <button className="btn btn-primary" type="submit">
            Submit Enquiry
          </button>
          <p className="status-text">{status}</p>
        </form>
      </section>
    </>
  );
}
