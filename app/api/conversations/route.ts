import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId: session.user.id } },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // 只取最新一条消息做预览
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 格式化：过滤掉自己，提取对方信息和最后一条消息
  const result = conversations.map((conv) => {
    const other = conv.participants.find((p) => p.userId !== session.user.id);

    const lastMessage = conv.messages[0] ?? null;

    // 未读数 = 该对话中 createdAt > lastReadAt 的消息数
    // 这里简化处理，后面你可以优化

    return {
      id: conv.id,
      otherUser: other?.user ?? null,
      lastMessage: lastMessage
        ? { content: lastMessage.content, createdAt: lastMessage.createdAt }
        : null,
      updatedAt: conv.updatedAt,
    };
  });

  return Response.json(result);
}
