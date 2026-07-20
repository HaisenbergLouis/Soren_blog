"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

type Conversation = {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null } | null;
  lastMessage: { content: string; createdAt: string } | null;
  updatedAt: string;
};

export default function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-neutral-400 text-center py-10">加载中...</p>;
  }

  if (conversations.length === 0) {
    return (
      <p className="text-neutral-400 text-center py-10 text-sm">
        还没有私信，去用户主页发起对话吧
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full text-left flex items-center gap-3 rounded-xl border p-3 transition-colors ${
            selectedId === conv.id
              ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800"
              : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          }`}
        >
          {/* 头像 */}
          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden shrink-0">
            {conv.otherUser?.image ? (
              <img
                src={conv.otherUser.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-500">
                {(conv.otherUser?.name ?? "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {conv.otherUser?.name ?? "未知用户"}
            </p>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {conv.lastMessage?.content ?? "暂无消息"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
