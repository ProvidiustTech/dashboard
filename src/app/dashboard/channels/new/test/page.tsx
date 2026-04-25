"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChannelStepper from "@/components/Stepper";
import MobileNav from "@/components/MobileNav";
import StepperIn from "@/components/StepperIn";
import StepperDe from "@/components/StepperDe";

const SIM_MESSAGES = [
  { from: "user",  text: "Hi, where's my order? I ordered 3 days ago and haven't received any updates.", time: "10:32 AM" },
  { from: "ai",    text: "Hi Emma! I'd be happy to help you track your order. Could you please provide your order number?", time: "10:32 AM", conf: "92% confidence" },
  { from: "user",  text: "It's order #12847", time: "10:33 AM" },
  { from: "ai",    text: "Thanks! I found your order #12847. It's currently in transit and expected to arrive tomorrow by 5 PM. Here's the tracking link: track.providius.io/12847", time: "10:33 AM", conf: "88% confidence", sources: ["Order Database", "Shipping Policy"] },
];

export default function TestActivatePage() {
  const [tested, setTested]   = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runTest = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setTested(true); }, 1800);
  };

  return (
    <div className="flex flex-col xl:flex-row h-screen bg-white dark:bg-gray-950 transition-colors duration-200 overflow-hidden">
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      <MobileNav/>

      <main className="flex-1 mt-16 xl:mt-9  overflow-y-auto px-7 xl:px-6 xl:px-10 py-4 xl:py-6 xl:py-8">
        <h1 className="text-xl xl:text-3xl mb-5 xl:mb-2 font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">Add a New Channel</h1>
        <p className="text-xs xl:text-sm hidden xl:block text-gray-400 dark:text-gray-100 mb-6 transition-colors duration-200">
          Connect a communication channel to start handling customer conversations with AI.
        </p>

        <div className="block xl:hidden mb-6 xl:mb-8">
                 <StepperIn current={3} />
               </div>
        <div className="hidden xl:block mb-6 xl:mb-8">
                 <StepperDe current={3} />
               </div>


        <p className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 mb-4 xl:mb-5">
          Run a simulated chat here to ensure your AI is functioning correctly and then activate the channel
        </p>

        {/* Chat preview window */}
        <div className="max-w-5xl border border-gray-200 dark:border-gray-700 rounded-lg xl:rounded-2xl bg-white dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-2 xl:gap-3 px-3 xl:px-5 py-3 xl:py-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
            <div className="w-7 xl:w-8 h-7 xl:h-8 rounded-lg bg-orange-500 dark:bg-orange-600 flex transition-colors duration-200 items-center justify-center text-white text-[10px] xl:text-xs font-bold flex-shrink-0">
              TC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200">Temu Company</p>
              <p className="text-[10px] xl:text-xs text-gray-400 dark:text-gray-500 transition-colors duration-200">Business Account</p>
            </div>
            {/* Expand icon */}
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="px-3 xl:px-5  py-3 xl:py-5 space-y-3 xl:space-y-4 xl:max-h-[820px] max-h-[280px] overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
            {!tested && !loading && (
              <div className="flex items-center justify-center h-32 xl:h-48 text-xs xl:text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200 text-center px-2">
                Press &ldquo;Run Test&rdquo; to simulate a conversation
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-32 xl:h-48 gap-2 text-xs xl:text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
                <svg className="animate-spin w-4 h-4 text-[#14A085]" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
                Running simulation…
              </div>
            )}

            {tested && !loading && SIM_MESSAGES.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "ai" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[78%]">
                  <div
                    className={`px-3 xl:px-4 py-2 xl:py-3 rounded-lg xl:rounded-2xl text-xs xl:text-sm leading-relaxed ${
                      msg.from === "ai"
                        ? "bg-emerald-600 dark:bg-emerald-600 text-white transition-colors duration-200 rounded-br-sm"
                        : "bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 text-gray-800 dark:text-gray-200 transition-colors duration-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                    {msg.from === "ai" && msg.sources && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <p className="text-[9px] xl:text-[11px] text-white/70 mb-1">📎 Sources used:</p>
                        <p className="text-[9px] xl:text-[11px] text-white/80">{msg.sources.join(", ")}</p>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${msg.from === "ai" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[9px] xl:text-[11px] text-gray-400">{msg.time}</span>
                    {msg.conf && (
                      <>
                        <span className="text-[9px] xl:text-[11px] text-gray-300">·</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#14A085" strokeWidth="2"/>
                          <path d="M12 8v4l3 3" stroke="#14A085" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[9px] xl:text-[11px] text-gray-400">AI · {msg.conf}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 xl:gap-3 mt-4 xl:mt-6 max-w-5xl flex-wrap">
          {tested ? (
            <>
              <button
                type="button"
                onClick={() => { setTested(false); runTest(); }}
                className="text-xs xl:text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 xl:px-5 py-2 xl:py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg xl:rounded-xl transition-colors"
              >
                Re-run test
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="bg-[#14A085] hover:bg-[#0d7a65] dark:bg-[#0D9488] dark:hover:bg-[#0D8488] text-white font-semibold rounded-lg xl:rounded-xl px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm transition-colors"
              >
                Activate Channel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={runTest}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#14A085] hover:bg-[#0d7a65] dark:bg-[#0D9488] dark:hover:bg-[#0D8488] text-white font-semibold rounded-lg xl:rounded-xl px-6 xl:px-8 py-2 xl:py-3 text-xs xl:text-sm transition-colors disabled:opacity-60 w-full xl:w-auto"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.07 4.93C18.1595 4.01632 17.0793 3.28936 15.89 2.79C14.6596 2.26807 13.3366 1.99939 12 2C11.45 2 11 2.45 11 3V8H13V4.06C13.73 4.15 14.44 4.34 15.11 4.63C16.06 5.03 16.92 5.61 17.65 6.35C18.38 7.08 18.96 7.94 19.36 8.89C19.78 9.88 19.99 10.92 19.99 12C19.99 13.08 19.78 14.13 19.36 15.11C18.96 16.06 18.38 16.92 17.65 17.65C16.92 18.38 16.06 18.96 15.11 19.37C13.14 20.2 10.85 20.2 8.88 19.37C7.93 18.97 7.07 18.39 6.34 17.65C5.61178 16.9213 5.03114 16.0589 4.63 15.11C4.21 14.12 4 13.08 4 12C4 10.92 4.21 9.87 4.63 8.89C5.03 7.94 5.61 7.08 6.34 6.35L4.93 4.93C4.01 5.85 3.29 6.92 2.79 8.11C2.27 9.34 2 10.65 2 12C2 13.35 2.26 14.66 2.79 15.89C3.29 17.08 4.02 18.15 4.93 19.07C5.85 19.99 6.92 20.71 8.11 21.21C9.34 21.73 10.65 22 12 22C13.35 22 14.66 21.74 15.89 21.21C17.08 20.71 18.15 19.99 19.07 19.07C19.99 18.15 20.71 17.08 21.21 15.89C21.73 14.66 22 13.35 22 12C22 10.65 21.74 9.34 21.21 8.11C20.71 6.92 19.98 5.85 19.07 4.93Z" fill="#E6E6E6"/>
<path d="M12.88 11.12L8 8L11.12 12.88C12.34 14.56 14.57 12.33 12.89 11.11L12.88 11.12Z" fill="#E6E6E6"/>
</svg>

              )}
              Run Test
            </button>
          )}
        </div>
      </main>
    </div>
  );
}