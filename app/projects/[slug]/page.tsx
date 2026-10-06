import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects, profile } from "@/data/portfolio";
import { CategoryTag } from "@/components/ProjectList";
import { ResultChart } from "@/components/ResultChart";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  return p ? { title: `${p.title} | ${profile.name}`, description: p.summary } : {};
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const index = projects.findIndex((x) => x.slug === params.slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="wrap pb-24 pt-10">
      <Link href="/#work" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
        <ArrowLeft size={16} /> All projects
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="mb-4 flex flex-wrap gap-2">
          {p.categories.map((c) => (
            <CategoryTag key={c} c={c} />
          ))}
          <span className="tag">{p.year}</span>
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{p.title}</h1>
        <p className="mt-4 text-xl text-muted">{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={p.github} target="_blank" rel="noreferrer" className="btn-primary"><Github size={17} /> View code</a>
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={17} /> Open demo</a>
          )}
        </div>
      </header>

      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {p.metrics.map((m) => (
          <div key={m.label} className="bg-surface p-5">
            <dt className="text-sm text-muted">{m.label}</dt>
            <dd className="font-display text-3xl font-semibold">{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_380px]">
        <div className="max-w-prose space-y-10">
          <section>
            <h2 className="font-display text-2xl font-semibold">The problem</h2>
            <p className="mt-3 text-muted">{p.problem}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">The data</h2>
            <p className="mt-3 text-muted">{p.data}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Approach</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted marker:text-ink">
              {p.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Results</h2>
            <p className="mt-3 text-muted">{p.results}</p>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {p.chart && <ResultChart chart={p.chart} category={p.categories[0]} />}
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Built with</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="tag">{s}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {p.embed && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Try it</h2>
          <p className="mt-2 text-muted">Live demo hosted on Hugging Face Spaces. It may take a few seconds to wake up.</p>
          <iframe src={p.embed} title={`${p.title} demo`} className="mt-5 h-[640px] w-full rounded-xl border border-line bg-surface" loading="lazy" />
        </section>
      )}

      <Link href={`/projects/${next.slug}`} className="group mt-20 block border-t border-line pt-8">
        <span className="text-muted">Next project</span>
        <span className="mt-1 block font-display text-3xl font-semibold group-hover:text-signal">{next.title}</span>
      </Link>
    </article>
  );
}
