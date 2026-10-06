"use client";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Project } from "@/data/portfolio";

// Splits long bar names onto two lines so they never overlap.
function WrappedTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const words = (payload?.value ?? "").split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines = words.length > 1 ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")] : words;
  return (
    <text x={x} y={y + 12} textAnchor="middle" fill="rgb(var(--muted))" fontSize={12}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>{l}</tspan>
      ))}
    </text>
  );
}

export function ResultChart({ chart, category }: { chart: NonNullable<Project["chart"]>; category: string }) {
  return (
    <figure className="rounded-xl border border-line bg-surface p-5">
      <figcaption className="mb-4">
        <span className="font-display text-lg font-semibold">{chart.title}</span>
        {chart.higherIsBetter === false && <span className="ml-2 text-sm text-muted">Lower is better</span>}
      </figcaption>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.bars} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <XAxis dataKey="name" interval={0} height={44} tick={<WrappedTick />} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgb(var(--line) / 0.4)" }}
              contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--line))", borderRadius: 8 }}
              formatter={(v: number) => [`${v}${chart.unit ?? ""}`, chart.title]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chart.bars.map((b) => (
                <Cell key={b.name} fill={b.highlight ? `rgb(var(--cat-${category}))` : "rgb(var(--line))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
