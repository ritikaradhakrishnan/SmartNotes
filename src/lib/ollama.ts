import { z } from "zod";

const resultSchema = z.object({ message: z.object({ content: z.string().min(1) }) });
export async function askOllama(messages: {role: string; content: string}[]) {
  const base = new URL(process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434");
  // This edition intentionally uses a local model, never a cloud model or exposed remote endpoint.
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname) || base.protocol !== 'http:') {
    throw new Error("OLLAMA_CONFIGURATION");
  }
  const model = process.env.OLLAMA_MODEL || "qwen3:4b";
  if (model.includes('cloud')) throw new Error("OLLAMA_CONFIGURATION");
  const response = await fetch(new URL('/api/chat', base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false, think: false, options: { num_ctx: 8192, num_predict: 900, temperature: 0.3 } }),
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) throw new Error(response.status === 404 ? "OLLAMA_MODEL_MISSING" : "OLLAMA_UNAVAILABLE");
  return resultSchema.parse(await response.json()).message.content;
}
