/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Calendar } from "lucide-react";
import FollowButton from "./FollowButton";
import MessageButton from "./MessageButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true, image: true },
  });

  if (!user) return { title: "用户未找到" };

  return {
    title: `${user.name ?? "用户"} 的个人主页`,
    description:
      user.bio || `${user.name ?? "该用户"} 的个人主页，查看其发表的文章`,
    openGraph: {
      title: `${user.name ?? "用户"} 的个人主页`,
      description: user.bio || undefined,
      ...(user.image ? { images: [{ url: user.image }] } : {}),
    },
    alternates: {
      canonical: `/user/${id}`,
    },
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      bgImage: true,
      createdAt: true,
      _count: {
        select: {
          posts: { where: { published: true } },
          followedBy: true,
          following: true,
        },
      },
    },
  });

  if (!user) notFound();

  const posts = await prisma.post.findMany({
    where: { authorId: id, published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const isOwn = session?.user?.id === id;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* 封面区域 */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <div className="h-48 sm:h-56 bg-linear-to-r from-neutral-300 to-neutral-400 dark:from-neutral-800 dark:to-neutral-700">
          {user.bgImage && (
            <img
              src={user.bgImage}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end gap-5">
            <div className="h-28 w-28 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-700 overflow-hidden shadow-lg shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-neutral-500">
                  {(user.name ?? "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-14">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {user.name ?? "用户"}
              </h1>
              {user.bio && (
                <p className="text-sm text-neutral-500 mt-1">{user.bio}</p>
              )}
            </div>

            <div className="pt-14 shrink-0">
              {!isOwn && session?.user?.id && (
                <>
                  <FollowButton targetUserId={user.id} />
                  <MessageButton targetUserId={user.id} />
                </>
              )}
              {isOwn && (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  编辑资料
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {user._count.posts} 篇文章
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(user.createdAt).toLocaleDateString("zh-CN")} 加入
            </span>
            <span>👥 {user._count.following} 关注</span>
            <span>❤️ {user._count.followedBy} 粉丝</span>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          文章
        </h2>

        {posts.length === 0 ? (
          <p className="text-neutral-400 text-center py-20">暂无文章</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900"
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600"
                >
                  {post.title}
                </Link>
                <div className="text-sm text-neutral-500 mt-1">
                  {post.category?.name ?? "未分类"} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
