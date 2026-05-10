"use client";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { ExportIcon, PlusIcon } from "@/components/Icons";
import Link from "next/link";
import { useMemo } from "react";

/* ── Static data (replace with API calls) ── */


function useGreeting(name: string) {
  return useMemo(() => {
    const hour = new Date().getHours();
    let greeting: string;
    let emoji: string;
    if (hour >= 5 && hour < 12) { greeting = "Good morning"; emoji = "☀️"; }
    else if (hour >= 12 && hour < 17) { greeting = "Good afternoon"; emoji = "🌤️"; }
    else if (hour >= 17 && hour < 21) { greeting = "Good evening"; emoji = "🌆"; }
    else { greeting = "Good night"; emoji = "🌙"; }
    return { text: `${greeting}, ${name}`, emoji };
  }, [name]);
}


const STATS = [
  {
    label: "Total Conversations", value: "2,847", change: "↑ 12.5% from last week", up: true,
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#14A085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  {
    label: "Resolution Rate", value: "94.2%", change: "↑ 3.1% improvement", up: true,
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#14A085" strokeWidth="1.8" strokeLinecap="round" /><polyline points="22 4 12 14.01 9 11.01" stroke="#14A085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  {
    label: "Escalation Rate", value: "5.8%", change: "↓ 2.3% reduction", up: false,
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="#F59E0B" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" /></svg>
  },
  {
    label: "Avg Response Time", value: "2.3s", change: "↓ 0.8s faster", up: false,
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="1.8" /><polyline points="12 6 12 12 16 14" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
];

const INTENTS = [
  { label: "Order Status", pct: 42, color: "#14A085" },
  { label: "Product Inquiry", pct: 28, color: "#14A085" },
  { label: "Returns", pct: 18, color: "#14A085" },
  { label: "Billing", pct: 12, color: "#14A085" },
];

const ACTIVITY = [
  {
    type: "resolved",
    title: "AI resolved",
    desc: "a conversation about order tracking",
    sub: "Customer: john.doe@email.com · Order #12847",
    time: "2 min ago",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
    icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#14A085" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    type: "escalated",
    title: "Escalated",
    desc: "to human agent - complex refund request",
    sub: "Assigned to Mike Chen · Priority: High",
    time: "8 min ago",
    iconBg: "bg-amber-100 dark:bg-amber-900",
    icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="#F59E0B" strokeWidth="2" /></svg>,
  },
  {
    type: "kb",
    title: "Knowledge base updated",
    desc: "- 3 new articles indexed",
    sub: "Shipping Policy, Return FAQ, Size Guide",
    time: "1 hour ago",
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /></svg>,
  },
];

// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// const rawData = [480, 520, 505, 580, 575, 600, 580];
// const W = 700;
// const H = 260;
// const PAD = 40;
// const maxValue = Math.max(...rawData, 600);

// const dataPoints = rawData.map((value, i) => {
//   const x = PAD + (i / (rawData.length - 1)) * (W - PAD * 1.8);
//   const y = PAD + ((maxValue - value) / maxValue) * (H - PAD * 2);
//   return { x, y };
// });

// const linePoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
// const areaPoints = [
//   `${dataPoints[0].x},${H - PAD}`,
//   ...dataPoints.map((p) => `${p.x},${p.y}`),
//   `${dataPoints[dataPoints.length - 1].x},${H - PAD}`,
// ].join(" ");




















const conversationData = [450, 320, 280, 510, 390, 620, 580]; // ← change this array and the whole chart updates
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ──────────────────────────────────────────────────────────────
// Dynamic calculations (add these right before the return / JSX)
const maxValue = Math.max(...conversationData, 600); // auto-scale but keep at least 600 for visual padding

const chartWidth = 640;
const chartHeight = 200;
const xOffset = 40;
const yOffset = 20;

const numDataPoints = conversationData.length;
const xStep = numDataPoints > 1 ? chartWidth / (numDataPoints - 1) : 0;

const calculatedDataPoints = conversationData.map((value, index) => {
  const x = xOffset + index * xStep;
  const y = yOffset + chartHeight * (1 - value / maxValue); // SVG y is inverted
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
  };
});

