import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function chatOpenAI(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  const { choices } = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "You are helpful assistant." },
      ...history,
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });
  return choices[0]?.message?.content ?? "";
}
