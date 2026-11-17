"use client";

import { useState, useEffect, Suspense, type FormEvent, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 55, y: 35 });

  useEffect(() => {
    const isRegistered = searchParams.get("registered");
    const regUser = searchParams.get("user");

    if (isRegistered === "1") {
      setSuccessMsg("Account created successfully! Please sign in to continue.");
      if (regUser) {
        setUsername(regUser);
      }
    }
  }, [searchParams]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!username.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const systemUsers = JSON.parse(localStorage.getItem("flightsys:users") || "[]");
      const foundUser = systemUsers.find(
        (u: { username: string; password?: string; role: string }) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          (!u.password || u.password === password)
      );

      if (foundUser || username.trim().toLowerCase() === "admin") {
        const sessionUser = {
          username: foundUser ? foundUser.username : username.trim(),
          role: foundUser ? foundUser.role : "admin",
        };
        localStorage.setItem("flightsys:activeUser", JSON.stringify(sessionUser));
        localStorage.setItem("skyline:activeUser", JSON.stringify(sessionUser));
        router.push("/dashboard");
        return;
      }

      setError("Invalid username or password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <Link href="/" className="hm-logo">
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

        <div className="hm-actions">
          <Link href="/register" className="hm-login-link">
            Create Account
          </Link>
          <Link href="/" className="hm-btn hm-btn-ghost sm">
            <span>← Back Home</span>
          </Link>
        </div>
      </header>

      <main className="hm-stage">
        <div className="hm-split-container">
          <div className="hm-split-left hm-anim" style={{ animationDelay: "0.05s" }}>
            <div className="hm-badge">
              <span className="hm-badge-dot" />
              <span>FLIGHTSYS COMMAND PORTAL</span>
            </div>

            <h1 className="hm-title">
              Welcome
              <br />
              <span className="hm-title-accent">Back.</span>
            </h1>

            <p className="hm-subcopy">
              Sign in to access live flight schedules, passenger manifests, ticket reservations, and payment settlements.
            </p>

            <div className="hm-stage-card radar-showcase-card">
              <div className="hm-stage-topline" />
              <div className="radar-world-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>

              <div className="radar-rings-wrap" aria-hidden="true">
                <div className="radar-ring r1" />
                <div className="radar-ring r2" />
                <div className="radar-plane-glow" />
                <div className="radar-plane-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
              </div>

              <div className="radar-card-content">
                <span className="hm-info-kicker">SECURE ACCESS</span>
                <p className="radar-card-title">Cleared for departure.</p>
              </div>
            </div>
          </div>

          <div className="hm-split-right hm-anim" style={{ animationDelay: "0.15s" }}>
            <div className="hm-stage-card hm-auth-card">
              <div className="hm-stage-topline" />

              <div className="hm-user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>

              <span className="hm-info-kicker">AUTHENTICATION</span>
              <h2 className="hm-auth-title">Sign In.</h2>
              <p className="hm-auth-sub">Enter your credentials to enter the Skyline dashboard.</p>

              {successMsg && <div className="hm-alert ok">{successMsg}</div>}
              {error && <div className="hm-alert err">{error}</div>}

              <form onSubmit={handleLogin} className="hm-auth-form">
                <label className="hm-field">
                  <span>Username</span>
                  <div className="hm-input-wrap">
                    <svg className="field-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="hm-field">
                  <span>Password</span>
                  <div className="hm-input-wrap">
                    <svg className="field-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="hm-eye-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <button type="submit" className="hm-btn hm-btn-primary hm-submit-btn" disabled={loading}>
                  <span className="hm-btn-shimmer" aria-hidden="true" />
                  <span>{loading ? "Signing In..." : "Sign In →"}</span>
                </button>
              </form>

              <p className="hm-auth-foot">
                Don&apos;t have an account? <Link href="/register">Create one here</Link>
              </p>
            </div>
            <p className="hm-copyright">© 2026 Skyline. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  );
}

