import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/posts/[id] — 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    return Response.json({ error: "文章不存在" }, { status: 404 });
  }

  return Response.json(post);
}

// PUT /api/posts/[id] — 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "文章不存在" }, { status: 404 });
  }
  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return Response.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      published: body.published,
      categoryId: body.categoryId,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return Response.json(post);
}

// DELETE /api/posts/[id] — 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "文章不存在" }, { status: 404 });
  }
  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return Response.json({ error: "无权限" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
