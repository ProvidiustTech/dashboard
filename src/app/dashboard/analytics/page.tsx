"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ExportIcon } from "@/components/Icons";
import MobileNav from "@/components/MobileNav";

/* ── Data ── */
const RESOLUTION = [62, 78, 85, 71, 80, 68, 55];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const VOLUME_AI = [320, 390, 370, 460, 420, 380, 410];
const VOLUME_ESC = [80, 60, 90, 70, 100, 75, 85];

const ESCALATION = [
  { label: "Complex Issues", pct: 42 },
  { label: "Low Confidence", pct: 31 },
  { label: "Customer Request", pct: 27 },
];

const TOP_KB = [
  { label: "Shipping Policy", count: 847, color: "bg-[#14A085]" },
  { label: "Product Catalog", count: 623, color: "bg-[#14A085]" },
  { label: "Return FAQ", count: 412, color: "bg-amber-400" },
];

const RESPONSE_DIST = [
  { label: "<1s", pct: 45, color: "bg-[#14A085]" },
  { label: "1-2s", pct: 28, color: "bg-[#14A085]" },
  { label: "2-3s", pct: 15, color: "bg-[#14A085]" },
  { label: "3-5s", pct: 8, color: "bg-amber-400" },
  { label: ">5s", pct: 4, color: "bg-red-400" },
];

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"];

