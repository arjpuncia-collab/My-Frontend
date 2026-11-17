"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";

type TabKey = "home" | "features" | "about";

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 55, y: 35 });
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="hm-page" onMouseMove={handleMouseMove}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        className="hm-spotlight"
        aria-hidden="true"
        style={{
          background: `radial-gradient(680px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 37, 58, 0.13), transparent 55%)`,
        }}
      />
      <div className="hm-orb hm-orb-1" aria-hidden="true" />
      <div className="hm-orb hm-orb-2" aria-hidden="true" />
      <div className="hm-grid-bg" aria-hidden="true" />

      <header className="hm-header">
        <Link href="/" className="hm-logo" onClick={() => setActiveTab("home")}>
          <span className="hm-logo-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="hm-logo-text">
            SKY<span>LINE</span>
          </span>
        </Link>

        <nav className="hm-nav" aria-label="Primary">
          <button
            type="button"
            className={activeTab === "home" ? "is-active" : ""}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={activeTab === "features" ? "is-active" : ""}
            onClick={() => setActiveTab("features")}
          >
            Features
          </button>
          <button
            type="button"
            className={activeTab === "about" ? "is-active" : ""}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </nav>

        <div className="hm-actions">
          <Link href="/login" className="hm-login-link">
            Login
          </Link>
          <Link href="/register" className="hm-btn hm-btn-primary sm">
            <span className="hm-btn-shimmer" aria-hidden="true" />
            <span>Get Started</span>
          </Link>
        </div>
      </header>

      <main className="hm-stage">
        <div className="hm-container">
          <section className="hm-left">
            <div className="hm-badge hm-anim" style={{ animationDelay: "0.05s" }}>
              <span className="hm-badge-dot" />
              <span>YOUR JOURNEY STARTS HERE</span>
            </div>

            <h1 className="hm-title hm-anim" style={{ animationDelay: "0.12s" }}>
              Explore the
              <br />
              World <span className="hm-title-accent">Beyond.</span>
            </h1>

            <p className="hm-subcopy hm-anim" style={{ animationDelay: "0.18s" }}>
              Discover new destinations, experience seamless booking, and make
              every journey unforgettable with Skyline.
            </p>

            <div className="hm-cta-row hm-anim" style={{ animationDelay: "0.24s" }}>
              <Link href="/register" className="hm-btn hm-btn-primary">
                <span className="hm-btn-shimmer" aria-hidden="true" />
                <span>Start Your Journey</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link href="/register" className="hm-login-link">
  Register
