"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);   // ← New ref for hamburger button

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks on the hamburger button itself
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }

      // Close only if click is truly outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="fixed xl:hidden xl:top-5 h-20  z-40 backdrop-blur-sm w-full flex items-center justify-center">
      <div className="xl:w-[90%] w-[130%] object-center">
        <nav className="bg-none mt-0 rounded-2xl mx-4 px-6 py-5 flex items-center justify-between shadow-sm">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" className="w-56 absolute mt-4 ml-[-56px]" alt="" />
            </div>
          </Link>

          {/* Mobile hamburger / Close button */}
          <button
            ref={buttonRef}                    // ← Attach ref here
            className="xl:hidden flex flex-col gap-1.5 p-1 cursor-pointer relative w-6 h-6"
            onClick={() => setMenuOpen(!menuOpen)}   // ← Simplified: no need for stopPropagation anymore
          >
            {/* Top line */}
            <span
              className={`block h-0.5 dark:bg-white bg-gray-900 rounded transition-all duration-400 origin-left
                ${menuOpen ? 'w-6 rotate-45 translate-y-1.5' : 'w-6'}`}
            ></span>

            {/* Middle line */}
            <span
              className={`block h-0.5 dark:bg-white bg-gray-900 rounded transition-all duration-400
                ${menuOpen ? 'opacity' : 'w-6'}`}
            ></span>

            {/* Bottom line */}
            <span
              className={`block h-0.5 dark:bg-white left-[11px] font-bold relative bg-gray-900 rounded transition-all duration-400 origin-left
                ${menuOpen ? 'w-6 -rotate-45 top-[87%] left-[1px] -translate-y-1.5' : 'w-3 float-right left-[48%] relative'}`}
            ></span>
          </button>

          {/* Mobile menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute left-4 right-4 mt-96 dark:bg-black dark:border-slate-600 dark:border-2 bg-white rounded-2xl shadow-lg backdrop-blur-sm p-6 z-50 w-[90%] flex flex-col gap-4"
            >
              <a href="/dashboard" className="text-gray-700 dark:text-gray-100 cursor-pointer hover:text-gray-900 dark:hover:text-gray-600 transition-colors">Dashboard</a>
              <a href="/dashboard/conversations" className="text-gray-700 dark:text-gray-100 dark:hover:text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">Conversations</a>
              <a href="/dashboard/knowledge-base" className="text-gray-700 dark:text-gray-100 dark:hover:text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">Knowledge Base</a>
              <a href="/dashboard/analytics" className="text-gray-700 dark:text-gray-100 dark:hover:text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">Analytics</a>
              <a href="/dashboard/automation" className="text-gray-700 dark:text-gray-100 dark:hover:text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">Automation</a>
              <a href="/dashboard/settings" className="text-gray-700 dark:text-gray-100 dark:hover:text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">Settings</a>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}