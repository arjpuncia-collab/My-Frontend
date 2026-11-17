"use client";

import { useState, useEffect, useMemo, type MouseEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type TabType = "Dashboard" | "Flights" | "Passengers" | "Bookings" | "Payments" | "Users";

interface BaseRecord {
  id: number | string;
}

interface Flight extends BaseRecord {
  flightNumber: string;
  route: string;
  departure: string;
  gate: string;
  status: "On Time" | "Boarding" | "Delayed";
  seats: number;
  basePrice: number;
}

interface Passenger extends BaseRecord {
  fullName: string;
  email: string;
  phone: string;
  passportNo: string;
  nationality: string;
}

interface Booking extends BaseRecord {
  bookingRef: string;
  passengerName: string;
  flightNumber: string;
  seatNo: string;
  seatClass: "Economy" | "Business" | "First Class";
  status: "Confirmed" | "Pending" | "Cancelled";
}

interface Payment extends BaseRecord {
  transactionId: string;
  bookingRef: string;
  amount: number;
  method: "Credit Card" | "GCash" | "Maya" | "Bank Transfer" | "Cash"; // Idinagdag ang Cash dito
  status: "Paid" | "Pending" | "Refunded";
  paidAt: string;
}

interface SystemUser extends BaseRecord {
  username: string;
  password?: string;
  role: "user" | "staff" | "admin";
}

interface AuditLog {
  id: number;
  method: "GET" | "POST" | "PUT" | "DELETE";
  module: string;
  description: string;
  timestamp: string;
}

const DEFAULT_FLIGHTS: Flight[] = [
  { id: 1, flightNumber: "SK-802", route: "Manila → Cebu", departure: "08:30 AM", gate: "G-04", status: "On Time", seats: 180, basePrice: 4500 },
  { id: 2, flightNumber: "SK-415", route: "Davao → Manila", departure: "11:15 AM", gate: "G-11", status: "Boarding", seats: 150, basePrice: 5200 },
  { id: 3, flightNumber: "SK-910", route: "Cebu → Tokyo", departure: "03:45 PM", gate: "I-02", status: "Delayed", seats: 240, basePrice: 18500 },
  { id: 4, flightNumber: "SK-204", route: "Naga → Manila", departure: "05:10 PM", gate: "G-02", status: "On Time", seats: 120, basePrice: 3400 },
];

const DEFAULT_PASSENGERS: Passenger[] = [
  { id: 1, fullName: "Juan Dela Cruz", email: "juan@email.com", phone: "+63 917 555 0101", passportNo: "P1234567A", nationality: "Filipino" },
  { id: 2, fullName: "Maria Santos", email: "maria@email.com", phone: "+63 918 555 0202", passportNo: "P9876543B", nationality: "Filipino" },
  { id: 3, fullName: "Kenji Takahashi", email: "kenji@tokyo.jp", phone: "+81 90 1234 5678", passportNo: "TZ4491029", nationality: "Japanese" },
];

const DEFAULT_BOOKINGS: Booking[] = [
  { id: 1, bookingRef: "BK-102", passengerName: "Juan Dela Cruz", flightNumber: "SK-802", seatNo: "12A", seatClass: "Economy", status: "Confirmed" },
  { id: 2, bookingRef: "BK-103", passengerName: "Maria Santos", flightNumber: "SK-415", seatNo: "02C", seatClass: "Business", status: "Pending" },
  { id: 3, bookingRef: "BK-104", passengerName: "Kenji Takahashi", flightNumber: "SK-910", seatNo: "01A", seatClass: "First Class", status: "Confirmed" },
];

const DEFAULT_PAYMENTS: Payment[] = [
  { id: 1, transactionId: "TXN-8801", bookingRef: "BK-102", amount: 4500, method: "GCash", status: "Paid", paidAt: "Nov 17, 2026" },
  { id: 2, transactionId: "TXN-8802", bookingRef: "BK-103", amount: 10400, method: "Credit Card", status: "Pending", paidAt: "Nov 17, 2026" },
  { id: 3, transactionId: "TXN-8803", bookingRef: "BK-104", amount: 37000, method: "Cash", status: "Paid", paidAt: "Nov 17, 2026" },
];

const DEFAULT_USERS: SystemUser[] = [
  { id: 9, username: "press", role: "user" },
  { id: 8, username: "LhynP", role: "user" },
  { id: 6, username: "strawbelei", role: "user" },
  { id: 5, username: "bienmabangog", role: "user" },
  { id: 4, username: "buluboy", role: "user" },
  { id: 3, username: "ivan", role: "user" },
  { id: 2, username: "arvin", role: "user" },
  { id: 1, username: "fimperial", role: "admin" },
];

function cleanSequentialIds<T extends BaseRecord>(items: T[]): T[] {
  const usedIds = new Set<number>();
  let maxValidId = 0;

  for (const item of items) {
    const n = Number(item.id);
    if (!Number.isNaN(n) && n > 0 && n < 100000) {
      maxValidId = Math.max(maxValidId, n);
    }
  }

  return items.map((item) => {
    const n = Number(item.id);
    if (!Number.isNaN(n) && n > 0 && n < 100000 && !usedIds.has(n)) {
      usedIds.add(n);
      return { ...item, id: n };
    }
    maxValidId += 1;
    usedIds.add(maxValidId);
    return { ...item, id: maxValidId };
  });
}

export default function FlightSysFullDashboard() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");

  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 1, method: "GET", module: "System", description: "System ready. All modules loaded.", timestamp: "Just now" },
  ]);

  const [editId, setEditId] = useState<number | string | null>(null);

  const [flightNumber, setFlightNumber] = useState("");
  const [route, setRoute] = useState("Manila → Cebu");
  const [departure, setDeparture] = useState("");
  const [gate, setGate] = useState("G-01");
  const [flightStatus, setFlightStatus] = useState<Flight["status"]>("On Time");
  const [seats, setSeats] = useState("180");
  const [basePrice, setBasePrice] = useState("4500");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("Filipino");

  const [bookingPassenger, setBookingPassenger] = useState("");
  const [bookingFlight, setBookingFlight] = useState("SK-802");
  const [seatNo, setSeatNo] = useState("14B");
  const [seatClass, setSeatClass] = useState<Booking["seatClass"]>("Economy");
  const [bookingStatus, setBookingStatus] = useState<Booking["status"]>("Confirmed");

  const [payBookingRef, setPayBookingRef] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<Payment["method"]>("Cash");
  const [payStatus, setPayStatus] = useState<Payment["status"]>("Paid");

  const [newUsername, setNewUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newRole, setNewRole] = useState<SystemUser["role"]>("user");

  const notify = (text: string, type: "ok" | "err" = "ok") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  const pushAuditLog = (method: AuditLog["method"], module: string, description: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setAuditLogs((prev) => [{ id: Date.now(), method, module, description, timestamp: now }, ...prev.slice(0, 14)]);
  };

  // Secure token & session validation on load
  useEffect(() => {
    const activeUser = localStorage.getItem("flightsys:activeUser");
    const accessToken = localStorage.getItem("flightsys:token");

    if (!accessToken || !activeUser) {
      router.replace("/login");
      return;
    }

    try {
      setCurrentUser(JSON.parse(activeUser));
    } catch {
      router.replace("/login");
      return;
    }

    loadAllData();

    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === "flightsys:users") {
        loadAllData();
      }
    };
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, [router]);

  async function fetchWithFallback<T extends BaseRecord>(
    endpoint: string,
    storageKey: string,
    defaultData: T[],
    normalizer: (raw: Record<string, unknown>, idx: number) => T
  ): Promise<T[]> {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, { method: "GET" });
      if (!res.ok) throw new Error("Offline");
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = cleanSequentialIds(
          data.map((item, idx) => normalizer(item as Record<string, unknown>, idx))
        );
        localStorage.setItem(storageKey, JSON.stringify(normalized));
        return normalized;
      }
      throw new Error("Invalid format");
    } catch {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const normalized = cleanSequentialIds(
              parsed.map((item, idx) => normalizer(item as Record<string, unknown>, idx))
            );
            localStorage.setItem(storageKey, JSON.stringify(normalized));
            return normalized;
          }
        } catch {
          return defaultData;
        }
      }
      localStorage.setItem(storageKey, JSON.stringify(defaultData));
      return defaultData;
    }
  }

  const loadAllData = async (manual = false) => {
    setIsRefreshing(true);
    const [fData, pData, bData, payData, uData] = await Promise.all([
      fetchWithFallback<Flight>("flights", "flightsys:flights", DEFAULT_FLIGHTS, (raw, idx) => ({
        id: (raw.id as number | string) ?? idx + 1,
        flightNumber: String(raw.flightNumber ?? raw.flight_number ?? `SK-${800 + idx}`),
        route: String(raw.route ?? raw.destination ?? "Manila → Cebu"),
        departure: String(raw.departure ?? raw.time ?? "08:30 AM"),
        gate: String(raw.gate ?? "G-01"),
        status: (["On Time", "Boarding", "Delayed"].includes(String(raw.status))
          ? raw.status
          : "On Time") as Flight["status"],
        seats: Number(raw.seats ?? 180),
        basePrice: Number(raw.basePrice ?? 4500),
      })),
      fetchWithFallback<Passenger>("passengers", "flightsys:passengers", DEFAULT_PASSENGERS, (raw, idx) => ({
        id: (raw.id as number | string) ?? idx + 1,
        fullName: String(raw.fullName ?? raw.name ?? "Unnamed Passenger"),
        email: String(raw.email ?? "passenger@email.com"),
        phone: String(raw.phone ?? "+63 900 000 0000"),
        passportNo: String(raw.passportNo ?? "P0000000A"),
        nationality: String(raw.nationality ?? "Filipino"),
      })),
      fetchWithFallback<Booking>("bookings", "flightsys:bookings", DEFAULT_BOOKINGS, (raw, idx) => ({
        id: (raw.id as number | string) ?? idx + 1,
        bookingRef: String(raw.bookingRef ?? `BK-${100 + idx}`),
        passengerName: String(raw.passengerName ?? "Guest Passenger"),
        flightNumber: String(raw.flightNumber ?? "SK-802"),
        seatNo: String(raw.seatNo ?? "12A"),
        seatClass: (["Economy", "Business", "First Class"].includes(String(raw.seatClass))
          ? raw.seatClass
          : "Economy") as Booking["seatClass"],
        status: (["Confirmed", "Pending", "Cancelled"].includes(String(raw.status))
          ? raw.status
          : "Confirmed") as Booking["status"],
      })),
      fetchWithFallback<Payment>("payments", "flightsys:payments", DEFAULT_PAYMENTS, (raw, idx) => ({
        id: (raw.id as number | string) ?? idx + 1,
        transactionId: String(raw.transactionId ?? `TXN-${8800 + idx}`),
        bookingRef: String(raw.bookingRef ?? "BK-102"),
        amount: Number(String(raw.amount ?? 4500).replace(/[^0-9.]/g, "")) || 4500,
        method: (["Credit Card", "GCash", "Maya", "Bank Transfer", "Cash"].includes(String(raw.method))
          ? raw.method
          : "Cash") as Payment["method"],
        status: (["Paid", "Pending", "Refunded"].includes(String(raw.status))
          ? raw.status
          : "Paid") as Payment["status"],
        paidAt: String(raw.paidAt ?? "Nov 17, 2026"),
      })),
      fetchWithFallback<SystemUser>("users", "flightsys:users", DEFAULT_USERS, (raw, idx) => ({
        id: (raw.id as number | string) ?? idx + 1,
        username: String(raw.username ?? `user_${idx + 1}`),
        password: raw.password ? String(raw.password) : undefined,
        role: (["user", "staff", "admin"].includes(String(raw.role))
          ? raw.role
          : "user") as SystemUser["role"],
      })),
    ]);

    setFlights(fData);
    setPassengers(pData);
    setBookings(bData);
    setPayments(payData);
    setUsers(uData);

    if (manual) {
      setSearchQuery("");
      setStatusFilter("ALL");
      resetForms();
      pushAuditLog("GET", "Dashboard", "Refreshed all module records");
      notify("Dashboard refreshed!");
    }

    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleResetDemoData = () => {
    if (!confirm("Reset all demo records back to default sample data?")) return;
    localStorage.setItem("flightsys:flights", JSON.stringify(DEFAULT_FLIGHTS));
    localStorage.setItem("flightsys:passengers", JSON.stringify(DEFAULT_PASSENGERS));
    localStorage.setItem("flightsys:bookings", JSON.stringify(DEFAULT_BOOKINGS));
    localStorage.setItem("flightsys:payments", JSON.stringify(DEFAULT_PAYMENTS));
    localStorage.setItem("flightsys:users", JSON.stringify(DEFAULT_USERS));
    setFlights(DEFAULT_FLIGHTS);
    setPassengers(DEFAULT_PASSENGERS);
    setBookings(DEFAULT_BOOKINGS);
    setPayments(DEFAULT_PAYMENTS);
    setUsers(DEFAULT_USERS);
    pushAuditLog("PUT", "System", "Reset database to default sample data");
    notify("Demo database restored to defaults!");
  };

  const exportToCSV = (filename: string, rows: Record<string, unknown>[]) => {
    if (!rows.length) {
      notify("No records available to export.", "err");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((field) => `"${String(row[field] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Exported ${filename}.csv`);
  };

  async function saveRecord<T extends BaseRecord>(
    endpoint: string,
    storageKey: string,
    list: T[],
    setList: (items: T[]) => void,
    payload: Omit<T, "id">,
    successText: string,
    moduleLabel: string
  ) {
    if (editId !== null) {
      try {
        await fetch(`${API_URL}/${endpoint}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // Local fallback
      }

      const updated = list.map((item) => (item.id === editId ? ({ ...item, ...payload } as T) : item));
      setList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setEditId(null);
      pushAuditLog("PUT", moduleLabel, `Updated record #${editId}`);
      notify("Record successfully updated!");
    } else {
      const maxId = list.reduce((max, item) => {
        const n = Number(item.id);
        return !Number.isNaN(n) && n < 100000 ? Math.max(max, n) : max;
      }, 0);
      const nextId = maxId + 1;

      let createdItem = { id: nextId, ...payload } as T;
      try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: nextId, ...payload }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.id && Number(data.id) < 100000) {
            createdItem = data;
          }
        }
      } catch {
        // Local fallback
      }

      const updated = [createdItem, ...list];
      setList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      pushAuditLog("POST", moduleLabel, `Created new record #${createdItem.id}`);
      notify(successText);
    }
  }

  async function deleteRecord<T extends BaseRecord>(
    endpoint: string,
    storageKey: string,
    list: T[],
    setList: (items: T[]) => void,
    id: number | string,
    moduleLabel: string
  ) {
    try {
      await fetch(`${API_URL}/${endpoint}/${id}`, { method: "DELETE" });
    } catch {
      // Local fallback
    }

    const updated = list.filter((item) => item.id !== id);
    setList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (editId === id) {
      resetForms();
    }
    pushAuditLog("DELETE", moduleLabel, `Removed record #${id}`);
    notify("Record removed.");
  }

  const cycleFlightStatus = async (flight: Flight) => {
    const order: Flight["status"][] = ["On Time", "Boarding", "Delayed"];
    const nextStatus = order[(order.indexOf(flight.status) + 1) % order.length];
    try {
      await fetch(`${API_URL}/flights/${flight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...flight, status: nextStatus }),
      });
    } catch {
      // Local fallback
    }

    const updated = flights.map((f) => (f.id === flight.id ? { ...f, status: nextStatus } : f));
    setFlights(updated);
    localStorage.setItem("flightsys:flights", JSON.stringify(updated));
    pushAuditLog("PUT", "Flights", `${flight.flightNumber} marked as ${nextStatus}`);
    notify(`${flight.flightNumber} status → ${nextStatus}`);
  };

  const cycleBookingStatus = async (booking: Booking) => {
    const order: Booking["status"][] = ["Confirmed", "Pending", "Cancelled"];
    const nextStatus = order[(order.indexOf(booking.status) + 1) % order.length];
    try {
      await fetch(`${API_URL}/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, status: nextStatus }),
      });
    } catch {
      // Local fallback
    }

    const updated = bookings.map((b) => (b.id === booking.id ? { ...b, status: nextStatus } : b));
    setBookings(updated);
    localStorage.setItem("flightsys:bookings", JSON.stringify(updated));
    pushAuditLog("PUT", "Bookings", `${booking.bookingRef} marked as ${nextStatus}`);
    notify(`${booking.bookingRef} status → ${nextStatus}`);
  };

  const cyclePaymentStatus = async (payment: Payment) => {
    const order: Payment["status"][] = ["Paid", "Pending", "Refunded"];
    const nextStatus = order[(order.indexOf(payment.status) + 1) % order.length];
    try {
      await fetch(`${API_URL}/payments/${payment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payment, status: nextStatus }),
      });
    } catch {
      // Local fallback
    }

    const updated = payments.map((p) => (p.id === payment.id ? { ...p, status: nextStatus } : p));
    setPayments(updated);
    localStorage.setItem("flightsys:payments", JSON.stringify(updated));
    pushAuditLog("PUT", "Payments", `${payment.transactionId} marked as ${nextStatus}`);
    notify(`${payment.transactionId} status → ${nextStatus}`);
  };

  const resetForms = () => {
    setEditId(null);
    setFlightNumber("");
    setDeparture("");
    setGate("G-01");
    setSeats("180");
    setBasePrice("4500");
    setFullName("");
    setEmail("");
    setPhone("");
    setPassportNo("");
    setBookingPassenger("");
    setSeatNo("14B");
    setPayBookingRef("");
    setPayAmount("");
    setNewUsername("");
    setTempPassword("");
    setNewRole("user");
  };

  const handleTabSwitch = (tab: TabType) => {
    resetForms();
    setSearchQuery("");
    setStatusFilter("ALL");
    setActiveTab(tab);
    if (tab === "Users") {
      loadAllData();
    }
  };

  const handleFlightSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!flightNumber || !departure) return;
    saveRecord<Flight>(
      "flights",
      "flightsys:flights",
      flights,
      setFlights,
      {
        flightNumber: flightNumber.toUpperCase(),
        route,
        departure,
        gate: gate.toUpperCase(),
        status: flightStatus,
        seats: Number(seats) || 150,
        basePrice: Number(basePrice) || 4500,
      },
      "Flight added!",
      "Flights"
    );
    resetForms();
  };

  const handlePassengerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !passportNo) return;
    saveRecord<Passenger>(
      "passengers",
      "flightsys:passengers",
      passengers,
      setPassengers,
      {
        fullName,
        email,
        phone: phone || "+63 900 000 0000",
        passportNo: passportNo.toUpperCase(),
        nationality,
      },
      "Passenger registered!",
      "Passengers"
    );
    resetForms();
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingPassenger) return;
    const existing = bookings.find((b) => b.id === editId);
    const newRef = existing ? existing.bookingRef : `BK-${Math.floor(100 + Math.random() * 899)}`;

    saveRecord<Booking>(
      "bookings",
      "flightsys:bookings",
      bookings,
      setBookings,
      {
        bookingRef: newRef,
        passengerName: bookingPassenger,
        flightNumber: bookingFlight,
        seatNo: seatNo.toUpperCase(),
        seatClass,
        status: bookingStatus,
      },
      `Booking ${newRef} created!`,
      "Bookings"
    );
    resetForms();
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!payBookingRef || !payAmount) return;
    const existing = payments.find((p) => p.id === editId);
    saveRecord<Payment>(
      "payments",
      "flightsys:payments",
      payments,
      setPayments,
      {
        transactionId: existing ? existing.transactionId : `TXN-${Math.floor(1000 + Math.random() * 8999)}`,
        bookingRef: payBookingRef.toUpperCase(),
        amount: Number(payAmount),
        method: payMethod,
        status: payStatus,
        paidAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      "Payment recorded!",
      "Payments"
    );
    resetForms();
  };

  const handleUserSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    const existingUser = users.find((u) => u.id === editId);
    saveRecord<SystemUser>(
      "users",
      "flightsys:users",
      users,
      setUsers,
      {
        username: newUsername.trim(),
        password: tempPassword || existingUser?.password,
        role: newRole,
      },
      "System account created!",
      "Users"
    );
    resetForms();
  };

  const handleSelectBookingForPayment = (ref: string) => {
    setPayBookingRef(ref);
    const foundBooking = bookings.find((b) => (b.bookingRef || "").toLowerCase() === ref.toLowerCase());
    if (foundBooking) {
      const foundFlight = flights.find((f) => f.flightNumber === foundBooking.flightNumber);
      const base = foundFlight ? foundFlight.basePrice : 4500;
      const multiplier =
        foundBooking.seatClass === "First Class" ? 2.5 : foundBooking.seatClass === "Business" ? 1.8 : 1;
      setPayAmount(String(Math.round(base * multiplier)));
    }
  };

  const filteredFlights = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return flights.filter((f) => {
      const fNum = (f.flightNumber || "").toLowerCase();
      const fRoute = (f.route || "").toLowerCase();
      const matchesSearch = fNum.includes(q) || fRoute.includes(q);
      const matchesStatus = statusFilter === "ALL" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [flights, searchQuery, statusFilter]);

  const filteredPassengers = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return passengers.filter((p) => {
      const pName = (p.fullName || "").toLowerCase();
      const pPass = (p.passportNo || "").toLowerCase();
      const pNat = (p.nationality || "").toLowerCase();
      return pName.includes(q) || pPass.includes(q) || pNat.includes(q);
    });
  }, [passengers, searchQuery]);

  const filteredBookings = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return bookings.filter((b) => {
      const bRef = (b.bookingRef || "").toLowerCase();
      const bPass = (b.passengerName || "").toLowerCase();
      const bFlight = (b.flightNumber || "").toLowerCase();
      const matchesSearch = bRef.includes(q) || bPass.includes(q) || bFlight.includes(q);
      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const filteredPayments = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return payments.filter((p) => {
      const pTxn = (p.transactionId || "").toLowerCase();
      const pRef = (p.bookingRef || "").toLowerCase();
      const pMethod = (p.method || "").toLowerCase();
      const matchesSearch = pTxn.includes(q) || pRef.includes(q) || pMethod.includes(q);
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  const filteredUsers = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return users.filter((u) => {
      const uName = (u.username || "").toLowerCase();
      const uId = String(u.id ?? "");
      const matchesSearch = uName.includes(q) || uId.includes(q);
      const matchesRole = statusFilter === "ALL" || u.role === statusFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, statusFilter]);

  // Updated Logout function removing token and session
  const handleLogout = () => {
    localStorage.removeItem("flightsys:activeUser");
    localStorage.removeItem("skyline:activeUser");
    localStorage.removeItem("flightsys:token");
    router.push("/login");
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingRevenue = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  if (!currentUser) return null;

  return (
    <div className="fs-page" onMouseMove={handleMouseMove}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        className="fs-spotlight"
        aria-hidden="true"
        style={{
          background: `radial-gradient(780px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 37, 58, 0.11), transparent 55%)`,
        }}
      />
      <div className="fs-orb fs-orb-left" aria-hidden="true" />
      <div className="fs-grid-bg" aria-hidden="true" />

      <header className="fs-header">
        <div className="fs-brand">
          <span className="fs-brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </span>
          <span className="fs-brand-name">
            SKY<span>LINE</span>
          </span>
        </div>

        <div className="fs-header-right">
          <button
            type="button"
            onClick={() => loadAllData(true)}
            className={`fs-refresh-btn ${isRefreshing ? "is-spinning" : ""}`}
            title="Reload all records and clear filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path
                d="M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <span className="fs-welcome-text">
            Welcome, <strong>{currentUser.username}</strong>
          </span>
          <span className="fs-avatar">{(currentUser.username || "U").charAt(0).toUpperCase()}</span>
          <button onClick={handleLogout} className="fs-logout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="fs-main">
        <div className="fs-container">
          <div className="fs-top-controls">
            <nav className="fs-stepper" aria-label="System Modules">
              <button
                className={`fs-step-pill ${activeTab === "Dashboard" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Dashboard")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>Dashboard</span>
              </button>

              <button
                className={`fs-step-pill ${activeTab === "Flights" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Flights")}
              >
                <span className="fs-step-num">01</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
                <span>Flights ({flights.length})</span>
              </button>

              <span className="fs-step-arrow">→</span>

              <button
                className={`fs-step-pill ${activeTab === "Passengers" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Passengers")}
              >
                <span className="fs-step-num">02</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Passengers ({passengers.length})</span>
              </button>

              <span className="fs-step-arrow">→</span>

              <button
                className={`fs-step-pill ${activeTab === "Bookings" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Bookings")}
              >
                <span className="fs-step-num">03</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2M13 17v2M13 11v2" />
                </svg>
                <span>Bookings ({bookings.length})</span>
              </button>

              <span className="fs-step-arrow">→</span>

              <button
                className={`fs-step-pill ${activeTab === "Payments" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Payments")}
              >
                <span className="fs-step-num">04</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Payments ({payments.length})</span>
              </button>

              <button
                className={`fs-step-pill ${activeTab === "Users" ? "is-active" : ""}`}
                onClick={() => handleTabSwitch("Users")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Users ({users.length})</span>
              </button>
            </nav>
          </div>

          {toast && (
            <div className={`fs-toast ${toast.type === "ok" ? "is-ok" : "is-err"}`}>
              {toast.text}
            </div>
          )}

          {activeTab === "Dashboard" && (
            <div className="fs-anim">
              <div className="fs-welcome-hero">
                <div className="fs-welcome-left">
                  <div className="fs-pill-badge">
                    <span className="fs-pill-dot" />
                    <span>YOUR AIRLINE MANAGEMENT SYSTEM</span>
                  </div>
                  <h1 className="fs-welcome-heading">
                    Welcome <span>Back.</span>
                  </h1>
                  <p className="fs-welcome-desc">
                    Manage your flights, passengers, bookings, and payments
                    <br />
                    all in one place with FlightSys.
                  </p>
                </div>

                <div className="fs-hero-actions">
                  <button type="button" onClick={() => handleTabSwitch("Bookings")} className="fs-primary-btn">
                    + Quick Book Flight
                  </button>
                  <button type="button" onClick={handleResetDemoData} className="fs-secondary-btn">
                    Reset Demo Data
                  </button>
                </div>
              </div>

              <div className="fs-stats-grid">
                <div className="fs-stat-card" onClick={() => handleTabSwitch("Flights")}>
                  <span className="fs-kicker">01 • SCHEDULE</span>
                  <div className="fs-stat-val">{flights.length}</div>
                  <div className="fs-stat-label">
                    {flights.filter((f) => f.status === "On Time").length} On Time •{" "}
                    {flights.filter((f) => f.status === "Delayed").length} Delayed
                  </div>
                </div>
                <div className="fs-stat-card" onClick={() => handleTabSwitch("Passengers")}>
                  <span className="fs-kicker">02 • MANIFEST</span>
                  <div className="fs-stat-val">{passengers.length}</div>
                  <div className="fs-stat-label">Verified Travelers</div>
                </div>
                <div className="fs-stat-card" onClick={() => handleTabSwitch("Bookings")}>
                  <span className="fs-kicker">03 • RESERVATIONS</span>
                  <div className="fs-stat-val">{bookings.length}</div>
                  <div className="fs-stat-label">
                    {bookings.filter((b) => b.status === "Confirmed").length} Confirmed Tickets
                  </div>
                </div>
                <div className="fs-stat-card" onClick={() => handleTabSwitch("Payments")}>
                  <span className="fs-kicker">04 • REVENUE</span>
                  <div className="fs-stat-val">₱{totalRevenue.toLocaleString()}</div>
                  <div className="fs-stat-label">₱{pendingRevenue.toLocaleString()} Pending</div>
                </div>
              </div>

              <div className="fs-guide-box">
                <div className="fs-guide-header">
                  <div>
                    <span className="fs-kicker">QUICK START GUIDE • HOW IT WORKS</span>
                    <h2 className="fs-guide-title">4-Step Airline Operations Workflow</h2>
                  </div>
                  <p className="fs-guide-sub">
                    Follow the sequence below to manage end-to-end flight operations, or click any step to open that module.
                  </p>
                </div>

                <div className="fs-guide-steps">
                  <div className="fs-guide-step" onClick={() => handleTabSwitch("Flights")}>
                    <div className="fs-guide-step-top">
                      <span className="fs-guide-num">STEP 01</span>
                      <span className="fs-guide-link">Open Flights →</span>
                    </div>
                    <h3>Schedule Flights</h3>
                    <p>
                      Set flight numbers (e.g. SK-802), routes, departure times, gates, and base ticket fares.
                    </p>
                  </div>

                  <div className="fs-guide-step" onClick={() => handleTabSwitch("Passengers")}>
                    <div className="fs-guide-step-top">
                      <span className="fs-guide-num">STEP 02</span>
                      <span className="fs-guide-link">Open Passengers →</span>
                    </div>
                    <h3>Register Passengers</h3>
                    <p>
                      Save traveler profiles including full name, email, contact number, and passport details.
                    </p>
                  </div>

                  <div className="fs-guide-step" onClick={() => handleTabSwitch("Bookings")}>
                    <div className="fs-guide-step-top">
                      <span className="fs-guide-num">STEP 03</span>
                      <span className="fs-guide-link">Open Bookings →</span>
                    </div>
                    <h3>Issue Bookings & Tickets</h3>
                    <p>
                      Assign passengers to flights, pick seat classes, and generate printable E-Ticket boarding passes.
                    </p>
                  </div>

                  <div className="fs-guide-step" onClick={() => handleTabSwitch("Payments")}>
                    <div className="fs-guide-step-top">
                      <span className="fs-guide-num">STEP 04</span>
                      <span className="fs-guide-link">Open Payments →</span>
                    </div>
                    <h3>Settle Payments</h3>
                    <p>
                      Enter a Booking Ref to auto-calculate the ticket fare and log transactions via Cash, GCash, or Card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="fs-dash-bottom">
                <div className="fs-card">
                  <div className="fs-card-header-row">
                    <div>
                      <span className="fs-kicker">LIVE RESERVATIONS FEED</span>
                      <h2 className="fs-card-title">Recent Ticket Bookings</h2>
                      <p className="fs-muted-note">
                        Tip: Click any status pill below to quickly cycle between Confirmed, Pending, and Cancelled.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportToCSV("flight_bookings", bookings as unknown as Record<string, unknown>[])}
                      className="fs-edit-btn"
                    >
                      ↓ Export CSV
                    </button>
                  </div>

                  <div className="fs-table-wrap">
                    <table className="fs-table">
                      <thead>
                        <tr>
                          <th>REF #</th>
                          <th>PASSENGER</th>
                          <th>FLIGHT</th>
                          <th>SEAT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td className="text-muted">#{b.bookingRef}</td>
                            <td className="font-bold text-white">{b.passengerName}</td>
                            <td>{b.flightNumber}</td>
                            <td>
                              <span className="fs-role-badge">
                                {b.seatNo} • {b.seatClass}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => cycleBookingStatus(b)}
                                className={`fs-status clickable ${(b.status || "confirmed").toLowerCase()}`}
                                title="Click to toggle status"
                              >
                                {b.status}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="fs-card">
                  <span className="fs-kicker">SYSTEM TELEMETRY</span>
                  <h2 className="fs-card-title">Recent Activity Log</h2>
                  <p className="fs-muted-note">
                    Every record you create, update, or remove is tracked here in real time.
                  </p>
                  <div className="fs-audit-list" style={{ marginTop: "14px" }}>
                    {auditLogs.map((log) => (
                      <div key={log.id} className="fs-audit-item">
                        <span className={`fs-method-tag ${log.method.toLowerCase()}`}>{log.method}</span>
                        <div className="fs-audit-info">
                          <strong>{log.module}:</strong> <span>{log.description}</span>
                          <small>{log.timestamp}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Flights" && (
            <div className="fs-split-grid fs-anim">
              <div className="fs-card fs-form-card">
                <span className="fs-kicker">01 • FLIGHT OPERATIONS</span>
                <h2 className="fs-card-title">{editId ? "Update Flight" : "Schedule New Flight"}</h2>
                <p className="fs-muted-note" style={{ marginBottom: "16px" }}>
                  Fill out the flight details below to add a new route to the active schedule.
                </p>

                <form onSubmit={handleFlightSubmit} className="fs-form">
                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Flight Number</span>
                      <input
                        type="text"
                        placeholder="e.g. SK-505"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        required
                      />
                    </label>
                    <label className="fs-field">
                      <span>Gate</span>
                      <input
                        type="text"
                        placeholder="G-04"
                        value={gate}
                        onChange={(e) => setGate(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  <label className="fs-field">
                    <span>Route</span>
                    <select value={route} onChange={(e) => setRoute(e.target.value)}>
                      <option value="Manila → Cebu">Manila → Cebu</option>
                      <option value="Davao → Manila">Davao → Manila</option>
                      <option value="Cebu → Tokyo">Cebu → Tokyo</option>
                      <option value="Naga → Manila">Naga → Manila</option>
                      <option value="Manila → Singapore">Manila → Singapore</option>
                    </select>
                  </label>

                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Departure</span>
                      <input
                        type="text"
                        placeholder="09:30 AM"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        required
                      />
                    </label>
                    <label className="fs-field">
                      <span>Base Fare (₱)</span>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Capacity Seats</span>
                      <input
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        required
                      />
                    </label>
                    <label className="fs-field">
                      <span>Status</span>
                      <select
                        value={flightStatus}
                        onChange={(e) => setFlightStatus(e.target.value as Flight["status"])}
                      >
                        <option value="On Time">On Time</option>
                        <option value="Boarding">Boarding</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </label>
                  </div>

                  <div className="fs-btn-row">
                    <button type="submit" className="fs-primary-btn">
                      {editId ? "Save Changes" : "Dispatch Flight"}
                    </button>
                    {editId && (
                      <button type="button" onClick={resetForms} className="fs-secondary-btn">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="fs-card fs-table-card">
                <div className="fs-card-header-row">
                  <div>
                    <span className="fs-kicker">FLIGHT DIRECTORY</span>
                    <h2 className="fs-card-title">Scheduled Flights ({filteredFlights.length})</h2>
                    <p className="fs-muted-note">
                      Click a status badge to switch between On Time, Boarding, or Delayed.
                    </p>
                  </div>
                  <div className="fs-toolbar">
                    <input
                      type="text"
                      className="fs-search-input"
                      placeholder="Search flight or route..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="fs-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="On Time">On Time</option>
                      <option value="Boarding">Boarding</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => exportToCSV("flights", filteredFlights as unknown as Record<string, unknown>[])}
                      className="fs-edit-btn"
                    >
                      ↓ CSV
                    </button>
                  </div>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>FLIGHT</th>
                        <th>ROUTE</th>
                        <th>TIME / GATE</th>
                        <th>FARE</th>
                        <th>STATUS</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFlights.map((f) => (
                        <tr key={f.id}>
                          <td className="font-bold text-white">{f.flightNumber}</td>
                          <td>{f.route}</td>
                          <td className="text-muted">
                            {f.departure} ({f.gate})
                          </td>
                          <td>₱{(Number(f.basePrice) || 0).toLocaleString()}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => cycleFlightStatus(f)}
                              className={`fs-status clickable ${(f.status || "on time").toLowerCase().replace(" ", "-")}`}
                              title="Click to cycle status"
                            >
                              {f.status}
                            </button>
                          </td>
                          <td className="fs-actions-cell">
                            <button
                              type="button"
                              className="fs-edit-btn"
                              onClick={() => {
                                setEditId(f.id);
                                setFlightNumber(f.flightNumber);
                                setRoute(f.route);
                                setDeparture(f.departure);
                                setGate(f.gate);
                                setSeats(String(f.seats));
                                setBasePrice(String(f.basePrice));
                                setFlightStatus(f.status);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="fs-remove-btn"
                              onClick={() =>
                                deleteRecord<Flight>(
                                  "flights",
                                  "flightsys:flights",
                                  flights,
                                  setFlights,
                                  f.id,
                                  "Flights"
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Passengers" && (
            <div className="fs-split-grid fs-anim">
              <div className="fs-card fs-form-card">
                <span className="fs-kicker">02 • PASSENGER MANIFEST</span>
                <h2 className="fs-card-title">{editId ? "Edit Passenger" : "Register Passenger"}</h2>
                <p className="fs-muted-note" style={{ marginBottom: "16px" }}>
                  Registered passengers will automatically appear as suggestions when booking tickets.
                </p>

                <form onSubmit={handlePassengerSubmit} className="fs-form">
                  <label className="fs-field">
                    <span>Full Name</span>
                    <input
                      type="text"
                      placeholder="e.g. Clara Ibarra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </label>

                  <label className="fs-field">
                    <span>Email Address</span>
                    <input
                      type="email"
                      placeholder="clara@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>

                  <label className="fs-field">
                    <span>Contact Number</span>
                    <input
                      type="text"
                      placeholder="+63 917 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>

                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Passport No.</span>
                      <input
                        type="text"
                        placeholder="P7654321C"
                        value={passportNo}
                        onChange={(e) => setPassportNo(e.target.value)}
                        required
                      />
                    </label>
                    <label className="fs-field">
                      <span>Nationality</span>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        required
                      />
                    </label>
                  </div>

                  <div className="fs-btn-row">
                    <button type="submit" className="fs-primary-btn">
                      {editId ? "Update Passenger" : "Add Passenger"}
                    </button>
                    {editId && (
                      <button type="button" onClick={resetForms} className="fs-secondary-btn">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="fs-card fs-table-card">
                <div className="fs-card-header-row">
                  <div>
                    <span className="fs-kicker">PASSENGER RECORDS</span>
                    <h2 className="fs-card-title">Registered Passengers ({filteredPassengers.length})</h2>
                    <p className="fs-muted-note">
                      Manage verified traveler records and passport details.
                    </p>
                  </div>
                  <div className="fs-toolbar">
                    <input
                      type="text"
                      className="fs-search-input"
                      placeholder="Search name or passport..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => exportToCSV("passengers", filteredPassengers as unknown as Record<string, unknown>[])}
                      className="fs-edit-btn"
                    >
                      ↓ CSV
                    </button>
                  </div>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>CONTACT</th>
                        <th>PASSPORT</th>
                        <th>NATIONALITY</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPassengers.map((p) => (
                        <tr key={p.id}>
                          <td className="font-bold text-white">{p.fullName}</td>
                          <td className="text-muted">{p.email}</td>
                          <td>{p.passportNo}</td>
                          <td>
                            <span className="fs-role-badge">{p.nationality}</span>
                          </td>
                          <td className="fs-actions-cell">
                            <button
                              type="button"
                              className="fs-edit-btn"
                              onClick={() => {
                                setEditId(p.id);
                                setFullName(p.fullName);
                                setEmail(p.email);
                                setPhone(p.phone);
                                setPassportNo(p.passportNo);
                                setNationality(p.nationality);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="fs-remove-btn"
                              onClick={() =>
                                deleteRecord<Passenger>(
                                  "passengers",
                                  "flightsys:passengers",
                                  passengers,
                                  setPassengers,
                                  p.id,
                                  "Passengers"
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Bookings" && (
            <div className="fs-split-grid fs-anim">
              <div className="fs-card fs-form-card">
                <span className="fs-kicker">03 • TICKET RESERVATION</span>
                <h2 className="fs-card-title">{editId ? "Modify Booking" : "Create New Booking"}</h2>
                <p className="fs-muted-note" style={{ marginBottom: "16px" }}>
                  Choose a passenger and flight to generate a unique Booking Reference (e.g. BK-105).
                </p>

                <form onSubmit={handleBookingSubmit} className="fs-form">
                  <label className="fs-field">
                    <span>Passenger Name</span>
                    <input
                      type="text"
                      list="passenger-suggestions"
                      placeholder="Select or type passenger name"
                      value={bookingPassenger}
                      onChange={(e) => setBookingPassenger(e.target.value)}
                      required
                    />
                    <datalist id="passenger-suggestions">
                      {passengers.map((p) => (
                        <option key={p.id} value={p.fullName} />
                      ))}
                    </datalist>
                  </label>

                  <label className="fs-field">
                    <span>Select Flight</span>
                    <select value={bookingFlight} onChange={(e) => setBookingFlight(e.target.value)}>
                      {flights.map((f) => (
                        <option key={f.id} value={f.flightNumber}>
                          {f.flightNumber} ({f.route}) - ₱{(Number(f.basePrice) || 4500).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Seat No.</span>
                      <input
                        type="text"
                        placeholder="14B"
                        value={seatNo}
                        onChange={(e) => setSeatNo(e.target.value)}
                        required
                      />
                    </label>
                    <label className="fs-field">
                      <span>Seat Class</span>
                      <select
                        value={seatClass}
                        onChange={(e) => setSeatClass(e.target.value as Booking["seatClass"])}
                      >
                        <option value="Economy">Economy (1.0x)</option>
                        <option value="Business">Business (1.8x)</option>
                        <option value="First Class">First Class (2.5x)</option>
                      </select>
                    </label>
                  </div>

                  <label className="fs-field">
                    <span>Status</span>
                    <select
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value as Booking["status"])}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </label>

                  <div className="fs-btn-row">
                    <button type="submit" className="fs-primary-btn">
                      {editId ? "Update Booking" : "Book Ticket"}
                    </button>
                    {editId && (
                      <button type="button" onClick={resetForms} className="fs-secondary-btn">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="fs-card fs-table-card">
                <div className="fs-card-header-row">
                  <div>
                    <span className="fs-kicker">RESERVATION LOGS</span>
                    <h2 className="fs-card-title">Active Bookings ({filteredBookings.length})</h2>
                    <p className="fs-muted-note">
                      Click &quot;Ticket&quot; on any row to preview and print the digital boarding pass.
                    </p>
                  </div>
                  <div className="fs-toolbar">
                    <input
                      type="text"
                      className="fs-search-input"
                      placeholder="Search ref or passenger..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="fs-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>REF</th>
                        <th>PASSENGER</th>
                        <th>FLIGHT / SEAT</th>
                        <th>STATUS</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id}>
                          <td className="text-muted">#{b.bookingRef}</td>
                          <td className="font-bold text-white">{b.passengerName}</td>
                          <td>
                            {b.flightNumber} <span className="text-muted">({b.seatNo})</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => cycleBookingStatus(b)}
                              className={`fs-status clickable ${(b.status || "confirmed").toLowerCase()}`}
                            >
                              {b.status}
                            </button>
                          </td>
                          <td className="fs-actions-cell">
                            <button
                              type="button"
                              className="fs-ticket-btn"
                              onClick={() => setSelectedTicket(b)}
                              title="View Boarding Pass"
                            >
                              Ticket
                            </button>
                            <button
                              type="button"
                              className="fs-edit-btn"
                              onClick={() => {
                                setEditId(b.id);
                                setBookingPassenger(b.passengerName);
                                setBookingFlight(b.flightNumber);
                                setSeatNo(b.seatNo);
                                setSeatClass(b.seatClass);
                                setBookingStatus(b.status);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="fs-remove-btn"
                              onClick={() =>
                                deleteRecord<Booking>(
                                  "bookings",
                                  "flightsys:bookings",
                                  bookings,
                                  setBookings,
                                  b.id,
                                  "Bookings"
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Payments" && (
            <div className="fs-split-grid fs-anim">
              <div className="fs-card fs-form-card">
                <span className="fs-kicker">04 • BILLING & SETTLEMENT</span>
                <h2 className="fs-card-title">{editId ? "Update Payment" : "Record Payment"}</h2>
                <p className="fs-muted-note" style={{ marginBottom: "16px" }}>
                  Select a Booking Ref to auto-compute the fare based on flight price and seat class.
                </p>

                <form onSubmit={handlePaymentSubmit} className="fs-form">
                  <label className="fs-field">
                    <span>Booking Reference</span>
                    <input
                      type="text"
                      list="booking-ref-list"
                      placeholder="e.g. BK-102"
                      value={payBookingRef}
                      onChange={(e) => handleSelectBookingForPayment(e.target.value)}
                      required
                    />
                    <datalist id="booking-ref-list">
                      {bookings.map((b) => (
                        <option key={b.id} value={b.bookingRef}>
                          {b.bookingRef} - {b.passengerName}
                        </option>
                      ))}
                    </datalist>
                  </label>

                  <label className="fs-field">
                    <span>Amount (PHP)</span>
                    <input
                      type="number"
                      placeholder="4500"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      required
                    />
                  </label>

                  <div className="fs-row-2">
                    <label className="fs-field">
                      <span>Method</span>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value as Payment["method"])}
                      >
                        <option value="Cash">Cash</option>
                        <option value="GCash">GCash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Maya">Maya</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </label>
                    <label className="fs-field">
                      <span>Status</span>
                      <select
                        value={payStatus}
                        onChange={(e) => setPayStatus(e.target.value as Payment["status"])}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </label>
                  </div>

                  <div className="fs-btn-row">
                    <button type="submit" className="fs-primary-btn">
                      {editId ? "Save Changes" : "Confirm Payment"}
                    </button>
                    {editId && (
                      <button type="button" onClick={resetForms} className="fs-secondary-btn">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="fs-card fs-table-card">
                <div className="fs-card-header-row">
                  <div>
                    <span className="fs-kicker">TRANSACTION LEDGER</span>
                    <h2 className="fs-card-title">Payment Records ({filteredPayments.length})</h2>
                    <p className="fs-muted-note">
                      Paid transactions automatically add to your total Dashboard Revenue.
                    </p>
                  </div>
                  <div className="fs-toolbar">
                    <input
                      type="text"
                      className="fs-search-input"
                      placeholder="Search TXN or booking ref..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => exportToCSV("payments_ledger", filteredPayments as unknown as Record<string, unknown>[])}
                      className="fs-edit-btn"
                    >
                      ↓ CSV
                    </button>
                  </div>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>TXN ID</th>
                        <th>BOOKING</th>
                        <th>METHOD</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((p) => (
                        <tr key={p.id}>
                          <td className="text-muted">{p.transactionId}</td>
                          <td className="font-bold text-white">{p.bookingRef}</td>
                          <td>{p.method}</td>
                          <td>₱{(Number(p.amount) || 0).toLocaleString()}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => cyclePaymentStatus(p)}
                              className={`fs-status clickable ${(p.status || "paid").toLowerCase()}`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="fs-actions-cell">
                            <button
                              type="button"
                              className="fs-edit-btn"
                              onClick={() => {
                                setEditId(p.id);
                                setPayBookingRef(p.bookingRef);
                                setPayAmount(String(p.amount));
                                setPayMethod(p.method);
                                setPayStatus(p.status);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="fs-remove-btn"
                              onClick={() =>
                                deleteRecord<Payment>(
                                  "payments",
                                  "flightsys:payments",
                                  payments,
                                  setPayments,
                                  p.id,
                                  "Payments"
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Users" && (
            <div className="fs-split-grid fs-anim">
              <div className="fs-card fs-form-card">
                <span className="fs-kicker">SYSTEM ACCESS</span>
                <h2 className="fs-card-title">{editId ? "Edit System User" : "Add Staff / Admin User"}</h2>
                <p className="fs-muted-note" style={{ marginBottom: "16px" }}>
                  Users registered on the Sign Up page appear here automatically with the &quot;user&quot; role.
                </p>

                <form onSubmit={handleUserSubmit} className="fs-form">
                  <label className="fs-field">
                    <span>Username</span>
                    <input
                      type="text"
                      placeholder="e.g. agent_claire"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </label>

                  <label className="fs-field">
                    <span>{editId ? "New Password (optional)" : "Temporary Password"}</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      required={!editId}
                    />
                  </label>

                  <label className="fs-field">
                    <span>Role</span>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as SystemUser["role"])}
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <div className="fs-btn-row">
                    <button type="submit" className="fs-primary-btn">
                      {editId ? "Update Account" : "Create Account"}
                    </button>
                    {editId && (
                      <button type="button" onClick={resetForms} className="fs-secondary-btn">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="fs-card fs-table-card">
                <div className="fs-card-header-row">
                  <div>
                    <span className="fs-kicker">ACCOUNT DIRECTORY</span>
                    <h2 className="fs-card-title">System Users ({filteredUsers.length})</h2>
                    <p className="fs-muted-note">
                      View, filter, and update user roles across your organization.
                    </p>
                  </div>
                  <div className="fs-toolbar">
                    <input
                      type="text"
                      className="fs-search-input"
                      placeholder="Search username or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="fs-filter-select"
                      value={statusFilter}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    >
                      <option value="ALL">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>

                <div className="fs-table-wrap">
                  <table className="fs-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>USERNAME</th>
                        <th>ROLE</th>
                        <th className="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="text-muted">#{u.id}</td>
                          <td className="font-bold text-white">{u.username}</td>
                          <td>
                            <span className="fs-role-badge">{u.role}</span>
                          </td>
                          <td className="fs-actions-cell">
                            <button
                              type="button"
                              className="fs-edit-btn"
                              onClick={() => {
                                setEditId(u.id);
                                setNewUsername(u.username);
                                setNewRole(u.role);
                                setTempPassword("");
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="fs-remove-btn"
                              onClick={() =>
                                deleteRecord<SystemUser>(
                                  "users",
                                  "flightsys:users",
                                  users,
                                  setUsers,
                                  u.id,
                                  "Users"
                                )
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedTicket && (
        <div className="fs-modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="fs-boarding-pass" onClick={(e) => e.stopPropagation()}>
            <div className="fs-bp-header">
              <div>
                <span className="fs-kicker">FLIGHTSYS E-TICKET</span>
                <h3>BOARDING PASS</h3>
              </div>
              <span className={`fs-status ${(selectedTicket.status || "confirmed").toLowerCase()}`}>
                {selectedTicket.status}
              </span>
            </div>

            <div className="fs-bp-body">
              <div className="fs-bp-grid">
                <div>
                  <small>PASSENGER</small>
                  <strong>{selectedTicket.passengerName}</strong>
                </div>
                <div>
                  <small>BOOKING REF</small>
                  <strong>#{selectedTicket.bookingRef}</strong>
                </div>
                <div>
                  <small>FLIGHT</small>
                  <strong>{selectedTicket.flightNumber}</strong>
                </div>
                <div>
                  <small>SEAT / CLASS</small>
                  <strong>
                    {selectedTicket.seatNo} ({selectedTicket.seatClass})
                  </strong>
                </div>
              </div>

              <div className="fs-bp-barcode">
                |||| || ||| |||| | ||| |||| || ||| ||||
                <span>
                  {selectedTicket.bookingRef}-{selectedTicket.flightNumber}-{selectedTicket.seatNo}
                </span>
              </div>
            </div>

            <div className="fs-bp-footer">
              <button type="button" onClick={() => window.print()} className="fs-primary-btn">
                Print Boarding Pass
              </button>
              <button type="button" onClick={() => setSelectedTicket(null)} className="fs-secondary-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
@keyframes fs-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fs-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fs-anim {
  animation: fs-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.fs-page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: #0a0a0d;
  color: #f4f4f6;
  font-family: var(--font-geist-sans), "Inter", system-ui, sans-serif;
  overflow-x: hidden;
}

.fs-spotlight {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transition: background 0.15s ease-out;
}

.fs-orb-left {
  position: fixed;
  top: 15%;
  left: -5%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: rgba(255, 37, 58, 0.12);
  filter: blur(110px);
  pointer-events: none;
  z-index: 0;
}

.fs-grid-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
  background-size: 72px 100%;
}

.fs-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 10, 13, 0.85);
  backdrop-filter: blur(14px);
}

.fs-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.fs-brand-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff253a 0%, #d91b2e 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px -4px rgba(255, 37, 58, 0.6);
}

.fs-brand-icon svg { width: 17px; height: 17px; }

.fs-brand-name {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #ffffff;
}

.fs-brand-name span { color: #ff253a; }

.fs-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fs-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4d4df;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.fs-refresh-btn svg {
  width: 14px;
  height: 14px;
  color: #ff4759;
}

.fs-refresh-btn.is-spinning svg {
  animation: fs-spin 0.65s linear infinite;
}

.fs-refresh-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.fs-welcome-text { font-size: 13px; color: #8f8f9e; }
.fs-welcome-text strong { color: #ffffff; }

.fs-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 37, 58, 0.18);
  border: 1px solid rgba(255, 37, 58, 0.35);
  color: #ff4759;
  font-size: 13px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.fs-logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 9px;
  background: rgba(255, 37, 58, 0.08);
  border: 1px solid rgba(255, 37, 58, 0.25);
  color: #ff6b79;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.fs-logout-btn svg { width: 15px; height: 15px; }
.fs-logout-btn:hover { background: #ff253a; color: #ffffff; }

.fs-main {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 32px 48px;
  display: flex;
  justify-content: center;
}

.fs-container {
  width: 100%;
  max-width: 1240px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.fs-stepper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.fs-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 11px;
  background: rgba(24, 24, 30, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #9393a3;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fs-step-pill svg {
  width: 15px;
  height: 15px;
  opacity: 0.8;
}

.fs-step-num {
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 10.5px;
  font-weight: 700;
  color: #7c7c8e;
}

.fs-step-pill:hover {
  border-color: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.fs-step-pill.is-active {
  background: #f42538;
  border-color: #ff4759;
  color: #ffffff;
  box-shadow: 0 8px 26px -4px rgba(244, 37, 56, 0.65);
}

.fs-step-pill.is-active .fs-step-num {
  background: rgba(0, 0, 0, 0.22);
  color: #ffffff;
}

.fs-step-arrow {
  color: #555563;
  font-size: 13px;
  user-select: none;
}

.fs-toast {
  padding: 12px 16px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 600;
}

.fs-toast.is-ok {
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.35);
  color: #6ee7b7;
}

.fs-toast.is-err {
  background: rgba(255, 37, 58, 0.14);
  border: 1px solid rgba(255, 37, 58, 0.35);
  color: #ff6b79;
}

.fs-welcome-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding: 16px 4px 28px;
}

.fs-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(255, 37, 58, 0.08);
  border: 1px solid rgba(255, 37, 58, 0.3);
  color: #ff3b4e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.fs-pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff253a;
  box-shadow: 0 0 10px #ff253a;
}

.fs-welcome-heading {
  margin: 0 0 14px;
  font-size: clamp(38px, 4.5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #ffffff;
}

.fs-welcome-heading span {
  color: #ff253a;
}

.fs-welcome-desc {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: #9393a3;
}

.fs-hero-actions {
  display: flex;
  gap: 12px;
}

.fs-guide-box {
  margin-top: 24px;
  padding: 26px 28px;
  border-radius: 20px;
  background: linear-gradient(160deg, rgba(20, 20, 25, 0.94) 0%, rgba(14, 14, 18, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.fs-guide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.fs-guide-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
}

.fs-guide-sub {
  margin: 0;
  font-size: 13px;
  color: #8c8c9c;
}

.fs-guide-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.fs-guide-step {
  padding: 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fs-guide-step:hover {
  background: rgba(244, 37, 56, 0.06);
  border-color: rgba(244, 37, 56, 0.4);
  transform: translateY(-2px);
}

.fs-guide-step-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.fs-guide-num {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #ff3b4e;
}

.fs-guide-link {
  font-size: 11.5px;
  font-weight: 600;
  color: #8c8c9c;
}

.fs-guide-step:hover .fs-guide-link {
  color: #ffffff;
}

.fs-guide-step h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.fs-guide-step p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #9393a3;
}

.fs-muted-note {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.45;
  color: #8c8c9c;
}

.fs-split-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  align-items: start;
}

.fs-card {
  background: linear-gradient(160deg, rgba(20, 20, 25, 0.94) 0%, rgba(14, 14, 18, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.85);
}

.fs-card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.fs-card-header-row .fs-card-title {
  margin-bottom: 0;
}

.fs-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fs-search-input {
  padding: 8px 12px;
  border-radius: 8px;
  background: #18181f;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #ffffff;
  font-size: 12.5px;
  width: 190px;
  outline: none;
}

.fs-search-input:focus {
  border-color: rgba(244, 37, 56, 0.6);
}

.fs-filter-select {
  padding: 8px 10px;
  border-radius: 8px;
  background: #18181f;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #d4d4df;
  font-size: 12.5px;
  outline: none;
}

.fs-kicker {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #f42538;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.fs-card-title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.fs-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.fs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fs-field span {
  font-size: 12px;
  font-weight: 600;
  color: #d4d4df;
}

.fs-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.fs-field input,
.fs-field select {
  width: 100%;
  padding: 11px 13px;
  border-radius: 10px;
  background: #18181f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.fs-field input::placeholder {
  color: #636372;
}

.fs-field input:focus,
.fs-field select:focus {
  border-color: rgba(244, 37, 56, 0.65);
  box-shadow: 0 0 0 3px rgba(244, 37, 56, 0.15);
}

.fs-btn-row {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.fs-primary-btn {
  flex: 1;
  padding: 12px 18px;
  border-radius: 10px;
  background: #f42538;
  border: 0;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px -6px rgba(244, 37, 56, 0.6);
  transition: transform 0.15s, background 0.2s;
  white-space: nowrap;
}

.fs-primary-btn:hover {
  background: #ff3346;
  transform: translateY(-1px);
}

.fs-secondary-btn {
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.fs-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.fs-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.fs-table th {
  padding: 12px 14px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #7c7c8e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-transform: uppercase;
}

.fs-table td {
  padding: 14px;
  font-size: 13.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: #d4d4df;
}

.fs-table tbody tr:last-child td {
  border-bottom: none;
}

.fs-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.015);
}

.text-muted { color: #8c8c9c; }
.text-white { color: #ffffff; }
.font-bold { font-weight: 700; }
.text-right { text-align: right; }

.fs-role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11.5px;
  font-weight: 600;
  color: #b4b4c4;
}

.fs-status {
  display: inline-block;
  padding: 4px 11px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  border: 0;
}

.fs-status.clickable {
  cursor: pointer;
  transition: transform 0.15s, filter 0.15s;
}

.fs-status.clickable:hover {
  transform: scale(1.05);
  filter: brightness(1.15);
}

.fs-status.on-time,
.fs-status.confirmed,
.fs-status.paid {
  background: rgba(52, 211, 153, 0.12);
  color: #34d399;
}

.fs-status.boarding,
.fs-status.pending {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.fs-status.delayed,
.fs-status.cancelled,
.fs-status.refunded {
  background: rgba(244, 37, 56, 0.14);
  color: #ff5c6c;
}

.fs-actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.fs-ticket-btn {
  padding: 6px 11px;
  border-radius: 7px;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: #6ee7b7;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.fs-edit-btn {
  padding: 6px 12px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #c4c4d4;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.fs-edit-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.fs-remove-btn {
  padding: 6px 14px;
  border-radius: 7px;
  background: rgba(244, 37, 56, 0.12);
  border: 1px solid rgba(244, 37, 56, 0.35);
  color: #ff6b79;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.fs-remove-btn:hover {
  background: #f42538;
  color: #ffffff;
}

.fs-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.fs-stat-card {
  background: linear-gradient(160deg, rgba(20, 20, 25, 0.94) 0%, rgba(14, 14, 18, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 22px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.fs-stat-card:hover {
  border-color: rgba(244, 37, 56, 0.45);
  transform: translateY(-2px);
}

.fs-stat-val {
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  margin: 6px 0 4px;
}

.fs-stat-label {
  font-size: 12.5px;
  color: #8c8c9c;
}

.fs-dash-bottom {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.fs-audit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 310px;
  overflow-y: auto;
}

.fs-audit-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.fs-method-tag {
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.fs-method-tag.get { background: rgba(59, 130, 246, 0.16); color: #60a5fa; }
.fs-method-tag.post { background: rgba(52, 211, 153, 0.16); color: #34d399; }
.fs-method-tag.put { background: rgba(245, 158, 11, 0.16); color: #fbbf24; }
.fs-method-tag.delete { background: rgba(244, 37, 56, 0.16); color: #ff6b79; }

.fs-audit-info {
  font-size: 12.5px;
  color: #d4d4df;
  line-height: 1.4;
}

.fs-audit-info small {
  display: block;
  font-size: 11px;
  color: #7c7c8e;
  margin-top: 2px;
}

.fs-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 20px;
}

.fs-boarding-pass {
  width: 100%;
  max-width: 440px;
  border-radius: 22px;
  background: #14141a;
  border: 1px solid rgba(244, 37, 56, 0.35);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
  overflow: hidden;
}

.fs-bp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 26px;
  background: linear-gradient(135deg, rgba(244, 37, 56, 0.2), transparent);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
}

.fs-bp-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #ffffff;
}

.fs-bp-body {
  padding: 24px 26px;
}

.fs-bp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.fs-bp-grid small {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #7c7c8e;
  margin-bottom: 4px;
}

.fs-bp-grid strong {
  font-size: 15px;
  color: #ffffff;
}

.fs-bp-barcode {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px dashed rgba(255, 255, 255, 0.12);
  text-align: center;
  font-family: monospace;
  font-size: 22px;
  letter-spacing: 3px;
  color: #d4d4df;
}

.fs-bp-barcode span {
  display: block;
  font-size: 11px;
  letter-spacing: 2px;
  color: #7c7c8e;
  margin-top: 6px;
}

.fs-bp-footer {
  display: flex;
  gap: 10px;
  padding: 18px 26px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

@media (max-width: 1024px) {
  .fs-split-grid,
  .fs-dash-bottom {
    grid-template-columns: 1fr;
  }
  .fs-stats-grid,
  .fs-guide-steps {
    grid-template-columns: repeat(2, 1fr);
  }
  .fs-welcome-hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .fs-header,
  .fs-main {
    padding: 18px 20px;
  }
}

@media (max-width: 640px) {
  .fs-guide-steps,
  .fs-stats-grid {
    grid-template-columns: 1fr;
  }
}
  `;