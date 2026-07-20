"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { PARAM_HEAT } from "@/lib/ask-nanci/data/risk-dashboard"

// Bars = fires count (left axis), line = case rate % (right axis).
export function ParamHeatChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={PARAM_HEAT} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
        <XAxis dataKey="param" tick={{ fontSize: 10 }} tickLine={false} interval={0} />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 250]} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Bar yAxisId="left" dataKey="fires" fill="#facc15" radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="caseRate" stroke="#0d9488" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
