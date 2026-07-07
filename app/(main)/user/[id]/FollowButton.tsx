"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/follow?userId=${targetUserId}`)
      .then((res) => res.json())
      .then((data) => setIsFollowing(data.isFollowing));
  }, [targetUserId]);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsFollowing(data.followed);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-xl px-5 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
        isFollowing
          ? "border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      }`}
    >
      {loading ? "..." : isFollowing ? "已关注" : "关注"}
    </button>
  );
}