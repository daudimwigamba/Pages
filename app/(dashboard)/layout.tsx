"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUserPlus, FaUserCog, FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { name: "Create Account", href: "/dashboardpageui", icon: <FaUserPlus size={20} /> },
  { name: "View Account Info", href: "/accountpageui", icon: <FaUserCog size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/loginpageui");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          bg-gray-50 shadow-xl
          transition-all duration-300
          ${isExpanded ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {isExpanded && (
            <Image
              src="/logo.png"
              alt="MHB logo"
              width={140}
              height={40}
              className="object-contain"
            />
          )}

          {/* DESKTOP TOGGLE */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex p-2 rounded hover:bg-gray-200"
          >
            <FaBars />
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {item.icon}
                {isExpanded && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg
                       text-gray-700 hover:bg-red-100 w-full transition"
          >
            <FaSignOutAlt />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR (MOBILE) */}
        <header className="lg:hidden bg-white shadow px-4 py-3 flex items-center">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded hover:bg-gray-200"
          >
            <FaBars />
          </button>
          <h1 className="ml-4 font-semibold text-gray-700">Dashboard</h1>
        </header>

        <main className="flex-1 bg-gray-100 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
