"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis } from "recharts"
import { type ChartConfig } from "aperia-ds5"
import { ResponsiveChart, ChartGrid, ChartTip, chartAxisProps } from "@/components/shared/ResponsiveChart"
import type { ChartWidget } from "@/lib/ask-nanci/types"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

// Series are keyed by position, not by label: the key becomes a CSS variable name
// (`--color-s0`) and a label such as "Fees & Comps" cannot be one. The label still
// names the series in the tooltip and the legend through the config.
const seriesKey = (i: number) => `s${i}`

export function MessageChart({ chart }: { chart: ChartWidget }) {
  const data = chart.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(chart.datasets.map((ds, s) => [seriesKey(s), ds.data[i]])),
  }))

  const config: ChartConfig = Object.fromEntries(
    chart.datasets.map((ds, i) => [seriesKey(i), { label: ds.label, color: ds.color ?? CHART_COLORS[i % CHART_COLORS.length] }]),
  )

  return (
    <div className="mt-3 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{chart.title}</span>
      </div>
      <div className="px-3 py-4">
        {/* One series needs no key: the title already says what the bars are. */}
        <ResponsiveChart height={180} config={config} legend={chart.datasets.length > 1}>
          {(narrow) => chart.kind === "bar" ? (
            <BarChart data={data}>
              <ChartGrid />
              <XAxis dataKey="label" {...chartAxisProps(narrow)} />
              <YAxis {...chartAxisProps(narrow)} width={narrow ? 32 : 40} />
              <ChartTip />
              {chart.datasets.map((_, i) => (
                <Bar key={seriesKey(i)} dataKey={seriesKey(i)} fill={`var(--color-${seriesKey(i)})`} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <ChartGrid />
              <XAxis dataKey="label" {...chartAxisProps(narrow)} />
              <YAxis {...chartAxisProps(narrow)} width={narrow ? 32 : 40} />
              <ChartTip />
              {chart.datasets.map((_, i) => (
                <Line key={seriesKey(i)} type="monotone" dataKey={seriesKey(i)} stroke={`var(--color-${seriesKey(i)})`} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveChart>
      </div>
    </div>
  )
}
