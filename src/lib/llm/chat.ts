type Provider = "openai";

export async function chatLLM(
  provider: Provider,
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  switch (provider) {
    case "openai":
      const { chatOpenAI } = await import("./openai");
      return chatOpenAI(prompt, history);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export async function* chatLLMStream(
  provider: Provider,
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[]
): AsyncGenerator<string> {
  switch (provider) {
    case "openai":
      const { chatOpenAIStream } = await import("./openai");
      yield* chatOpenAIStream(prompt, history);
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
