'use client'

interface MobileStepperProps {
  current: number          // 1–4
  onBack?: () => void      // called when back arrow is tapped
}

const STEPS = [
  { n: 1, label: 'Account'    },
  { n: 2, label: 'Workspace Setup' },
  { n: 3, label: 'Connect Channels' },
  { n: 4, label: 'Train AI'   },
]

export default function MobileStepper({ current, onBack }: MobileStepperProps) {
  const step  = STEPS.find(s => s.n === current) ?? STEPS[0]
  const total = STEPS.length
  // progress bar fills proportionally: step 1 = 25%, step 2 = 50%, etc.
  const pct   = (current / total) * 100

  return (
    <div className="w-full dark:bg-gray-950 mt-[-10%] bg-[#F1F5F9]]">
      {/* ── Row: back arrow · step badge · step label ── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        {/* Back arrow */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-12 h-12 rounded-full relative left-[-22px] bg-white dark:bg-gray-100 flex items-center justify-center flex-shrink-0 active:bg-gray-200 transition-colors"
        >
          <svg width="27" height="27" fill="none" viewBox="0 0 24 24" className="">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#374151"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Teal circle with step number */}
        <div className="w-6 h-6 rounded-full bg-[#0D9488] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-medium leading-none">
            {current}
          </span>
        </div>

        {/* Step label */}
        <span className="text-gray-900 dark:text-gray-100 text-base font-semibold tracking-tight">
          {step.label}
        </span>
      </div>

      {/* ── Progress bar ── */}
      {/* Track */}
      <div className="w-full h-[5px] mt-5 rounded-xl bg-gray-200">
        {/* Fill — smooth transition when step changes */}
        <div
          className="h-full bg-[#0D9488] transition-all duration-400 ease-out rounded-xl"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}