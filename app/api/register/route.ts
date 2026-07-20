import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import {
  checkPasswordStrength,
  getPasswordErrors,
} from "@/lib/password-strength";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, password } = body;

  if (!password || typeof password !== "string") {
    return Response.json({ error: "密码不能为空" }, { status: 400 });
  }

  // 服务端密码强度验证
  const strengthResult = checkPasswordStrength(password);
  if (strengthResult.strength === "weak") {
    const errors = getPasswordErrors(password, strengthResult);
    return Response.json(
      { error: `密码强度不足：${errors.join("，")}` },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return Response.json({ error: "邮箱已被注册" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  const userCount = await prisma.user.count();

  const user = await prisma.user.create({
    data: {
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      role: userCount === 0 ? "ADMIN" : "USER",
    },
  });

  return Response.json({ id: user.id }, { status: 201 });
}
