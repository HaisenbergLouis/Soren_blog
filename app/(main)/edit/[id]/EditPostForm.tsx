"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  categoryId: string | null;
};

export default function EditPostForm({ post }: { post: PostData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleAISummary = async () => {
    const content = contentRef.current?.value;
    const title = titleRef.current?.value;
    if (!content || content.length < 50) {
      return;
    }
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!data.error && excerptRef.current) {
        excerptRef.current.value = data.summary;
      }
    } catch {
      // ignore
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleAISlug = async () => {
    const title = titleRef.current?.value;
    if (!title || !title.trim()) return;
    setGeneratingSlug(true);
    try {
      const res = await fetch("/api/ai/slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!data.error && slugRef.current) {
        slugRef.current.value = data.slug;
      }
    } catch {
      // ignore
    } finally {
      setGeneratingSlug(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      categoryId: formData.get("categoryId") || null,
      published: formData.get("published") === "on",
    };

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/profile");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div>
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> 返回个人主页
      </Link>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900"
      >
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            ref={titleRef}
            name="title"
            defaultValue={post.title}
            required
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            placeholder="输入文章标题"
          />
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Slug <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAISlug}
              disabled={generatingSlug}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
            >
              {generatingSlug ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              AI 生成
            </button>
          </div>
          <input
            ref={slugRef}
            name="slug"
            defaultValue={post.slug}
            required
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            placeholder="my-article-slug"
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            分类
          </label>
          <select
            name="categoryId"
            defaultValue={post.categoryId ?? ""}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="">未分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 摘要 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              摘要
            </label>
            <button
              type="button"
              onClick={handleAISummary}
              disabled={generatingSummary}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
            >
              {generatingSummary ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              AI 生成摘要
            </button>
          </div>
          <textarea
            ref={excerptRef}
            name="excerpt"
            defaultValue={post.excerpt ?? ""}
            rows={3}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
            placeholder="文章摘要（可选）"
          />
        </div>

        {/* 内容 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            内容（Markdown）
          </label>
          <textarea
            ref={contentRef}
            name="content"
            defaultValue={post.content}
            rows={16}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 font-mono resize-y"
            placeholder="在此输入 Markdown 内容..."
          />
        </div>

        {/* 发布状态 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={post.published}
            className="h-4 w-4 rounded border-neutral-300"
          />
          <label
            htmlFor="published"
            className="text-sm text-neutral-700 dark:text-neutral-300"
          >
            已发布
          </label>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "保存中..." : "保存修改"}
          </button>
          <Link
            href="/profile"
            className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
