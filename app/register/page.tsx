
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getStrength = () => {
    if (!password) return { label: "Not entered", score: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", score: 1 };
    if (score <= 2) return { label: "Medium", score: 2 };

    return { label: "Strong", score: 3 };
  };

  const strength = getStrength();

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Username is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // FRONTEND DEMO ONLY
      // No backend or database connection yet.

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const existingUsers = JSON.parse(
        localStorage.getItem("flightsys_demo_users") || "[]"
      );

      const userExists = existingUsers.some(
        (user: { username: string }) =>
          user.username.toLowerCase() ===
          cleanUsername.toLowerCase()
      );

      if (userExists) {
        throw new Error("Username is already registered.");
      }

      const newUser = {
        username: cleanUsername,
        password,
        role: "Customer",
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);

      localStorage.setItem(
        "flightsys_demo_users",
        JSON.stringify(existingUsers)
      );

      setSuccess("Account created successfully!");

      setUsername("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1200);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fs-page">

      <div className="fs-bg-glow fs-glow-left" />
      <div className="fs-bg-glow fs-glow-right" />
      <div className="fs-bg-grid" />

      <header className="fs-navbar">
        <Link href="/" className="fs-brand">
          <span className="fs-brand-icon">
            <Plane size={23} />
          </span>
          <span>FLIGHT<span>SYS</span></span>
        </Link>

        <div className="fs-nav-login">
          <span>Already a member?</span>
          <Link href="/login">
            Sign in <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <section className="fs-main">

        <div className="fs-hero">

          <div className="fs-eyebrow">
            <Sparkles size={14} />
            YOUR JOURNEY STARTS HERE
          </div>

          <h1>
            Explore the
            <br />
            world <span>beyond.</span>
          </h1>

          <p className="fs-description">
            Discover new destinations and experience a
            seamless travel journey. Your next adventure
            begins with FlightSys.
          </p>

          <div className="fs-flight-visual">
            <div className="fs-visual-glow" />
            <div className="fs-orbit fs-orbit-one" />
            <div className="fs-orbit fs-orbit-two" />

            <Plane
              className="fs-hero-plane"
              size={110}
              strokeWidth={1.1}
            />

            <Globe2
              className="fs-visual-globe"
              size={25}
            />

            <div className="fs-visual-caption">
              <span>FLIGHTSYS EXPERIENCE</span>
              <h3>Travel without limits.</h3>
            </div>
          </div>

          <div className="fs-features">

            <div className="fs-feature">
              <ShieldCheck size={23} />
              <div>
                <strong>Secure Access</strong>
                <span>Account protection</span>
              </div>
            </div>

            <div className="fs-feature">
              <Globe2 size={23} />
              <div>
                <strong>Explore More</strong>
                <span>Your journey awaits</span>
              </div>
            </div>

          </div>
        </div>

        <div className="fs-register-area">

          <div className="fs-register-card">

            <div className="fs-card-accent" />

            <div className="fs-form-heading">

              <div className="fs-form-icon">
                <User size={25} />
              </div>

              <span className="fs-form-label">
                CREATE YOUR ACCOUNT
              </span>

              <h2>Join FlightSys.</h2>
              <p>Start your journey with us today.</p>

            </div>

            <form
              onSubmit={handleRegister}
              className="fs-form"
            >

              {error && (
                <div role="alert" className="fs-match fs-match-error">
                  {error}
                </div>
              )}

              {success && (
                <div role="status" className="fs-match fs-match-success">
                  <CheckCircle2 size={16} />
                  {success}
                </div>
              )}

              <div className="fs-field">
                <label htmlFor="fs-username">
                  Username
                </label>

                <div className="fs-input-box">
                  <User
                    className="fs-input-icon"
                    size={18}
                  />

                  <input
                    id="fs-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="fs-field">
                <label htmlFor="fs-password">
                  Password
                </label>

                <div className="fs-input-box">
                  <Lock
                    className="fs-input-icon"
                    size={18}
                  />

                  <input
                    id="fs-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="fs-eye"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}
                  </button>
                </div>

                <div className="fs-strength-info">
                  <span>Password strength</span>

                  <span
                    className={`fs-strength-label strength-${strength.score}`}
                  >
                    {strength.label}
                  </span>
                </div>

                <div className="fs-strength-track">
                  <div
                    className={`fs-strength-fill strength-bar-${strength.score}`}
                    style={{
                      width:
                        strength.score === 0
                          ? "0%"
                          : strength.score === 1
                          ? "25%"
                          : strength.score === 2
                          ? "60%"
                          : "100%",
                    }}
                  />
                </div>
              </div>

              <div className="fs-field">
                <label htmlFor="fs-confirm">
                  Confirm Password
                </label>

                <div className="fs-input-box">
                  <Lock
                    className="fs-input-icon"
                    size={18}
                  />

                  <input
                    id="fs-confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="fs-eye"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}
                  </button>
                </div>

                {confirmPassword && (
                  <div
                    className={
                      password === confirmPassword
                        ? "fs-match fs-match-success"
                        : "fs-match fs-match-error"
                    }
                  >
                    <CheckCircle2 size={14} />

                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="fs-submit"
                disabled={loading}
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Your Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            <div className="fs-card-footer">
              Already have an account?
              <Link href="/login">
                Sign In
              </Link>
            </div>

          </div>

          <p className="fs-copyright">
            © 2026 FlightSys. All rights reserved.
          </p>

        </div>

      </section>
    </main>
  );
}
