import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) {
    return Response.json({ error: "邮箱已被注册" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name: body.name || body.email.split("@")[0],
      email: body.email,
      password: body.password,
    },
  });

  return Response.json({ id: user.id }, { status: 201 });
}
