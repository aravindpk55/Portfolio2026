import { NextResponse } from "next/server";
import { retrieve } from "@/lib/knowledge";
import { profile } from "@/data/portfolio";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

// Simple per-IP limit so a public demo can't drain your API quota.
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { n: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  h.n += 1;
  return h.n > 30;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Question limit reached for this hour. Email me instead." }, { status: 429 });
  }

  const { messages } = (await req.json()) as { messages: Msg[] };
  const history = (messages ?? []).slice(-6).map((m) => ({ role: m.role, content: String(m.content).slice(0, 1000) }));
  const question = history.filter((m) => m.role === "user").at(-1)?.content;
  if (!question) return NextResponse.json({ error: "Ask a question first." }, { status: 400 });

  const context = retrieve(question);
  const sources = Array.from(new Set(context.map((c) => c.source)));

  const { LLM_BASE_URL, LLM_API_KEY, LLM_MODEL } = process.env;
  if (!LLM_API_KEY) {
    // Works without a key: returns the retrieved passages so you can test retrieval locally.
    return NextResponse.json({
      answer: `The chat model isn't configured yet (add LLM_API_KEY). Closest matches:\n\n${context
        .map((c) => `• ${c.text.slice(0, 220)}…`)
        .join("\n\n")}`,
      sources,
    });
  }

  const system = `You answer questions about ${profile.name}'s work for recruiters and hiring managers.
Use ONLY the context below. If the answer isn't in it, say you don't have that detail and suggest emailing ${profile.email}.
Refer to ${profile.name} in the third person. Keep answers under 120 words, concrete, and include numbers when the context has them.

Context:
${context.map((c, i) => `[${i + 1}] (${c.source}) ${c.text}`).join("\n")}`;

  try {
    const res = await fetch(`${LLM_BASE_URL ?? "https://api.groq.com/openai/v1"}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify({
        model: LLM_MODEL ?? "openai/gpt-oss-120b",
        temperature: 0.2,
        max_tokens: 1500,
        reasoning_effort: "low",
        messages: [{ role: "system", content: system }, ...history],
      }),
    });
    if (!res.ok) throw new Error(`LLM API returned ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content ?? "No answer returned.", sources });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "The chat model didn't respond. Try again in a minute." }, { status: 502 });
  }
}
