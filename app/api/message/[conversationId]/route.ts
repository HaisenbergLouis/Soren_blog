import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { conversationId } = await params;

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: session.user.id },
    },
  });
  if (!participant) {
    return Response.json({ error: "无权访问" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  return Response.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { conversationId } = await params;
  const { content } = await request.json();

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "消息不能为空" }, { status: 400 });
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: session.user.id },
    },
  });
  if (!participant) {
    return Response.json({ error: "无权访问" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      conversationId,
      senderId: session.user.id,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return Response.json(message, { status: 201 });
}
