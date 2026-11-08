export default function Contact() {
  return (
    <section className="contact-section">

      {/* LEFT */}
      <div className="contact-left">

        <h1 className="contact-title">
          Contact <span>Me</span>
        </h1>

        <p>
          Feel free to reach out to collaborate on a project or simply connect.
        </p>

        <div className="contact-card">
  <div className="contact-icon">💻</div>

  <div className="contact-details">
    <span className="contact-label">GitHub</span>
    <a
      href="https://github.com/arjpuncia-collab"
      target="_blank"
    >
      <p>@arjpuncia-collab</p>
    </a>
  </div>
</div>

<div className="contact-card">
  <div className="contact-icon">📧</div>

  <div className="contact-details">
    <span className="contact-label">Email</span>
    <p>arvinpuncia@gmail.com</p>
  </div>
</div>

<div className="contact-card">
  <div className="contact-icon">📱</div>

  <div className="contact-details">
    <span className="contact-label">Phone</span>
    <p>+63 9511458948</p>
  </div>
</div>

      </div>

      {/* RIGHT */}
      <div className="contact-right">

        <h1 className="contact-title">
          Send <span>Message</span>
        </h1>

        <form className="contact-form">

          <input
            type="text"
            placeholder="Your Name"
          />

          <input
            type="email"
            placeholder="Your Email"
          />

          <textarea
            placeholder="Your Message"
            rows={6}
          />

          <button type="submit">
            Send Message
          </button>

        </form>

      </div>

    </section>
  );
}