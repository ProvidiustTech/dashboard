"use client";
import Link from "next/link";
import { useState } from "react";
// import { ProvidusLogo } from "@/components/Icons";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const stats = [
    { val: "98%", label: "Resolution Rate" },
    { val: "3s",  label: "Avg Response" },
    { val: "2%",  label: "Escalation rate" },
  ];
  const mobilestats = [
    { val: "98% Resolution Rate", label: "Your AI is resolving most customer request seamlessly" },
    { val: "3s Avg Response",  label: "Customers receive replies almost instantly across all channels" },
    { val: "2% Escalation rate",  label: "AI is confidently handling most requests with minimal handoffs" },
  ];

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < stats.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 flex items-center overflow-hidden justify-center transition-colors duration-200">
      <div className="w-full  bg-white dark:bg-gray-900 h-screen xl:h-[100vh] shadow-2xl overflow-hidden flex flex-col xl:flex-row transition-colors duration-200">

        {/* ── Left teal panel ── */}
        <div  className="xl:w-[50%] h-[55vh] xl:h-screen pt-16 bg-[#0D9488] dark:bg-emerald-900 flex flex-col p-8 xl:p-16 xl:px-20 relative overflow-hidden bg-gradient-to-br from-[#0D9488] dark:from-emerald-800 to-[#0D9488]-dark dark:to-emerald-900 transition-colors duration-200">
          {/* Logo */}
          <div className="xl:block ">
            <div className="flex items-center gap-2.5 mb-12">
            <img className="xl:w-16 w-10 mt-[-10%] ml-[-1%] xl:mt-10 xl:ml-0 xl:mx-[-60px] xl:absolute" src="/logoa.png" alt="Providius Logo" />
          </div>
            <h3 className="xl:text-4xl text-2xl text-white font-bold ml-12 xl:ml-20 top-[-100%] xl:top-[-40%] relative mt-[-20]">Providius</h3>
          </div>

          {/* Headline */}
          <h1 className="text-white text-[1.7rem] xl:text-[2.8rem] xl:mt-0 mt-[-10%] font-bold leading-tight mb-8 xl:mb-4">
            Automate customer support<br />with AI intelligence
          </h1>
          <p className="text-white/80 text-[14px] xl:text-[17px] leading-relaxed xl:mt-0 mb-2 mt-[-6%] xl:mb-3">
            Reduce response time by 80% with RAG powered AI agents that understand your business.
          </p>

          {/* Photo card */}
          {/* <div className="flex-1 relative rounded-2xl overflow-hidden bg-white/10 min-h-[220px]"> */}



            {/* Placeholder image area with teal overlay feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D9488]/30 to-[#0D9488]-dark/60" />
            <img className="xl:w-[92%] mt-8 h-[43%] xl:mt-0 object-cover rounded-xl xl:h-[80%]" src="/dashboard/lady.png" alt="Customer Support Demo" />
            
            {/* Navigation dots - Mobile and Tablet only */}
            <div className="xl:hidden absolute top-[65%] right-16 flex gap-2 z-10">
              {mobilestats.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Mobile and Tablet Stats Slider */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            className="xl:hidden absolute bottom-3 w-[76%] left-44 transform -translate-x-1/2 flex gap-10 m-8">
              <div className="w-full flex gap-20 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 122}%)` }}
              >
                {mobilestats.map((s, i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-full px-4 py-3 h-20 rounded-2xl relative mt-10 bg-[#FFFFFF1A]/10 backdrop-blur-xs flex flex-col"
                  >
                    <p className="text-white font-bold text-base float-left mb-0.5">{s.val}</p>
                    <p className="text-white/70 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop and 4K Stats bar */}
            <div className="hidden xl:flex absolute bottom-10 w-[80%] xl:w-[63%] left-16 right-0 gap-10 m-10">
              {stats.map((s, i) => (
                <div key={i} className="flex-1 px-4 py-3 h-20 w-[20%] rounded-xl relative mt-10 bg-[#FFFFFF1A]/10 backdrop-blur-xs ">
                  <p className="text-white font-bold text-xl   mb-0.5">{s.val}</p>
                  <p className="text-white/70 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          {/* </div> */}
        </div>

        {/* ── Right sign-in panel ── */}
        <div className="flex-1  overflow-y-auto xl:h-screen flex h-[50%] xl:pt-0 pt-40 text-md xl:text-xl flex-col bottom-2 top-[-20px] relative justify-center px-8 sm:px-12 py-14 bg-[#F1F5F9] dark:bg-gray-900 transition-colors duration-200">
          <h2 className="text-[23px] xl:text-[39px]  mt-10  font-bold  text-gray-900 dark:text-white mb-2 text-center transition-colors">Welcome back</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm xl:text-lg xl:top-10 relative mb-9 text-center transition-colors">Sign in to your workspace</p>

          <form action="/onboarding/workspace" className="w-full">
            <div className="space-y-5 max-w-sm w-full mt-0 xl:mt-16 mx-auto">
            <div>
              <label className="block xl:text-lg font-medium text-gray-700 dark:text-gray-300 mb-5 transition-colors">Email</label>
              <input
                type="email"
                className="w-full border-none border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 xl:py-4 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20"
                placeholder="you@company.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block xl:text-lg font-medium mt-10 text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border-none border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 xl:py-4 pr-12 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 outline-none transition-all focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/10 dark:focus:ring-emerald-500/20"
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 1.657-.672 3.157-1.757 4.243A6 6 0 0121 12a6 6 0 00-6-6" />
                      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth={2} />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 dark:text-emerald-500 focus:ring-emerald-600 dark:focus:ring-emerald-500 dark:bg-gray-800 transition-colors"
                />
                <span className="text-sm xl:text-lg text-gray-600 dark:text-gray-400 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm xl:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Forgot password?
              </a>
            </div>

              <button type="submit" className="w-full bg-[#0D9488] dark:bg-[#0D9488] hover:bg-[#0a7e74] dark:hover:bg-[#0a7e74] mt-8 text-white font-semibold rounded-2xl px-6 transition-colors cursor-pointer py-3 xl:py-4 text-lg disabled:opacity-70">Sign In</button>

            <p className="text-center mt-8 text-xs xl:text-sm text-gray-400 dark:text-gray-500 transition-colors">Secured by 256-bit SSL encryption</p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
