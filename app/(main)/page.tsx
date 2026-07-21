import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LoadMore from "@/components/posts/LoadMore";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}): Promise<Metadata> {
  const { category, q } = await searchParams;

  if (q?.trim()) {
    return {
      title: `搜索: ${q.trim()}`,
      description: `搜索「${q.trim()}」的相关文章`,
      robots: { index: false, follow: true },
    };
  }

  if (category) {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      select: { name: true, description: true },
    });
    if (cat) {
      return {
        title: cat.name,
        description: cat.description || `${cat.name} 分类下的所有文章`,
      };
    }
  }

  return {
    title: "首页",
    description: "FS Blog - 一个使用 Next.js 构建的全栈博客应用，发现精彩文章",
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = { slug: category };
  if (q?.trim()) {
    where.OR = [
      { title: { contains: q.trim() } },
      { excerpt: { contains: q.trim() } },
    ];
  }

  const [categories, posts, totalPosts] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: { select: { posts: { where: { published: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const currentCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="flex">
        {/* 左侧：分类列表 */}
        <aside className="w-56 shrink-0 hidden md:block border-r border-neutral-200 dark:border-neutral-700 pr-12">
          <div className="sticky top-24 space-y-1 bg-gray-100 p-2 rounded-md">
            <Link
              href="/"
              className={
                "block rounded-xl px-4 py-2.5 text-sm transition-colors " +
                (!category
                  ? "font-semibold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white")
              }
            >
              全部文章
              <span className="float-right text-xs text-neutral-400">
                {totalPosts}
              </span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={"/?category=" + cat.slug}
                scroll={false}
                className={
                  "block rounded-xl px-4 py-2.5 text-sm transition-colors " +
                  (category === cat.slug
                    ? "font-semibold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100")
                }
              >
                <span>{cat.name}</span>
                <span className="float-right text-xs text-neutral-400">
                  {cat._count.posts}
                </span>
              </Link>
            ))}
          </div>
        </aside>

        {/* 右侧：文章列表 */}
        <div
          key={(category ?? "") + ":" + (q ?? "")}
          className="flex-1 min-w-0 pl-12"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {q?.trim()
              ? `搜索「${q.trim()}」`
              : currentCategory
                ? currentCategory.name
                : "所有文章"}
          </h1>

          {posts.length === 0 ? (
            <p className="text-neutral-400 text-center py-20">
              {q?.trim() ? "没有找到相关文章" : "还没有文章"}
            </p>
          ) : (
            <LoadMore
              initialPosts={posts}
              category={category}
              keyword={q?.trim()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
