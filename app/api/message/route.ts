import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId) {
    return Response.json({ error: "缺少目标用户" }, { status: 400 });
  }
  if (targetUserId === session.user.id) {
    return Response.json({ error: "不能给自己发消息" }, { status: 400 });
  }

  // 查两人是否已有共同对话
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: session.user.id } } },
        { participants: { some: { userId: targetUserId } } },
      ],
    },
  });

  if (existing) {
    return Response.json({ conversationId: existing.id });
  }

  // 没有则新建
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: session.user.id }, { userId: targetUserId }],
      },
    },
  });

  return Response.json({ conversationId: conversation.id });
}
