import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();

  if (!content || typeof content !== "string") {
    return Response.json({ error: "缺少文章内容" }, { status: 400 });
  }

  if (content.length < 50) {
    return Response.json(
      { error: "内容太短，至少需要 50 个字符" },
      { status: 400 },
    );
  }

  try {
    const summary = await chatCompletion(
      [
        {
          role: "system",
          content:
            "你是一个博客文章摘要生成助手。根据用户提供的文章标题和内容，" +
            "用中文生成一段简洁的摘要（30-80字），突出文章核心观点。" +
            "直接输出摘要内容，不要加前缀、引号或多余格式。",
        },
        {
          role: "user",
          content: `标题：${title || "无标题"}\n\n文章内容：\n${content.slice(0, 4000)}`,
        },
      ],
      { temperature: 0.3, maxTokens: 300 },
    );

    return Response.json({ summary: summary.trim() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "生成摘要失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