const linePoints = calculatedDataPoints.map((p) => `${p.x},${p.y}`).join(' ');

const areaPoints = [
  ...calculatedDataPoints.map((p) => `${p.x},${p.y}`),
  `${xOffset + chartWidth},${yOffset + chartHeight}`,
  `${xOffset},${yOffset + chartHeight}`,
].join(' ');

// Dynamic Y-axis labels (always 7 nice steps)
const numYTicks = 7;
const yStep = maxValue / (numYTicks - 1);
const yLabels = Array.from({ length: numYTicks }, (_, i) =>
  Math.round(maxValue - i * yStep)
);

// Optional dynamic % change (last value vs first value)
const percentChangeRaw =
  conversationData.length > 1
    ? ((conversationData[conversationData.length - 1] - conversationData[0]) /
      conversationData[0]) *
    100
    : 0;
const percentChange = percentChangeRaw >= 0 ? `+${percentChangeRaw.toFixed(1)}%` : `${percentChangeRaw.toFixed(1)}%`;
const percentColorClass = percentChangeRaw >= 0 ? 'text-[#0D9488] dark:text-emerald-400' : 'text-red-500';


export default function DashboardPage() {
  const { text: greetingText, emoji } = useGreeting("Stark");
  return (
    <div className="flex flex-col xl:flex-row h-screen bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <div className="hidden xl:block">
        <Sidebar />
      </div>



      <MobileNav />

      <main className="flex-1 mt-12 xl:mt-0 px-4 xl:px-7 overflow-y-auto pb-20 xl:pb-0">
        {/* Header */}
        <header className="bg-none px-3 rounded-lg dark:bg-gray-900 mt-9 xl:mt-[3.7%] backdrop-blur-sm xl:border xl:border-b border-none border-gray-100 dark:border-gray-800 xl:px-4 xl:ml-8 xl:w-[95%] py-4 xl:py-5 flex flex-col xl:flex-row items-start xl:items-center justify-between xl:sticky top-0 z-10 xl:rounded-xl transition-colors duration-200 xl:shadow-sm dark:shadow-none">
          <div className="w-full xl:w-auto xl:mb-0">
            <h1 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white">{greetingText} <span>{emoji}</span></h1>
            <p className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{"Here's what's happening with your support today"}</p>
          </div>
          <div className="flex items-center gap-2 xl:gap-3 w-full xl:w-auto">
            <button className="hidden xl:flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-3 xl:px-4 py-2 xl:py-2.5 text-xs xl:text-sm text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ExportIcon />
              <span className="hidden xl:inline">Export</span>
            </button>
            <Link href="/dashboard/channels/new" className="flex-1 xl:flex-none xl:block hidden">
              <button className="w-full xl:w-auto flex items-center justify-center xl:justify-start gap-2 bg-[#0D9488] hover:bg-emerald-700 dark:bg-[#0D9488] dark:hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 py-2.5 xl:px-5 xl:py-2.5 text-xs xl:text-sm transition-colors cursor-pointer">
                <PlusIcon />
                <span>Add New Channel</span>
              </button>
            </Link>
          </div>
        </header>

        <div className=" xl:px-8 py-4 xl:py-6 space-y-4 xl:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-900 rounded-lg xl:rounded-2xl p-3 xl:p-5 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-800">
                <div className="flex items-start justify-between mb-2 xl:mb-3">
                  <p className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{s.label}</p>
                  <div className="w-6 xl:w-8 h-6 xl:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                </div>
                <p className="text-lg xl:text-3xl font-bold text-gray-900 dark:text-white mb-1">{s.value}</p>
                <p className="text-[10px] xl:text-xs font-medium text-[#0D9488] dark:text-emerald-400 line-clamp-1">
                  {s.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_657px] xl:mx-8 gap-4 xl:gap-5">
          {/* Conversation Trends - NOW FULLY DYNAMIC */}
          <div className="bg-white dark:bg-gray-900 rounded-lg xl:rounded-2xl border border-gray-100 dark:border-gray-800 p-4 xl:p-6 transition-colors duration-200 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4 xl:mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm xl:text-base">Conversation Trends</h3>
              <p className={`${percentColorClass} text-xs xl:text-sm font-semibold`}>{percentChange}</p>
            </div>

            <div className="relative">
              {/* Chart Container */}
              <div className="h-[180px] xl:h-[260px] relative">
                <svg viewBox="0 0 700 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14A085" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#14A085" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines (unchanged visual style) */}
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={20 + (i / 6) * 200}
                      x2="680"
                      y2={20 + (i / 6) * 200}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area under the curve — updates with data */}
                  <polygon points={areaPoints} fill="url(#areaGrad)" />

                  {/* Main Line — updates with data */}
                  <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#14A085"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points (dots) — updates with data */}
                  {calculatedDataPoints.map((point, i) => (
                    <circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="white"
                      stroke="#14A085"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>

                {/* Y-axis labels — now dynamic */}
                <div className="absolute left-0 top-5 bottom-8 w-10 flex flex-col justify-between text-right text-xs text-gray-400 dark:text-gray-500 pr-3 pointer-events-none">
                  {yLabels.map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>

              {/* X-axis labels — matches your data length */}
              <div className="flex justify-between xl:mt-[-30px] mt-2 px-10 text-xs text-gray-400 dark:text-gray-500">
                {DAYS.map((day, i) => (
                  <span key={i}>{day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Intents — already dynamic, unchanged */}
          <div className="bg-white dark:bg-gray-900 rounded-lg xl:rounded-2xl border border-gray-100 dark:border-gray-800 p-4 xl:p-6 transition-colors duration-200 shadow-sm dark:shadow-none">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm xl:text-base mb-4 xl:mb-5">
              Top Intents
            </h3>
            <div className="space-y-4 xl:space-y-5">
              {INTENTS.map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs xl:text-sm mb-1.5">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{pct}%</span>
                  </div>
                  <div className="h-2 xl:h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#14A085] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/channels/new" className="flex-1 mb-5 justify-center flex xl:flex-none xl:hidden ">
            <button className="w-48 xl:w-auto flex items-center justify-center xl:justify-start gap-2 bg-[#0D9488] hover:bg-emerald-700 dark:bg-[#0D9488] dark:hover:bg-emerald-700 text-white font-semibold rounded-2xl px-4 py-2.5 xl:px-5 xl:py-2.5 text-xs xl:text-sm transition-colors cursor-pointer">
              <PlusIcon />
              <span>Add New Channel</span>
            </button>
          </Link>

          {/* Recent Activity */}
        </div>
          <div className="bg-white xl:mt-6 xl:mx-8 dark:bg-gray-900 rounded-lg xl:rounded-2xl border border-gray-100 dark:border-gray-800 p-4 xl:p-6 transition-colors duration-200 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4 xl:mb-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm xl:text-base">Recent Activity</h3>
              <button className="text-xs xl:text-sm font-medium text-[#0D9488] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-3 xl:space-y-5">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 xl:gap-4 pb-3 xl:pb-5 border-b border-gray-100 dark:border-gray-800 last:pb-0 last:border-b-0">
                  <div className={`w-7 xl:w-9 h-7 xl:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs xl:text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{a.title}</span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">{a.desc}</span>
                    </p>
                    <p className="text-[10px] xl:text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{a.sub}</p>
                  </div>
                  <span className="text-[10px] xl:text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {/* <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around xl:hidden transition-colors duration-200 z-20">
        <button className="flex-1 flex flex-col items-center justify-center py-3 text-[#0D9488] dark:text-emerald-400 border-b-2 border-[#0D9488] dark:border-emerald-400 transition-colors">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mb-1">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[10px] font-medium">Conversations</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-[10px] font-medium">Knowledge Base</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="text-[10px] font-medium">Analytics</span>
        </button>
      </nav> */}
    </div>
  );
}
