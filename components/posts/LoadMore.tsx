"use client";

import { useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  category: { name: string; slug: string } | null;
};

export default function LoadMore({
  initialPosts,
  category,
  keyword,
}: {
  initialPosts: Post[];
  category?: string;
  keyword?: string;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 9);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({ page: String(nextPage), limit: "9" });
    if (category) params.set("category", category);
    if (keyword) params.set("q", keyword);

    const res = await fetch("/api/posts?" + params.toString());
    const data = await res.json();

    if (data.length < 9) setHasMore(false);
    setPosts((prev) => [...prev, ...data]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <div>
      {/* 文章列表 */}
      <div className="space-y-8">
        {posts.map((post, i) => (
          <article key={post.id}>
            <Link href={"/posts/" + post.slug} className="group block">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <span>{post.category?.name ?? "未分类"}</span>
                <span>·</span>
                <time>
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </time>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </Link>
            {i < posts.length - 1 && (
              <div className="border-b border-neutral-100 dark:border-neutral-800 mt-8" />
            )}
          </article>
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl border border-neutral-300 dark:border-neutral-600 px-8 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40"
          >
            {loading ? "加载中..." : "加载更多文章"}
          </button>
        </div>
      )}
    </div>
  );
}
