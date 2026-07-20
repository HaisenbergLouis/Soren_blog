import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
  const { category } = await searchParams;

  const [categories, posts, totalPosts] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: { select: { posts: { where: { published: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where: {
        published: true,
        ...(category ? { category: { slug: category } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 20,
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
        <div key={category ?? "all"} className="flex-1 min-w-0 pl-12">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {currentCategory ? currentCategory.name : "所有文章"}
          </h1>

          {posts.length === 0 ? (
            <p className="text-neutral-400 text-center py-20">还没有文章</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post, i) => (
                <article key={post.id}>
                  <Link href={"/posts/" + post.slug} className="group block">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                      <span>{post.category?.name ?? "未分类"}</span>
                      <span>·</span>
                      <time>
                        {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                      </time>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-neutral-500 mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                  {i < posts.length - 1 && (
                    <div className="border-b border-neutral-100 dark:border-neutral-800 mt-8" />
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
