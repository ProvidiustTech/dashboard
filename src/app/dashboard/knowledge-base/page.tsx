'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Search, SlidersHorizontal, Eye, Pencil, Trash2, X, Check, RotateCcw, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Sidebar from "@/components/Sidebar"
import MobileNav from '@/components/MobileNav'

/* ── Types ──────────────────────────────────────────────────────────────── */
interface Doc {
  id: string; name: string; size: string; type: string
  status: 'Indexed' | 'Processing' | 'Failed'
  usage: string | null; uploaded: string; icon: string; iconBg: string; url?: string
}

type UploadPhase = 'uploading' | 'indexing' | 'done'
interface UploadState {
  id: string; name: string; size: string; icon: string; iconBg: string
  phase: UploadPhase; progress: number; step: number
}

/* ── Static data ────────────────────────────────────────────────────────── */
const INIT_DOCS: Doc[] = [
  { id:'1', name:'Shipping Policy 2024.pdf', size:'2.4 MB', type:'Policy',   status:'Indexed',    usage:'847',   uploaded:'Jan 15, 2026', icon:'PDF', iconBg:'bg-red-500' },
  { id:'2', name:'Product Catalog.docx',     size:'1.8 MB', type:'Product',  status:'Indexed',    usage:'1,234', uploaded:'Jan 12, 2026', icon:'DOC', iconBg:'bg-blue-500' },
  { id:'3', name:'Return FAQ.md',             size:'124 KB', type:'FAQ',      status:'Processing', usage:null,    uploaded:'Just now',     icon:'MD',  iconBg:'bg-yellow-500' },
  { id:'4', name:'Help Center Articles',      size:'',       type:'Web Link', status:'Indexed',    usage:'562',   uploaded:'Jan 10, 2026', icon:'URL', iconBg:'bg-purple-500', url:'https://help.acme.com' },
]

const STATUS_CLS: Record<string, string> = {
  Indexed:    'bg-green-100 text-green-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Failed:     'bg-red-100 text-red-600',
}

const STEPS = ['Chunking documents', 'Generating embeddings', 'Indexing into database']

function extMeta(name: string): { icon: string; iconBg: string; type: string } {
  const ext = name.split('.').pop()?.toUpperCase() || 'FILE'
  if (ext === 'PDF')                   return { icon: 'PDF', iconBg: 'bg-red-500',    type: 'Policy' }
  if (ext === 'DOCX' || ext === 'DOC') return { icon: 'DOC', iconBg: 'bg-blue-500',  type: 'Product' }
  if (ext === 'MD')                    return { icon: 'MD',  iconBg: 'bg-yellow-500', type: 'FAQ' }
  if (ext === 'TXT')                   return { icon: 'TXT', iconBg: 'bg-gray-500',   type: 'Document' }
  return { icon: ext.slice(0, 3), iconBg: 'bg-gray-400', type: 'Document' }
}

function fmtSize(bytes: number) {
  if (bytes < 1024)      return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1_048_576).toFixed(1)} MB`
}

/* ── Upload progress panel ──────────────────────────────────────────────── */
function UploadPanel({ state, onDismiss }: { state: UploadState; onDismiss: (id: string) => void }) {
  if (state.phase === 'done') return null

  return (
    <div className="border border-gray-200 rounded-2xl p-6 mb-6 bg-white">
      {/* File row */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg ${state.iconBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
          {state.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{state.name}</p>
          <p className="text-xs text-gray-400">{state.size}</p>
        </div>
        <button onClick={() => onDismiss(state.id)} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      {state.phase === 'uploading' ? (
        <>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#14A085] font-medium">Uploading...</span>
            <span className="text-gray-500 tabular-nums">{state.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#14A085] rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#14A085] font-medium">Indexing...</span>
            <span className="text-gray-500 tabular-nums">{state.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#14A085] rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base"></span> AI is analyzing your document
            </p>
            {STEPS.map((s, i) => {
              const done   = i < state.step
              const active = i === state.step
              return (
                <div key={s} className="flex items-center gap-2.5 py-1.5">
                  {done ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-600 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                  ) : active ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-600 dark:border-emerald-600 flex items-center justify-center flex-shrink-0 transition-colors">
                      <div className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-600 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors" />
                  )}
                  <span className={`text-xs transition-colors ${done ? 'text-emerald-600 dark:text-emerald-400 font-medium' : active ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                    {s}
                  </span>
                </div>
              )
            })}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 transition-colors">This may take a few seconds...</p>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Indexing Complete Modal ─────────────────────────────────────────────── */
function IndexingCompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl w-full max-w-[590px] mx-4 p-24 text-center transition-colors duration-200">
        <div className="w-14 h-14 rounded-full border-2 border-emerald-600 dark:border-emerald-600 flex items-center justify-center mx-auto mb-5 transition-colors">
          <Check size={28} className="text-emerald-600 dark:text-emerald-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 duration-200 transition-colors">Indexing Complete</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-7 leading-relaxed transition-colors">
          Your document has been indexed successfully and is now ready for AI queries.
        </p>
        <button onClick={onClose} className="w-60 py-3.5 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
          View Knowledge Base
        </button>
      </div>
    </div>
  )
}

/* ── Document Preview Modal ─────────────────────────────────────────────── */
function PreviewModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const content = `Return Policy FAQ\nOur return policy allows customers to return items within 30 days of purchase. Items must be in original packaging and unused condition.\n\n**Q: How do I start a return?**\nA: Log into your account, go to 'Orders', and select 'Request Return'.\n\n**Q: What is the return policy?**\nA: You can return items within 30 days of receipt for a full refund.\n\n**Q: Can I exchange an item?**\nA: Yes, you can exchange items within the return period by selecting 'Request Exchange'.\n\n**Q: How long does it take to process a return?**\nA: Returns are typically processed within 5-7 business days after we receive the item.`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[760px] p-7 mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${doc.iconBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>{doc.icon}</div>
            <div>
              <p className="text-sm font-bold text-gray-900">{doc.name}</p>
              <p className="text-xs text-gray-400">Uploaded on {doc.uploaded} · {doc.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-[#14A085] text-white text-xs font-semibold rounded-lg hover:bg-[#0d7a65] transition-colors">
              <RotateCcw size={12} /> Reprocess
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">Document Preview</span>
            <span className="text-xs text-gray-400">Page 1 of 1</span>
          </div>
          <div className="px-8 py-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function KnowledgeBasePage() {
  const router = useRouter()
  const [docs, setDocs]             = useState<Doc[]>(INIT_DOCS)
  const [uploads, setUploads]       = useState<UploadState[]>([])
  const [showComplete, setComplete] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null)
  const [dragging, setDragging]     = useState(false)
  const [search, setSearch]         = useState('')
  const [showUrl, setShowUrl]       = useState(false)
  const [urlVal, setUrlVal]         = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  /* ── Ticker: advances every active upload every 120ms ─────────────────── */
  useEffect(() => {
    if (uploads.length === 0) return
    const timer = setInterval(() => {
      setUploads(prev => prev.map(u => {
        if (u.phase === 'done') return u

        if (u.phase === 'uploading') {
          // Natural deceleration toward 94%, never self-completes
          const remaining = 94 - u.progress
          if (remaining <= 0) return u
          const inc = Math.max(1, Math.floor(remaining * 0.15 + Math.random() * 3))
          return { ...u, progress: Math.min(u.progress + inc, 94) }
        }

        // Indexing: smooth 0→100, steps gate at 33% / 66%
        const inc  = Math.floor(Math.random() * 6 + 4)
        const next = Math.min(u.progress + inc, 100)
        const step = next < 34 ? 0 : next < 67 ? 1 : next < 100 ? 2 : 3
        if (next >= 100) return { ...u, phase: 'done', progress: 100, step: 3 }
        return { ...u, progress: next, step }
      }))
    }, 120)
    return () => clearInterval(timer)
  }, [uploads.length])

  /* ── Stall handler: when uploading hits 94%, pause 500ms then switch to indexing ── */
  useEffect(() => {
    const stalled = uploads.filter(u => u.phase === 'uploading' && u.progress >= 94)
    if (stalled.length === 0) return
    const timer = setTimeout(() => {
      setUploads(prev => prev.map(u =>
        u.phase === 'uploading' && u.progress >= 94
          ? { ...u, phase: 'indexing', progress: 0, step: 0 }
          : u
      ))
    }, 500)
    return () => clearTimeout(timer)
  }, [uploads])

  /* ── Done handler: commit finished uploads to docs table ──────────────── */
  useEffect(() => {
    const done = uploads.filter(u => u.phase === 'done')
    if (done.length === 0) return

    done.forEach(u => {
      if (docs.find(d => d.id === u.id)) return
      setDocs(prev => [{
        id: u.id, name: u.name, size: u.size,
        type: extMeta(u.name).type,
        status: 'Indexed', usage: '0', uploaded: 'Just now',
        icon: u.icon, iconBg: u.iconBg,
      }, ...prev])
    })

    setComplete(true)

    const t = setTimeout(() => {
      setUploads(prev => prev.filter(u => u.phase !== 'done'))
    }, 700)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploads])

  const startUpload = useCallback((file: File) => {
    const meta = extMeta(file.name)
    setUploads(prev => [...prev, {
      id: String(Date.now() + Math.random()),
      name: file.name,
      size: fmtSize(file.size),
      icon: meta.icon,
      iconBg: meta.iconBg,
      phase: 'uploading',
      progress: 0,
      step: 0,
    }])
  }, [])

  const dismissUpload = (id: string) =>
    setUploads(prev => prev.filter(u => u.id !== id))

  const addUrl = () => {
    if (!urlVal.trim()) return
    const id = String(Date.now())
    setDocs(prev => [{ id, name: urlVal, size: '', type: 'Web Link', status: 'Processing', usage: null, uploaded: 'Just now', icon: 'URL', iconBg: 'bg-purple-500', url: urlVal }, ...prev])
    setTimeout(() => setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'Indexed', usage: '0' } : d)), 3000)
    setUrlVal(''); setShowUrl(false)
  }

  const activeUploads = uploads.filter(u => u.phase !== 'done')

  const filteredDocs = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex gap-16 h-screen bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <Sidebar />


      <MobileNav/>

      <div className="w-full xl:w-[76%] px-6 xl:px-0 pt-24 xl:pt-[4.3%] mb-16 xl:mb-0 pb-6 xl:pb-0 overflow-y-auto">
        {/* Header */}
        <div className="flex flex- xl:flex-row items-start xl:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl xl:text-2xl font-bold text-gray-900 dark:text-white transition-colors">Knowledge Base</h2>
            <p className="text-xs xl:text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">Upload and manage documents</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex rounded-full items-center gap-2 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white font-semibold xl:rounded-xl px-2.5 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm transition-colors w-fit"
          >
            <Plus size={14} /> <span className='xl:block hidden'>Add Content</span>
          </button>
        </div>

        {/* Upload drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); Array.from(e.dataTransfer.files).forEach(startUpload) }}
          onClick={() => activeUploads.length === 0 && fileRef.current?.click()}
          className={`border-2 rounded-2xl transition-all mb-5 ${
            activeUploads.length > 0
              ? 'border-emerald-600 dark:border-emerald-600 bg-white dark:bg-gray-900 p-6 cursor-default transition-colors'
              : dragging
              ? 'border-emerald-600 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 p-10 text-center cursor-pointer transition-colors'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-600 dark:hover:border-emerald-600 p-10 text-center cursor-pointer transition-colors'
          }`}
        >
          <input
            ref={fileRef} type="file" multiple accept=".pdf,.docx,.txt,.md" className="hidden"
            onChange={e => { Array.from(e.target.files || []).forEach(startUpload); e.target.value = '' }}
          />

          {activeUploads.length > 0 ? (
            <div onClick={e => e.stopPropagation()}>
              {activeUploads.map(u => (
                <UploadPanel key={u.id} state={u} onDismiss={dismissUpload} />
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className="text-sm text-[#14A085] font-medium hover:underline mt-1"
              >
                + Add more files
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Drop files here or click to upload</p>
              <p className="text-xs text-gray-400 mb-5">Supports PDF, DOCX, TXT, and Markdown files up to 10MB</p>
              <div className="flex items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors"
                >
                  Browse Files
                </button>
                <button
                  onClick={() => setShowUrl(v => !v)}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Import from URL
                </button>
              </div>
            </>
          )}
        </div>

        {/* URL input */}
        {showUrl && (
          <div className="flex gap-2 mb-5">
            <input
              type="url" value={urlVal} onChange={e => setUrlVal(e.target.value)}
              placeholder="https://help.example.com/articles"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#14A085]"
            />
            <button onClick={addUrl} className="bg-[#14A085] hover:bg-[#0d7a65] text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
              Add
            </button>
          </div>
        )}

        {/* Documents table - Desktop view */}
        <div className="hidden xl:block bg-white dark:bg-gray-900 border border-none rounded-2xl">
          <div className="px-6 py-4 border-b dark:border-none border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold dark:text-white text-gray-900">Uploaded Documents</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs dark:text-white text-gray-400">{docs.length} documents</span>
                <span className="text-xs text-gray-500 font-medium">All Status</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search documents, content, or tags..."
                  className="w-full dark:text-black bg-gray-50  border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#14A085] focus:ring-2 focus:ring-[#14A085]/10 transition-all"
                />
              </div>
              <button className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 hover:border-gray-300 transition-colors">All Types</button>
              <button className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 hover:border-gray-300 transition-colors">All Status</button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b dark:border-none border-gray-50">
            {['Document', '', 'Type', 'Status', 'Usage', 'Uploaded', 'Actions'].map((h, i) => (
              <div key={i} className={`text-xs font-medium  text-gray-400 ${
                i === 0 ? 'col-span-3' : i === 1 ? 'col-span-1' :
                i === 2 ? 'col-span-2' : i === 3 ? 'col-span-2' :
                i === 4 ? 'col-span-2' : i === 5 ? 'col-span-1' : 'col-span-1 text-right'
              }`}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y dark:divide-none divide-gray-50 overflow-y-scroll h-[37.3vh]">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${doc.iconBg} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
                    {doc.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium dark:text-white text-gray-900 truncate">{doc.name}</p>
                    {doc.size && <p className="text-xs text-gray-400">{doc.size}</p>}
                    {doc.url && <p className="text-xs text-gray-400 truncate">{doc.url}</p>}
                  </div>
                </div>
                <div className="col-span-2 text-sm  dark:text-white text-gray-500">{doc.type}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CLS[doc.status]}`}>
                    {doc.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />}
                    {doc.status}
                  </span>
                </div>
                <div className="col-span-2 text-sm">
                  {doc.usage
                    ? <><span className="font-semibold dark:text-white text-gray-800">{doc.usage}</span><span className="text-gray-400"> queries</span></>
                    : <span className="text-gray-300">—</span>
                  }
                </div>
                <div className="col-span-1 text-xs  dark:text-white text-gray-400 whitespace-nowrap">{doc.uploaded}</div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button onClick={() => setPreviewDoc(doc)} className="text-gray-300 hover:text-gray-500 transition-colors"><Eye size={14} /></button>
                  <button onClick={() => router.push('knowledge-base/edit')} className="text-gray-300 hover:text-[#14A085] transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDocs(d => d.filter(x => x.id !== doc.id))} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents list - Mobile view */}
        <div className="xl:hidden">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold dark:text-white text-gray-900">Documents ({docs.length})</h3>
            </div>
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full dark:text-black bg-white dark:bg-gray-900 border dark:border-gray-700 border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-[#14A085] focus:ring-1 focus:ring-[#14A085]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-gray-900 border dark:border-gray-700 border-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${doc.iconBg} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
                    {doc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold dark:text-white text-gray-900 truncate">{doc.name}</p>
                    {doc.size && <p className="text-xs text-gray-400">{doc.size}</p>}
                  </div>
                  <button onClick={() => setDocs(d => d.filter(x => x.id !== doc.id))} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CLS[doc.status]}`}>
                    {doc.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />}
                    {doc.status}
                  </span>
                  <span className="text-xs text-gray-400">{doc.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>Uploaded {doc.uploaded}</span>
                  {doc.usage && <span>{doc.usage} queries</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewDoc(doc)} className="flex-1 text-xs font-medium text-[#14A085] border border-[#14A085]/30 rounded-lg py-2 hover:bg-[#E6F7F4] transition-colors">
                    View
                  </button>
                  <button onClick={() => router.push('knowledge-base/edit')} className="flex-1 text-xs font-medium text-gray-600 dark:text-gray-300 border dark:border-gray-600 border-gray-200 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showComplete && <IndexingCompleteModal onClose={() => setComplete(false)} />}
        {previewDoc && <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
      </div>
    </div>
  )
}