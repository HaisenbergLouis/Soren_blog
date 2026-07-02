import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: 根据 slug 获取文章详情
  // const post = await getPostBySlug(slug);
  // if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
      >
        ← 返回文章列表
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
          <span>分类</span>
          <span>·</span>
          <span>2024-01-01</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
          文章标题: {slug}
        </h1>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-neutral-400 text-center py-20">
          文章内容将在这里展示
        </p>
      </div>
    </article>
  );
}