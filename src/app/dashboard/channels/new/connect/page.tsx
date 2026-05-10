"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Stepperj from "@/components/Stepperj";
import MobileNav from "@/components/MobileNav";

import { CheckIcon, WhatsAppIcon, Telegram, WebChatIcon, EmailIcon, InstagramIcon } from "@/components/Icons";
import StepperIn from "@/components/StepperIn";
import StepperDe from "@/components/StepperDe";



export default function ConnectAccountPage() {
  const [phone, setPhone]   = useState("+234 8160 5824 60");
  const [token, setToken]   = useState("EAAN2aW5zCVB0B026SR17");
  const router = useRouter();




  return (
    <div className="flex flex-col xl:flex-row h-screen bg-[#F7FAFC] dark:bg-gray-950 transition-colors duration-200 overflow-hidden">
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      <MobileNav/>

      <main className="flex-1 overflow-y-auto mt-16 xl:mt-9 ml-1 xl:ml-5  px-7 py-4 xl:py-8">
        <h1 className="text-xl xl:text-3xl xl:mb-2 font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">Add a New Channel</h1>
        <p className="text-xs xl:text-sm hidden xl:block text-gray-400 dark:text-gray-100 mb-6 transition-colors duration-200">
          Connect a communication channel to start handling customer conversations with AI.
        </p>

        <div className="block xl:hidden mb-6 xl:mb-8">
                 <StepperIn current={2} />
               </div>
        <div className="hidden xl:block mb-6 xl:mb-8">
                 <StepperDe current={2} />
               </div>



        {/* Form card */}
        <div className="max-w-2xl justify-center xl:mx-0 border border-gray-200 dark:border-gray-800 rounded-lg xl:rounded-xl p-6 xl:p-10 mx-auto transition-colors duration-200">
          <h2 className="text-base xl:text-lg text-gray-900 dark:text-white mb-6 transition-colors duration-200">
            Connect Your WhatsApp business account to Providus
          </h2>

          <div className="space-y-4 xl:space-y-5">
            <div>
              <label className="block text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 transition-colors duration-200">Business Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 8160 5824 60"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg xl:rounded-xl px-3 xl:px-4 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 transition-colors duration-200">Account API Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your API token here"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg xl:rounded-xl px-3 xl:px-4 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex justify-center xl:justify-end mt-6 xl:mt-8">
            <button
              type="button"
              onClick={() => router.push("/dashboard/channels/new/verify")}
              className="w-full xl:w-auto bg-[#0D9488] hover:bg-[#0D9488] dark:bg-[#0D9488] dark:hover:bg-[#0D8488] duration-200 text-white font-semibold rounded-lg xl:rounded-xl px-6 xl:px-16 py-2.5 xl:py-3 text-xs xl:text-sm transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}