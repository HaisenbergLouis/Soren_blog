import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { title } = await request.json();

  if (!title || typeof title !== "string" || !title.trim()) {
    return Response.json({ error: "缺少标题" }, { status: 400 });
  }

  try {
    const slug = await chatCompletion(
      [
        {
          role: "system",
          content:
            "你是一个 URL Slug 生成器。根据用户提供的文章标题，" +
            "生成一个适合 URL 的英文 slug。规则：仅包含小写字母、数字和连字符(-)，" +
            "不能以连字符开头或结尾，长度不超过 80 个字符。直接输出 slug，不要任何额外内容。",
        },
        {
          role: "user",
          content: title,
        },
      ],
      { temperature: 0.1, maxTokens: 100 },
    );

    return Response.json({ slug: slug.trim() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "生成 Slug 失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
