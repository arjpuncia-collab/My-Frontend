
import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <nav className="navbar">
        <Link href="/" className="logo">
          <span className="logo-icon">✈</span>
          SKY<span>LINE</span>
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Login
          </Link>
          <Link href="/register" className="nav-register">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot"></span>
            YOUR JOURNEY STARTS HERE
          </div>

          <h1>
            Explore the
            <br />
            World <span>Beyond.</span>
          </h1>

          <p className="hero-description">
            Discover new destinations, experience seamless
            booking, and make every journey unforgettable.
          </p>

          <div className="hero-buttons">
            <Link href="/register" className="primary-btn">
              Start Your Journey <span>→</span>
            </Link>

            <Link href="/login" className="secondary-btn">
              Sign In
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>Easy</h3>
              <p>Booking Process</p>
            </div>
            <div>
              <h3>Secure</h3>
              <p>Authentication</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Online Access</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="plane-glow"></div>

          <div className="plane">
            <svg viewBox="0 0 512 512" fill="currentColor">
              <path d="M480 224L288 160V64c0-18-14-32-32-32s-32 14-32 32v96L32 224c-18 6-24 25-16 40 5 10 16 16 27 16h181v96l-64 40v32l96-24 96 24v-32l-64-40v-96h181c11 0 22-6 27-16 8-15 2-34-16-40z"/>
            </svg>
          </div>

          <div className="destination-card">
            <span>✦ DESTINATION</span>
            <h3>Anywhere.</h3>
            <p>Your next adventure awaits.</p>
          </div>

          <div className="visual-label">FLY WITHOUT LIMITS</div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-heading">
          <span>WHY SKYLINE?</span>
          <h2>Travel made <span>simple.</span></h2>
          <p>Everything you need for a smoother travel experience.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">✈</div>
            <h3>Easy Access</h3>
            <p>Access your account and travel platform anytime.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⌑</div>
            <h3>Secure Account</h3>
            <p>Authentication designed to keep your account protected.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">↗</div>
            <h3>Simple Experience</h3>
            <p>Enjoy a clean and convenient booking experience.</p>
          </div>
        </div>
      </section>

      <section className="bottom-cta" id="about">
        <h2>Ready for your next adventure?</h2>
        <p>Create an account and get started today.</p>
        <Link href="/register" className="primary-btn">
          Create Account →
        </Link>
      </section>

      <footer>
        <Link href="/" className="logo">
          ✈ SKY<span>LINE</span>
        </Link>
        <p>© 2026 Skyline Flight Booking System.</p>
        <p>Powered by Next.js + NestJS</p>
      </footer>
    </main>
  );
}
