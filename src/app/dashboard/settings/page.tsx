"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

import { useTheme } from "@/components/ThemeProvider";
import MobileNav from "@/components/MobileNav";

/* ── Sub-nav tabs ── */
const TABS = ["General", "Integrations", "Team Members", "Billing", "API Keys", "Appearance", "Notifications"];


const MOBILE_MENU = [
  {
    id: "General",
    label: "General",
    sub: "Profile, language, and timezone",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="#3B82F6" strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Integrations",
    label: "Integrations",
    sub: "Connect your channels and third-party services",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <rect x="2" y="2" width="9" height="9" rx="2" stroke="#14A085" strokeWidth="1.8"/>
          <rect x="13" y="2" width="9" height="9" rx="2" stroke="#14A085" strokeWidth="1.8"/>
          <rect x="2" y="13" width="9" height="9" rx="2" stroke="#14A085" strokeWidth="1.8"/>
          <rect x="13" y="13" width="9" height="9" rx="2" stroke="#14A085" strokeWidth="1.8"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Team Members",
    label: "Team Members",
    sub: "Manage Your Team Members",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="9" cy="7" r="3" stroke="#8B5CF6" strokeWidth="1.8"/>
          <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M19 11c1.7.5 3 2.1 3 4" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="17" cy="7" r="2.5" stroke="#8B5CF6" strokeWidth="1.8"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Automation",
    label: "Automation",
    sub: "Manage automated responses and actions",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Billing",
    label: "Billing",
    sub: "Manage subscription and invoices",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="#3B82F6" strokeWidth="1.8"/>
          <path d="M2 10h20" stroke="#3B82F6" strokeWidth="1.8"/>
        </svg>
      </div>
    ),
  },
  {
    id: "API Keys",
    label: "API Keys",
    sub: "Manage API Keys",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="8" cy="15" r="4" stroke="#F97316" strokeWidth="1.8"/>
          <path d="M12 11l8-8M18 2l2 2-4 4-2-2" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Appearance",
    label: "Appearance",
    sub: "Adjust theme, layout, and interface preferences.",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" stroke="#EAB308" strokeWidth="1.8"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    ),
  },
  {
    id: "Notifications",
    label: "Notifications",
    sub: "Alerts and email preferences",
    icon: (
      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    ),
  },
];
 
/* ── Integrations data ── */
interface Integration {
  id: string;
  name: string;
  desc: string;
  status: "connected" | "disconnected";
  icon: React.ReactNode;
}

const COMM_CHANNELS: Integration[] = [
  {
    id: "whatsapp", name: "WhatsApp Business", desc: "Connect your WhatsApp Business account", status: "connected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.11-1.34A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.19 13.87c-.22.62-1.3 1.19-1.79 1.25-.49.06-.5.37-3.15-.9-2.65-1.27-4.25-4.3-4.38-4.5-.13-.2-.99-1.32-.99-2.52 0-1.2.62-1.79.85-2.04.23-.25.5-.31.66-.31h.48c.16 0 .37-.06.58.44l.83 2.23c.08.2.04.43-.07.59l-.48.66c-.11.15-.24.31-.1.6.13.3.62 1.08 1.33 1.75.93.84 1.7 1.12 1.98 1.24.28.12.45.1.62-.06l.43-.5c.17-.2.41-.26.66-.16l2.09 1c.24.11.24.22.24.36v.41z" fill="#25D366"/>
        </svg>
      </div>
    ),
  },
  {
    id: "webchat", name: "Web Chat Widget", desc: "Embed a chat widget on your website", status: "connected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.8"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#3B82F6" strokeWidth="1.8"/>
        </svg>
      </div>
    ),
  },
  {
    id: "email", name: "Email Support", desc: "Automate your support inbox responses", status: "disconnected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#9CA3AF" strokeWidth="1.8"/>
          <path d="M3 7l9 7 9-7" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    ),
  },
  {
    id: "messenger", name: "Messenger", desc: "Connect Facebook Messenger", status: "disconnected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0084FF">
          <path d="M12 2C6.48 2 2 6.27 2 11.5c0 2.76 1.21 5.24 3.15 6.99V22l3.7-2.03c.98.27 2.02.42 3.15.42 5.52 0 10-4.27 10-9.5S17.52 2 12 2zm1.12 12.82l-2.56-2.72-4.98 2.72 5.48-5.82 2.62 2.72 4.92-2.72-5.48 5.82z"/>
        </svg>
      </div>
    ),
  },
];

