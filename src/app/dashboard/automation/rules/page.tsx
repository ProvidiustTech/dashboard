"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { ArrowLeftIcon } from "lucide-react";

const LOGS = [
  { ts: "2023-11-24 14:22:01", query: '"Where is my order?"', response: '"Your order is in transit…"', status: "Success" },
  { ts: "2023-11-24 14:18:45", query: '"Track #ABC-123"', response: "—", status: "Failed" },
  { ts: "2023-11-24 13:55:12", query: '"Where is order #9900?"', response: '"Delivered on Nov 22"', status: "Success" },
  { ts: "2023-11-24 13:10:07", query: '"Order 77821 status"', response: '"In transit, ETA tomorrow"', status: "Success" },
];

export default function RuleDetailPage() {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [triggerType, setTrigger] = useState("Customer Intent");
  const [intentName, setIntent] = useState("track_order");
  const [apiUrl, setApiUrl] = useState("https://api.store.com/v1/orders/track");
  const [method, setMethod] = useState("POST");
  const [saved, setSaved] = useState(false);


  const [menuOpen, setMenuOpen] = useState(false);   // boolean is fine

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };



  const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/dashboard/automation/'); // or wherever you want to go
  }
};




  const testRule = () => {
    // TODO: Implement your test logic here
    // console.log("Testing current rule...");
    // alert("Rule test started! (Check console for details)");

    // Example real implementation:
    // fetch('/api/rules/test', {
    //   method: 'POST',
    //   body: JSON.stringify({ intent: intentName, apiUrl, method })
    // });

    router.push("/dashboard/automation/rules/test");

  };

  const deleteRule = () => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    // console.log("Deleting current rule...");
    alert("Rule deleted successfully!");

    // Redirect back to rules list after deletion
    router.push("/dashboard/automation");
  };


  return (
    <div className="flex h-screen gap-10 bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <Sidebar />

      <MobileNav/>

      <main className="flex-1 overflow-y-auto mt-20 xl:mt-10">
        {/* Top bar */}
        <header className="bg-none backdrop-blur-sm sticky  border-none px-3 py-4 flex items-center justify-between top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="xl:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors" title="Back to Automation">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-lg xl:text-2xl text-gray-900 dark:text-white transition-colors duration-200">Rule details</h1>
          </div>
          <div className="hidden xl:flex items-center gap-3 ">
            <div className="bg-white dark:bg-gray-800 p-4 px-7 transition-colors duration-200 items-center flex gap-4 rounded-full">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-bold transition-colors duration-200">Activate</span>
              <button
                type="button"
                onClick={() => setActive((v) => !v)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${active ? "bg-[#14A085]" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${active ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button
              onClick={save}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl px-6 py-4 text-sm transition-colors"
            >
              {saved ? "✓ Saved" : "Save & Publish"}
            </button>
            {/* More Options Button */}
            {/* More Options Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);        // Simple toggle
              }}
              className="w-10 h-10 flex items-center justify-center relative left-[-15px] text-gray-400 border border-none rounded-lg hover:bg-none transition-colors"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 min-w-[170px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    testRule();           // No parameter needed
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 4.01V8" />
                  </svg>
                  Test rule
                </button>

                <button
                  onClick={() => {
                    deleteRule();         // No parameter needed
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5 4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4v6m2-2v2" />
                  </svg>
                  Delete rule
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="px-5 py-6 space-y-5">

          {/* When (Trigger) */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-base"></div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">When (Trigger)</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium dark:text-white text-gray-500 mb-1.5">Trigger Type</label>
                <input
                  value={triggerType}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full border border-gray-200 dark:bg-gray-400 dark:border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#14A085] focus:ring-2 focus:ring-[#14A085]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-white text-gray-500 mb-1.5">Intent Name</label>
                <input
                  value={intentName}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full border  dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#14A085] focus:ring-2 focus:ring-[#14A085]/10"
                />
              </div>
            </div>
          </div>

          {/* Then (Actions) */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" />
                    <path d="M12 8v4l3 3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">Then (Actions)</h2>
              </div>
              <button className="text-sm font-medium text-[#14A085] hover:text-[#0d7a65] transition-colors flex items-center gap-1">
                <span>+</span> Add Step
              </button>
            </div>

            {/* API config card */}
            <div className="border dark:border-gray-600 border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 dark:border-none dark:bg-gray-600 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-400 flex items-center justify-center">
                    <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="4" rx="1" /><rect x="3" y="10" width="12" height="4" rx="1" /><rect x="3" y="17" width="8" height="4" rx="1" /></svg>
                  </div>
                  <span className="text-sm font-semibold dark:text-white text-gray-700">Call External API</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Method + URL */}
                <div className="flex gap-3">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="border  dark:bg-gray-400 dark:border-none border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-[#14A085] bg-white"
                  >
                    <option>POST</option><option>GET</option><option>PUT</option><option>DELETE</option>
                  </select>
                  <input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="flex-1  dark:bg-gray-400 dark:border-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#14A085] focus:ring-2 focus:ring-[#14A085]/10"
                  />
                </div>

                {/* Headers + Params */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium dark:text-white text-gray-500 mb-2">Headers</p>
                    <div className="bg-gray-50  dark:bg-gray-400 dark:border-none rounded-xl p-3 space-y-1">
                      <p className="text-xs dark:text-white text-gray-600 font-mono">Authorization: Bearer {"{api_key}"}</p>
                      <p className="text-xs dark:text-white text-gray-600 font-mono">Content-Type: application/json</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium dark:text-white text-gray-500 mb-2">Parameters</p>
                    <div className="bg-gray-50  dark:bg-gray-400 dark:border-none rounded-xl p-3">
                      <p className="text-xs dark:text-white text-gray-600 font-mono">order_id: {"{user_input.order_id}"}</p>
                    </div>
                  </div>
                </div>

                {/* Response Mapping */}
                <div>
                  <p className="text-xs font-medium text-[#14A085] mb-2">Response Mapping Preview</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-[#E6F7F4] text-[#14A085] px-2 py-0.5 rounded">status</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-xs text-gray-600">mapped to {"{order_status}"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Logs */}
          <div className="bg-white dark:bg-gray-900 dark:border-none rounded-2xl border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">Execution Logs</h2>
              <button className="text-sm font-medium text-gray-500 dark:border-none hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="xl:overflow-y-scroll overflow-y-auto border-none mb-10 overflow-x-scroll xl:overflow-x-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-none border-gray-100">
                    {["Timestamp", "Input Query", "AI Response", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium dark:text-white text-gray-400 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-none divide-gray-50">
                  {LOGS.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                      <td className="py-3 pr-4 text-xs dark:text-gray-300 text-gray-500 whitespace-nowrap">{log.ts}</td>
                      <td className="py-3 pr-4 text-xs dark:text-gray-400 text-gray-700">{log.query}</td>
                      <td className="py-3 pr-4 text-xs dark:text-gray-300 text-gray-500">{log.response}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${log.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${log.status === "Success" ? "bg-green-500" : "bg-red-500"}`} />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-xs font-medium text-[#14A085] hover:text-[#0d7a65] transition-colors">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}