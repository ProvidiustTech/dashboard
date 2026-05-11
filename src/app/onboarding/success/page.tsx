"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full dark:bg-slate-800 bg-[#E0EFE9] opacity-60 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full dark:bg-slate-800 bg-[#D9EDF7] opacity-60 blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full dark:bg-slate-800 bg-[#E8F5E9] opacity-40 blur-2xl" />
            </div>

            {/* Card */}
            <div
                className={`relative z-10 bg-white dark:bg-gray-950 dark:border-2 dark:border-gray-800 rounded-3xl shadow-xl w-full max-w-3xl px-8 py-40 flex flex-col items-center text-center
          transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                {/* Confetti Emoji */}
                <div
                    className={`text-6xl mb-5 transition-all duration-700 delay-200
            ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                    aria-hidden="true"
                >
                    🎊
                </div>

                {/* Badge */}
                <span
                    className={`inline-block bg-[#E6F7F4] text-[#1BAA87] text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full mb-5
            transition-all duration-700 delay-300
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    Setup complete
                </span>

                {/* Headline */}
                <h1
                    className={`text-[#1A1F2E] dark:text-white font-bold text-2xl sm:text-3xl leading-tight mb-4
            transition-all duration-700 delay-400
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    Your AI support is ready to go!
                </h1>

                {/* Subtext */}
                <p
                    className={`text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-sm mb-8
            transition-all duration-700 delay-500
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    Your workspace is configured, channels are connected, and your AI has
                    been trained. You&apos;re all set to automate your customer support.
                </p>

                {/* CTA Button */}
                <Link
                    href="/login"
                    className={`w-full sm:w-auto inline-flex items-center justify-center
            bg-[#0D9488] hover:bg-[#169A79] active:bg-[#0D9488]
            text-white font-semibold text-base px-10 py-3.5 rounded-2xl
             shadow-md hover:shadow-lg
            transition-all duration-700 delay-600
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                    Go to Login
                </Link>

                {/* Helper text */}
                <p
                    className={`mt-5 text-xs text-[#9CA3AF]
            transition-all duration-700 delay-700
            ${visible ? "opacity-100" : "opacity-0"}`}
                >
                    You can always revisit setup from{" "}
                    <Link
                        href="/dashboard/settings"
                        className="underline underline-offset-2 hover:text-[#1BAA87] transition-colors"
                    >
                        Settings
                    </Link>
                </p>
            </div>
        </div>
    );
}
