import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/comments?postId=xxx — 获取某篇文章的评论
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return Response.json({ error: "缺少 postId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null }, // 只取顶级评论
    include: {
      author: { select: { id: true, name: true, image: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(comments);
}

// POST /api/comments — 发表评论
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.postId || !body.content?.trim()) {
    return Response.json({ error: "参数不完整" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content: body.content.trim(),
      postId: body.postId,
      authorId: session.user.id,
      parentId: body.parentId || null,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return Response.json(comment, { status: 201 });
}
