"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Users,
  Ticket,
  CreditCard,
  LogOut,
} from "lucide-react";

const getJwtPayload = (token: string) => {
  const [, payload] = token.split(".");

  if (!payload) return null;

  const normalizedPayload = payload
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(payload.length / 4) * 4, "=");

  try {
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
};

export default function Dashboard() {
  const router = useRouter();

  const [username] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const token = localStorage.getItem("token");
    if (!token) return "";

    const payload = getJwtPayload(token);
    return payload?.username || "";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = getJwtPayload(token);

    if (!payload?.username) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-red-500/20 bg-zinc-950">

        <div className="p-6">

          <h1 className="text-3xl font-bold text-red-500">
            ✈ FlightSys
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Flight Reservation System
          </p>

        </div>

        <nav className="mt-6 space-y-2 px-4">

          <button className="w-full rounded-lg bg-red-600 px-4 py-3 text-left">
            Dashboard
          </button>

          <button className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-zinc-900">
            Flights
          </button>

          <button className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-zinc-900">
            Passengers
          </button>

          <button className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-zinc-900">
            Bookings
          </button>

          <button className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-zinc-900">
            Payments
          </button>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-4xl font-bold text-red-500">
              Dashboard
            </h2>

            <p className="text-zinc-400">
              Welcome, {username}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950 via-zinc-950 to-black p-8">

          <h3 className="text-5xl font-bold text-white">
            Airline Management
          </h3>

          <p className="mt-3 text-zinc-400">
            Manage flights, passengers,
            bookings and payments.
          </p>

        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-6 hover:border-red-500">

            <Plane
              size={40}
              className="text-red-500"
            />

            <p className="mt-4 text-zinc-400">
              Flights
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              120
            </h3>

          </div>

          <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-6 hover:border-red-500">

            <Users
              size={40}
              className="text-red-500"
            />

            <p className="mt-4 text-zinc-400">
              Passengers
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              450
            </h3>

          </div>

          <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-6 hover:border-red-500">

            <Ticket
              size={40}
              className="text-red-500"
            />

            <p className="mt-4 text-zinc-400">
              Bookings
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              210
            </h3>

          </div>

          <div className="rounded-2xl border border-red-500/20 bg-zinc-950 p-6 hover:border-red-500">

            <CreditCard
              size={40}
              className="text-red-500"
            />

            <p className="mt-4 text-zinc-400">
              Revenue
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              ₱52,000
            </h3>

          </div>

        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-zinc-950 p-6">

          <h3 className="mb-5 text-2xl font-bold text-red-500">
            Recent Activity
          </h3>

          <div className="space-y-3">

            <div className="rounded-lg bg-zinc-900 p-4">
              ✅ New booking created
            </div>

            <div className="rounded-lg bg-zinc-900 p-4">
              ✅ Passenger registered
            </div>

            <div className="rounded-lg bg-zinc-900 p-4">
              ✅ Flight schedule updated
            </div>

            <div className="rounded-lg bg-zinc-900 p-4">
              ✅ Payment received
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
