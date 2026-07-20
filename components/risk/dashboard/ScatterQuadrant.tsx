"use client"

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine, ReferenceArea, ResponsiveContainer } from "recharts"
import { SCATTER_POINTS, SCATTER_COLORS, type ScatterCat } from "@/lib/ask-nanci/data/risk-dashboard"

const CATS: ScatterCat[] = ["none", "vw", "mc", "both"]

// VW (x) vs MC (y) scatter with quadrant lines at 65 and a tinted "Both Critical" corner.
export function ScatterQuadrant() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 10, right: 16, bottom: 20, left: 0 }}>
        <ReferenceArea x1={65} x2={100} y1={65} y2={100} fill="#dc2626" fillOpacity={0.06} />
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
  )
}
