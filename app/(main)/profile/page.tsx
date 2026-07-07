import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {session.user.name ?? "用户"} 的个人主页
        </h1>
        <p className="text-neutral-500 mt-2">
          共 {posts.length} 篇文章 · {posts.filter((p) => p.published).length}{" "}
          篇已发布
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p>还没有写过文章</p>
          <Link href="/write" className="mt-4 inline-block underline text-sm">
            写第一篇 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                    <span>{post.category?.name ?? "未分类"}</span>
                    <span>·</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                    <span
                      className={`text-xs ${post.published ? "text-emerald-500" : "text-neutral-400"}`}
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/edit/${post.id}`}
                  className="text-sm text-neutral-400 hover:text-neutral-600"
                >
                  编辑
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
