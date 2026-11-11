"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plane } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/auth/login",
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

      const result =
        await response.json();

      if (result.error) {
        alert(result.error);
        return;
      }

      localStorage.setItem(
        "token",
        result.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        result.refreshToken
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden p-4">

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />

      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-950/80 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(220,38,38,0.15)]">

        <div className="mb-8 text-center">
          <Plane
            size={45}
            className="mx-auto text-red-500"
          />

          <h1 className="mt-3 text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-zinc-400">
            Flight Reservation System
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-red-500"
          />

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
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

        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-red-600 p-3 font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]"
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

        <p className="mt-6 text-center text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-red-500 hover:text-red-400"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}