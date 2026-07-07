import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload — 上传图片（头像/背景图）
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "未选择文件" }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "仅支持 JPG、PNG、GIF、WebP 格式" },
        { status: 400 },
      );
    }

    // 验证文件大小（最大 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: "文件大小不能超过 5MB" }, { status: 400 });
    }

    // 生成唯一文件名
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${session.user.id}_${Date.now()}.${ext}`;

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 写入文件
    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // 返回可访问的 URL
    const url = `/uploads/${filename}`;
    return Response.json({ url }, { status: 201 });
  } catch {
    return Response.json({ error: "上传失败" }, { status: 500 });
  }
}
