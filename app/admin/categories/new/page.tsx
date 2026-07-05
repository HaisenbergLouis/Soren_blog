"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: 提交表单
    // const formData = new FormData(e.currentTarget);
    // const res = await fetch("/api/categories", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name: formData.get("name"),
    //     slug: formData.get("slug"),
    //     description: formData.get("description"),
    //   }),
    //   headers: { "Content-Type": "application/json" },
    // });
    // if (res.ok) router.push("/admin/categories");

    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> 返回分类管理
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          新建分类
        </h1>
        <p className="text-sm text-neutral-500 mt-1">添加一个新的文章分类</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900"
      >
        {/* 名称 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            名称 <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            placeholder="例如：技术"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            required
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            placeholder="tech"
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            描述
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
            placeholder="分类描述（可选）"
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "创建中..." : "创建分类"}
          </button>
          <Link
            href="/admin/categories"
            className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
