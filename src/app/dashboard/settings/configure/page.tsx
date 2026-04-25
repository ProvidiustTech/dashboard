'use client'
import { useState, Suspense } from 'react'
export const dynamic = 'force-dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

const TONES = ['Friendly', 'Professional', 'Casual']

const AGENTS = [
  { initials: 'EW', name: 'Emma Wilson' },
  { initials: 'MC', name: 'Mike Chen' },
  { initials: 'SO', name: 'Sara Okafor' },
]

function ConfigureChannelPageInner() {
  const router      = useRouter()
  const params      = useSearchParams()
  const channelId   = params.get('channelId')
  const channelName = params.get('channelName') || 'WhatsApp'
  const returnTo    = params.get('returnTo') || '/dashboard/channels/new/test' // where Save goes

  const [aiAuto, setAiAuto]       = useState(true)
  const [tone, setTone]           = useState('')
  const [confidence, setConf]     = useState(80)
  const [agentOpen, setAgentOpen] = useState(false)
  const [agent, setAgent]         = useState(AGENTS[0])
  const [saved, setSaved]         = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push(returnTo)
    }, 1000)
  }

  return (
<div className="flex h-screen gap-16 bg-[#F1F5F9] overflow-hidden">
      <Sidebar />


      <MobileNav/>

      {/* Desktop Layout */}
      <div className="hidden xl:flex h-[91.5%] flex-1 w-[40%] mt-10 overflow-hidden">
      <nav className="w-48 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 pt-8 px-3 transition-colors">
        {['General', 'Integrations', 'Team Members', 'Billing', 'API Keys', 'Notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => tab !== 'Integrations' && router.push('/dashboard/settings')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
              tab === 'Integrations'
                ? 'text-[#14A085] font-medium bg-[#E6F7F4] dark:bg-[#0d7a65]/30'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className='w-[94vw]'>
        <main className="flex-1 w-[78%] overflow-y-auto px-10 py-8 pb-24 relative bg-white dark:bg-gray-900 transition-colors">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-1 transition-colors">Configure your channel settings</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 transition-colors">
          Customize how your AI handles customer conversations on this channel
          {/* {channelName && <> — <span className="text-[#14A085] font-medium">{channelName}</span></>} */}
        </p>

        <div className=" space-y-8">

          {/* ── AI Behaviour ── */}
          <section>
            <h3 className="text-lg  text-gray-900 mb-5">AI Behaviour</h3>

            {/* Toggle */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <span className="text-sm text-gray-700">Use AI Auto - Response</span>
              <button
                type="button"
                onClick={() => setAiAuto(v => !v)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${aiAuto ? 'bg-[#14A085]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${aiAuto ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Tone */}
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-800 mb-3">Select response tone</p>
              <div className="space-y-0 border bg-white border-gray-100 rounded-xl overflow-hidden">
                {TONES.map((t, i) => (
                  <label
                    key={t}
                    className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${i < TONES.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    {/* Custom radio */}
                    <div
                      onClick={() => setTone(t)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${tone === t ? 'border-[#14A085]' : 'border-gray-300'}`}
                    >
                      {tone === t && <div className="w-2.5 h-2.5 rounded-full bg-[#14A085]" />}
                    </div>
                    <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ── AI Confidence Level ── */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-1">AI Confidence Level</h3>
            <p className="text-sm text-gray-400 mb-8">
              Adjust how much your AI should escalate to human agents versus automating responses.
            </p>

            <div className="relative">
              {/* Tooltip + label row */}
              <div className="flex items-end justify-end mb-1">
                <span className="text-xs text-gray-500 mr-2">Escalate to Human Agent</span>
              </div>

              {/* Slider with floating badge */}
              <div className="relative mb-1 my-12">
                {/* Badge */}
                <div
                  className="absolute -top-8 transition-all duration-150 pointer-events-none"
                  style={{ left: `calc(${confidence}% - 20px)` }}
                >
                  <div className="bg-[#14A085] text-white text-xs font-bold px-2.5 py-0.5 rounded-lg">
                    {confidence}%
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={confidence}
                  onChange={e => setConf(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #14A085 ${confidence}%, #e2e8f0 ${confidence}%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>More Escalation</span>
                <span>More Automation</span>
              </div>
            </div>
          </section>

          {/* ── Escalation Rules ── */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Escalation Rules</h3>
            <p className="text-sm text-gray-500 mb-4">Assigned Human Agent</p>

            {/* Agent dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAgentOpen(v => !v)}
                className="w-full border-none flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {agent.initials}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{agent.name}</span>
                </div>
                <svg
                  width="16" height="16" fill="none" viewBox="0 0 24 24"
                  className={`text-gray-400 transition-transform ${agentOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {agentOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                  {AGENTS.map(a => (
                    <button
                      key={a.name}
                      onClick={() => { setAgent(a); setAgentOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E6F7F4] flex items-center justify-center text-xs font-bold text-[#14A085]">
                        {a.initials}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{a.name}</span>
                      {agent.name === a.name && (
                        <svg className="ml-auto text-[#14A085]" width="14" height="14" fill="none" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-3">
              If AI confidence is {confidence}% and below escalate to human agent assigned for this channel
            </p>
          </section>
        </div>

        {/* Save button — fixed bottom right */}
        <div className="fixed bottom-0 mb-6 right-3 bg-none border-none border-gray-100 px-10 py-4 flex justify-end z-20">
          <button
            onClick={save}
            className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-20 py-3 text-sm transition-colors min-w-[140px] text-center"
          >
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </main>
      </div>
      </div>

      {/* Mobile Layout */}
      <div className="xl:hidden flex flex-col flex-1 mt-20 overflow-hidden bg-white dark:bg-gray-900 transition-colors">
        {/* Mobile Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-0.5">Configure Settings</h2>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            Customize your channel settings
          </p>
        </div>

        {/* Mobile Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-20">
          <div className="space-y-6 sm:space-y-8">

            {/* ── AI Behaviour ── */}
            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5">AI Behaviour</h3>

              {/* Toggle */}
              <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Use AI Auto - Response</span>
                <button
                  type="button"
                  onClick={() => setAiAuto(v => !v)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 flex-shrink-0 ${aiAuto ? 'bg-[#14A085]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${aiAuto ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Tone */}
              <div className="mt-4 sm:mt-5">
                <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Select response tone</p>
                <div className="space-y-0 border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden transition-colors">
                  {TONES.map((t, i) => (
                    <label
                      key={t}
                      className={`flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${i < TONES.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                    >
                      {/* Custom radio */}
                      <div
                        onClick={() => setTone(t)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${tone === t ? 'border-[#14A085]' : 'border-gray-300'}`}
                      >
                        {tone === t && <div className="w-2 h-2 rounded-full bg-[#14A085]" />}
                      </div>
                      <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* ── AI Confidence Level ── */}
            <section>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">AI Confidence Level</h3>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4 sm:mb-8">
                Adjust how much your AI should escalate to human agents versus automating responses.
              </p>

              <div className="relative">
                {/* Tooltip + label row */}
                <div className="flex items-end justify-end mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2\">Escalate to Human Agent</span>
                </div>

                {/* Slider with floating badge */}
                <div className="relative mb-1 my-8 sm:my-12">
                  {/* Badge */}
                  <div
                    className="absolute -top-6 sm:-top-8 transition-all duration-150 pointer-events-none"
                    style={{ left: `calc(${confidence}% - 20px)` }}
                  >
                    <div className="bg-[#14A085] text-white text-xs font-bold px-2.5 py-0.5 rounded-lg\">
                      {confidence}%
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={confidence}
                    onChange={e => setConf(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #14A085 ${confidence}%, #e2e8f0 ${confidence}%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                  <span>More Escalation</span>
                  <span>More Automation</span>
                </div>
              </div>
            </section>

            {/* ── Escalation Rules ── */}
            <section>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Escalation Rules</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Assigned Human Agent</p>

              {/* Agent dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAgentOpen(v => !v)}
                  className="w-full border-none flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-3 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                      {agent.initials}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate\">{agent.name}</span>
                  </div>
                  <svg
                    width="16" height="16" fill="none" viewBox="0 0 24 24"
                    className={`text-gray-400 transition-transform flex-shrink-0 ${agentOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {agentOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-10 transition-colors">
                    {AGENTS.map(a => (
                      <button
                        key={a.name}
                        onClick={() => { setAgent(a); setAgentOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#E6F7F4] dark:bg-[#0d7a65]/30 flex items-center justify-center text-xs font-bold text-[#14A085] flex-shrink-0">
                          {a.initials}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 min-w-0 truncate\">{a.name}</span>
                        {agent.name === a.name && (
                          <svg className="ml-auto text-[#14A085] flex-shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                If AI confidence is {confidence}% and below escalate to human agent assigned for this channel
              </p>
            </section>
          </div>
        </main>

        {/* Mobile Save Button - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-4 flex justify-end z-20 transition-colors">
          <button
            onClick={save}
            className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm transition-colors min-w-[120px] text-center\"
          >
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>

  )

  // Original fixed button - keep for desktop
  const OriginalSaveButton = () => (
    <div className="fixed bottom-0 mb-6 right-3 bg-none border-none border-gray-100 px-10 py-4 flex justify-end z-20">
      <button
        onClick={save}
        className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-20 py-3 text-sm transition-colors min-w-[140px] text-center"
      >
        {saved ? '✓ Saved' : 'Save'}
      </button>
    </div>
  );
}

export default function ConfigureChannelPage() {
  return <Suspense><ConfigureChannelPageInner /></Suspense>
}