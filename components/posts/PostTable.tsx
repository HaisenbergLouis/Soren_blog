"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Inbox } from "lucide-react";
import DeleteButton from "./DeleteButton";

type Post = {
  id: string;
  title: string;
  published: boolean;
  category: { name: string } | null;
  createdAt: Date;
};

export default function PostTable({
  posts,
  categories,
}: {
  posts: Post[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchAction, setBatchAction] = useState("");
  const [batchCategory, setBatchCategory] = useState("");

  const allSelected = selected.size === posts.length && posts.length > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(posts.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const executeBatch = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);

    let res;
    if (batchAction === "delete") {
      res = await fetch("/api/posts/batch", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (batchAction === "publish") {
      res = await fetch("/api/posts/batch", {
        method: "PATCH",
        body: JSON.stringify({ ids, published: true }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (batchAction === "draft") {
      res = await fetch("/api/posts/batch", {
        method: "PATCH",
        body: JSON.stringify({ ids, published: false }),
        headers: { "Content-Type": "application/json" },
      });
    } else if (batchAction === "category" && batchCategory) {
      res = await fetch("/api/posts/batch", {
        method: "PATCH",
        body: JSON.stringify({ ids, categoryId: batchCategory }),
        headers: { "Content-Type": "application/json" },
      });
    }
    if (res?.ok) {
      setSelected(new Set());
      router.refresh();
    }
  };

  return (
    <div>
      {/* 批量操作栏 */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 py-3">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            已选 {selected.size} 篇
          </span>
          <select
            value={batchAction}
            onChange={(e) => setBatchAction(e.target.value)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs"
          >
            <option value="">批量操作</option>
            <option value="publish">批量发布</option>
            <option value="draft">批量下架</option>
            <option value="delete">批量删除</option>
            <option value="category">批量移动分类</option>
          </select>
          {batchAction === "category" && (
            <select
              value={batchCategory}
              onChange={(e) => setBatchCategory(e.target.value)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs"
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={executeBatch}
            disabled={
              !batchAction || (batchAction === "category" && !batchCategory)
            }
            className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-900"
          >
            执行
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            取消选择
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <th className="px-4 py-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-neutral-300"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                标题
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                状态
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                分类
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                日期
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-8 w-8 text-neutral-300" />
                    <p className="text-sm text-neutral-400">还没有文章</p>
                    <Link
                      href="/admin/posts/new"
                      className="mt-2 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                      写第一篇 →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(post.id)}
                      onChange={() => toggleOne(post.id)}
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {post.category?.name ?? "未分类"}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton id={post.id} label={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
