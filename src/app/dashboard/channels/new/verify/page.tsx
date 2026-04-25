"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChannelStepper from "@/components/Stepper";
import MobileNav from "@/components/MobileNav";
import StepperIn from "@/components/StepperIn";
import StepperDe from "@/components/StepperDe";


export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    text.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  };

  const filled = otp.every((d) => d !== "");

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


        {/* OTP card */}
        <div className="max-w-xl w-full border border-gray-200 dark:border-gray-800 rounded-lg xl:rounded-xl p-6 xl:p-10 mx-auto transition-colors duration-200">
          <h2 className="text-lg xl:text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Verify Email OTP</h2>
          <p className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 mb-6 xl:mb-8 transition-colors duration-200">
            Enter the OTP sent to{" "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">pat*******gmail.com</span>
            {" "}to complete Account Connection
          </p>

          {/* 6 OTP boxes */}
          <div className="flex gap-2 xl:gap-3 mb-6 xl:mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`flex-1 h-11 xl:h-12 w-10 xl:w-5 text-center text-lg font-semibold rounded-lg xl:rounded-xl border-2 outline-none transition-all dark:bg-gray-800 dark:text-white ${
                  digit
                    ? "border-emerald-600 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-[#14A085]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => { if (filled) router.push("/dashboard/channels/new/configure"); }}
            className={`w-full py-2.5 xl:py-3 rounded-lg xl:rounded-xl font-semibold text-xs xl:text-sm transition-all ${
              filled
                ? "bg-emerald-600 dark:bg-emerald-600 hover:bg-[#0d7a65] text-white"
                : "bg-emerald-600/50 dark:bg-emerald-600/40 text-white cursor-not-allowed"
            }`}
          >
            Verify
          </button>

          <p className="text-center mt-3 xl:mt-4 text-xs xl:text-sm text-gray-400">
            {"Didn't receive code? "}
            <button className="text-[#14A085] font-medium hover:underline">Resend OTP</button>
          </p>
        </div>
      </main>
    </div>
  );
}