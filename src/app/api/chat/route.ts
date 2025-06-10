import { chatLLM } from "@/lib/llm/chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, history } = await request.json();

    const aiContent = await chatLLM("openai", prompt, history);

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
