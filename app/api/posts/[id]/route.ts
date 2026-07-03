import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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
  const { id } = await params;
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
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
