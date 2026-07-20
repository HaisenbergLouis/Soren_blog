import { NextRequest } from "next/server";
import { chatCompletionStream } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { message, postTitle, postContent } = await request.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "缺少问题" }, { status: 400 });
  }

  if (!postContent || typeof postContent !== "string") {
    return Response.json({ error: "缺少文章内容" }, { status: 400 });
  }

  const systemPrompt =
    "你是一个博客文章 AI 助手。你的任务是根据用户提供的文章内容回答读者的问题。\n\n" +
    "规则：\n" +
    "1. 只回答与文章内容相关的问题，如果问题超出文章范围，礼貌地表示无法回答\n" +
    "2. 用中文回答，语言简洁清晰\n" +
    "3. 引用文章中的具体内容时，用引号标注\n" +
    "4. 如果问题在文章中找不到答案，直接说「这篇文章中没有提到这个信息」\n\n" +
    `文章标题：${postTitle || "无标题"}\n\n文章内容：\n${postContent}`;

  const stream = chatCompletionStream([
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ]);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
