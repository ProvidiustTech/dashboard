// import { CheckIcon } from "./Icons/CheckIcon";

import { useState } from "react";


const SUB_STEPS = [
  { n: 1, label: "Select" },
  { n: 2, label: "Connect" },
  { n: 3, label: "Configure" },
  { n: 4, label: "Test & Activate" },
];


export default function Stepper({ current }: { current: number }) {

  const [selected, setSelected] = useState("whatsapp");

  return (
    <div className=" xl:w-20 mb-16">
      <div className="flex items-center space-x-2 mb-6 xl:mb-10 gap-2 xl:gap-4">
        {SUB_STEPS.map((step, i) => {
          const done = step.n < current;
          const active = step.n === current;
          return (
            <div key={step.n} className="w-20 xl:w-56  items-center">
              <div className="flex items-center gap-1 xl:gap-2">
                <div
                  className={`w-8 xl:w-7 h-8 xl:h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${done || active ? "bg-[#0D9488] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}
                >
                  {done ? <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.44651e-05 4.23087L1.40203 2.82391L3.70388 5.08598L8.8097 4.44651e-05L10.2216 1.407L3.70388 7.88996L4.44651e-05 4.23087Z" fill="white" />
                  </svg> : step.n}
                </div>
              </div>

              <span
                className={`text-[10px]  justify-center items-center space-x-3 xl:text-sm font-medium whitespace-nowrap ${active ? "text-[#0D9488]" : done ? "text-[#0D9488]" : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
