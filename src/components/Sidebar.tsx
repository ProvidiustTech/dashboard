"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { LogOut } from "lucide-react";
import { handleLogout } from "../../auth-utils";
import {
  ProvidusLogo,
  DashboardIcon,
  ConversationsIcon,
  KnowledgeBaseIcon,
  AnalyticsIcon,
  AutomationIcon,
  SettingsIcon,
} from "./Icons";

const NAV = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
  { label: "Conversations", href: "/dashboard/conversations", Icon: ConversationsIcon },
  { label: "Knowledge Base", href: "/dashboard/knowledge-base", Icon: KnowledgeBaseIcon },
  { label: "Analytics", href: "/dashboard/analytics", Icon: AnalyticsIcon },
  { label: "Automation", href: "/dashboard/automation", Icon: AutomationIcon },
  { label: "Settings", href: "/dashboard/settings", Icon: SettingsIcon },
];

// Helper to determine if a nav item should be active
const isNavActive = (href: string, currentPath: string): boolean => {
  // if (href === "/dashboard") {
  //   return currentPath === href || currentPath.startsWith(href + "/");
  // }
  if (href === "/dashboard/knowledge-base") {
    return currentPath === href || currentPath.startsWith(href + "/");
  }
  if (href === "/dashboard/automation") {
    return currentPath === href || currentPath.startsWith(href + "/");
  }
  if (href === "/dashboard/settings") {
    return currentPath === href || currentPath.startsWith(href + "/");
  }
  return currentPath === href;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const themes: ("Light" | "Dark" | "System")[] = ["Light", "Dark", "System"];

  return (
    <>
      <aside className="w-64 xl:flex hidden rounded-3xl ml-6 mt-10 pl-2 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-[92%] sticky top-0 transition-colors duration-200">
        {/* Logo */}
        <div className="flex float-left w-60 right-[9%] top-[3%] gap-2.5 px-0 py-0 absolute border-gray-100 dark:border-gray-800">
          <ProvidusLogo />
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-20 p-0 z-50 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, Icon }) => {
            const active = isNavActive(href, pathname);

            return (
              <Link key={href} href={href}>
                <div
                  className={`flex h-12 items-center gap-3 px-5 py-2.5 rounded-xl text-md font-medium transition-colors cursor-pointer w-full ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="w-6">
                    <Icon
                      className={`transition-colors ${
                        active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-500"
                      }`}
                    />
                  </div>
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className="px-3 mb-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full h-12 items-center gap-3 px-5 py-2.5 rounded-xl text-md font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <div className="w-6">
              <LogOut size={20} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <LogOut className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Are you sure you want to end your current session? You will need to sign in again to access your workspace.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLogout()}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
