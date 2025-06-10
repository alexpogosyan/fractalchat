type Provider = "openai";

export async function chatLLM(
  provider: Provider,
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  switch (provider) {
    case "openai":
    default:
      const { chatOpenAI } = await import("./openai");
      return chatOpenAI(prompt, history);
  }
}
