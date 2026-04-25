"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

interface Message {
    id: string;
    role: "user" | "ai";
    text: string;
    apiData?: string;
}

const MOCK_RESPONSES: Record<string, { reply: string; api: string }> = {
    default: {
        reply:
            "I'm here to help! Could you provide more details about your request?",
        api: `// API Response Data\n{\n "status": "ok",\n "message": "processed"\n}`,
    },
    order: {
        reply:
            "Your order #ORD-9921 is currently in transit and expected to arrive by Friday.",
        api: `// API Response Data\n{\n "status": "shipped",\n "eta": "2023-12-01"\n}`,
    },
    payment: {
        reply:
            "Your payment of $249.00 was successfully processed on Nov 24, 2023. Receipt has been sent to your email.",
        api: `// API Response Data\n{\n "status": "success",\n "amount": 249.00,\n "date": "2023-11-24"\n}`,
    },
    return: {
        reply:
            "I've initiated a return request for your order. You'll receive a prepaid shipping label within 24 hours.",
        api: `// API Response Data\n{\n "return_id": "RET-4421",\n "status": "initiated",\n "label_eta": "24h"\n}`,
    },
};

function pickResponse(text: string) {
    const t = text.toLowerCase();
    if (t.includes("order") || t.includes("track") || t.includes("ship"))
        return MOCK_RESPONSES.order;
    if (t.includes("pay") || t.includes("charge") || t.includes("receipt"))
        return MOCK_RESPONSES.payment;
    if (t.includes("return") || t.includes("refund") || t.includes("exchange"))
        return MOCK_RESPONSES.return;
    return MOCK_RESPONSES.default;
}

export default function TestSimulatorPageContent() {
    const router = useRouter();
    const params = useSearchParams();
    const ruleId = params.get("ruleId");
    const ruleName = params.get("ruleName") || "Order Status Lookup";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiPanel, setApiPanel] = useState<string>("");
    const [running, setRunning] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = { id: String(Date.now()), role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Simulate API delay
        await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

        const { reply, api } = pickResponse(text);
        const aiMsg: Message = {
            id: String(Date.now() + 1),
            role: "ai",
            text: reply,
            apiData: api,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setApiPanel(api);
        setLoading(false);
    };

    const runTest = async () => {
        if (running) return;
        setRunning(true);
        setMessages([]);
        setApiPanel("");

        const testQuery = "Where is my order #ORD-9921?";

        const userMsg: Message = { id: "run-user", role: "user", text: testQuery };
        setMessages([userMsg]);
        setLoading(true);

        await new Promise((r) => setTimeout(r, 1200));

        const { reply, api } = MOCK_RESPONSES.order;
        const aiMsg: Message = {
            id: "run-ai",
            role: "ai",
            text: reply,
            apiData: api,
        };

        setMessages([userMsg, aiMsg]);
        setApiPanel(api);
        setLoading(false);
        setRunning(false);
    };

    return (
        <div className="flex h-screen gap-10 bg-[#F7FAFC] dark:bg-gray-950 overflow-hidden transition-colors duration-200">
            <Sidebar />

            <MobileNav/>

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 flex flex-col mt-10 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Test Simulator
                                </h1>
                                {ruleId && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Testing rule:{" "}
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                            {ruleName}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={runTest}
                            disabled={running}
                            className="flex items-center gap-2 bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl px-8 py-3 text-sm transition-colors"
                        >
                            {running ? (
                                <svg
                                    className="animate-spin w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray="32"
                                        strokeDashoffset="12"
                                    />
                                </svg>
                            ) : (
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                                </svg>
                            )}
                            Run Test
                        </button>
                    </div>

                    {/* Chat Container - This is the key part */}
                    <div className="h-[100%]">
                        <div className="flex-1 h-[93.3%] flex flex-col overflow-hidden bg-white dark:bg-gray-900 mx-6 my-4 border border-gray-100 dark:border-gray-800 rounded-2xl transition-colors duration-200">
                            {/* Scrollable Messages Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar">
                                {messages.length === 0 && !loading && (
                                    <div className="flex flex-col items-center justify-center h-96 text-center py-20">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="#14A085"
                                                    strokeWidth="1.8"
                                                />
                                                <path d="M10 8l6 4-6 4V8z" fill="#14A085" />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                            Ready to test
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                                            Type a message below or click{" "}
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">Run Test</span>{" "}
                                            for a demo
                                        </p>
                                    </div>
                                )}

                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "ai" ? (
                                            <div className="max-w-[70%]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 bg-emerald-600 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">
                                                            AI
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                        AI Response
                                                    </span>
                                                </div>
                                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 text-sm text-gray-700 dark:text-gray-300 shadow-sm dark:shadow-none transition-colors duration-200">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="max-w-[70%]">
                                                <div className="bg-emerald-600 dark:bg-emerald-600 text-white rounded-2xl rounded-tr-none px-5 py-4 text-sm leading-relaxed shadow-md dark:shadow-lg">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm dark:shadow-none">
                                            <div className="flex gap-1.5">
                                                <div
                                                    className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0ms" }}
                                                />
                                                <div
                                                    className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce"
                                                    style={{ animationDelay: "150ms" }}
                                                />
                                                <div
                                                    className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce"
                                                    style={{ animationDelay: "300ms" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            <div className="">
                                {/* API Response Panel */}
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-900 dark:bg-gray-950 p-4 mx-6 mb-4 rounded-xl transition-colors duration-200">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
                                        API RESPONSE
                                    </p>
                                    {apiPanel ? (
                                        <pre className="text-xs text-emerald-400 dark:text-emerald-400 font-mono overflow-auto max-h-32">
                                            {apiPanel}
                                        </pre>
                                    ) : (
                                        <p className="text-xs text-gray-600 dark:text-gray-500 font-mono">
                                            API response will appear here after a message is sent...
                                        </p>
                                    )}
                                </div>

                                {/* Fixed Input Bar at Bottom */}
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-colors duration-200">
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 transition-colors duration-200">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && !e.shiftKey && sendMessage(input)
                                            }
                                            placeholder="Type a message to test this rule..."
                                            className="flex-1 border-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                                        />

                                        <button
                                            onClick={() => sendMessage(input)}
                                            disabled={!input.trim() || loading}
                                            className="w-10 h-10 flex items-center justify-center bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                                        >
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                <line
                                                    x1="22"
                                                    y1="2"
                                                    x2="11"
                                                    y2="13"
                                                    stroke="white"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                />
                                                <polygon points="22,2 15,22 11,13 2,9" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
