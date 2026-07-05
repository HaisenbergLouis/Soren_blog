"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  id,
  label,
  api = "posts",
}: {
  id: string;
  label: string;
  api?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/${api}/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="rounded-lg px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          确认
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-2 py-1 text-xs font-medium text-neutral-600 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
      title={`删除「${label}」`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
