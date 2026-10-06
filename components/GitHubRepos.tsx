import { Star, GitFork } from "lucide-react";
import { profile } from "@/data/portfolio";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
};

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${profile.github}/repos?sort=pushed&per_page=30`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
      next: { revalidate: 3600 }, // refresh at most once an hour
    });
    if (!res.ok) return [];
    const repos: Repo[] = await res.json();
    return repos.filter((r) => !r.fork).slice(0, 6);
  } catch {
    return [];
  }
}

export async function GitHubRepos() {
  const repos = await getRepos();
  if (!repos.length) {
    return (
      <p className="text-muted">
        Set your GitHub username in <code>data/portfolio.ts</code> to show your latest repositories here.
      </p>
    );
  }
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((r) => (
        <li key={r.id} className="bg-surface">
          <a href={r.html_url} target="_blank" rel="noreferrer" className="flex h-full flex-col p-5 hover:bg-paper">
            <span className="font-medium">{r.name}</span>
            <span className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{r.description ?? "No description yet."}</span>
            <span className="mt-4 flex items-center gap-4 text-sm text-muted">
              {r.language && <span>{r.language}</span>}
              <span className="inline-flex items-center gap-1"><Star size={14} /> {r.stargazers_count}</span>
              <span className="inline-flex items-center gap-1"><GitFork size={14} /> {r.forks_count}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
