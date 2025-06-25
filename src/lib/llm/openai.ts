import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function* chatOpenAIStream(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are helpful assistant." },
      ...history,
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