</Link>
            </div>

            <div className="hm-stats-row hm-anim" style={{ animationDelay: "0.3s" }}>
              <div className="hm-stat-item">
                <span className="hm-stat-num">Easy</span>
                <span className="hm-stat-label">Booking Process</span>
              </div>
              <div className="hm-stat-divider" />
              <div className="hm-stat-item">
                <span className="hm-stat-num">Secure</span>
                <span className="hm-stat-label">Authentication</span>
              </div>
              <div className="hm-stat-divider" />
              <div className="hm-stat-item">
                <span className="hm-stat-num">24/7</span>
                <span className="hm-stat-label">Online Access</span>
              </div>
            </div>
          </section>

          <section className="hm-right hm-anim" style={{ animationDelay: "0.18s" }}>
            {activeTab === "home" && (
              <div className="hm-stage-card">
                <div className="hm-stage-topline" />
                <span className="hm-stage-kicker">FLY WITHOUT LIMITS</span>

                <div className="hm-radar-pulse" aria-hidden="true" />
                <div className="hm-orbit hm-orbit-1" aria-hidden="true" />
                <div className="hm-orbit hm-orbit-2" aria-hidden="true" />

                <div className="hm-plane-glow" aria-hidden="true" />
                <div className="hm-plane-hero">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>

                <div className="hm-dest-card">
                  <div className="hm-dest-tag">
                    <span>+</span>
                    <span>DESTINATION</span>
                  </div>
                  <p className="hm-dest-title">Anywhere.</p>
                  <p className="hm-dest-sub">Your next adventure awaits.</p>
                </div>

                <div className="hm-route-pill">
                  <span className="hm-route-dot" />
                  <span>MNL → CEB · ON TIME</span>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className="hm-stage-card hm-info-card">
                <div className="hm-stage-topline" />
                <span className="hm-info-kicker">WHY SKYLINE?</span>
                <h2 className="hm-info-title">
                  Travel made <span>simple.</span>
                </h2>
                <div className="hm-info-list">
                  <div className="hm-info-row">
                    <span className="hm-info-dot" />
                    <div>
                      <strong>Real-Time Flight Control</strong>
                      <p>Schedule routes, monitor seats, and update statuses live.</p>
                    </div>
                  </div>
                  <div className="hm-info-row">
                    <span className="hm-info-dot" />
                    <div>
                      <strong>Instant Seat Reservations</strong>
                      <p>Automated seat inventory and instant booking references.</p>
                    </div>
                  </div>
                  <div className="hm-info-row">
                    <span className="hm-info-dot" />
                    <div>
                      <strong>Secure Role-Based Access</strong>
                      <p>Protected authentication for seamless 24/7 operations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="hm-stage-card hm-info-card">
                <div className="hm-stage-topline" />
                <span className="hm-info-kicker">ABOUT SKYLINE</span>
                <h2 className="hm-info-title">
                  Modern aviation <span>operations.</span>
                </h2>
                <p className="hm-info-desc">
                  Skyline unifies flight scheduling, passenger management, and
                  real-time booking workflows into one fast, reliable platform built
                  for effortless travel.
                </p>
                <div className="hm-about-metrics">
                  <div>
                    <strong>99.9%</strong>
                    <span>System Uptime</span>
                  </div>
                  <div>
                    <strong>Instant</strong>
                    <span>Ticket Sync</span>
                  </div>
                  <div>
                    <strong>24/7</strong>
                    <span>Flight Control</span>
                  </div>
                </div>
              </div>
            )}

            <p className="hm-copyright">© 2026 Skyline. All rights reserved.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

