import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LoadMore from "@/components/posts/LoadMore";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const keyword = q?.trim();

  const where = {
    published: true,
    ...(keyword ? { OR: [{ title: { contains: keyword } }, { excerpt: { contains: keyword } }] } : {}),
    ...(category ? { category: { slug: category } } : {}),
  };

  const [categories, posts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { category: { select: { name: true, slug: true } } },
    }),
  ]);

  const currentCategory = category ? categories.find((c) => c.slug === category) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="flex gap-12">
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-1">
            <Link
              href="/"
              className={"block rounded-xl px-4 py-2.5 text-sm transition-colors " + (!category && !keyword ? "font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100")}
            >
              全部文章
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={category === cat.slug ? "/" : "/?category=" + cat.slug}
                className={"block rounded-xl px-4 py-2.5 text-sm transition-colors " + (category === cat.slug ? "font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100")}
              >
                <span>{cat.name}</span>
                <span className="float-right text-xs text-neutral-400">{cat._count.posts}</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {keyword ? '"' + keyword + '" 的搜索结果' : currentCategory ? currentCategory.name : "所有文章"}
          </h1>
          <p className="text-sm text-neutral-500 mb-8">{posts.length} 篇文章</p>

          {posts.length === 0 ? (
            <p className="text-neutral-400 text-center py-20">
              {keyword ? "没有找到相关文章" : "还没有文章"}
            </p>
          ) : (
            <LoadMore
              initialPosts={posts}
              category={category}
              keyword={keyword}
            />
          )}
        </div>
      </div>
    </div>
  );
}