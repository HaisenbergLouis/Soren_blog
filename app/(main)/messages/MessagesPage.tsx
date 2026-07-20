"use client";

import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatView from "./ChatView";
import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex w-full gap-0 mx-auto max-w-5xl px-4 py-4">
      {/* 左侧：最近聊天 */}
      <div className="w-72 shrink-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 pr-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-l-2xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 shrink-0">
          最近聊天
        </h2>
        <div className="flex-1 overflow-y-auto min-h-0">
          <ConversationList
            selectedId={selectedId ?? undefined}
            onSelect={setSelectedId}
          />
        </div>
      </div>

      {/* 右侧：聊天区域 */}
      <div className="flex-1 flex flex-col min-w-0 pl-4">
        {selectedId ? (
          <ChatView key={selectedId} conversationId={selectedId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 rounded-r-2xl">
            <MessageCircle className="h-12 w-12 mb-3" />
            <p className="text-sm">选择一个聊天</p>
          </div>
        )}
      </div>
    </div>
  );
}
