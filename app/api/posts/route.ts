import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/posts — 获取文章列表（支持筛选已发布/全部）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get("published");
  const where = published === "true" ? { published: true } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(posts);
}

// POST /api/posts — 创建新文章
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      published: body.published ?? false,
      categoryId: body.categoryId,
      authorId: session.user.id,
      tags: {
        create: body.tagIds?.map((tagId: string) => ({ tagId })),
      },
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return Response.json(post, { status: 201 });
}
