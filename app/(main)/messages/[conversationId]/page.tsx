"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function ChatRoom({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  // 提取 conversationId → 调 GET 接口获取历史 → 渲染消息列表
  // 底部输入框 → 调 POST 发送消息 → 追加到列表
  // 定时轮询（每3秒）拉取新消息

  // 初始化：获取conversationId
  useEffect(() => {
    params.then((p) => setConversationId(p.conversationId));
  }, [params]);

  // 获取消息历史
  useEffect(() => {
    if (!conversationId) return;
    fetch(`/api/message/${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
        // 从消息中推断当前用户 ID
        if (data.length > 0) {
          // 随便拿一条，sender 不是当前用户的那个就是
        }
      });
    // 获取当前用户信息
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.id) setCurrentUserId(data.id);
      });
  }, [conversationId]);

  // 自动滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 定时轮询新消息
  useEffect(() => {
    if (!conversationId) return;
    const timer = setInterval(async () => {
      const res = await fetch(`/api/message/${conversationId}`);
      const data = await res.json();
      setMessages(data);
    }, 3000);
    return () => clearInterval(timer);
  }, [conversationId]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");
    try {
      const res = await fetch(`/api/message/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 flex flex-col h-screen">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => router.push("/messages")}
          className="rounded-lg p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          私信
        </h1>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isMe
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMe
                      ? "text-white/60 dark:text-neutral-500"
                      : "text-neutral-400"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入消息..."
            disabled={sending}
            className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="rounded-xl bg-neutral-900 p-2.5 text-white transition-all hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
