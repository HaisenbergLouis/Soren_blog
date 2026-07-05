"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [post, setPost] = useState<{
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    categoryId: string | null;
  } | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories")
        .then((res) => res.json())
        .then(setCategories),
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then(setPost),
    ]).then(() => setLoaded(true));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: 提交更新
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      categoryId: formData.get("categoryId") || null,
      published: formData.get("published") === "on",
    };
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) router.push("/admin/posts");

    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> 返回文章管理
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          编辑文章
        </h1>
        <p className="text-sm text-neutral-500 mt-1">修改文章内容</p>
      </div>

      {!loaded ? (
        <div className="max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900 text-center py-12">
          <p className="text-sm text-neutral-400">加载中...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900"
        >
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              defaultValue={post?.title ?? ""}
              required
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="输入文章标题"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              name="slug"
              defaultValue={post?.slug ?? ""}
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
              defaultValue={post?.categoryId ?? ""}
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
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              摘要
            </label>
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
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
              name="content"
              defaultValue={post?.content ?? ""}
              rows={12}
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
              defaultChecked={post?.published ?? false}
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
              href="/admin/posts"
              className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              取消
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
