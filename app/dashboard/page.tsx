"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Users,
  Ticket,
  CreditCard,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  ShieldCheck,
  Globe2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

type UserRole = "Admin" | "Passenger" | "user";

type AuthenticatedUser = {
  id: number | string;
  username: string;
  role: UserRole;
  exp?: number; // seconds since epoch
};

type TokenPayload = {
  sub?: number | string;
  id?: number | string;
  userId?: number | string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
};

const menuItems: {
  name: string;
  icon: typeof Plane;
  roles?: UserRole[]; // omit = visible to everyone
}[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Flights", icon: Plane },
  { name: "Passengers", icon: Users, roles: ["Admin"] },
  { name: "Bookings", icon: Ticket },
  { name: "Payments", icon: CreditCard },
];

const stats = [
  { title: "Total Flights", value: "120", icon: Plane },
  { title: "Passengers", value: "450", icon: Users },
  { title: "Bookings", value: "210", icon: Ticket },
  { title: "Total Revenue", value: "₱52,000", icon: CreditCard },
];

const SAMPLE_NOTE = "Sample dashboard data";

const activities = [
  {
    id: "flight-scheduled",
    activity: "Flight scheduled",
    details: "Manila → Cebu",
    status: "Scheduled",
    type: "success",
  },
  {
    id: "new-booking",
    activity: "New booking",
    details: "Booking #BK-102",
    status: "Confirmed",
    type: "success",
  },
  {
    id: "passenger-registration",
    activity: "Passenger registration",
    details: "New passenger account",
    status: "Pending",
    type: "pending",
  },
  {
    id: "payment-received",
    activity: "Payment received",
    details: "Payment #PAY-204",
    status: "Confirmed",
    type: "success",
  },
];

// NOTE: this only decodes the payload for UI purposes. It does NOT verify the
// signature, so never rely on it for security. The backend must verify the
// token and enforce roles on every request.
function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      Math.ceil(normalized.length / 4) * 4,
      "="
    );

    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload;
  } catch {
    return null;
  }
}

