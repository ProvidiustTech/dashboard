"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
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

  const themes: ("Light" | "Dark" | "System")[] = ["Light", "Dark", "System"];

  return (
    <aside className="w-64 xl:flex hidden rounded-3xl ml-6 mt-10 pl-2 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-[92%] sticky top-0 transition-colors duration-200">
      {/* Logo */}
      <div className="flex float-left w-60 right-[9%] top-[-2%] gap-2.5 px-0 py-0 absolute border-gray-100 dark:border-gray-800">
        <ProvidusLogo />
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-20 p-0 z-50 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, Icon }) => {
          const active = isNavActive(href, pathname);

          return (
            <Link key={href} href={href}>
              <div
                className={`flex cursor-pointer h-12 items-center gap-3 px-5 py-2.5 rounded-xl text-md font-medium transition-colors cursor-pointer w-full ${
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

      {/* Theme Selector */}
      {/* <div className="px-3 py-4 mx-3 mb-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
          Theme
        </p>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                theme === t
                  ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div> */}

      {/* Upgrade card */}
      <div className="mx-3 mb-4 rounded-2xl p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white shadow-lg dark:shadow-xl transition-all duration-200">
        <p className="font-semibold text-sm mb-1">Upgrade to Pro</p>
        <p className="text-xs text-white/90 mb-3 leading-relaxed">
          Get unlimited conversations and advanced analytics
        </p>
        <button className="w-full bg-white dark:bg-gray-100 text-emerald-600 dark:text-emerald-600 font-semibold text-xs py-2.5 rounded-lg hover:bg-white/95 dark:hover:bg-gray-200 transition-all duration-200 shadow-sm">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
