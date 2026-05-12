"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Pin } from "lucide-react"
import type { ChartWidget } from "@/lib/ask-nanci/types"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { generateId } from "@/lib/ask-nanci/utils"

export function BotChart({ chart }: { chart: ChartWidget }) {
  const { pinWidget } = useAskNanci()

  const data = chart.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(chart.datasets.map((ds) => [ds.label, ds.data[i]])),
  }))

  return (
    <div className="mt-3 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{chart.title}</span>
        <button
          onClick={() => pinWidget({ id: generateId(), title: chart.title, chart })}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pin className="size-3.5" /> Pin
        </button>
      </div>
      <div className="px-3 py-4">
        <ResponsiveContainer width="100%" height={180}>
          {chart.kind === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              {chart.datasets.map((ds) => (
                <Bar key={ds.label} dataKey={ds.label} fill={ds.color ?? "#2c5aa0"} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              {chart.datasets.map((ds) => (
                <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={ds.color ?? "#2c5aa0"} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
