"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { ResponsiveChart, chartTickProps } from "@/components/shared/ResponsiveChart"
import type { ChartWidget } from "@/lib/ask-nanci/types"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function MessageChart({ chart }: { chart: ChartWidget }) {
  const data = chart.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(chart.datasets.map((ds) => [ds.label, ds.data[i]])),
  }))

  // One series needs no key: the title already says what the bars are.
  const legend = chart.datasets.length > 1
    ? chart.datasets.map((ds, i) => ({
        label: ds.label,
        color: ds.color ?? CHART_COLORS[i % CHART_COLORS.length],
      }))
    : undefined

  return (
    <div className="mt-3 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{chart.title}</span>
      </div>
      <div className="px-3 py-4">
        <ResponsiveChart height={180} legend={legend}>
          {(narrow) => chart.kind === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="label" {...chartTickProps(narrow)} />
              <YAxis tick={{ fontSize: narrow ? 10 : 11 }} width={narrow ? 32 : 40} />
              <Tooltip />
              {chart.datasets.map((ds, i) => (
                <Bar key={ds.label} dataKey={ds.label} fill={ds.color ?? CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="label" {...chartTickProps(narrow)} />
              <YAxis tick={{ fontSize: narrow ? 10 : 11 }} width={narrow ? 32 : 40} />
              <Tooltip />
              {chart.datasets.map((ds, i) => (
                <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={ds.color ?? CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveChart>
      </div>
    </div>
  )
}
