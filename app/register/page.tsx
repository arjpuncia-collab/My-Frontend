"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plane } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const getPasswordStrength = () => {
    if (password.length < 4) {
      return {
        text: "Weak",
        width: "30%",
        color: "bg-red-500",
      };
    }

    if (password.length < 8) {
      return {
        text: "Medium",
        width: "60%",
        color: "bg-yellow-500",
      };
    }

    return {
      text: "Strong",
      width: "100%",
      color: "bg-green-500",
    };
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        alert(result.error);
        return;
      }

      alert("Registration Successful!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const strength =
    getPasswordStrength();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />

      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-950/90 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(220,38,38,0.2)]">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
            <Plane size={34} />
          </div>

          <h1 className="mt-4 text-4xl font-bold text-white">
            FlightSys
          </h1>

          <p className="mt-2 text-zinc-400">
            Create Your Account
          </p>

        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-red-500"
        />

        {/* Password */}
        <div className="relative mt-4">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-red-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-4 top-4 text-zinc-400"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

        {/* Strength */}
        <div className="mt-2">

          <div className="h-2 rounded-full bg-zinc-800">

            <div
              className={`h-2 rounded-full ${strength.color}`}
              style={{
                width:
                  strength.width,
              }}
            />

          </div>

          <p className="mt-1 text-xs text-zinc-400">
            Strength: {strength.text}
          </p>

        </div>

        {/* Confirm Password */}
        <div className="relative mt-4">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-red-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-4 text-zinc-400"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

        {/* Match Checker */}
        {confirmPassword && (
          <p
            className={`mt-2 text-xs ${
              password === confirmPassword
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {password ===
            confirmPassword
              ? "✓ Passwords Match"
              : "✗ Passwords Do Not Match"}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="
          mt-6
          w-full
          rounded-xl
          bg-red-600
          p-3
          font-semibold
          text-white
          transition-all
          duration-300
          hover:bg-red-700
          hover:scale-[1.02]
          hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]
        "
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        <p className="mt-6 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-500 hover:text-red-400"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}