"use client";
import { useState } from "react";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import MobileStepper from '@/components/MobileStepper'
import router from "next/dist/shared/lib/router/router";
// import { ChevronDownIcon } from "@/components/Icons";

import { useRouter } from "next/navigation"

const INDUSTRIES = [
  "E-commerce", "SaaS / Software", "Healthcare", "Finance & Banking",
  "Education", "Real Estate", "Retail", "Logistics", "Hospitality", "Other",
];
const VOLUMES = [
  "Under 100 / month", "100–500 / month", "500–2,000 / month",
  "2,000–10,000 / month", "10,000+ / month",
];
const SIZES = ["1-5", "6-20", "21-50", "50+"];

export default function WorkspacePage() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("6-20");
  const [volume, setVolume] = useState("");

  const [step, setStep] = useState(1)
  const router = useRouter()


  return (
    <div className="min-h-screen p-10 bg-[#F1F5F9] dark:bg-gray-950 flex items-center justify-center xl:pt-16 pb-16 px-4 transition-colors duration-200">
      <form action="/onboarding/channels">
        <div className=" xl:w-[100%] w-[108%] ml-[10px] xl:ml-8 xl:max-w-[750px] bg-[#F1F5F9] dark:bg-gray-950 rounded-2xl  mt-4 xl:mr-28 border-gray-100 dark:border-gray-800 xl:px-12 py-12 transition-colors duration-200">
          <div className="xl:block hidden mt-[-120px]">
            <Stepper current={2} />
          </div>

          <div className="xl:hidden block fixed top-[29px]">
            <MobileStepper current={2} onBack={() => router.back()} />

          </div>
          <div className="center mt-[35px] xl:mt-0 xl:ml-10 xl:w-[88%]">
            <h2 className="text-2xl mt-12 font-bold text-gray-900 dark:text-white mb-4 xl:mb-1 transition-colors">Set up your workspace</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 transition-colors">
              Tell us about your business to personalize your AI assistant
            </p>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Company Name</label>
                <input
                  type="text"
                  className="w-full border-none border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corporation"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Industry</label>
                <div className="relative">
                  <select
                    className={`w-full border-none border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-md bg-white dark:bg-gray-800 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 appearance-none cursor-pointer pr-10 ${industry ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"} transition-colors`}
                    value={industry}
                    required
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="" disabled>Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* <ChevronDownIcon /> */}
                  </div>
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2.5 transition-colors">Team Size</label>
                <div className="flex gap-3">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2.5 rounded-xl text-md font-medium border-none transition-all duration-150 ${size === s
                        ? "border-emerald-600 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600 dark:ring-emerald-600"
                        : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Volume */}
              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Monthly Support Volume</label>
                <div className="relative">
                  <select
                    className={`w-full border-none border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-md bg-white dark:bg-gray-800 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20 appearance-none cursor-pointer pr-10 ${volume ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"} transition-colors`}
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  >
                    <option value="" disabled>Select estimated volume</option>
                    {VOLUMES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* <ChevronDownIcon /> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              <Link href="/">
                <button type="button" className="text-gray-600 xl:block hidden dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium text-md transition-colors cursor-pointer">Back</button>
              </Link>

              <button type="submit" className="bg-[#0D9488] ml-[-50px] hover:bg-[#0D9488]-dark xl:mt-0 mt-16 text-white font-semibold rounded-xl xl:px-8 xl:py-3 px-[153px] py-4 text-sm transition-colors cursor-pointer">Continue</button>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