const CSS = `
@keyframes hm-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hm-float { 0%, 100% { transform: translate(-50%, -50%) rotate(32deg) translateY(0px); } 50% { transform: translate(-50%, -50%) rotate(32deg) translateY(-10px); } }
@keyframes hm-radar { 0% { width: 110px; height: 110px; opacity: 0.65; } 100% { width: 390px; height: 390px; opacity: 0; } }
@keyframes hm-orbit-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes hm-orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(26px, -20px) scale(1.08); } }
@keyframes hm-shimmer { 0% { transform: translateX(-140%) skewX(-20deg); } 60%, 100% { transform: translateX(260%) skewX(-20deg); } }
.hm-anim { animation: hm-fade-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
.hm-page { position: relative; display: flex; flex-direction: column; height: 100vh; min-height: 100vh; width: 100%; background: #09090c; color: #f4f4f6; overflow: hidden; font-family: var(--font-geist-sans), "Inter", system-ui, sans-serif; }
.hm-spotlight { position: fixed; inset: 0; pointer-events: none; z-index: 0; transition: background 0.15s ease-out; }
.hm-orb { position: fixed; border-radius: 50%; filter: blur(95px); pointer-events: none; z-index: 0; animation: hm-orb-drift 12s ease-in-out infinite; }
.hm-orb-1 { top: 10%; left: 6%; width: 380px; height: 380px; background: rgba(255, 37, 58, 0.15); }
.hm-orb-2 { bottom: 8%; right: 10%; width: 360px; height: 360px; background: rgba(255, 37, 58, 0.12); animation-delay: -5s; }
.hm-grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.024) 1px, transparent 1px); background-size: 72px 100%; mask-image: radial-gradient(ellipse at center, black 45%, transparent 95%); }
.hm-header { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 20px 48px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(9, 9, 12, 0.72); backdrop-filter: blur(16px); flex-shrink: 0; }
.hm-logo { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.hm-logo-box { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #ff253a 0%, #d91b2e 100%); color: #ffffff; box-shadow: 0 8px 22px -4px rgba(255, 37, 58, 0.65); transition: transform 0.25s ease; }
.hm-logo:hover .hm-logo-box { transform: scale(1.06) rotate(-4deg); }
.hm-logo-box svg { width: 18px; height: 18px; }
.hm-logo-text { font-size: 19px; font-weight: 800; letter-spacing: 0.08em; color: #ffffff; }
.hm-logo-text span { color: #ff253a; }
.hm-nav { display: flex; align-items: center; gap: 32px; }
.hm-nav button { background: none; border: 0; padding: 4px 0; font-size: 13.5px; font-weight: 500; color: #8f8f9e; cursor: pointer; transition: color 0.2s; }
.hm-nav button:hover, .hm-nav button.is-active { color: #ffffff; font-weight: 600; }
.hm-actions { display: flex; align-items: center; gap: 20px; }
.hm-login-link { font-size: 13.5px; font-weight: 600; color: #e4e4ec; text-decoration: none; transition: color 0.2s; }
.hm-login-link:hover { color: #ff253a; }
.hm-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 26px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
.hm-btn.sm { padding: 10px 18px; font-size: 13px; border-radius: 10px; }
.hm-btn-primary { background: linear-gradient(135deg, #ff253a 0%, #e11d30 100%); color: #ffffff; box-shadow: 0 12px 30px -8px rgba(255, 37, 58, 0.65); }
.hm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 38px -8px rgba(255, 37, 58, 0.85); }
.hm-btn-shimmer { position: absolute; top: 0; left: 0; width: 45%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent); pointer-events: none; animation: hm-shimmer 3.8s ease-in-out infinite; }
.hm-btn-ghost { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.12); color: #ffffff; }
.hm-btn-ghost:hover { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.22); transform: translateY(-2px); }
.hm-btn svg { width: 16px; height: 16px; transition: transform 0.2s ease; }
.hm-btn:hover svg { transform: translateX(4px); }
.hm-stage { position: relative; z-index: 1; flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 24px 48px; }
.hm-container { display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: 80px; width: 100%; max-width: 1180px; }
.hm-left { display: flex; flex-direction: column; align-items: flex-start; }
.hm-badge { display: inline-flex; align-items: center; gap: 9px; padding: 7px 14px; border-radius: 999px; background: rgba(255, 37, 58, 0.1); border: 1px solid rgba(255, 37, 58, 0.28); color: #ff4759; font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; box-shadow: 0 0 24px -6px rgba(255, 37, 58, 0.35); }
.hm-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff253a; box-shadow: 0 0 10px #ff253a; }
.hm-title { margin: 22px 0 0; font-size: clamp(44px, 4.9vw, 66px); font-weight: 900; line-height: 1.03; letter-spacing: -0.03em; color: #ffffff; }
.hm-title-accent { background: linear-gradient(135deg, #ff253a 0%, #ff6373 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hm-subcopy { margin: 20px 0 0; max-width: 470px; font-size: 15.5px; line-height: 1.65; color: #9393a3; }
.hm-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 30px; }
.hm-stats-row { display: flex; align-items: center; gap: 28px; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.07); }
.hm-stat-item { display: flex; flex-direction: column; }
.hm-stat-num { font-size: 19px; font-weight: 800; color: #ffffff; }
.hm-stat-label { margin-top: 3px; font-size: 12px; color: #777787; }
.hm-stat-divider { width: 1px; height: 30px; background: rgba(255, 255, 255, 0.08); }
.hm-right { display: flex; flex-direction: column; align-items: center; width: 100%; }
.hm-stage-card { position: relative; width: 100%; height: 410px; border-radius: 24px; background: radial-gradient(circle at 54% 48%, rgba(255, 37, 58, 0.22), transparent 56%), linear-gradient(145deg, rgba(22, 18, 24, 0.92) 0%, rgba(13, 13, 17, 0.96) 100%); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 34px 75px -24px rgba(0, 0, 0, 0.9); overflow: hidden; transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease; }
.hm-stage-card:hover { transform: translateY(-4px); border-color: rgba(255, 37, 58, 0.35); box-shadow: 0 38px 85px -22px rgba(255, 37, 58, 0.25); }
.hm-stage-topline { position: absolute; top: 0; left: 16%; right: 16%; height: 2px; background: linear-gradient(90deg, transparent, #ff253a, transparent); }
.hm-stage-kicker { position: absolute; top: 22px; right: 24px; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: #7c7c8e; }
.hm-radar-pulse { position: absolute; top: 48%; left: 54%; transform: translate(-50%, -50%); border-radius: 50%; border: 1px solid rgba(255, 37, 58, 0.45); pointer-events: none; animation: hm-radar 3.4s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
.hm-orbit { position: absolute; top: 48%; left: 54%; border: 1px solid rgba(255, 255, 255, 0.06); pointer-events: none; }
.hm-orbit-1 { width: 280px; height: 200px; border-radius: 50%; animation: hm-orbit-spin 26s linear infinite; }
.hm-orbit-2 { width: 210px; height: 300px; border-radius: 50%; border-color: rgba(255, 37, 58, 0.16); animation: hm-orbit-spin 34s linear infinite reverse; }
.hm-plane-glow { position: absolute; top: 48%; left: 54%; width: 160px; height: 160px; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255, 37, 58, 0.36) 0%, transparent 70%); filter: blur(18px); pointer-events: none; }
.hm-plane-hero { position: absolute; top: 48%; left: 54%; color: #ff253a; filter: drop-shadow(0 16px 32px rgba(255, 37, 58, 0.65)); animation: hm-float 4.2s ease-in-out infinite; }
.hm-plane-hero svg { width: 118px; height: 118px; }
.hm-dest-card { position: absolute; left: 24px; bottom: 24px; width: 205px; padding: 16px 18px; border-radius: 16px; background: rgba(18, 18, 24, 0.88); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.85); }
.hm-dest-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; color: #ff4759; }
.hm-dest-title { margin: 7px 0 0; font-size: 18px; font-weight: 800; color: #ffffff; }
.hm-dest-sub { margin: 4px 0 0; font-size: 11.5px; color: #8c8c9c; }
.hm-route-pill { position: absolute; right: 24px; bottom: 24px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(52, 211, 153, 0.25); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: #6ee7b7; }
.hm-route-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; }
.hm-info-card { display: flex; flex-direction: column; justify-content: center; padding: 36px 38px; }
.hm-info-kicker { font-size: 10.5px; font-weight: 700; letter-spacing: 0.2em; color: #ff253a; }
.hm-info-title { margin: 10px 0 0; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; }
.hm-info-title span { color: #ff253a; }
.hm-info-list { display: flex; flex-direction: column; gap: 18px; margin-top: 24px; }
.hm-info-row { display: flex; align-items: flex-start; gap: 14px; }
.hm-info-dot { width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: #ff253a; box-shadow: 0 0 10px #ff253a; flex-shrink: 0; }
.hm-info-row strong { display: block; font-size: 14.5px; color: #ffffff; }
.hm-info-row p { margin: 3px 0 0; font-size: 13px; color: #8f8f9e; }
.hm-info-desc { margin: 16px 0 0; font-size: 14.5px; line-height: 1.65; color: #9696a6; }
.hm-about-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 28px; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.hm-about-metrics strong { display: block; font-size: 20px; font-weight: 800; color: #ffffff; }
.hm-about-metrics span { font-size: 11.5px; color: #7e7e8e; }
.hm-copyright { margin: 16px 0 0; text-align: center; font-size: 11.5px; color: #5e5e6e; }
@media (max-width: 980px) { .hm-page { height: auto; overflow-y: auto; } .hm-header { padding: 18px 24px; } .hm-stage { padding: 32px 24px; } .hm-container { grid-template-columns: 1fr; gap: 44px; max-width: 520px; } }
@media (max-width: 640px) { .hm-nav { display: none; } .hm-stage-card { height: 360px; } .hm-route-pill { display: none; } }
`;