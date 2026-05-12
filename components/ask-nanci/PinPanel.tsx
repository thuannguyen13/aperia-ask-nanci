"use client"

import { X, GripVertical } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useAskNanci } from "@/contexts/AskNanciContext"
import type { PinnedWidget } from "@/lib/ask-nanci/types"

function PinnedChart({ widget }: { widget: PinnedWidget }) {
  const { unpinWidget } = useAskNanci()
  const { chart } = widget

  const data = chart.labels.map((label, i) => ({
    label,
    ...Object.fromEntries(chart.datasets.map((ds) => [ds.label, ds.data[i]])),
  }))

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <GripVertical className="size-3.5 cursor-grab text-muted-foreground/40" />
        <span className="flex-1 truncate text-xs font-semibold text-foreground">{chart.title}</span>
        <button
          onClick={() => unpinWidget(widget.id)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <div className="px-2 py-3">
        <ResponsiveContainer width="100%" height={140}>
          {chart.kind === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              {chart.datasets.map((ds) => (
                <Bar key={ds.label} dataKey={ds.label} fill={ds.color ?? "#2c5aa0"} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
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

export function PinPanel() {
  const { pinnedWidgets } = useAskNanci()
  if (!pinnedWidgets.length) return null

  return (
    <div className="flex h-full w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l p-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pinned</p>
      {pinnedWidgets.map((w) => (
        <PinnedChart key={w.id} widget={w} />
      ))}
    </div>
  )
}
