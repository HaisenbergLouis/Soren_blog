/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Eye } from "lucide-react";
import CommentList from "@/components/comments/CommentList";
import FollowButton from "@/app/(main)/user/[id]/FollowButton";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let { slug } = await params;
  slug = decodeURIComponent(slug);

  const session = await auth();
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true, image: true } },
    },
  });
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto py-8">
      {/* 返回链接 */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
      >
        ← 返回文章列表
      </Link>
      {/* 封面图 */}
      {post.coverImage && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      {/* 文章头部 */}
      <header className="mb-10">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
          {/* TODO: 分类标签 */}
          {post.category && (
            <Link
              href={`/posts?category=${post.category.slug}`}
              className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          <span className="text-neutral-300">·</span>
          {/* TODO: 发布时间 */}
          <time>
            {new Date(post.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {/* TODO: 阅读量 */}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {post.viewCount}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
          {post.title}
        </h1>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
          {slug}
        </h1>
        {/* TODO: 文章摘要 */}
        {post.excerpt && (
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* 作者信息 */}
      {post.author && (
        <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Link
            href={`/user/${post.author.id}`}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden shrink-0">
              {post.author.image ? (
                <img
                  src={post.author.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-500">
                  {(post.author.name ?? "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {post.author.name ?? "匿名"}
              </p>
              <p className="text-xs text-neutral-400">文章作者</p>
            </div>
          </Link>
          {session?.user?.id && session.user.id !== post.author.id && (
            <FollowButton targetUserId={post.author.id} />
          )}
        </div>
      )}

      {/* 文章正文 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* TODO: 渲染 Markdown 内容，可以用 react-markdown */}
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      {/* TODO: 标签列表 */}
      {post.tags.length > 0 && (
        <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/posts?tag=${tag.slug}`}
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <CommentList postId={post.id} />
    </article>
  );
}
