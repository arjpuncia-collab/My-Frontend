"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arvin Jay Puncia | Portfolio",
  description: "BSIT Student & Aspiring Web Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
  { name: "HOME", href: "/home" },
  { name: "ABOUT", href: "/about" },
  { name: "EDUCATION", href: "/education" },
  { name: "PROJECT", href: "/project" },
  { name: "HOBBIES", href: "/hobbies" },
  { name: "CONTACT", href: "/contact" },
];

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="logo-container">
            <h1 className="logo">DevPortfolio</h1>
          </div>

          <ul className="menu">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {children}
      </body>
    </html>
  );
}