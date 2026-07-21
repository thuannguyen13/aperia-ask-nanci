"use client"

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, ReferenceArea, ResponsiveContainer } from "recharts"
import { SCATTER_POINTS, SCATTER_COLORS, type ScatterCat } from "@/lib/ask-nanci/data/risk-dashboard"

const CATS: ScatterCat[] = ["none", "vw", "mc", "both"]

const count = (cat: ScatterCat) => SCATTER_POINTS.filter((p) => p.cat === cat).length

// The four quadrants the 65/65 lines cut the portfolio into. Each is tinted with its
// category color and labeled in its outer corner, so the chart reads as a quadrant
// map rather than a scatter that happens to have crosshairs on it.
const QUADRANTS: { cat: ScatterCat; label: string; x: [number, number]; y: [number, number]; pos: "insideTopLeft" | "insideTopRight" | "insideBottomLeft" | "insideBottomRight" }[] = [
  { cat: "both", label: "Both critical", x: [65, 100], y: [65, 100], pos: "insideTopRight" },
  { cat: "mc",   label: "MC only",       x: [0, 65],   y: [65, 100], pos: "insideTopLeft" },
  { cat: "vw",   label: "VW only",       x: [65, 100], y: [0, 65],   pos: "insideBottomRight" },
  { cat: "none", label: "Below both",    x: [0, 65],   y: [0, 65],   pos: "insideBottomLeft" },
]

export function ScatterQuadrant() {
  return (
    // Fills the card: chart takes the leftover height, the caption keeps its own.
    <div className="flex h-full min-h-[240px] flex-col gap-2">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <ScatterChart margin={{ top: 10, right: 16, bottom: 20, left: 0 }}>
            {QUADRANTS.map((q) => (
              <ReferenceArea
                key={q.cat}
                x1={q.x[0]} x2={q.x[1]} y1={q.y[0]} y2={q.y[1]}
                fill={SCATTER_COLORS[q.cat]}
                fillOpacity={q.cat === "both" ? 0.09 : 0.04}
                label={{ value: `${q.label} · ${count(q.cat)}`, position: q.pos, fontSize: 10, fontWeight: 600, fill: SCATTER_COLORS[q.cat], offset: 8 }}
              />
            ))}
            <ReferenceLine x={65} stroke="#cbd5e1" strokeDasharray="4 4" />
            <ReferenceLine y={65} stroke="#cbd5e1" strokeDasharray="4 4" />
            <XAxis type="number" dataKey="vw" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false}
              label={{ value: "VW Risk Score →", position: "insideBottom", offset: -12, fontSize: 11, fill: "#64748b" }} />
            <YAxis type="number" dataKey="mc" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false}
              label={{ value: "MC Score →", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
            <ZAxis range={[45, 45]} />
            {CATS.map((cat) => (
              <Scatter key={cat} data={SCATTER_POINTS.filter((p) => p.cat === cat)} fill={SCATTER_COLORS[cat]} fillOpacity={0.9} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="shrink-0 px-1 text-[11px] text-muted-foreground">
        Both models score above 65 for{" "}
        <span className="font-semibold" style={{ color: SCATTER_COLORS.both }}>{count("both")} merchants</span> — the top-right corner is where the two models agree, and where to start.
      </p>
    </div>
  )
}