function normalizeRole(role?: string): UserRole | null {
  switch (role?.toLowerCase()) {
    case "admin":
      return "Admin";
    case "passenger":
      return "Passenger";
    case "user":
      return "user";
    default:
      return null;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("flightsys_demo_session");
}

function getAuthenticatedUser(token: string): AuthenticatedUser | null {
  const payload = decodeToken(token);

  if (!payload) {
    console.warn("Dashboard: token could not be decoded");
    return null;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    console.warn("Dashboard: token expired");
    return null;
  }

  const id = payload.sub ?? payload.id ?? payload.userId;
  const username = payload.username ?? payload.name ?? payload.email;
  const role = normalizeRole(payload.role);

  if (id === undefined || id === "" || !username || !role) {
    console.warn("Dashboard: token payload rejected", payload);
    return null;
  }

  return { id, username: String(username), role, exp: payload.exp };
}

export default function DashboardPage() {
  const router = useRouter();

  const [activePage, setActivePage] = useState("Dashboard");
  const [loggingOut, setLoggingOut] = useState(false);

  // Read the token from localStorage without setState-in-effect.
  // undefined = still hydrating (server snapshot), null = no token.
  const token = useSyncExternalStore<string | null | undefined>(
    subscribeToStorage,
    () => localStorage.getItem("token"),
    () => undefined
  );

  const auth = useMemo<AuthenticatedUser | null>(
    () => (token ? getAuthenticatedUser(token) : null),
    [token]
  );

  // Redirect or sync the stored user once the token has been read
  useEffect(() => {
    if (token === undefined) return; // not hydrated yet

    if (!auth) {
      clearSession();
      router.replace("/login");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: auth.id,
        username: auth.username,
        role: auth.role,
      })
    );
  }, [token, auth, router]);

  // Log the user out automatically when the token expires while the page is open
  useEffect(() => {
    if (!auth?.exp) return;

    const msLeft = auth.exp * 1000 - Date.now();
    // setTimeout overflows above ~24.8 days; clamp so it never fires instantly
    const delay = Math.min(Math.max(msLeft, 0), 2_147_483_647);

    const timer = window.setTimeout(() => {
      clearSession();
      router.replace("/login");
    }, delay);

    return () => window.clearTimeout(timer);
  }, [auth, router]);

  const handleLogout = useCallback(async () => {
    if (loggingOut || !auth) return;

    setLoggingOut(true);

    const token = localStorage.getItem("token");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Don't let a slow or unreachable API trap the user on the page
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    try {
      if (API_URL && token) {
        await fetch(`${API_URL.replace(/\/+$/, "")}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: auth.id }),
          signal: controller.signal,
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      window.clearTimeout(timeout);
      clearSession();
      router.replace("/login");
    }
  }, [auth, loggingOut, router]);

  if (!auth) {
    return (
      <div className="fs-dashboard flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-400">Loading FlightSys...</p>
      </div>
    );
  }

  const { username, role } = auth;

  const visibleMenu = menuItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  // Fall back to Dashboard if the selected page isn't allowed for this role
  const currentPage = visibleMenu.some((i) => i.name === activePage)
    ? activePage
    : "Dashboard";

  const quickInfo = stats.filter((s) =>
    ["Total Flights", "Passengers", "Bookings"].includes(s.title)
  );

  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fs-dashboard">
      {/* TOP NAVIGATION */}
      <header className="fs-topbar">
        <div className="fs-brand">
          <div className="fs-brand-icon">
            <Plane size={23} />
          </div>

          <div className="fs-brand-name">
            FLIGHT<span>SYS</span>
          </div>
        </div>

        <div className="fs-topbar-right">
          <div className="fs-user-label">
            Welcome,
            <span className="fs-user-name">{username}</span>
          </div>

          <div className="fs-avatar">{username.charAt(0).toUpperCase()}</div>

          <button
            type="button"
            className="fs-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={15} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="fs-dashboard-content">
        {/* PAGE HEADING */}
        <section className="fs-dashboard-heading">
          <div>
            <div className="fs-eyebrow">
              <span className="fs-eyebrow-dot" />
              YOUR AIRLINE MANAGEMENT SYSTEM
            </div>

            <h1 className="fs-dashboard-title">
              Welcome <span>Back.</span>
            </h1>

            <p className="fs-dashboard-subtitle">
              Manage your flights, passengers, bookings, and payments
              <br className="hidden sm:block" />
              all in one place with FlightSys.
            </p>
          </div>

          <div className="fs-date-label">
            <CalendarDays
              size={15}
              style={{
                display: "inline",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            {today}
          </div>
        </section>

        {/* NAVIGATION */}
        <nav
          aria-label="Dashboard sections"
          className="mb-7 flex flex-wrap items-center gap-2"
        >
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.name;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => setActivePage(item.name)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition ${
                  active
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-red-500/40 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* DASHBOARD PAGE */}
        {currentPage === "Dashboard" ? (
          <>
            {/* STATISTICS */}
            <section className="fs-stats-grid">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div className="fs-stat-card" key={stat.title}>
                    <div className="fs-stat-top">
                      <span className="fs-stat-label">{stat.title}</span>

                      <div className="fs-stat-icon">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="fs-stat-value">{stat.value}</div>

                    <p className="fs-stat-note">{SAMPLE_NOTE}</p>
                  </div>
                );
              })}
            </section>

            {/* MAIN DASHBOARD GRID */}
            <section className="fs-dashboard-grid">
              {/* RECENT ACTIVITY */}
              <div className="fs-panel">
                <div className="fs-panel-header">
                  <div>
                    <h2 className="fs-panel-title">Recent Activity</h2>

                    <p className="fs-panel-description">
                      Latest airline management activities
                    </p>
                  </div>

                  <span className="fs-panel-action">ACTIVITY</span>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {activities.map((item) => (
                        <tr key={item.id}>
                          <td>{item.activity}</td>
                          <td>{item.details}</td>
                          <td>
                            <span
                              className={`fs-status ${
                                item.type === "success"
                                  ? "fs-status-success"
                                  : "fs-status-pending"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SIDE INFORMATION */}
              <div className="fs-side-stack">
                <div className="fs-panel">
                  <div className="fs-panel-header">
                    <div>
                      <h2 className="fs-panel-title">Quick Information</h2>
                      <p className="fs-panel-description">System overview</p>
                    </div>
                  </div>

                  <div className="fs-info-list">
                    {quickInfo.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div className="fs-info-row" key={item.title}>
                          <div className="fs-info-left">
                            <div className="fs-info-icon">
                              <Icon size={16} />
                            </div>
                            {item.title === "Total Flights"
                              ? "Flight Schedule"
                              : item.title}
                          </div>

                          <span className="fs-info-value">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SYSTEM INFORMATION */}
                <div className="fs-panel fs-system-card">
                  <div className="fs-system-heading">
                    <span className="fs-system-indicator" />
                    System Information
                  </div>

                  <p className="fs-system-text">
                    <ShieldCheck
                      size={14}
                      style={{
                        display: "inline",
                        marginRight: "7px",
                        verticalAlign: "middle",
                      }}
                    />
                    Signed in as {username}.
                  </p>

                  <p className="fs-system-text">
                    <Globe2
                      size={14}
                      style={{
                        display: "inline",
                        marginRight: "7px",
                        verticalAlign: "middle",
                      }}
                    />
                    Role: {role}
                  </p>

                  <p className="fs-system-text">
                    <Clock
                      size={14}
                      style={{
                        display: "inline",
                        marginRight: "7px",
                        verticalAlign: "middle",
                      }}
                    />
                    Dashboard session active.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* OTHER MODULES */
          <section className="fs-panel fs-dashboard-empty">
            {(() => {
              const selected = menuItems.find((i) => i.name === currentPage);
              const Icon = selected?.icon ?? LayoutDashboard;

              return (
                <Icon
                  size={42}
                  style={{ color: "#ff2442", margin: "0 auto 18px" }}
                />
              );
            })()}

            <h2>{currentPage}</h2>

            <p>
              The {currentPage.toLowerCase()} module is ready for backend
              integration.
            </p>

            <button
              type="button"
              className="fs-back-button"
              onClick={() => setActivePage("Dashboard")}
            >
              Back to Dashboard
              <ArrowUpRight
                size={14}
                style={{
                  display: "inline",
                  marginLeft: "7px",
                  verticalAlign: "middle",
                }}
              />
            </button>
          </section>
        )}

        {/* FOOTER */}
        <footer className="fs-footer">
          <p>© 2026 FlightSys. All rights reserved.</p>
          <p>Airline Management System</p>
        </footer>
      </main>
    </div>
  );
}