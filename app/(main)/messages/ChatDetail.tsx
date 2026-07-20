"use client";

import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatView from "./ChatView";

export default function ChatDetail({
  conversationId,
}: {
  conversationId: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(conversationId);

  return (
    <div className="flex w-full gap-0 mx-auto max-w-5xl px-4 py-4">
      {/* 左侧：最近聊天 */}
      <div className="w-72 shrink-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 pr-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-l-2xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 shrink-0">
          最近聊天
        </h2>
        <div className="flex-1 overflow-y-auto min-h-0">
          <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      {/* 右侧：聊天区域 */}
      <div className="flex-1 flex flex-col min-w-0 pl-4">
        <ChatView key={selectedId} conversationId={selectedId} />
      </div>
    </div>
  );
}