const maxRes = Math.max(...RESOLUTION);
const maxVol = Math.max(...VOLUME_AI.map((v, i) => v + VOLUME_ESC[i]));

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 7 days");
  const [showExport, setExport] = useState(false);
  const [dateFrom, setFrom] = useState("Oct 12, 2025");
  const [dateTo, setTo] = useState("Oct 19, 2026");
  const [dataType, setDataType] = useState("Resolution Metrics");
  const [format, setFormat] = useState<"CSV" | "PDF">("CSV");
  const [generating, setGen] = useState(false);

  const generate = () => {
    setGen(true);
    setTimeout(() => { setGen(false); setExport(false); }, 1800);
  };

  return (
    <div className="flex gap-5 h-[100vh] overflow-hidden  bg-[#F7FAFC] dark:bg-gray-950 transition-colors duration-200">
      <Sidebar />
      <MobileNav />

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl w-full max-w-md p-7 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Export Analytics</h2>
              <button onClick={() => setExport(false)} className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input value={dateFrom} onChange={(e) => setFrom(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 transition-colors" />
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input value={dateTo} onChange={(e) => setTo(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Date Type</label>
                <div className="relative">
                  <select value={dataType} onChange={(e) => setDataType(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 appearance-none pr-10 transition-colors">
                    <option>Resolution Metrics</option>
                    <option>Conversation Volume</option>
                    <option>Escalation Insights</option>
                    <option>Response Time</option>
                    <option>All Metrics</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Format</label>
                <div className="flex gap-3">
                  {(["CSV", "PDF"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${format === f
                          ? "border-emerald-600 dark:border-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={generating}
              className="mt-6 w-full bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  Generating…
                </>
              ) : "Generate Export"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 overflow-auto xl:overflow-hidden xl:w-[81%] ">


        <main className="flex-1 mt-8 xl:mt-0 px-6 xl:px-10 py-8">
          {/* Header */}

          <div className="bg-none backdrop-blur-sm sticky  flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Analytics</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">Track your AI assistant performance and customer insights</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-400 outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 cursor-pointer transition-colors"
              >
                {RANGES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <button onClick={() => setExport(true)} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ExportIcon />
               <span className="xl:block hidden"> Export</span>
              </button>
            </div>
          </div>

          {/* Row 1 — two charts */}
          <div className="overflow-y-auto xl:h-[100vh] pb-48">
            <div className="grid grid-cols-1 w-[100%] xl:grid-cols-2 gap-5 mb-5 ">

              {/* Resolution Rate Over Time */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 transition-colors">Resolution Rate Over Time</h3>
                <div className="flex gap-3 items-end">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between text-[10px] text-gray-300 dark:text-gray-600 text-right pb-5 transition-colors" style={{ height: 140 }}>
                    {["100%", "80%", "60%", "40%", "20%", "0%"].map((v) => (
                      <span key={v}>{v}</span>
                    ))}
                  </div>
                  {/* Bars */}
                  <div className="flex-1">
                    <div className="flex items-end gap-2" style={{ height: 130 }}>
                      {RESOLUTION.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0">
                          <div
                            className="w-full rounded-t-lg bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                            style={{ height: `${(v / maxRes) * 118}px`, minHeight: 4 }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {DAYS.map((d) => (
                        <span key={d} className="flex-1 text-center text-[10px] text-gray-400 dark:text-gray-600 transition-colors">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Volume */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 transition-colors">Conversation Volume</h3>
                <div className="flex gap-3 items-end">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between text-[10px] text-gray-300 dark:text-gray-600 text-right pb-5 transition-colors" style={{ height: 140 }}>
                    {["600", "500", "400", "300", "200", "100", "0"].map((v) => (
                      <span key={v}>{v}</span>
                    ))}
                  </div>
                  {/* Stacked bars */}
                  <div className="flex-1">
                    <div className="flex items-end gap-2" style={{ height: 130 }}>
                      {DAYS.map((_, i) => {
                        const total = VOLUME_AI[i] + VOLUME_ESC[i];
                        const aiH = (VOLUME_AI[i] / maxVol) * 118;
                        const escH = (VOLUME_ESC[i] / maxVol) * 118;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col" style={{ height: `${aiH + escH}px` }}>
                              <div className="w-full rounded-t-lg bg-red-400 dark:bg-red-500" style={{ height: `${escH}px` }} />
                              <div className="w-full bg-emerald-600 dark:bg-emerald-500 flex-1" style={{ height: `${aiH}px` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2">
                      {DAYS.map((d) => (
                        <span key={d} className="flex-1 text-center text-[10px] text-gray-400 dark:text-gray-600 transition-colors">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-600 transition-colors">AI Resolved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-400 dark:bg-red-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-600 transition-colors">Escalated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 — Escalation Insights / Top KB / Customer Satisfaction */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

              {/* Escalation Insights */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Escalation Insights</h3>
                <div className="space-y-3">
                  {ESCALATION.map(({ label, pct }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
                  <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">Avg escalation time: <span className="font-medium text-gray-600 dark:text-gray-400">4.2 min</span></p>
                </div>
              </div>

              {/* Top Knowledge Sources */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Top Knowledge Sources</h3>
                <div className="space-y-3">
                  {TOP_KB.map(({ label, count, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${color === "bg-[#14A085]" ? "bg-emerald-600 dark:bg-emerald-500" : "bg-amber-400 dark:bg-amber-500"}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none flex flex-col items-center justify-center transition-colors duration-200">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 self-start transition-colors">Customer Satisfaction</h3>
                <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">4.6</p>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4].map((s) => (
                    <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  {/* Half star */}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="halfStar">
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="50%" stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#halfStar)" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">Based on 1,247 ratings</p>
              </div>
            </div>

            {/* Row 3 — Response Time Distribution */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6 transition-colors">Response Time Distribution</h3>
              <div className="flex items-end gap-4 justify-around">
                {RESPONSE_DIST.map(({ label, pct, color }) => (
                  <div key={label} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-full max-w-[80px] rounded-t-xl ${color === "bg-[#14A085]" ? "bg-emerald-600 dark:bg-emerald-500" : color === "bg-amber-400" ? "bg-amber-400 dark:bg-amber-500" : "bg-red-400 dark:bg-red-500"} transition-all duration-500`}
                      style={{ height: `${(pct / 45) * 100}px`, minHeight: 8 }}
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-600 transition-colors">{label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Smart Insights */}
            <div className="rounded-2xl mt-7 bg-gradient-to-br from-gray-900 to-gray-950 dark:from-gray-900 dark:to-gray-950 p-6 transition-colors duration-200">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-base"></span>
                <h3 className="text-base font-semibold text-white">AI Smart Insights</h3>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {[
                  { priority: "High Priority", priorityColor: "bg-red-500/20 text-red-400", icon: "/analytics/risingicon.svg", title: "Escalations increased by 15% this week.", body: 'Most users are asking about "International Shipping" which isn\'t in your KB.' },
                  { priority: "Medium", priorityColor: "bg-yellow-500/20 text-yellow-400", icon: "/analytics/mediumicon.svg", title: 'Improve "Return FAQ" document.', body: "AI confidence is dropping for return-related queries. Update policy details." },
                  { priority: "Low", priorityColor: "bg-green-500/20 text-green-400", icon: "/analytics/peakicon.svg", title: "Peak activity detected at 2 PM.", body: "Consider increasing human agent availability during this window for escalations." },
                ].map((insight) => (
                  <div key={insight.title} className="bg-white/5 dark:bg-white/5 rounded-xl p-4 border border-white/10 dark:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${insight.priorityColor}`}>
                        {insight.priority}
                      </span>
                      <span className="text-base">
                        <img src={insight.icon} alt="" />
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed">{insight.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}