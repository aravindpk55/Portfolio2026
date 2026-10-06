"use client";
// The hero's signature element: your projects drawn as points in an
// "embedding space", clustered by category. Background dots are a
// deterministic decoration so the layout is identical on every load.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { projects, categoryLabels, type Category } from "@/data/portfolio";

const W = 600;
const H = 470;

// Only categories that have at least one project get a cluster, laid out to fit how many there are.
const order: Category[] = ["rag", "llm", "ml", "analysis"];
const activeCats = order.filter((c) => projects.some((p) => p.categories[0] === c));
const layouts: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 300, y: 235 }],
  2: [{ x: 185, y: 250 }, { x: 415, y: 220 }],
  3: [{ x: 190, y: 150 }, { x: 410, y: 160 }, { x: 300, y: 345 }],
  4: [{ x: 190, y: 150 }, { x: 400, y: 135 }, { x: 420, y: 340 }, { x: 175, y: 345 }],
};
const centers = Object.fromEntries(activeCats.map((c, i) => [c, layouts[activeCats.length][i]])) as Record<Category, { x: number; y: number }>;

const color = (c: Category) => `rgb(var(--cat-${c}))`;

function prng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

export function EmbeddingMap() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const { dots, points } = useMemo(() => {
    const rand = prng(7);
    const cats = activeCats;
    const dots = Array.from({ length: 40 * cats.length }, (_, i) => {
      const c = cats[i % cats.length];
      return { c, x: centers[c].x + gaussian(rand) * 52, y: centers[c].y + gaussian(rand) * 42, r: 1.6 + rand() * 1.8 };
    });
    // Place each project around its main cluster, spread so labels don't collide.
    const perCat: Record<string, number> = {};
    const points = projects.map((p) => {
      const c = p.categories[0];
      const i = (perCat[c] = (perCat[c] ?? -1) + 1);
      const angle = -Math.PI / 3 + i * 2.1;
      const radius = i === 0 ? 0 : 38;
      return { p, c, x: centers[c].x + Math.cos(angle) * radius, y: centers[c].y + Math.sin(angle) * radius };
    });
    return { dots, points };
  }, []);

  const activePoint = points.find((pt) => pt.p.slug === active);
  const cx = W / 2, cy = H / 2;
  const delayFor = (x: number, y: number) => (reduce ? 0 : Math.hypot(x - cx, y - cy) / 900);

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Map of projects grouped by topic">
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={color(d.c)}
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 0.12 : 0.28 }}
            transition={{ duration: 0.6, delay: active ? 0 : delayFor(d.x, d.y) }}
          />
        ))}

        {activeCats.map((c) => (
          <text
            key={c}
            x={centers[c].x}
            y={centers[c].y + (centers[c].y <= cy ? -78 : 92)}
            textAnchor="middle"
            className="font-display"
            fontSize="19"
            fontWeight={600}
            fill={color(c)}
          >
            {categoryLabels[c]}
          </text>
        ))}

        {/* Links from a project to the other topics it touches */}
        {activePoint?.p.categories.slice(1).filter((c) => centers[c]).map((c) => (
          <motion.line
            key={c}
            x1={activePoint.x}
            y1={activePoint.y}
            x2={centers[c].x}
            y2={centers[c].y}
            stroke={color(c)}
            strokeWidth={1.5}
            strokeDasharray="4 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35 }}
          />
        ))}

        {points.map(({ p, c, x, y }) => {
          const on = active === p.slug;
          return (
            <motion.g
              key={p.slug}
              role="link"
              tabIndex={0}
              aria-label={`${p.title}. Open project`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActive(p.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive(null)}
              onClick={() => router.push(`/projects/${p.slug}`)}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/projects/${p.slug}`)}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.5 + delayFor(x, y) }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={22} fill="transparent" />
              <circle cx={x} cy={y} r={on ? 20 : 15} fill={color(c)} opacity={0.18} style={{ transition: "r .2s" }} />
              <circle cx={x} cy={y} r={on ? 10 : 8} fill={color(c)} stroke="rgb(var(--paper))" strokeWidth={2} style={{ transition: "r .2s" }} />
            </motion.g>
          );
        })}
      </svg>

      {activePoint && (
        <div
          className="pointer-events-none absolute z-10 w-60 rounded-lg border border-line bg-surface p-3 text-sm shadow-lg"
          style={{
            left: `${(activePoint.x / W) * 100}%`,
            top: `${(activePoint.y / H) * 100}%`,
            transform: `translate(${activePoint.x > W / 2 ? "-105%" : "5%"}, -50%)`,
          }}
        >
          <p className="font-display font-semibold leading-snug">{activePoint.p.title}</p>
          <p className="mt-1 leading-snug text-muted">{activePoint.p.summary}</p>
        </div>
      )}

      <figcaption className="mt-2 text-center text-sm text-muted">
        Each large point is a project. Select one to open it.
      </figcaption>
    </figure>
  );
}
