"use client";
// "Ask about my work": a floating RAG chat over the content in data/portfolio.ts.
// Other components can open it with: window.dispatchEvent(new CustomEvent("open-chat", { detail: "question" }))
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import { profile } from "@/data/portfolio";

type Msg = { role: "user" | "assistant"; content: string; sources?: string[] };

const first = profile.name.split(" ")[0];
const suggestions = [`What projects has ${first} built?`, "Which project had the strongest results?", `What tools does ${first} use?`];

export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string>).detail;
      if (q) ask(q);
    };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.answer ?? data.error, sources: data.sources }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Couldn't reach the server. Check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask about my work"}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper shadow-lg hover:bg-signal"
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
        <span className="hidden text-[0.95rem] font-medium sm:inline">{open ? "Close" : "Ask about my work"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Ask about my work"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 flex h-[min(560px,75vh)] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          >
            <header className="border-b border-line px-5 py-4">
              <p className="font-display text-lg font-semibold">Ask about my work</p>
              <p className="text-sm text-muted">Answers come only from my projects and resume, with sources.</p>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted">Try one of these:</p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="block w-full rounded-lg border border-line px-3 py-2 text-left text-[0.95rem] hover:border-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed ${
                      m.role === "user" ? "bg-ink text-paper" : "bg-paper"
                    }`}
                  >
                    {m.content}
                    {m.sources && m.sources.length > 0 && (
                      <p className="mt-2 border-t border-line pt-2 text-xs text-muted">Sources: {m.sources.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && <p className="text-sm text-muted">Searching my projects…</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <label htmlFor="chat-input" className="sr-only">Your question</label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${first}'s projects`}
                className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-[0.95rem] outline-none focus:border-signal"
                maxLength={500}
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Send question" className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper disabled:opacity-40">
                <Send size={16} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
