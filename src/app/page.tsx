'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BENEFITS = [
  {
    title: 'Free Onboarding to Get Started',
    desc: 'Up to 1,000 AI-handled conversations/month, Basic dashboard access, Multi-channel support (WhatsApp + Web), Free tier resets every month',
  },
  {
    title: 'Built for Real Customer Conversations',
    desc: 'Not just chatbots, actual support automation. Learns from your business data, Handles FAQs, complaints, and inquiries, Smart escalation to human agents, Designed for real-world customer scenarios',
  },
  {
    title: 'Trusted by Growing Businesses',
    desc: 'Built for teams that want to scale support without scaling cost. Designed for High impact Industries, Handles high message volume effortlessly.',
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ company: '', email: '', password: '' })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.company.trim())         e.company  = 'Company name is required'
    if (!form.email.includes('@'))    e.email    = 'Enter a valid email'
    if (form.password.length < 8)     e.password = 'Minimum 8 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    // TODO: call auth.register(form) here
    await new Promise(r => setTimeout(r, 900))   // simulated delay
    router.push('/onboarding/workspace')
  }

  const inputCls = (k: string) =>
    `w-full px-4 py-3.5 rounded-xl dark:bg-gray-800 border-gray-500 dark:placeholder-gray-500 xl:text-base text-sm outline-none border-1 transition-all duration-150 bg-white
     ${focused === k   ? 'border-teal-500 ring-4 ring-teal-500/10'
     : errors[k]       ? 'border-red-400'
     :                   'border-gray-200 hover:border-gray-300'}`

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-stretch">

        {/* ── LEFT — benefits ─────────────────────────────────────── */}
        <div className="w-full lg:w-[60%] flex flex-col justify-between py-4 lg:py-10 px-2">

          {/* Logo */}
          <div className="xl:block ">
            <div className="flex items-center gap-2.5 mb-12">
            <img className="xl:w-16 w-10 mt-[5%] ml-[-1%] xl:mt-10 xl:ml-0 xl:mx-[-60px] xl:absolute" src="/logoa.png" alt="Providius Logo" />
          </div>
            <h3 className="xl:text-4xl text-2xl dark:text-white text-black font-bold ml-12 xl:ml-20 top-[-80px] xl:top-[-50%] relative mt-[-0]">Providius</h3>
          </div>

          {/* Benefit rows */}
          <div className="flex-1 mt-[-50px] xl:mt-0 space-y-8">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full border-2 border-teal-500 flex items-center justify-center">
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5l3 3 6-7" stroke="#0D9488" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium dark:text-white text-gray-900 xl:text-xl text-sm mb-1">{b.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 xl:text-base text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tip */}
          <div className="mt-10 border border-gray-200 rounded-2xl px-5 py-4 bg-white xl:text-sm text-xs text-gray-500 leading-relaxed">
            Did you know? Early users of{' '}
            <span className="text-teal-600 font-semibold">Providiustech V1</span>{' '}
            get priority access to new technologies in our AI features and integrations as we roll them out.
          </div>
        </div>

        {/* ── RIGHT — form card ────────────────────────────────────── */}
        <div className="w-full lg:w-[65%] bg-white dark:bg-gray-900 dark:border dark:border-gray-600 rounded-2xl shadow-sm px-8 sm:px-12 py-10 sm:py-12 flex flex-col justify-center">
          <h1 className="xl:text-5xl text-3xl font-medium dark:text-white text-gray-900 text-center mb-2 tracking-tight">
            Get Started
          </h1>
          <p className="text-gray-400 text-sm text-center mb-9">
            Sign up to set up your workspace
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Company */}
            <div>
              <label className="block xl:text-lg text-sm font-medium dark:text-white text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="company name here"
                value={form.company}
                onChange={set('company')}
                onFocus={() => setFocused('company')}
                onBlur={() => setFocused('')}
                className={inputCls('company')}
              />
              {errors.company && (
                <p className="text-xs text-red-500 mt-1">{errors.company}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block xl:text-lg dark:text-white text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                className={inputCls('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block xl:text-lg dark:text-white text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                className={inputCls('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[3, 6, 9].map(threshold => (
                    <div key={threshold}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        form.password.length >= threshold
                          ? threshold === 9 ? 'bg-teal-500'
                          : threshold === 6 ? 'bg-amber-400'
                          : 'bg-red-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-xl py-4 rounded-xl bg-teal-600 hover:bg-teal-700
                         text-white font-medium text-[15px]
                         transition-all active:scale-[0.99]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3"
                          strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
              )}
              {loading ? 'Creating workspace…' : 'Continue'}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <p className="xl:text-lg text-sm dark:text-white text-gray-500">
              Already have an account?{' '}
              <Link href="/login/" className="text-teal-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              Trying to join an existing organisation
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}