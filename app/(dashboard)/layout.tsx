'use client'
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaUserPlus, FaUserCog, FaBars, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { name: "Create Account", href: "/dashboardpageui", icon: <FaUserPlus size={20} /> },
  { name: "View Account Info", href: "/accountpageui", icon: <FaUserCog size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamically update sidebar width (optional)
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isExpanded ? "16rem" : "5rem"
    );
  }, [isExpanded]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          isExpanded ? "w-64" : "w-20"
        } bg-gray-50 shadow-lg flex flex-col fixed left-0 top-0 h-full transition-all duration-300 z-50`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 py-3">
          {isExpanded && (
            <Image
              src="/logo.png"
              alt="MHB logo"
              width={200}
              height={200}
              className="object-contain"
            />
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-md hover:bg-gray-200 transition"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active
                    ? "bg-blue-400 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {isExpanded && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4">
          <button className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-100 rounded-lg transition w-full">
            <FaSignOutAlt size={20} />
            {isExpanded && (
              <span>
                <Link href="/loginpageui">Logout</Link>
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 pl-[var(--sidebar-width)] transition-all duration-300 bg-gray-100 overflow-y-auto p-6`}
      >
        {children}
      </main>
    </div>
  );
}
