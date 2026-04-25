'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

const CONTENT = `Return Policy FAQ
Our return policy allows customers to return items within 30 days of purchase. Items must be in original packaging and unused condition.

Q: How do I start a return?
A: Log into your account, go to 'Orders', and select 'Request Return'.

Q: What is the return policy?
A: You can return items within 30 days of receipt for a full refund.

Q: Can I exchange an item?
A: Yes, you can exchange items within the return period by selecting 'Request Exchange'.

Q: How long does it take to process a return?
A: Returns are typically processed within 5-7 business days after we receive the item.

Q: Are return shipping costs covered?
A: Return shipping is free for orders over $50.

Q: How long does it take to process a return?
A: Returns are typically processed within 5-7 business days.

Q: What if my item is damaged?
A: Contact customer service to initiate a return for damaged items.

Q: Can I return sale items?
A: Sale items can be returned as long as they are within the return window.

Q: Where do I send my return?
A: Returns should be sent to the address provided in your return label.`

const SUGGESTIONS = [
  { title: 'Clarify Return Window', desc: 'Users often ask if the 30 days starts from purchase or delivery date.', action: 'Apply Suggestion' },
  { title: 'Add International Policy', desc: 'You mention domestic shipping, but 15% of queries are about international returns.', action: 'Apply Suggestion' },
]

export default function ContentEditorPage() {
  const router = useRouter()
  const [content, setContent] = useState(CONTENT)

  return (
       <div className="flex gap-16 h-screen bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
         <Sidebar />

         <MobileNav/>

     <div className="w-full xl:w-[76%] px-6 xl:px-6 pt-20 xl:pt-[4.3%] pb-6 xl:pb-0 overflow-y-auto">
        
        {/* <div className="max-w-5xl"> */}
        {/* <div className="max-w-5xl"> */}
      <h2 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mb-5 transition-colors">Content Editor</h2>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-colors">
        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 xl:gap-0 px-4 xl:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Editing: Return FAQ.md</span>
            <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full transition-colors">Draft</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg font-medium transition-colors" title="Back to Knowledge Base">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="px-4 xl:px-5 py-2 xl:py-2.5 bg-[#14A085] hover:bg-[#0d7a65] text-white text-xs xl:text-sm font-semibold rounded-xl transition-colors">
              Save & Reprocess
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row">
          {/* Editor */}
          <div className="flex-1 min-w-0 xl:border-r border-gray-100 dark:border-gray-800">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 xl:px-8 py-4 xl:py-6 text-xs xl:text-sm text-gray-700 dark:text-gray-300 leading-relaxed outline-none resize-none font-sans dark:bg-gray-900 transition-colors"
              style={{ minHeight: 'max(50vh, 70vh)' }}
            />
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden xl:block w-px bg-gray-100 dark:bg-gray-800 flex-shrink-0 transition-colors" />

          {/* AI Suggestions - hidden on mobile, shown on desktop */}
          <div className="hidden xl:block w-64 flex-shrink-0 p-5 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto transition-colors">
            <h4 className="text-xs xl:text-sm font-bold text-[#14A085] mb-4 flex items-center gap-2">
              <Sparkles size={14} /> AI Suggestions
            </h4>
            <div className="space-y-4">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 transition-colors">
                  <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 transition-colors">{s.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-3 transition-colors">{s.desc}</p>
                  <button className="text-xs text-[#14A085] font-semibold hover:text-[#0d7a65] transition-colors">{s.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* </div> */}
    </div>
  )
}