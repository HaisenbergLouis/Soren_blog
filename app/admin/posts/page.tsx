import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Inbox, Pencil, Trash2 } from "lucide-react";
import type { PostListItem } from "@/types";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            文章管理
          </h1>
          <p className="text-sm text-neutral-500 mt-1">管理所有博客文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          <span>＋</span>
          新建文章
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
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
                <td colSpan={5} className="px-6 py-16 text-center">
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
              posts.map((post: PostListItem) => (
                <tr
                  key={post.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
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
                      <button className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
