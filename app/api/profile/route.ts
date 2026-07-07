import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/profile — 获取当前用户完整信息
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      bgImage: true,
      role: true,
      createdAt: true,
    },
  });

  return Response.json(user);
}

// PUT /api/profile — 更新个人资料
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name ?? undefined,
      image: body.image ?? undefined,
      bio: body.bio ?? undefined,
      bgImage: body.bgImage ?? undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      bgImage: true,
      role: true,
    },
  });

  return Response.json(user);
}
