import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold text-red-500">
        Flight Booking System
      </h1>

      <p className="mt-4 text-zinc-400">
        NextJS + NestJS Authentication
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-red-600 px-6 py-3"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg border border-red-500 px-6 py-3"
        >
          Register
        </Link>
      </div>
    </main>
  );
}