/* eslint-disable @next/next/no-img-element */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Globe, Calendar } from "lucide-react";
import ProfileActions from "./ProfileActions";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, posts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        bio: true,
        bgImage: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      where: { authorId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const publishedCount = posts.filter((p) => p.published).length;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("zh-CN")
    : "";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* 封面区域 */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        {/* 背景图 */}
        <div className="h-48 sm:h-56 bg-linear-to-r from-neutral-300 to-neutral-400 dark:from-neutral-800 dark:to-neutral-700">
          {user?.bgImage && (
            <img
              src={user.bgImage}
              alt="背景"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* 头像 + 个人资料（覆盖在背景图上） */}
        <div className="relative px-6 pb-6">
          {/* 头像 */}
          <div className="-mt-12 mb-4 flex items-end gap-5">
            <div className="h-28 w-28 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-700 overflow-hidden shadow-lg shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="头像"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-neutral-500 dark:text-neutral-400">
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-14">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {user?.name ?? "用户"}
              </h1>
              {user?.bio && (
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>

            <div className="pt-14 shrink-0">
              <ProfileActions
                profile={{
                  name: user?.name ?? null,
                  bio: user?.bio ?? null,
                  image: user?.image ?? null,
                  bgImage: user?.bgImage ?? null,
                }}
              />
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {posts.length} 篇文章 · {publishedCount} 篇已发布
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {memberSince} 加入
            </span>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          我的文章
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <p>还没有写过文章</p>
            <Link
              href="/write"
              className="mt-4 inline-block rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              写第一篇
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {post.category?.name ?? "未分类"}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                      {post.excerpt && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-xs text-neutral-400">
                            {post.excerpt}
                          </span>
                        </>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          post.published
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/edit/${post.id}`}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 opacity-0 group-hover:opacity-100"
                  >
                    编辑
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
