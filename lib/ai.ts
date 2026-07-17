const DEEPSEEK_BASE = "https://api.deepseek.com/v1";

function getApiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key === "sk-your-deepseek-api-key-here") {
    throw new Error("请在 .env 中配置 DEEPSEEK_API_KEY");
  }
  return key;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * 非流式调用 DeepSeek Chat API
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number },
) {
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API 错误 (${res.status}): ${err}`);
  }

  const json = await res.json();
  return json.choices[0].message.content as string;
}

/**
 * 流式调用 DeepSeek Chat API，返回 ReadableStream
 * 用于 SSE (Server-Sent Events)
 */
export function chatCompletionStream(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number },
): ReadableStream {
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 4096,
            stream: true,
          }),
        });

        if (!res.ok) {
          await res.text();
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ error: `API 错误 (${res.status})` })}\n\n`,
            ),
          );
          controller.close();
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          if (cancelled) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content ?? "";
              if (content) {
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ content })}\n\n`,
                  ),
                );
              }
            } catch {
              // skip parse errors
            }
          }
        }

        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ done: true })}\n\n`,
          ),
        );
      } catch (e) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: e instanceof Error ? e.message : "未知错误" })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      cancelled = true;
    },
  });

  return stream;
}
