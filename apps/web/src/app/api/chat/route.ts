import { chatLLMStream } from "@/lib/llm/chat";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt, history } = await request.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const token of chatLLMStream("openai", prompt, history)) {
          controller.enqueue(encoder.encode(token));
        }
      } catch (err) {
        console.error("Stream error:", err);
        controller.enqueue(encoder.encode("\n[Stream error occurred]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
