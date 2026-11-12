"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Plane,
  User,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If a token is already stored, skip the login screen
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.prefetch("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setError("Please enter your username and password.");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
      setError("Backend API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: cleanUsername,
            password,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message = Array.isArray(result?.message)
          ? result.message.join(", ")
          : result?.message || result?.error || "Login failed";
        throw new Error(message);
      }

      const accessToken =
        result?.accessToken || result?.access_token || result?.token;

      if (!accessToken) {
        throw new Error("Invalid login response from backend.");
      }

      const refreshToken = result?.refreshToken || result?.refresh_token;

      // Clear any old session first, then store the new one
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("flightsys_demo_session");

      localStorage.setItem("token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // The dashboard re-derives the real user from the token
      localStorage.setItem(
        "user",
        JSON.stringify(result?.user ?? { username: cleanUsername })
      );

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof TypeError
          ? "Cannot connect to the backend server."
          : err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fs-page">
      <div className="fs-bg-glow fs-glow-left" />
      <div className="fs-bg-glow fs-glow-right" />
      <div className="fs-bg-grid" />

      {/* NAVBAR */}
      <nav className="fs-navbar">
        <Link href="/" className="fs-brand">
          <span className="fs-brand-icon">
            <Plane size={23} />
          </span>

          <span>
            FLIGHT<span>SYS</span>
          </span>
        </Link>

        <div className="fs-nav-login">
          <span>New to FlightSys?</span>

          <Link href="/register">
            Create Account <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="fs-main">
        {/* LEFT HERO */}
        <section className="fs-hero">
          <div className="fs-eyebrow">
            <Plane size={14} />
            YOUR JOURNEY CONTINUES HERE
          </div>

          <h1>
            Welcome
            <br />
            <span>Back.</span>
          </h1>

          <p className="fs-description">
            Your next destination is waiting. Sign in to manage your flights
            and continue your seamless travel experience with FlightSys.
          </p>

          {/* FLIGHT VISUAL */}
          <div className="fs-flight-visual">
            <div className="fs-visual-glow" />
            <div className="fs-orbit fs-orbit-one" />
            <div className="fs-orbit fs-orbit-two" />

            <div className="fs-hero-plane">
              <Plane size={100} strokeWidth={1.2} />
            </div>

            <Globe2 className="fs-visual-globe" size={25} />

            <div className="fs-visual-caption">
              <span>FLIGHTSYS EXPERIENCE</span>
              <h3>Your journey starts here.</h3>
            </div>
          </div>

          {/* FEATURES */}
          <div className="fs-features">
            <div className="fs-feature">
              <ShieldCheck size={25} />

              <div>
                <strong>Secure Login</strong>
                <span>Protected account access</span>
              </div>
            </div>

            <div className="fs-feature">
              <Globe2 size={25} />

              <div>
                <strong>Explore More</strong>
                <span>Your journey awaits</span>
              </div>
            </div>
          </div>
        </section>

        {/* LOGIN FORM */}
        <section className="fs-register-area">
          <div className="fs-register-card">
            <div className="fs-card-accent" />

            <div className="fs-form-heading">
              <div className="fs-form-icon">
                <User size={25} />
              </div>

              <span className="fs-form-label">WELCOME BACK</span>

              <h2>Sign In.</h2>

              <p>Enter your credentials to access your account.</p>
            </div>

            <form className="fs-form" onSubmit={handleLogin}>
              {/* ERROR MESSAGE */}
              {error && (
                <div role="alert" className="fs-match fs-match-error">
                  {error}
                </div>
              )}

              {/* USERNAME */}
              <div className="fs-field">
                <label htmlFor="login-username">Username</label>

                <div className="fs-input-box">
                  <User className="fs-input-icon" size={19} />

                  <input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="fs-field">
                <label htmlFor="login-password">Password</label>

                <div className="fs-input-box">
                  <LockKeyhole className="fs-input-icon" size={19} />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="fs-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="fs-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Your Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="fs-card-footer">
              Don&apos;t have an account?
              <Link href="/register">Create Account</Link>
            </div>
          </div>

          <p className="fs-copyright">
            © 2026 FlightSys. All rights reserved.
          </p>
        </section>
      </main>
    </div>
  );
}