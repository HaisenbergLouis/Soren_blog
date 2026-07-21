"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function UnreadBadge() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  const fetchCount = useCallback(() => {
    fetch(`/api/messages/unread?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => {});
  }, []);

  // 切换路由时刷新（包括初始加载）
  useEffect(() => {
    fetchCount();
  }, [pathname, fetchCount]);

  // 切换回页面标签时刷新
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchCount();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchCount]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-2 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
