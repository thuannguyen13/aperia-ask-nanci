"use client"

import { useTheme } from "next-themes"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { ChartWidget } from "@/lib/ask-nanci/types"

// Values from aperia-ds5/styles/base.css — light and dark chart palettes
const LIGHT_COLORS = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
]
const DARK_COLORS = [
  "oklch(0.488 0.243 264.376)",
  "oklch(0.696 0.17 162.48)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.627 0.265 303.9)",
  "oklch(0.645 0.246 16.439)",
]

export function MessageChart({ chart }: { chart: ChartWidget }) {
  const { resolvedTheme } = useTheme()
  const chartColors = resolvedTheme === "dark" ? DARK_COLORS : LIGHT_COLORS
  const data = chart.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(chart.datasets.map((ds) => [ds.label, ds.data[i]])),
  }))

  return (
    <div className="mt-3 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{chart.title}</span>
      </div>
      <div className="px-3 py-4">
        <ResponsiveContainer width="100%" height={180}>
          {chart.kind === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              {chart.datasets.map((ds, i) => (
                <Bar key={ds.label} dataKey={ds.label} fill={ds.color ?? chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              {chart.datasets.map((ds, i) => (
                <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={ds.color ?? chartColors[i % chartColors.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
