// Turns data/portfolio.ts into small text chunks and retrieves the most
// relevant ones with BM25. No vector database needed for a portfolio-sized
// corpus; see README for swapping in embeddings.
import { profile, projects, skills, timeline, categoryLabels } from "@/data/portfolio";

export type Chunk = { id: string; source: string; text: string };

export function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  chunks.push({
    id: "profile",
    source: "About",
    text: `${profile.name} is a ${profile.role}, based in ${profile.location}. ${profile.intro} ${profile.about.join(" ")} ${profile.lookingFor} Contact: ${profile.email}.`,
  });
  chunks.push({
    id: "skills",
    source: "Skills",
    text: skills.map((s) => `${s.group}: ${s.items.join(", ")}.`).join(" "),
  });
  chunks.push({
    id: "timeline",
    source: "Education and experience",
    text: timeline.map((t) => `${t.period}: ${t.title} at ${t.place}. ${t.detail}`).join(" "),
  });
  for (const p of projects) {
    const cats = p.categories.map((c) => categoryLabels[c]).join(", ");
    chunks.push({
      id: `${p.slug}-overview`,
      source: p.title,
      text: `Project "${p.title}" (${p.year}, ${cats}). ${p.summary} Problem: ${p.problem} Data: ${p.data} Stack: ${p.stack.join(", ")}.`,
    });
    chunks.push({
      id: `${p.slug}-method`,
      source: p.title,
      text: `How "${p.title}" was built: ${p.approach.join(" ")} Results: ${p.results} Metrics: ${p.metrics
        .map((m) => `${m.label} ${m.value}`)
        .join(", ")}.`,
    });
  }
  return chunks;
}

const STOP = new Set(
  "a an the and or of to in on for with by is are was were be what which who how does do did your you i me my has have about tell any from that this it as at".split(" ")
);

const tokenize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

export function retrieve(query: string, k = 4): Chunk[] {
  const chunks = buildChunks();
  const docs = chunks.map((c) => tokenize(c.text));
  const avgLen = docs.reduce((a, d) => a + d.length, 0) / docs.length;
  const df = new Map<string, number>();
  docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
  const q = tokenize(query);
  const k1 = 1.4, b = 0.75, N = docs.length;

  const scored = chunks.map((chunk, i) => {
    const d = docs[i];
    let score = 0;
    for (const term of q) {
      const tf = d.filter((t) => t === term || t.startsWith(term)).length;
      if (!tf) continue;
      const n = df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.length) / avgLen)));
    }
    return { chunk, score };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
  // Vague questions ("tell me about yourself") match nothing: fall back to the profile.
  return hits.length ? hits.map((h) => h.chunk) : chunks.slice(0, 2);
}
