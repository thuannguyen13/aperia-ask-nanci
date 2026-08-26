"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { PARAM_HEAT } from "@/lib/ask-nanci/data/risk-dashboard"
import { findParameter } from "@/lib/ask-nanci/data/risk-parameters"

// The axis has room for "P14" and nothing else, so the parameter's actual name only
// exists on hover. Resolved through the catalog rather than stored on the chart row —
// this chart and the Risk Report's violation table name the same parameters.
function ParamTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey?: string | number; value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const param = findParameter(String(label))
  const value = (key: string) => payload.find((p) => p.dataKey === key)?.value
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{param ? `${param.id} — ${param.name}` : label}</p>
      {param && <p className="text-muted-foreground">{param.model === "mc" ? "Mastercard" : "VisionWeb"} parameter</p>}
      <p className="mt-1 tabular-nums text-foreground">{value("fires")} fires · {value("caseRate")}% case rate</p>
    </div>
  )
}

// Bars = fires count (left axis), line = case rate % (right axis).
export function ParamHeatChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={PARAM_HEAT} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
        <XAxis dataKey="param" tick={{ fontSize: 10 }} tickLine={false} interval={0} />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 250]} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip content={<ParamTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.06 }} />
        <Bar yAxisId="left" dataKey="fires" fill="#facc15" radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="caseRate" stroke="#0d9488" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
