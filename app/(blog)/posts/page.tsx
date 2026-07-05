import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          所有文章
        </h1>
        <p className="text-neutral-500 mt-2">共 {posts.length} 篇文章</p>
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
    </div>
  );
}
