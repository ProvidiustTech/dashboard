// import { CheckIcon } from "./Icons/CheckIcon";

const STEPS = [
  { n: 1, label: "Account" },
  { n: 2, label: "Workspace" },
  { n: 3, label: "Channels" },
  { n: 4, label: "Train AI" },
];

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  done || active
                    ? "bg-[#14B8A6] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {done ? <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.44651e-05 4.23087L1.40203 2.82391L3.70388 5.08598L8.8097 4.44651e-05L10.2216 1.407L3.70388 7.88996L4.44651e-05 4.23087Z" fill="white"/>
</svg>
 : step.n}
              </div>
              <span
                className={`text-sm font-medium ${
                  active ? "text-[#14B8A6]" : done ? "text-[#14B8A6]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 h-px w-14 ${
                  done ? "bg-[#14B8A6]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
