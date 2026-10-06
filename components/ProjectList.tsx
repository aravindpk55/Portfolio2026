"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, categoryLabels, type Category } from "@/data/portfolio";

const filters: ("all" | Category)[] = [
  "all",
  ...(["rag", "llm", "ml", "analysis"] as Category[]).filter((c) => projects.some((p) => p.categories.includes(c))),
];

export function CategoryTag({ c }: { c: Category }) {
  return (
    <span className="tag">
      <span className="h-2 w-2 rounded-full" style={{ background: `rgb(var(--cat-${c}))` }} />
      {categoryLabels[c]}
    </span>
  );
}

export function ProjectList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const shown = projects.filter((p) => filter === "all" || p.categories.includes(filter));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by topic">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-4 py-1.5 text-[0.95rem] transition-colors ${
              filter === f ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {f === "all" ? "All projects" : categoryLabels[f]}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {shown.map((p) => (
          <li key={p.slug} className="group relative grid gap-4 py-8 md:grid-cols-[1fr_auto] md:gap-10">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {p.categories.map((c) => (
                  <CategoryTag key={c} c={c} />
                ))}
                <span className="text-sm text-muted">{p.year}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 group-hover:text-signal">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-prose text-muted">{p.summary}</p>
              <p className="mt-3 text-sm text-muted">{p.stack.join(", ")}</p>
            </div>

            <div className="flex items-end gap-6 md:flex-col md:items-end md:justify-between">
              <dl className="flex gap-6 md:text-right">
                {p.metrics.slice(0, 2).map((m) => (
                  <div key={m.label}>
                    <dt className="text-sm text-muted">{m.label}</dt>
                    <dd className="font-display text-2xl font-semibold">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="relative z-10 flex gap-3 text-sm">
                <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-ink">
                  <Github size={16} /> Code
                </a>
                <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1 text-muted hover:text-ink">
                  Case study <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