const CRM_TOOLS: Integration[] = [
  {
    id: "hubspot", name: "HubSpot", desc: "Sync contacts and conversations", status: "connected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF7A59">
          <path d="M15.5 8.5V6.25a1.75 1.75 0 10-3.5 0V8.5a4.5 4.5 0 102.5 8.06V14a1 1 0 112 0v2.56A6.5 6.5 0 1115.5 8.5z"/>
        </svg>
      </div>
    ),
  },
  {
    id: "salesforce", name: "Salesforce", desc: "Connect your Salesforce CRM", status: "disconnected",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#00A1E0">
          <path d="M9.5 4.5a3.5 3.5 0 013.4 2.67A3 3 0 0116 10a3 3 0 01-.09.72A2.5 2.5 0 0117.5 13a2.5 2.5 0 01-2.5 2.5h-8A3 3 0 017 9.5a3 3 0 011.23-2.43A3.5 3.5 0 019.5 4.5z"/>
        </svg>
      </div>
    ),
  },
];

/* ── General settings ── */
function GeneralTab() {
  const [workspace, setWorkspace] = useState("Acme Corporation");
  const [email, setEmail]         = useState("admin@acme.com");
  const [timezone, setTimezone]   = useState("Africa/Lagos");
  const [language, setLanguage]   = useState("English");
  const [saved, setSaved]         = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="xl:max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl xl:text-2xl font-semibold dark:text-white text-gray-900 mb-1">General Settings</h2>
        <p className="text-xs xl:text-sm text-gray-400">Manage your workspace preferences</p>
      </div>
      <div className="bg-white dark:bg-black dark:border-gray-800 rounded-2xl border border-gray-100 p-4 xl:p-6 space-y-5">
        <div>
          <label className="block text-xs xl:text-sm font-medium dark:text-white text-gray-700 mb-1.5">Workspace Name</label>
          <input value={workspace} onChange={(e) => setWorkspace(e.target.value)}
            className="w-full border dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-4 py-2.5 text-xs xl:text-sm outline-none focus:border-[#14A085] focus:ring-2 dark:text-gray-700 focus:ring-[#14A085]/10" />
        </div>
        <div>
          <label className="block text-xs xl:text-sm font-medium dark:text-white text-gray-700 mb-1.5">Contact Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border  dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-4 py-2.5 text-xs xl:text-sm outline-none focus:border-[#14A085] dark:text-gray-700 focus:ring-2 focus:ring-[#14A085]/10" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs xl:text-sm font-medium dark:text-white text-gray-700 mb-1.5">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
              className="w-full border  dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-4 py-2.5 text-xs xl:text-sm outline-none dark:text-gray-700 focus:border-[#14A085] bg-white appearance-none">
              <option>Africa/Lagos</option><option>UTC</option><option>America/New_York</option>
              <option>Europe/London</option><option>Asia/Singapore</option>
            </select>
          </div>
          <div>
            <label className="block text-xs xl:text-sm font-medium dark:text-white text-gray-700 mb-1.5">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full border  dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-4 py-2.5 text-xs xl:text-sm outline-none dark:text-gray-700 focus:border-[#14A085] bg-white appearance-none">
              <option>English</option><option>French</option><option>Spanish</option><option>Arabic</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={save} className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-6 py-2.5 text-xs xl:text-sm transition-colors">
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Integrations tab ── */
function IntegrationsTab() {

  const [comm, setComm]   = useState<Integration[]>(COMM_CHANNELS);
  const [crm, setCrm]     = useState<Integration[]>(CRM_TOOLS);

  const toggleComm = (id: string) =>
    setComm((p) => p.map((i) => i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" : "connected" } : i));

  const toggleCrm = (id: string) =>
    setCrm((p) => p.map((i) => i.id === id ? { ...i, status: i.status === "connected" ? "disconnected" : "connected" } : i));


  const router = useRouter();


  const IntegrationRow = ({ item, onToggle }: { item: Integration; onToggle: (id: string) => void }) => (
    <div className="flex items-center justify-between dark:border-none py-4 border-b border-gray-50 last:border-none">
      <div className="flex items-center gap-4 min-w-0">
        {item.icon}
        <div className="min-w-0">
          <p className="text-xs xl:text-sm font-semibold dark:text-white text-gray-900 truncate">{item.name}</p>
          {item.status === "connected"
            ? <p className="text-xs font-medium text-[#14A085] mt-0.5">Connected</p>
            : <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
          }
        </div>
      </div>
      {item.status === "connected" ? (
        <button onClick={() => router.push("/dashboard/settings/configure")}
          className="text-xs xl:text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 xl:px-4 py-1 xl:py-1.5 transition-colors hover:border-gray-300 flex-shrink-0">
          Configure
        </button>
      ) : (
        <button onClick={() => onToggle(item.id)}
          className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-lg px-3 xl:px-4 py-1 xl:py-1.5 text-xs xl:text-sm transition-colors flex-shrink-0">
          Connect
        </button>
      )}
    </div>
  );

  return (
    <div className="xl:max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl xl:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Integrations</h2>
        <p className="text-xs xl:text-sm text-gray-400">Connect your channels and third-party services</p>
      </div>

      {/* Communication Channels */}
      <div className="bg-white  dark:bg-black dark:border-gray-800 rounded-2xl border  border-gray-100 p-4 xl:p-6">
        <h3 className="text-xs xl:text-sm font-semibold  dark:text-white text-gray-900 mb-1">Communication Channels</h3>
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-x-8">
          {comm.map((item) => (
            <IntegrationRow key={item.id} item={item} onToggle={toggleComm} />
          ))}
        </div>
      </div>

      {/* CRM & Tools */}
      <div className="bg-white  dark:bg-black dark:border-gray-800 rounded-2xl border border-gray-100 p-4 xl:p-6">
        <h3 className="text-xs xl:text-sm font-semibold dark:text-white text-gray-900 mb-1">CRM & Tools</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8">
          {crm.map((item) => (
            <IntegrationRow key={item.id} item={item} onToggle={toggleCrm} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AI Settings tab (Image 2) ── */
function AISettingsTab() {
  const [aiAuto, setAiAuto]     = useState(true);
  const [tone, setTone]         = useState("Friendly");
  const [confidence, setConf]   = useState(80);
  const [saved, setSaved]       = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const TONES = ["Friendly", "Professional", "Casual"];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Configure your channel settings</h2>
        <p className="text-sm text-gray-400">Customize how your AI handles customer conversations on this channel</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        {/* AI Behaviour */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">AI Behaviour</h3>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-700">Use AI Auto - Response</span>
            <button type="button" onClick={() => setAiAuto((v) => !v)}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${aiAuto ? "bg-[#14A085]" : "bg-gray-300"}`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${aiAuto ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-3">Select response tone</p>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {TONES.map((t, i) => (
              <label key={t} className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${i < TONES.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${tone === t ? "border-[#14A085]" : "border-gray-300"}`}>
                  {tone === t && <div className="w-2 h-2 rounded-full bg-[#14A085]" />}
                </div>
                <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Confidence Level */}
        <div className="pt-2">
          <h3 className="text-base font-semibold text-gray-900 mb-1">AI Confidence Level</h3>
          <p className="text-sm text-gray-400 mb-6">Adjust how much your AI should escalate to human agents versus automating responses.</p>

          <div className="relative mb-2">
            <div className="flex justify-end mb-1">
              <span className="text-xs text-gray-500">Escalate to Human Agent</span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute -top-8 transition-all" style={{ left: `calc(${confidence}% - 20px)` }}>
                <span className="bg-[#14A085] text-white text-xs font-bold px-2 py-0.5 rounded">{confidence}%</span>
              </div>
              <input type="range" min={0} max={100} value={confidence} onChange={(e) => setConf(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #14A085 ${confidence}%, #e2e8f0 ${confidence}%)` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>More Escalation</span><span>More Automation</span>
            </div>
          </div>
        </div>

        {/* Escalation Rules */}
        <div className="pt-2">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Escalation Rules</h3>
          <p className="text-sm text-gray-500 mb-3">Assigned Human Agent</p>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F4] flex items-center justify-center text-xs font-bold text-[#14A085]">EW</div>
              <span className="text-sm font-medium text-gray-800">Emma Wilson</span>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-400">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xs text-gray-400 mt-2">If AI confidence is {confidence}% and below escalate to human agent assigned for this channel</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-10 py-3 text-sm transition-colors">
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ── Team Members tab ── */
function TeamMembersTab() {
  const members = [
    { name: "Sarah Jenkins", email: "sarah@company.com", role: "Owner",  avatar: "SJ", color: "bg-rose-100 text-rose-600" },
    { name: "Michael Chen",  email: "m.chen@company.com", role: "Editor", avatar: "MC", color: "bg-blue-100 text-blue-600" },
    { name: "John Doe",      email: "john@company.com",   role: "Viewer", avatar: "JD", color: "bg-[#E6F7F4] text-[#14A085]" },
  ];
 
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage your team and permissions</p>
        </div>
        <button className="w-9 h-9 flex items-center justify-center bg-[#14A085] text-white rounded-full text-xl font-light hover:bg-[#0d7a65] transition-colors">
          +
        </button>
      </div>
 
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-50 dark:divide-gray-800">
        {members.map((m) => (
          <div key={m.email} className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar circle with initials */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${m.color}`}>
                {m.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{m.name}</p>
                <p className="text-xs text-gray-400 truncate">{m.email}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
 
/* ── API Keys tab ── */

function APIKeysTab() {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };
 
  return (
    <div className="space-y-5">
      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3.5">
        <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="1.8"/>
          <path d="M12 8v4M12 16h.01" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          Keep your API keys secure. Do not share them in public repositories or client-side code.
        </p>
      </div>
 
      {/* Production Key */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Production Key</p>
          <p className="text-xs text-gray-400">Created 2d ago</p>
        </div>
        <div className="flex items-center justify-between bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3">
          <code className="text-xs text-gray-600 dark:text-gray-300 font-mono">sk_live_51Nz...9×2A</code>
          <button onClick={copy} className="ml-2 text-gray-400 hover:text-[#14A085] transition-colors flex-shrink-0">
            {copied
              ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#14A085" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.8"/></svg>
            }
          </button>
        </div>
      </div>
 
      {/* Generate New Key */}
      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 text-sm text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors bg-white dark:bg-gray-950">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Generate New Key
      </button>
    </div>
  );
}
 
/* ── Billing tab ── */
function BillingTab() {
  return (
    <div className="space-y-5">
      {/* Dark plan card */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f2a2a] to-[#0a1f2e] p-5 relative">
        {/* Decorative teal blob */}
        <div className="absolute right-4 top-4 w-20 h-20 rounded-full bg-[#14A085]/30 blur-xl" />
        <p className="text-xs text-gray-400 mb-1">Current Plan</p>
        <p className="text-xl font-bold text-white mb-2">Pro Monthly</p>
        <p className="text-4xl font-extrabold text-white">
          $49<span className="text-base font-normal text-gray-400">/mo</span>
        </p>
        <button className="absolute right-5 bottom-5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl px-5 py-2 text-sm transition-colors">
          Upgrade
        </button>
      </div>
 
      {/* Payment Method */}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Payment Method</p>
        <div className="flex items-center justify-between bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5">
          <div className="flex items-center gap-3">
            {/* Mastercard logo */}
            <div className="flex flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-red-500 opacity-90" />
              <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-90 -ml-2.5" />
            </div>
            <div>
              <p className="text-sm text-gray-800 dark:text-white font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-400">Expires 12/25</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-[#14A085]">Edit</button>
        </div>
      </div>
 
      {/* Recent Invoices */}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Invoices</p>
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl divide-y divide-gray-50 dark:divide-gray-800">
          {[
            { date: "Oct 12, 2023", inv: "INV-0042", amount: "$49.00" },
            { date: "Sep 12, 2023", inv: "INV-0041", amount: "$49.00" },
          ].map((inv) => (
            <div key={inv.inv} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm text-gray-800 dark:text-white font-medium">{inv.date}</p>
                <p className="text-xs text-gray-400">{inv.inv}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{inv.amount}</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" fill="#14A085"/>
                  <path d="M4 20h16" stroke="#14A085" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
 



/* ── Appearance tab ── */
function AppearanceTab() {
  // const [theme, setTheme]         = useState<"Light" | "Dark" | "System">("Light");
  const [density, setDensity]     = useState<"Comfortable" | "Compact">("Comfortable");
  const [langOpen, setLangOpen]   = useState(false);
  const [language, setLanguage]   = useState({ label: "English (US)", sub: "Primary language" });
  const [timeFormat, setTime]     = useState<"12h" | "24h">("12h");
  const [saved, setSaved]         = useState(false);

  const { theme, setTheme } = useTheme();

  const LANGUAGES = [
    { label: "English (US)", sub: "Primary language" },
    { label: "French",       sub: "Français" },
    { label: "Spanish",      sub: "Español" },
    { label: "Arabic",       sub: "العربية" },
    { label: "Yoruba",       sub: "Yorùbá" },
  ];

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="xl:max-w-3xl mb-10 space-y-8 xl:space-y-10">
      <div>
        <h2 className="text-xl xl:text-2xl font-bold dark:text-white text-gray-900 mb-0.5">Appearance</h2>
        <p className="text-xs xl:text-sm text-gray-400">Connect your channels and third-party services</p>
      </div>

      {/* ── Theme ── */}
      <section>
        <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white mb-1">Theme</p>
        <p className="text-xs text-gray-400 mb-4">Select your preferred color scheme</p>
        <div className="flex items-start gap-2 xl:gap-5 overflow-x-auto pb-2">
          {(["Light", "Dark", "System"] as const).map((t) => {
            const active = theme === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setSaved(true); // Immediate visual feedback
                  setTimeout(() => setSaved(false), 1500);
                }}
                className={`flex flex-col items-center gap-2 p-3 xl:p-4 rounded-2xl border-2 w-24 xl:w-28 flex-shrink-0 transition-all ${
                  active ? "border-[#14A085]  dark:bg-black  bg-white" : "border-gray-100  dark:bg-black dark:border-gray-800 bg-gray-50 hover:border-gray-200"
                }`}
              >
                {t === "Light" && (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" stroke={active ? "#14A085" : "#9CA3AF"} strokeWidth="1.8"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                      stroke={active ? "#14A085" : "#9CA3AF"} strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )}
                {t === "Dark" && (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                      stroke={active ? "#14A085" : "#9CA3AF"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {t === "System" && (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke={active ? "#14A085" : "#9CA3AF"} strokeWidth="1.8"/>
                    <path d="M8 21h8M12 17v4" stroke={active ? "#14A085" : "#9CA3AF"} strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )}
                <span className={`text-xs xl:text-sm font-medium ${active ? "text-[#14A085]" : "text-gray-400"}`}>{t}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Density ── */}
      <section>
        <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white mb-1">Density</p>
        <p className="text-xs text-gray-400 mb-4">Adjust the spacing between elements</p>
        <div className="flex gap-3 mb-4">
          {(["Comfortable", "Compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl text-xs xl:text-sm font-semibold border-2 transition-all flex-1 xl:flex-none ${
                density === d
                  ? "bg-[#14A085] border-[#14A085] text-white"
                  : "bg-white  dark:bg-black dark:border-gray-800 border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-start gap-2.5  dark:bg-black dark:border-gray-800 bg-gray-50 border border-gray-100 rounded-xl px-3 xl:px-4 py-3">
          <svg className="flex-shrink-0 mt-0.5" width="12" height="12" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold dark:text-white text-gray-700">Comfortable</span> spacing provides more breathing room between elements, ideal for larger displays.
            <span className="font-semibold dark:text-white text-gray-700"> Compact</span> reduces spacing to show more content on screen.
          </p>
        </div>
      </section>

      {/* ── Language ── */}
      <section>
        <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white mb-1">Language</p>
        <p className="text-xs text-gray-400 mb-4">Select your preferred language</p>
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 xl:px-4 py-3 xl:py-3.5  dark:bg-black dark:border-gray-800 bg-white hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 xl:w-9 h-8 xl:h-9 rounded-xl  bg-[#E6F7F4] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#14A085" strokeWidth="1.8"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#14A085" strokeWidth="1.8"/>
                </svg>
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white truncate">{language.label}</p>
                <p className="text-xs text-gray-400">{language.sub}</p>
              </div>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
              className={`text-gray-400 transition-transform flex-shrink-0 ${langOpen ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {langOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white  dark:bg-black dark:border-gray-800 border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              {LANGUAGES.map((l) => (
                <button
                  key={l.label}
                  onClick={() => { setLanguage(l); setLangOpen(false); }}
                  className="w-full flex items-center justify-between px-3 xl:px-4 py-3 hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors text-left"
                >
                  <div>
                    <p className="text-xs xl:text-sm font-medium text-gray-900 dark:text-white">{l.label}</p>
                    <p className="text-xs text-gray-400">{l.sub}</p>
                  </div>
                  {language.label === l.label && (
                    <svg className="text-[#14A085] flex-shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Time Format ── */}
      <section>
        <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white mb-1">Time Format</p>
        <p className="text-xs text-gray-400 mb-4">Choose how times are displayed</p>
        <div className="space-y-2">
          {([
            { id: "12h", label: "12-Hour", example: "e.g., 2:30 PM" },
            { id: "24h", label: "24-Hour", example: "e.g., 14:30" },
          ] as const).map((f) => {
            const active = timeFormat === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setTime(f.id)}
                className={`w-full flex items-center gap-3 xl:gap-4 px-4 xl:px-5 py-3 xl:py-4 rounded-2xl border-2 transition-all text-left ${
                  active ? "border-[#14A085]  dark:bg-black dark:border-gray-800 bg-white" : "border-gray-100  dark:bg-black dark:border-gray-700 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <span className={`text-xs font-bold w-6 xl:w-7 flex-shrink-0 ${active ? "text-[#14A085]" : "text-gray-400"}`}>
                  {f.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs xl:text-sm font-semibold ${active ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>{f.label}</p>
                  <p className="text-xs text-gray-400">{f.example}</p>
                </div>
                <div className={`w-4 xl:w-5 h-4 xl:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  active ? "border-[#14A085] bg-[#14A085]" : "border-gray-300"
                }`}>
                  {active && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Automation Active preview card ── */}
      <section>
        <div className="border  dark:bg-black dark:border-gray-800 border-gray-100 rounded-2xl p-4 xl:p-5 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 xl:w-10 h-9 xl:h-10 rounded-xl bg-[#E6F7F4] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" stroke="#14A085" strokeWidth="1.8"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                  stroke="#14A085" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white">Automation Active</p>
              <p className="text-xs text-gray-400">
                Last triggered at {timeFormat === "12h" ? "2:30 PM" : "14:30"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span className="font-semibold">75%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#14A085] rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pt-2 pb-8">
        <button
          onClick={save}
          className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-6 xl:px-8 py-2 xl:py-3 text-xs xl:text-sm transition-colors"
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}




/* ── Notifications tab ── */

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    weeklyAnalytics: true,
    securityAlerts: true,
    escalations: false,
    resolved: false,
    lowConfidence: false,
    newConversation: false,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
 
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? "bg-[#14A085]" : "bg-gray-200 dark:bg-gray-700"}`}
    >
      <span className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
 
  const Row = ({ label, desc, value, onToggle }: { label: string; desc: string; value: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-none">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <Toggle on={value} onToggle={onToggle} />
    </div>
  );
 
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div>
        <p className="text-xs font-semibold text-[#14A085] uppercase tracking-wider mb-3">Email Notifications</p>
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-4">
          <Row label="Weekly Analytics" desc="Receive a summary of rule performance" value={prefs.weeklyAnalytics} onToggle={() => toggle("weeklyAnalytics")} />
          <Row label="Security Alerts"  desc="New login or API key generation"        value={prefs.securityAlerts}  onToggle={() => toggle("securityAlerts")} />
        </div>
      </div>
 
      {/* Push Notifications */}
      <div>
        <p className="text-xs font-semibold text-[#14A085] uppercase tracking-wider mb-3">Push Notifications</p>
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-4">
          <Row label="Escalations"      desc="Alerts when AI escalates to human"         value={prefs.escalations}     onToggle={() => toggle("escalations")} />
          <Row label="Resolved"         desc="Alert when ticket is resolved"              value={prefs.resolved}        onToggle={() => toggle("resolved")} />
          <Row label="Low AI Confidence" desc="Alert when confidence drops below threshold" value={prefs.lowConfidence} onToggle={() => toggle("lowConfidence")} />
          <Row label="New Conversations" desc="Alert on every new incoming conversation."  value={prefs.newConversation} onToggle={() => toggle("newConversation")} />
        </div>
      </div>
    </div>
  );
}
 
 

/* ── Main settings page ── */
const TAB_COMPONENTS: Record<string, React.FC> = {
  General: GeneralTab,
  Integrations: IntegrationsTab,
  "Team Members": TeamMembersTab,
  Billing: BillingTab,
  "API Keys": APIKeysTab,
  Appearance: AppearanceTab,
  Notifications: NotificationsTab,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("");
  const ActiveComponent = TAB_COMPONENTS[activeTab] || GeneralTab;


  const router = useRouter();


  return (
    <div className="flex h-screen gap-16 bg-[#F1F5F9] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <Sidebar />

      <MobileNav/>

      {/* Desktop Layout */}
      <div className="hidden xl:flex flex-1 w-[40%] mt-10 overflow-hidden">
        {/* Settings sub-nav */}
        <nav className="w-48 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 pt-8 px-3 transition-colors duration-200">
          <div className="space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab
                    ? "text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-100 dark:bg-emerald-900/30 transition-colors"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 ml-12 overflow-y-auto px-8 py-8 bg-white dark:bg-gray-950 transition-colors duration-200">
          <ActiveComponent />
        </main>
      </div>

      {/* Mobile Layout */}
     <div className="xl:hidden mt-16 flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-200">
 
  {activeTab === "" ? (
    /* ──────────────────────────────────────────────────────
       SETTINGS HOME SCREEN — full menu list (matches screenshot)
    ────────────────────────────────────────────────────── */
    <div className="flex-1 overflow-y-auto">
 
      {/* Top bar: logo + icons */}
      
 
      {/* Page title */}
      <div className="px-5 pt-4 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
      </div>
 
      {/* Menu items — spaced rows, no card wrapper, no dividers */}
      <div className="px-5 space-y-1">
        {MOBILE_MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="w-full flex items-center gap-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl px-2 transition-colors text-left"
          >
            {item.icon}
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-loose">
                {item.label}
              </p>
              <p className="text-sm text-gray-400 mt-0.5 leading-snug">
                {item.sub}
              </p>
            </div>
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24"
              className="text-gray-300 dark:text-gray-600 flex-shrink-0"
            >
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
 
      {/* Bottom spacer */}
      <div className="h-10" />
    </div>
 
  ) : (
    /* ──────────────────────────────────────────────────────
       SUB-PAGE — back arrow + title header + content
    ────────────────────────────────────────────────────── */
    <div className="flex-1 flex flex-col overflow-hidden">
 
      {/* Header */}
      <div 
      onClick={() => router.back()}
      className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <button
          
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          title="Back to Settings"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">{activeTab}</h2>
      </div>
 
      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <ActiveComponent />
      </main>
    </div>
  )}
</div>
    </div>
  );
}