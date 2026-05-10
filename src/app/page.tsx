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
  const [form, setForm]       = useState({ company: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.company.trim())         e.company  = 'Company name is required'
    if (!form.email.includes('@'))    e.email    = 'Enter a valid email'
    if (form.password.length < 8)     e.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    // Sanitize the base URL by removing any trailing slashes
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    const registrationUrl = `${baseUrl}/api/v1/auth/register`;

    try {
      const { confirmPassword, ...dataToSubmit } = form;
      const response = await fetch(registrationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      router.push('/onboarding/workspace');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Could not connect to the server. Please check if the backend is running.' });
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (k: string) =>
    `w-full px-4 py-3.5 rounded-xl dark:bg-gray-800 border-gray-500 dark:placeholder-gray-500 xl:text-base text-sm outline-none border transition-all duration-150 bg-white
     ${focused === k   ? 'border-teal-500 ring-4 ring-teal-500/10'
     : errors[k]       ? 'border-red-400'
     :                   'border-gray-200 hover:border-gray-300'}`

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-8">
      <div className="xl:w-[90%]  max-w-7xl flex flex-col lg:flex-row gap-6 lg:gap-16 items-center lg:items-stretch">

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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className={`${inputCls('password')} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
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

            {/* Confirm Password */}
            <div>
              <label className="block xl:text-lg dark:text-white text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                  className={`${inputCls('confirmPassword')} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Global Submit Error */}
            {errors.submit && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{errors.submit}</p>
            )}

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