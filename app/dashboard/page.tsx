
"use client";

import { useEffect, useState } from "react";
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

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Flights", icon: Plane },
  { name: "Passengers", icon: Users },
  { name: "Bookings", icon: Ticket },
  { name: "Payments", icon: CreditCard },
];

const stats = [
  {
    title: "Total Flights",
    value: "120",
    note: "Sample dashboard data",
    icon: Plane,
  },
  {
    title: "Passengers",
    value: "450",
    note: "Sample dashboard data",
    icon: Users,
  },
  {
    title: "Bookings",
    value: "210",
    note: "Sample dashboard data",
    icon: Ticket,
  },
  {
    title: "Total Revenue",
    value: "₱52,000",
    note: "Sample dashboard data",
    icon: CreditCard,
  },
];

const activities = [
  {
    activity: "Flight scheduled",
    details: "Manila → Cebu",
    status: "Scheduled",
    type: "success",
  },
  {
    activity: "New booking",
    details: "Booking #BK-102",
    status: "Confirmed",
    type: "success",
  },
  {
    activity: "Passenger registration",
    details: "New passenger account",
    status: "Pending",
    type: "pending",
  },
  {
    activity: "Payment received",
    details: "Payment #PAY-204",
    status: "Confirmed",
    type: "success",
  },
];

function getUsername(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(atob(normalized));

    return decoded;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();

  const [username, setUsername] = useState("Administrator");
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const payload = getUsername(token);

      const expired =
        !!payload?.exp &&
        payload.exp * 1000 <= Date.now();

      if (!payload?.username || expired) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.replace("/login");
        return;
      }

      // Only update state if valid
      setUsername(payload.username);
      setLoading(false);
    };

    // Defer state update to avoid cascading renders
    setTimeout(checkAuth, 0);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="fs-dashboard flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-400">
          Loading FlightSys...
        </p>
      </div>
    );
  }

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

          <div className="fs-avatar">
            {String(username).charAt(0).toUpperCase()}
          </div>

          <button
            className="fs-logout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
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
            FlightSys Dashboard
          </div>
        </section>

        {/* NAVIGATION */}
        <nav className="mb-7 flex flex-wrap items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
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

        {activePage === "Dashboard" ? (
          <>
            {/* STATISTICS */}
            <section className="fs-stats-grid">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div className="fs-stat-card" key={stat.title}>
                    <div className="fs-stat-top">
                      <span className="fs-stat-label">
                        {stat.title}
                      </span>

                      <div className="fs-stat-icon">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="fs-stat-value">
                      {stat.value}
                    </div>

                    <p className="fs-stat-note">
                      {stat.note}
                    </p>
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
                    <h2 className="fs-panel-title">
                      Recent Activity
                    </h2>
                    <p className="fs-panel-description">
                      Latest airline management activities
                    </p>
                  </div>

                  <span className="fs-panel-action">
                    ACTIVITY
                  </span>
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
                      {activities.map((item, index) => (
                        <tr key={index}>
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
                      <h2 className="fs-panel-title">
                        Quick Information
                      </h2>
                      <p className="fs-panel-description">
                        System overview
                      </p>
                    </div>
                  </div>

                  <div className="fs-info-list">
                    <div className="fs-info-row">
                      <div className="fs-info-left">
                        <div className="fs-info-icon">
                          <Plane size={16} />
                        </div>
                        Flight Schedule
                      </div>
                      <span className="fs-info-value">120</span>
                    </div>

                    <div className="fs-info-row">
                      <div className="fs-info-left">
                        <div className="fs-info-icon">
                          <Users size={16} />
                        </div>
                        Passengers
                      </div>
                      <span className="fs-info-value">450</span>
                    </div>

                    <div className="fs-info-row">
                      <div className="fs-info-left">
                        <div className="fs-info-icon">
                          <Ticket size={16} />
                        </div>
                        Bookings
                      </div>
                      <span className="fs-info-value">210</span>
                    </div>
                  </div>
                </div>

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
                    You are signed in as {username}.
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
                    FlightSys management interface.
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
          <section className="fs-panel fs-dashboard-empty">
            {(() => {
              const selected = menuItems.find(
                (item) => item.name === activePage
              );

              const Icon = selected?.icon || LayoutDashboard;

              return (
                <Icon
                  size={42}
                  style={{
                    color: "#ff2442",
                    margin: "0 auto 18px",
                  }}
                />
              );
            })()}

            <h2>{activePage}</h2>

            <p>
              The {activePage.toLowerCase()} module is ready for
              development. Backend integration is still needed.
            </p>

            <button
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
