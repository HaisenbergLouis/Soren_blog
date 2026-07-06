import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/components/Pagination";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 9;
  const keyword = q?.trim();

  const where = {
    published: true,
    ...(keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { excerpt: { contains: keyword } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          所有文章
        </h1>
        <p className="text-neutral-500 mt-2">共 {posts.length} 篇文章</p>
        {/* 搜索框 */}
        <form className="mt-6 flex gap-3 max-w-md">
          <input
            name="q"
            defaultValue={keyword ?? ""}
            placeholder="搜索文章..."
            className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            搜索
          </button>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">
            <BookOpen className="w-16 h-16" />
          </span>
          <p className="text-neutral-400">还没有文章</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-xs text-neutral-500 mb-2">
                {post.category?.name ?? "未分类"}
              </div>
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <p className="text-xs text-neutral-400 mt-4">
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </Link>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/posts"
      />
    </div>
  );
}
