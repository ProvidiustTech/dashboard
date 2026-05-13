"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Paperclip, Send, X, ChevronDown, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { useRouter } from "next/navigation";
import { useTelegramWS } from "@/hooks/useTelegram";



/* ── Chat Message Interface ─────────────────────────────────────────────── */
interface ChatMessage {
  id: string;
  from: "user" | "ai" | "human";
  text: string;
  time: string;
  conf?: string; // For AI messages
  sources?: string[]; // For AI messages
  agent?: string; // For human messages
}

/* ── Escalate Modal ─────────────────────────────────────────────────────── */
function EscalateModal({
  onClose,
  onEscalate,
  companyName,
}: {
  onClose: () => void;
  onEscalate: () => void;
  companyName: string;
}) {
  const [agent, setAgent] = useState(`${companyName} (Support Lead)`);
  const [note, setNote] = useState("");

  // Update agent if companyName changes
  useEffect(() => {
    setAgent(`${companyName} (Support Lead)`);
  }, [companyName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl w-full max-w-[440px] mx-4 p-8 transition-colors duration-200">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">
          Escalate to Human Agent
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 transition-colors">
          Transfer this conversation to a specialized team member.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Select Agent
          </label>
          <div className="relative">
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full px-4 py-3 text-sm border-none rounded-xl outline-none focus:border-emerald-600 dark:focus:border-emerald-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none pr-10 transition-colors"
            >
              <option>{companyName} (Support Lead)</option>
              <option>Mike Chen (Technical Lead)</option>
              <option>Emma Wilson (Senior Agent)</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Internal Note{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context for the agent..."
            className="w-full px-4 py-3 text-sm border-none rounded-xl outline-none focus:border-emerald-600 dark:focus:border-emerald-400 resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onEscalate}
            className="flex-1 py-3 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function ConversationsPage() {
  interface Convo {
    id: string;
    name: string;
    preview: string;
    time: string;
    channel: string;
    tag: string;
    tagColor: string;
    active: boolean;
  }
  const [convos, setConvos] = useState<Convo[]>([]);
  const [chatIdMap, setChatIdMap] = useState<Record<string, string>>({});

  const [filter, setFilter] = useState<"All" | "AI Active" | "Escalated">("All");

  const [typingConvos, setTypingConvos] = useState<Set<string>>(new Set());
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});


  const [compose, setCompose] = useState(""); // User input for message
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("User");
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Dynamic chat messages
  const [isAiTyping, setIsAiTyping] = useState(false); // AI typing indicator
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  const wsRef = useRef<WebSocket | null>(null);


  const handleTyping = useCallback((chatId: string) => {
    const convoId = chatIdMap[chatId] || `tg-${chatId}`;

    setTypingConvos(prev => new Set(prev).add(convoId));

    // Clear previous timer for this convo
    if (typingTimersRef.current[convoId]) {
      clearTimeout(typingTimersRef.current[convoId]);
    }

    // Auto-clear after 3s
    typingTimersRef.current[convoId] = setTimeout(() => {
      setTypingConvos(prev => {
        const next = new Set(prev);
        next.delete(convoId);
        return next;
      });
    }, 3000);
  }, [chatIdMap]);




  useEffect(() => {
    const fetchUser = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      if (!token || token === 'undefined') {
        setCompanyName("User");
        return;
      }
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
        const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.company || "User");
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [router]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  // Telegram WebSocket
  // Telegram WebSocket
  // Telegram WebSocket
  const telegramWsRef = useTelegramWS(
    (msg) => {
      const telegramChatId = msg.chat_id;
      let convoId = chatIdMap[telegramChatId];

      if (!convoId) {
        convoId = `tg-${telegramChatId}`;
        setChatIdMap(prev => ({ ...prev, [telegramChatId]: convoId! }));

        setConvos(prev => [{
          id: convoId!,
          name: msg.sender_name || "Telegram User",
          preview: msg.text || "",
          time: "just now",
          channel: "Telegram",
          tag: "AI: High",
          tagColor: "bg-blue-100 text-blue-700",
          active: false,
        }, ...prev]);
      } else {
        setConvos(prev => prev.map(c =>
          c.id === convoId ? { ...c, preview: msg.text || "", time: "just now" } : c
        ));
      }

      // Add message to open chat
      if (selectedId === convoId) {
        setMessages(prev => [...prev, {
          id: msg.id || String(Date.now()),
          from: "user",
          text: msg.text,
          time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    },
    (data) => console.log("Init data:", data),
    handleTyping
  );


  useEffect(() => {
    wsRef.current = telegramWsRef.current;
  }, [telegramWsRef]);

  // ==================== AI SEND (for non-escalated chats) ====================
  const handleSendMessage = async () => {
    if (!compose.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      from: "user",
      text: compose.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setCompose("");
    setIsAiTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Simulate AI response
    const aiMessage: ChatMessage = {
      id: String(Date.now() + 1),
      from: "ai",
      text: "Thank you for your message. How else can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conf: "85% confidence",
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsAiTyping(false);
  };

  // ==================== HUMAN SEND (for escalated / Telegram chats) ====================
  const handleHumanSendMessage = async () => {
    if (!compose.trim() || !selectedId) return;

    const telegramChatId = Object.entries(chatIdMap).find(([_, id]) => id === selectedId)?.[0];
    const text = compose.trim();

    if (telegramChatId) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: "send_message",
          chat_id: telegramChatId,
          text: text,
          agent_name: companyName,
        }));
      } else {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
        await fetch(`${baseUrl}/api/v1/telegram/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: telegramChatId, text }),
        });
      }
    }

    const humanMessage: ChatMessage = {
      id: String(Date.now()),
      from: "human",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      agent: companyName,
    };

    setMessages(prev => [...prev, humanMessage]);
    setCompose("");
  };

  const selectedConvo = selectedId ? convos.find(c => c.id === selectedId) : null;

  const handleEscalate = () => {
    setEscalated(true);
    setShowEscalate(false);
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      from: "ai",
      text: `Conversation escalated to ${companyName}. AI autopilot disabled.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conf: "100% confidence",
    }]);
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();



  return (
    <div className="flex flex-col xl:flex-row h-screen bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden xl:block">
        <Sidebar />
      </div>
      <MobileNav />


      {/* Conversation list - Mobile: Full width, Desktop: Sidebar */}
      <aside
        className={`${selectedId ? "hidden xl:flex" : "flex"} xl:flex xl:ml-16 mt-20 px-4 xl:px-0 w-full xl:w-[23%] xl:flex-shrink-0 xl:mt-10 xl:h-[92%] h-full xl:border-r border-gray-100 dark:border-gray-800 flex-col transition-colors duration-200 pb-20 xl:pb-0 bg-white dark:bg-gray-900`}
      >
        {/* Header with Search */}
        <div className="p-4 xl:p-6 bg-white  dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 transition-colors duration-200">
          {/* Title and Add Button */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <h2 className="text-2xl xl:text-lg font-bold text-gray-900 dark:text-white">
              Conversations
            </h2>
            <button className="flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex-shrink-0 transition-colors">
              <Plus size={16} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 transition-colors pointer-events-none"
            />
            <input
              placeholder="Search conversations..."
              className="w-full bg-gray-50 h-10 xl:h-10 dark:bg-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs xl:text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 mt-7 xl:mt-0 mb-2 overflow-x-auto">
            {["All", "AI Active", "Escalated"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "All" | "AI Active" | "Escalated")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${filter === f
                    ? "bg-teal-500 dark:bg-teal-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-gray-50 dark:divide-gray-800 transition-colors duration-200">
          {convos.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`px-3 xl:px-4 py-3 xl:py-4 cursor-pointer bg-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex gap-3 border-none xl:border-l-2 ${c.active
                  ? "xl:bg-teal-50 dark:bg-teal-900/10 border-teal-500"
                  : "border-transparent"
                }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs xl:text-sm font-bold flex-shrink-0">
                {getInitials(c.name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <span className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] xl:text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
                    {c.time}
                  </span>
                </div>
                <p className="text-[11px] xl:text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                  {c.preview}
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  {c.tag.includes("AI") && (
                    <span className="flex items-center gap-1 text-[9px] xl:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <span className="w-1 h-1 bg-yellow-600 rounded-full" />
                      {c.tag}
                    </span>
                  )}
                  {c.tag.includes("Escalated") && (
                    <span className="text-[9px] xl:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {c.tag}
                    </span>
                  )}
                  {c.tag.includes("Resolved") && (
                    <span className="text-[9px] xl:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {c.tag}
                    </span>
                  )}
                  {c.channel && (
                    <span className="text-[9px] xl:text-[10px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                      {c.channel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area - Mobile: Full screen overlay, Desktop: Sidebar */}
      {selectedConvo && (
        <div
          className={`${selectedId ? "fixed xl:relative" : "hidden xl:flex"
            } inset-0 xl:ml-16 xl:inset-auto w-full xl:w-[50%] h-full xl:h-[92%] xl:mt-10 bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col z-40`}
        >
          {/* Mobile Back Button */}
          <div className="xl:hidden px-3 xl:px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm xl:text-base font-semibold text-gray-900 dark:text-white truncate">
              {selectedConvo.name}
            </h3>
          </div>

          {/* Chat Header - Desktop visible always, Mobile shown */}
          <div className={`px-4 xl:px-6 py-3 xl:py-4 border-b border-gray-100 dark:border-gray-800 ${selectedId ? "hidden xl:flex" : "flex"
            } xl:flex items-center justify-between flex-shrink-0 transition-colors duration-200`}>
            <div className="flex items-center gap-2 xl:gap-3">
              <div className="w-8 h-8 xl:w-9 xl:h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xs xl:text-sm font-bold transition-colors">
                {getInitials(selectedConvo.name)}
              </div>
              <div>
                <p className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                  {selectedConvo.name}
                </p>
                <p className="text-[10px] xl:text-xs text-gray-500 dark:text-gray-400 transition-colors">
                  {selectedConvo.channel} · Customer since Jan 2024
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 xl:gap-2 flex-wrap">
              {escalated ? (
                <>
                  <span className="flex items-center gap-1 text-[10px] xl:text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 xl:px-3 py-1 xl:py-1.5 rounded-full transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Human Active
                  </span>
                  <div className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[9px] xl:text-xs font-bold transition-colors">
                      {companyName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline">{companyName}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-[10px] xl:text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-2 xl:px-3 py-1 xl:py-1.5 rounded-full transition-colors">
                    <span className="w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full" /> AI Active
                  </span>
                  <span className="text-[10px] xl:text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 xl:px-3 py-1 xl:py-1.5 rounded-full transition-colors">
                    Confidence: 72%
                  </span>
                  <button
                    onClick={() => setShowEscalate(true)}
                    className="flex items-center gap-1 text-[10px] xl:text-xs font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-2 xl:px-3 py-1 xl:py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Escalate
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 xl:px-5 xl:px-6 py-3 xl:py-4 xl:py-5 space-y-3 xl:space-y-4 bg-white dark:bg-gray-900 transition-colors duration-200">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from !== "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%] xl:max-w-[72%]">
                  <div
                    className={`px-3 xl:px-4 py-2 xl:py-3 rounded-2xl text-xs xl:text-sm leading-relaxed ${msg.from === "user"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm dark:shadow-none transition-colors"
                        : msg.from === "human"
                          ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-sm transition-colors"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm dark:shadow-none transition-colors"
                      }`}
                  >
                    {msg.text}
                    {"sources" in msg && msg.sources && (
                      <div className="mt-1.5 xl:mt-2 pt-1.5 xl:pt-2 border-t border-white/20 text-[10px] xl:text-[11px]">
                        <p className="text-white/70 mb-0.5">📎 Sources used:</p>
                        <p className="text-white">
                          {(msg.sources as string[]).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                  {msg.from === "ai" && !escalated && (
                    <div className="flex justify-end gap-2 xl:gap-3 mt-1 xl:mt-1.5 px-1">
                      <button className="text-[10px] xl:text-[11px] text-teal-600 dark:text-teal-400 font-medium hover:underline transition-colors">
                        Improve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-sm shadow-sm dark:shadow-none px-3 xl:px-4 py-2 xl:py-3 text-xs xl:text-sm">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 bg-teal-600 dark:bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-teal-600 dark:bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-teal-600 dark:bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>
          {/* Input Area - This section handles both escalated and non-escalated input */}
          <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 transition-colors duration-200">
            {!escalated && (
              <div className="p-3 xl:p-4 xl:p-5 space-y-2 xl:space-y-3">
                {/* AI confidence warning */}
                {messages.length > 0 && !isAiTyping && ( // Only show if there are messages and AI isn't typing
                  <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg px-3 xl:px-4 py-2 xl:py-2.5 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-500 flex-shrink-0" />
                    <span className="text-[10px] xl:text-xs text-orange-700 dark:text-orange-400 font-medium transition-colors">
                      AI confidence dropped to 72%. Consider escalating...
                    </span>
                    <button
                      onClick={() => setShowEscalate(true)}
                      className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white text-[10px] xl:text-xs font-semibold px-2 xl:px-3 py-1 xl:py-1.5 rounded transition-colors flex-shrink-0 ml-auto"
                    >
                      Escalate Now
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 xl:px-4 py-2 xl:py-2.5 transition-colors">
                  <input
                    placeholder="Type a message..."
                    value={compose}
                    onChange={(e) => setCompose(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 bg-transparent text-xs xl:text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
                  />
                  <button className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0">
                    <Paperclip size={14} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!compose.trim() || isAiTyping}
                    className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 flex items-center justify-center text-white flex-shrink-0 transition-colors disabled:opacity-50"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
            {escalated && (
              <div className="p-3 xl:p-4 xl:p-5">
                <div className="flex items-center justify-center py-1 xl:py-1.5 mb-2 xl:mb-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    AI Autopilot Disabled
                  </span>
                </div>

                {/* Customer typing indicator — shown above input when escalated */}
                {selectedId && typingConvos.has(selectedId) && (
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] xl:text-xs text-gray-400 dark:text-gray-500">Customer is typing...</span>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 xl:px-4 py-2 xl:py-2.5 transition-colors">
                  <input
                    placeholder={`Type as ${companyName}...`}
                    value={compose}
                    onChange={(e) => setCompose(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleHumanSendMessage()}
                    className="flex-1 bg-transparent text-xs xl:text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors"
                  />
                  <button className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0">
                    <Paperclip size={14} />
                  </button>
                  <button
                    onClick={handleHumanSendMessage}
                    disabled={!compose.trim()}
                    className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 flex items-center justify-center text-white flex-shrink-0 transition-colors disabled:opacity-50"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Escalation Modal */}
          {showEscalate && (
            <EscalateModal
              onClose={() => setShowEscalate(false)}
              onEscalate={handleEscalate}
              companyName={companyName}
            />
          )}
        </div>
      )}

      {/* Bottom Navigation - Mobile Only */}
      {/* <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around transition-colors duration-200 z-30 h-20">
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-teal-500 dark:text-gray-500 dark:hover:text-teal-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 10.26 24 12.75 18 18.91 19.54 27.88 12 23.77 4.46 27.88 6 18.91 0 12.75 8.91 10.26 12 2" />
          </svg>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-teal-500 dark:text-teal-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[10px] font-medium">Conversations</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-teal-500 dark:text-gray-500 dark:hover:text-teal-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z" />
          </svg>
          <span className="text-[10px] font-medium">Knowledge</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-teal-500 dark:text-gray-500 dark:hover:text-teal-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="text-[10px] font-medium">Analytics</span>
        </button>
      </nav> */}
    </div>
    // </div>
  );
}