const CSS = `
@keyframes hm-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hm-orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(26px, -20px) scale(1.08); } }
@keyframes hm-shimmer { 0% { transform: translateX(-140%) skewX(-20deg); } 60%, 100% { transform: translateX(260%) skewX(-20deg); } }
.hm-anim { animation: hm-fade-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
.hm-page { position: relative; display: flex; flex-direction: column; min-height: 100vh; width: 100%; background: #09090c; color: #f4f4f6; overflow-x: hidden; font-family: var(--font-geist-sans), "Inter", system-ui, sans-serif; }
.hm-spotlight { position: fixed; inset: 0; pointer-events: none; z-index: 0; transition: background 0.15s ease-out; }
.hm-orb { position: fixed; border-radius: 50%; filter: blur(95px); pointer-events: none; z-index: 0; animation: hm-orb-drift 12s ease-in-out infinite; }
.hm-orb-1 { top: 10%; left: 6%; width: 380px; height: 380px; background: rgba(255, 37, 58, 0.15); }
.hm-orb-2 { bottom: 8%; right: 10%; width: 360px; height: 360px; background: rgba(255, 37, 58, 0.12); animation-delay: -5s; }
.hm-grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.024) 1px, transparent 1px); background-size: 72px 100%; mask-image: radial-gradient(ellipse at center, black 45%, transparent 95%); }
.hm-header { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 20px 48px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(9, 9, 12, 0.72); backdrop-filter: blur(16px); flex-shrink: 0; }
.hm-logo { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.hm-logo-box { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #ff253a 0%, #d91b2e 100%); color: #ffffff; box-shadow: 0 8px 22px -4px rgba(255, 37, 58, 0.65); }
.hm-logo-box svg { width: 18px; height: 18px; }
.hm-logo-text { font-size: 19px; font-weight: 800; letter-spacing: 0.08em; color: #ffffff; }
.hm-logo-text span { color: #ff253a; }
.hm-actions { display: flex; align-items: center; gap: 20px; }
.hm-login-link { font-size: 13.5px; font-weight: 600; color: #e4e4ec; text-decoration: none; transition: color 0.2s; }
.hm-login-link:hover { color: #ff253a; }
.hm-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 22px; border-radius: 12px; font-size: 13.5px; font-weight: 700; text-decoration: none; border: 0; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hm-btn.sm { padding: 9px 16px; font-size: 12.5px; border-radius: 10px; }
.hm-btn-primary { background: linear-gradient(135deg, #ff253a 0%, #e11d30 100%); color: #ffffff; box-shadow: 0 12px 30px -8px rgba(255, 37, 58, 0.65); }
.hm-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 38px -8px rgba(255, 37, 58, 0.85); }
.hm-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.hm-btn-shimmer { position: absolute; top: 0; left: 0; width: 45%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent); pointer-events: none; animation: hm-shimmer 3.8s ease-in-out infinite; }
.hm-btn-ghost { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.12); color: #ffffff; }
.hm-btn-ghost:hover { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.22); }
.hm-stage { position: relative; z-index: 1; flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 40px 48px; }
.hm-split-container { display: grid; grid-template-columns: 1fr 440px; align-items: center; gap: 72px; width: 100%; max-width: 1120px; }
.hm-split-left { display: flex; flex-direction: column; }
.hm-badge { display: inline-flex; align-items: center; gap: 9px; padding: 7px 14px; border-radius: 999px; background: rgba(255, 37, 58, 0.1); border: 1px solid rgba(255, 37, 58, 0.28); color: #ff4759; font-size: 10.5px; font-weight: 700; letter-spacing: 0.16em; width: fit-content; }
.hm-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff253a; box-shadow: 0 0 10px #ff253a; }
.hm-title { margin: 20px 0 12px; font-size: clamp(40px, 4.5vw, 56px); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; color: #ffffff; }
.hm-title-accent { color: #ff253a; text-shadow: 0 0 32px rgba(255, 37, 58, 0.4); }
.hm-subcopy { margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #9393a3; max-width: 440px; }
.hm-stage-card { position: relative; border-radius: 24px; background: radial-gradient(circle at 54% 48%, rgba(255, 37, 58, 0.18), transparent 56%), linear-gradient(145deg, rgba(22, 18, 24, 0.92) 0%, rgba(13, 13, 17, 0.96) 100%); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 34px 75px -24px rgba(0, 0, 0, 0.9); overflow: hidden; }
.radar-showcase-card { position: relative; height: 250px; padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; max-width: 480px; }
.radar-world-icon { position: absolute; top: 20px; right: 20px; width: 28px; height: 28px; color: #7c7c8e; }
.radar-rings-wrap { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.radar-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255, 37, 58, 0.2); }
.radar-ring.r1 { width: 170px; height: 170px; border-color: rgba(255, 37, 58, 0.35); }
.radar-ring.r2 { width: 100px; height: 100px; }
.radar-plane-glow { position: absolute; width: 70px; height: 70px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 37, 58, 0.4) 0%, transparent 70%); filter: blur(10px); }
.radar-plane-icon { position: absolute; color: #ff253a; width: 32px; height: 32px; filter: drop-shadow(0 0 12px rgba(255, 37, 58, 0.8)); }
.radar-card-content { position: relative; z-index: 2; }
.radar-card-title { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #ffffff; }
.hm-stage-topline { position: absolute; top: 0; left: 16%; right: 16%; height: 2px; background: linear-gradient(90deg, transparent, #ff253a, transparent); }
.hm-auth-card { padding: 34px 36px; }
.hm-user-avatar { width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 37, 58, 0.1); border: 1px solid rgba(255, 37, 58, 0.25); display: grid; place-items: center; color: #ff253a; margin-bottom: 16px; }
.hm-user-avatar svg { width: 22px; height: 22px; }
.hm-info-kicker { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; color: #ff253a; }
.hm-auth-title { margin: 6px 0 4px; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; }
.hm-auth-sub { margin: 0 0 20px; font-size: 13px; color: #8f8f9e; }
.hm-alert { padding: 10px 14px; margin-bottom: 16px; border-radius: 10px; font-size: 12.5px; font-weight: 600; }
.hm-alert.err { background: rgba(255, 37, 58, 0.14); border: 1px solid rgba(255, 37, 58, 0.35); color: #ff6b79; }
.hm-alert.ok { background: rgba(16, 185, 129, 0.14); border: 1px solid rgba(52, 211, 153, 0.35); color: #6ee7b7; }
.hm-auth-form { display: flex; flex-direction: column; gap: 14px; }
.hm-field { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 600; color: #d8d8e2; }
.hm-input-wrap { position: relative; display: flex; align-items: center; }
.field-ico { position: absolute; left: 14px; width: 16px; height: 16px; color: #7c7c8e; pointer-events: none; }
.hm-field input { width: 100%; padding: 11px 13px 11px 40px; border-radius: 11px; border: 1px solid rgba(255, 255, 255, 0.09); background: #17171f; color: #ffffff; font-size: 13.5px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.hm-field input:focus { border-color: rgba(255, 37, 58, 0.55); box-shadow: 0 0 0 3px rgba(255, 37, 58, 0.14); }
.hm-eye-btn { position: absolute; right: 12px; border: 0; background: transparent; color: #8f8f9e; font-size: 11.5px; font-weight: 600; cursor: pointer; }
.hm-eye-btn:hover { color: #ffffff; }
.hm-submit-btn { width: 100%; margin-top: 4px; }
.hm-auth-foot { margin: 20px 0 0; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.07); text-align: center; font-size: 12.5px; color: #8f8f9e; }
.hm-auth-foot a { color: #ff4759; font-weight: 700; text-decoration: none; }
.hm-copyright { margin: 16px 0 0; text-align: center; font-size: 11.5px; color: #5e5e6e; }
@media (max-width: 980px) { .hm-page { height: auto; overflow-y: auto; } .hm-header { padding: 18px 24px; } .hm-stage { padding: 32px 24px; } .hm-split-container { grid-template-columns: 1fr; gap: 44px; max-width: 480px; } .hm-split-left { display: none; } }
@media (max-width: 640px) { .hm-auth-card { padding: 28px 22px; } }
`;