"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="font-display text-lg font-semibold">
          {profile.name}
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-full px-3 py-1.5 text-[0.95rem] text-muted hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={profile.resume} className="btn-ghost !px-4 !py-1.5 text-sm" target="_blank" rel="noreferrer">
            Resume
          </a>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink"
            aria-label="Switch colour theme"
          >
            {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
