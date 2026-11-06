"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/home" },
    { name: "ABOUT", href: "/about" },
    { name: "PROJECT", href: "/project" },
    { name: "SKILL", href: "/skill" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <h1 className="logo">Arvin J.</h1>

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