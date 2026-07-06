import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const { ids, published, categoryId } = body;

  await prisma.post.updateMany({
    where: { id: { in: ids } },
    data: {
      ...(published !== undefined ? { published } : {}),
      ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
    },
  });

  return Response.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const { ids } = body;

  await prisma.post.deleteMany({
    where: { id: { in: ids } },
  });

  return new Response(null, { status: 204 });
}
