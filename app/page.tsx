import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { EmbeddingMap } from "@/components/EmbeddingMap";
import { ProjectList } from "@/components/ProjectList";
import { GitHubRepos } from "@/components/GitHubRepos";
import { AskButton } from "@/components/AskButton";
import { profile, skills, timeline } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="wrap grid items-center gap-10 pb-16 pt-14 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-1.5 text-muted">
            <MapPin size={16} /> {profile.location}
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-5 font-display text-2xl leading-snug text-ink/80 sm:text-[1.7rem]">{profile.role}</p>
          <p className="mt-5 max-w-prose text-muted">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn-primary">See my projects</a>
            <AskButton />
          </div>
        </div>
        <EmbeddingMap />
      </section>

      {/* Work */}
      <section id="work" className="section border-t border-line">
        <div className="wrap">
          <h2 className="h2">Selected projects</h2>
          <p className="mb-10 mt-3 max-w-prose text-muted">
            Each one has a case study with the problem, data, method and measured results.
          </p>
          <ProjectList />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section border-t border-line bg-surface">
        <div className="wrap">
          <h2 className="h2 mb-10">Skills and tools</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="font-display text-lg font-semibold">{s.group}</h3>
                <ul className="mt-3 space-y-1.5 text-muted">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub */}
      <section className="section border-t border-line">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="h2">Recently on GitHub</h2>
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-ink">
              <Github size={18} /> github.com/{profile.github}
            </a>
          </div>
          <GitHubRepos />
        </div>
      </section>

      {/* About + timeline */}
      <section id="about" className="section border-t border-line bg-surface">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="h2 mb-6">About me</h2>
            <div className="max-w-prose space-y-4 text-muted">
              {profile.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="text-ink">{profile.lookingFor}</p>
            </div>
          </div>
          <div>
            <h2 className="h2 mb-6">Education and experience</h2>
            <ol className="relative border-l border-line pl-6">
              {timeline.map((t) => (
                <li key={t.title} className="mb-8 last:mb-0">
                  <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-signal" />
                  <p className="text-sm text-muted">{t.period}</p>
                  <p className="font-display text-lg font-semibold">{t.title}</p>
                  <p className="text-muted">{t.place}</p>
                  <p className="mt-1 text-muted">{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section border-t border-line">
        <div className="wrap max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Let&apos;s talk</h2>
          <p className="mx-auto mt-4 max-w-prose text-muted">{profile.lookingFor} The fastest way to reach me is email.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary"><Mail size={17} /> {profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-ghost"><Linkedin size={17} /> LinkedIn</a>
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="btn-ghost"><Github size={17} /> GitHub</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
      </footer>
    </>
  );
}
