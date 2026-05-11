"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/dist/client/link";
import MobileNav from "@/components/MobileNav";

interface Rule {
  id: string;
  name: string;
  desc: string;
  status: "Active" | "Draft" | "Paused";
  when: string;
  then: string;
  extra?: string;
  stats?: string;
  icon: string;
  iconBg: string;
}

const INIT_RULES: Rule[] = [
  {
    id: "1",
    name: "Order Status Lookup",
    desc: "Automatically fetch and display order tracking info",
    status: "Active",
    when: "Intent: track_order",
    then: "Call API: orders/track",
    extra: "Return tracking info",
    stats: "Used 847 times  ·  98% success rate  ·  Last triggered 2 min ago",
    icon: "📦",
    iconBg: "bg-orange-100 dark:bg-orange-900",
  },
  {
    id: "2",
    name: "Payment Status Check",
    desc: "Check payment status and provide receipt",
    status: "Active",
    when: "Intent: check_payment",
    then: "Call API: payments/status",
    stats: "",
    icon: "💳",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  {
    id: "3",
    name: "Return Request Handler",
    desc: "Process return requests automatically",
    status: "Draft",
    when: "Intent: request_return",
    then: "Escalate to human",
    stats: "",
    icon: "🔄",
    iconBg: "bg-gray-100 dark:bg-gray-800",
  },
];

const STATUS_STYLE: Record<string, string> = {
  Active: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400",
  Draft: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  Paused: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400",
};

function NewRuleModal({ onClose, onSave }: { onClose: () => void; onSave: (r: Rule) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [when, setWhen] = useState("");
  const [then, setThen] = useState("");

  const save = () => {
    if (!name.trim()) return;
    onSave({
      id: String(Date.now()), name, desc, status: "Draft",
      when: when || "Intent: new_intent", then: then || "Take action",
      icon: "", iconBg: "bg-purple-100 dark:bg-purple-900",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl dark:shadow-xl w-full max-w-lg p-7 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Automation Rule</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rule Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Order Status Lookup"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this rule do?"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors placeholder-gray-400 dark:placeholder-gray-500" />
          </div>

          {/* When → Then */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">When (Trigger)</label>
              <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Intent: track_order"
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Then (Action)</label>
              <input value={then} onChange={(e) => setThen(e.target.value)} placeholder="Call API: orders/track"
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button onClick={save} className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors">
            Create Rule
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
        const res = await fetch(`${baseUrl}/api/v1/rules`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRules(data);
        }
      } catch (error) {
        console.error("Failed to fetch rules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const toggleStatus = (id: string) =>
    setRules((p) => p.map((r) =>
      r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r
    ));

  const deleteRule = (id: string) => setRules((p) => p.filter((r) => r.id !== id));

  return (
    <div className="flex h-screen gap-5 bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <Sidebar />

      <MobileNav />

      {showModal && <NewRuleModal onClose={() => setModal(false)} onSave={(r) => setRules((p) => [...p, r])} />}

      <div className="xl:mt-10 mt-16 overflow-auto w-[100%] min-h-screen xl:overflow-x-hidden mb-10 xl:w-[81%]">
        <main className="flex-1 overflow-y-auto px-6 xl:px-10 py-8" onClick={() => setMenuOpen(null)}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automation Rules</h1>
              <p className="text-sm text-gray-500 xl:block hidden dark:text-gray-400 mt-0.5">Create automated responses and actions based on customer intents</p>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              New Rule
            </button>
          </div>

          {/* Rules list */}
          <div className="space-y-4 max-w-7xl">
            {Array.isArray(rules) && rules.map((rule) => (
              <Link key={rule.id} href={`/dashboard/automation/rules/`}>
                <div /* Reverted dark mode styles */
                  className={`border mt-10 rounded-2xl p-5 py-12 transition-all cursor-pointer ${rule.status === "Draft"
                    ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-800"
                    }`}
                >
                  {/* Rule header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${rule.iconBg}`}>
                        {rule.icon}
                      </div> {/* Reverted dark mode styles */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rule.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[rule.status]}`}>
                        {rule.status}
                      </span>
                      {/* 3-dot menu */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === rule.id ? null : rule.id); }} /* Reverted dark mode styles */
                          className="w-7 h-7 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {menuOpen === rule.id && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-xl py-1 z-20 min-w-[140px]" onClick={(e) => e.stopPropagation()}> {/* Reverted dark mode styles */}
                            <Link href={`/dashboard/automation/rules/`}>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"> {/* Reverted dark mode styles */}
                                Edit Rule
                              </button>
                            </Link>
                            <button onClick={() => { deleteRule(rule.id); setMenuOpen(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"> {/* Reverted dark mode styles */}
                              Delete Rule
                            </button>
                            <Link href={`/dashboard/automation/rules/test/`}>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Test Rule
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* When → Then flow */}
                  <div className={`flex items-center gap-2 flex-wrap px-4 py-3 rounded-xl text-xs ${rule.status === "Draft" ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}> {/* Reverted dark mode styles */}
                    <span className="font-medium text-gray-600 dark:text-gray-400">When:</span> {/* Reverted dark mode styles */}
                    <span className={`font-semibold ${rule.status === "Draft" ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}> {/* Reverted dark mode styles */}
                      {rule.when}
                    </span>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-gray-400 dark:text-gray-500"> {/* Reverted dark mode styles */}
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Then:</span> {/* Reverted dark mode styles */}
                    <span className={`font-semibold ${rule.status === "Draft" ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}> {/* Reverted dark mode styles */}
                      {rule.then}
                    </span>
                    {rule.extra && (
                      <>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-gray-400 dark:text-gray-500">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={`font-semibold ${rule.status === "Draft" ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                          {rule.extra}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stats */}
                  {rule.stats && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2.5 px-1">{rule.stats}</p> 
                  )}
                </div>
              </Link>
            ))}

            {/* Empty state */}
            {(!Array.isArray(rules) || rules.length === 0) && !loading && (
              <div className="text-center py-16 border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-700"> {/* Reverted dark mode styles */}
                <div className="text-4xl mb-3"></div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No automation rules yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Create your first rule to automate customer responses</p>
                <button onClick={() => setModal(true)} className="bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors">
                  Create First Rule
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
