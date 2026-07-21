import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/messages/unread — 获取当前用户的未读消息总数
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ count: 0 });
  }

  const count = await prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: session.user.id },
      conversation: {
        participants: { some: { userId: session.user.id } },
      },
    },
  });

  return Response.json({ count }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
