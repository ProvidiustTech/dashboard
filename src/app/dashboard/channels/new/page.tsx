"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { CheckIcon, WhatsAppIcon, Telegram, WebChatIcon, EmailIcon, InstagramIcon } from "@/components/Icons";
import Link from "next/dist/client/link";
import MobileNav from "@/components/MobileNav";
import StepperIn from "@/components/StepperIn";
import StepperDe from "@/components/StepperDe";



const CHANNELS = [
  { id: "whatsapp",  Icon: WhatsAppIcon,  name: "WhatsApp",     desc: "Connect your WhatsApp Business account", popular: true },
  { id: "x",         Icon: Telegram,         name: "Telegram",            desc: "Engage with your audience in real-time" },
  { id: "webchat",   Icon: WebChatIcon,   name: "Website Chat", desc: "Embed a chat widget on your website" },
  { id: "email",     Icon: EmailIcon,     name: "Email",        desc: "Automate responses from your support inbox" },
  { id: "instagram", Icon: InstagramIcon, name: "Instagram",    desc: "Respond to DMs automatically" },
];

export default function AddChannelPage() {
  const [selected, setSelected] = useState("whatsapp");


  return (
    <div className="flex flex-col xl:flex-row h-screen bg-[#F7FAFC] dark:bg-gray-950 transition-colors duration-200 overflow-hidden">
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      <MobileNav/>

      <main className="flex-1 overflow-y-auto mt-40 xl:mt-9 xl:ml-5 ml-3 px-4 py-4  xl:py-8 pb-8">
        {/* Page header */}
        <h1 className="text-xl xl:text-3xl xl:mb-2 font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">Add a New Channel</h1>
        <p className="text-xs xl:text-sm hidden xl:block text-gray-400 dark:text-gray-100 mb-6 xl:mb-8 transition-colors duration-200">
          Connect a communication channel to start handling customer conversations with AI.
        </p>

        {/* Sub-stepper */}
        
        <div className="block fixed backdrop-blur-sm xl:hidden mt-[-147px] w-[90%] pt-4 h-20 mb-6 xl:mb-8">
                         <StepperIn current={1} />
                       </div>
        <div className="hidden xl:block mb-6 xl:mb-8">
                 <StepperDe current={1} />
               </div>

        {/* Channel grid */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-9 xl:max-w-[95%] max-w-6xl mb-6 xl:mb-8">
          {CHANNELS.map(({ id, Icon, name, desc, popular }) => {
            const on = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`relative h-56 xl:h-64 rounded-lg xl:rounded-2xl p-3 xl:p-6 cursor-pointer transition-all duration-150 text-left border-2 ${on ? "border-[#0D9488] bg-[#E6F6F3] dark:bg-opacity-20" : "border-gray-200 dark:border-gray-700 hover:border-[#0D9488] hover:bg-[#F0FDFA] dark:hover:bg-gray-800"}`}
              >
                {popular && (
                  <span className="absolute top-2 xl:top-3 left-2 xl:left-3 bg-[#0D9488] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="absolute top-2 xl:top-3 right-2 xl:right-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      on ? "border-[#0D9488] pt-1" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {on && <CheckIcon  />}
                  </div>
                </div>
                <div className={popular ? "mt-6 xl:mt-8 mb-2 xl:mb-3" : "mb-2 xl:mb-3"}>
                  <Icon  />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-base xl:text-lg mb-1">{name}</p>
                <p className="text-gray-400 dark:text-gray-100 mt-3 xl:mt-6 text-xs xl:text-sm leading-snug line-clamp-3">{desc}</p>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="flex justify-end mt-6 xl:mt-8">
          <Link href="/dashboard/channels/new/connect">
            <button
              type="button"
              className="bg-[#0D9488] hover:bg-[#0a6b60] xl:mr-16 dark:bg-[#0D9488] dark:hover:bg-[#0D8488] text-white font-semibold rounded-lg xl:rounded-xl px-6 xl:px-8 py-2.5 xl:py-3 text-xs xl:text-sm transition-colors cursor-pointer"
            >
              Continue
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
