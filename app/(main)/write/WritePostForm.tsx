"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

export default function WritePostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setError("内容太短，至少需要 50 个字符才能生成摘要");
      return;
    }
    setGeneratingSummary(true);
    setError("");
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (excerptRef.current) {
        excerptRef.current.value = data.summary;
      }
    } catch {
      setError("生成摘要失败，请检查 API Key 是否配置");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleAISlug = async () => {
    const title = titleRef.current?.value;
    if (!title || !title.trim()) {
      setError("请先输入标题");
      return;
    }
    setGeneratingSlug(true);
    setError("");
    try {
      const res = await fetch("/api/ai/slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (slugRef.current) {
        slugRef.current.value = data.slug;
      }
    } catch {
      setError("生成 Slug 失败，请检查 API Key 是否配置");
    } finally {
      setGeneratingSlug(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      categoryId: formData.get("categoryId") || null,
      published: formData.get("published") === "on",
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/profile");
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({ error: "发布失败" }));
      setError(err.error || "发布失败，请检查 slug 是否重复");
    }

    setLoading(false);
  };

  return (
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
          className="h-4 w-4 rounded border-neutral-300"
        />
        <label
          htmlFor="published"
          className="text-sm text-neutral-700 dark:text-neutral-300"
        >
          立即发布
        </label>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 提交按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {loading ? "发布中..." : "发布文章"}
        </button>
      </div>
    </form>
  );
}
