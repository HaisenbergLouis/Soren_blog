"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function MessageButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const router = useRouter();

  const handleClick = async () => {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });

    if (res.ok) {
      const { conversationId } = await res.json();
      router.push(`/messages/${conversationId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5"
    >
      <MessageCircle className="h-4 w-4" />
      发私信
    </button>
  );
}
