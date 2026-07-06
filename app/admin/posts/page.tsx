import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostTable from "@/components/posts/PostTable";

export default async function AdminPostsPage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);

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
          <span>+</span>
          新建文章
        </Link>
      </div>

      <PostTable posts={posts} categories={categories} />
    </div>
  );
}