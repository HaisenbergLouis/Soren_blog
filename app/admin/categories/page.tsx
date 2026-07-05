import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pencil } from "lucide-react";
import DeleteButton from "@/components/posts/DeleteButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            分类管理
          </h1>
          <p className="text-sm text-neutral-500 mt-1">管理文章分类</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          <span>＋</span>
          新建分类
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                名称
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                标识
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                文章数
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-neutral-400">还没有分类</p>
                    <Link
                      href="/admin/categories/new"
                      className="mt-2 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                      创建第一个 →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500 font-mono">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {cat._count.posts}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton
                        id={cat.id}
                        label={cat.name}
                        api="categories"
                      />
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
