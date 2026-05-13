// hooks/useTelegram.ts
import { useEffect, useRef, useCallback } from "react";

export function useTelegramWS(
  onNewMessage: (msg: any) => void,
  onInit?: (data: any) => void,
  onTyping?: (chatId: string) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());


   const onTypingRef = useRef(onTyping);
  useEffect(() => { onTypingRef.current = onTyping; }, [onTyping]);



  // Stable refs for callbacks — prevents reconnect on every render
  const onNewMessageRef = useRef(onNewMessage);
  const onInitRef = useRef(onInit);
  useEffect(() => { onNewMessageRef.current = onNewMessage; }, [onNewMessage]);
  useEffect(() => { onInitRef.current = onInit; }, [onInit]);

  

  const connect = useCallback(() => {
    if (isConnectedRef.current) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/api/v1/telegram/ws";
    console.log("🔌 Connecting to:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    isConnectedRef.current = true;

    ws.onopen = () => console.log("✅ WebSocket Connected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_message" && data.message) {
          const msgId = data.message.id || `${data.message.chat_id}-${data.message.text}-${data.message.time}`;
          if (seenIdsRef.current.has(msgId)) return; // dedupe
          seenIdsRef.current.add(msgId);
          onNewMessageRef.current(data.message);
        } else if (data.event === "typing") {        // handle typing event
        onTypingRef.current?.(data.chat_id);
      } else if (data.event === "init") {
        onInitRef.current?.(data.conversations);
      }
    } catch (err) {}
    };

    ws.onclose = () => {
      console.log("WebSocket closed. Reconnecting...");
      isConnectedRef.current = false;
      setTimeout(connect, 1500);
    };

    ws.onerror = () => console.error("❌ WebSocket Error");
  }, []); // empty deps — connect never changes

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      isConnectedRef.current = false;
    };
  }, [connect]);

  return wsRef;
}