"use client";
import { useState } from "react";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import { CheckIcon, WhatsAppIcon, Telegram, WebChatIcon, EmailIcon, InstagramIcon } from "@/components/Icons";
import MobileStepper from '@/components/MobileStepper'
import { useRouter } from "next/navigation"

const CHANNELS = [
  { id: "whatsapp", Icon: WhatsAppIcon, name: "WhatsApp", desc: "Connect your WhatsApp Business account", popular: true },
  { id: "telegram", Icon: Telegram, name: "Telegram", desc: "Engage with your audience in real-time" },
  { id: "webchat", Icon: WebChatIcon, name: "Website Chat", desc: "Embed a chat widget on your website" },
  { id: "email", Icon: EmailIcon, name: "Email", desc: "Automate responses from your support inbox" },
  { id: "instagram", Icon: InstagramIcon, name: "Instagram", desc: "Respond to DMs automatically" },
];

export default function ChannelsPage() {
  const [selected, setSelected] = useState<string[]>(["whatsapp"]);
  const router = useRouter();

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("providius_onboarding_channels", JSON.stringify(selected));
    router.push("/onboarding/train");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-gray-950 flex flex-col items-center justify-center transition-colors duration-200 px-4 py-16">
      <div className="w-full max-w-[750px]">
        <div className="xl:block hidden mt-5">
          <Stepper current={3} />
        </div>

        <div className="xl:hidden block relative mb-8">
                    <MobileStepper current={3} onBack={() => router.back()} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full mt-16 ">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 xl:text-center transition-colors duration-200">Connect your support channels</h2>
            <p className="text-gray-400 text-sm mb-8 dark:text-white xl:text-center transition-colors duration-200">Add a channel for your&nbsp;business support</p>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:max-w-6xl">
              {CHANNELS.map(({ id, Icon, name, desc, popular }) => {
                const on = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={`relative h-40 xl:h-64 w-44 xl:w-full rounded-2xl p-4 cursor-pointer transition-all duration-150  text-left ${on ? "border-[#00A389] border bg-[#E6F6F3]" : "border-gray-200 hover:border-[#0D9488] hover:bg-[#F0FDFA]"}`}
                  >
                    {popular && (
                      <span className="absolute top-3 left-3 bg-[#0D9488] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div className="absolute top-3 right-3 ">
                      <div
                        className={`h-4 w-4 xl:w-5 xl:h-5 pt-1 rounded-full border-2 flex items-center justify-center transition-colors ${on ? "border-none dark:text-black " : "border-gray-300"
                          }`}
                      >
                        {on && <CheckIcon />}
                      </div>
                    </div>
                    <div className={popular ? "mt-6 xl:mb-3" : "mb-3"}>
                      <Icon />
                    </div>
                    <p className="font-semibold dark:text-gray-500 text-gray-900 text-lg mb-1">{name}</p>
                    <p className="text-gray-400 xl:mt-6 text-[10px] xl:text-sm leading-snug">{desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              <Link href="/onboarding/workspace">
                <button type="button" className="text-gray-600 xl:block hidden hover:text-gray-900 font-medium text-sm transition-colors cursor-pointer">Back</button>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="xl:block hidden">
                  <button type="button" className="border border-gray-200 dark:text-black hover:border-gray-300 text-gray-600 hover:text-gray-700 font-medium rounded-xl px-6 py-3 text-sm transition-colors cursor-pointer bg-white">Skip</button>
                </Link>
                <button type="submit" className="bg-[#0D9488]  mb-9 ml-[-40px] xl:ml-3 hover:bg-[#0D9488]-dark xl:mt-0 mt-8 text-white font-semibold rounded-xl xl:px-8 xl:py-3 px-[153px] py-4 text-sm transition-colors cursor-pointer">Continue</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}