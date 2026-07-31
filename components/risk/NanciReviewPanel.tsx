"use client"

import Image from "next/image"
import { CornerDownRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts"
import { PanelHeader } from "@/components/ask-nanci/shared"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { NANCI_REVIEW, NANCI_PROJECTION, EXAMPLE_ASSIGNMENT_NAME } from "@/lib/ask-nanci/data/risk-create-assignment"

// "Review with Nanci" (Figma frames 224/225) — Nanci's read on the draft assignment
// beside the form: bullets, a before/after alert-rate projection, and action chips.
// Rendered as a sibling column of the form rather than through the panel stack so the
// "Modify the Threshold" chip can write straight back into the form's state.

function Chip({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 self-start rounded-full border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <CornerDownRight className="size-4 text-muted-foreground" /> {label}
    </button>
  )
}

function Projection() {
  return (
    <div className="[&_*]:outline-none">
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={NANCI_PROJECTION} margin={{ top: 20, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} ticks={[0, 20, 40, 60, 80, 100]} width={36} />
          <ReferenceLine x="Jun" stroke="var(--border)" label={{ value: "Today", position: "top", fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Line dataKey="current" stroke="var(--muted-foreground)" strokeWidth={1.5} dot={false} />
          <Line dataKey="recommended" stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-[2px] bg-muted-foreground/60" /> Current Setup</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-[2px] bg-primary" /> Ask Nanci Recommended</span>
      </div>
    </div>
  )
}

export function NanciReviewPanel({
  name, tightened, onModify, onClose,
}: {
  name: string
  tightened: boolean
  onModify: () => void
  onClose: () => void
}) {
  return (
    <div className="hidden w-[386px] shrink-0 flex-col overflow-hidden border-l bg-background md:flex">
      <PanelHeader
        title={<Image data-logo="ask-nanci" src="/ask-nanci/ask-nanci-logo.svg" alt="Ask Nanci" width={113} height={24} />}
        size="lg"
        onClose={onClose}
      />

      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-3 text-sm text-foreground">
        <p>
          Based on your inputs and past data, here&apos;s what I&apos;m seeing for added assignment{" "}
          <strong>{name || EXAMPLE_ASSIGNMENT_NAME}</strong>:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          {NANCI_REVIEW.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>

        <p>{NANCI_REVIEW.suggestion}</p>
        <p>{NANCI_REVIEW.projectionLead}</p>

        <div className="grid grid-cols-2 gap-2">
          {[["Before adjustment:", NANCI_REVIEW.before], ["After adjustment:", NANCI_REVIEW.after]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted px-3 py-2">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <Projection />

        {tightened ? (
          <>
            <div className="flex justify-end">
              <span className="rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm text-primary-foreground">Modify the Threshold</span>
            </div>
            <p>{NANCI_REVIEW.confirmation}</p>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Chip label="Modify the Threshold" onClick={onModify} />
            <Chip label="Review the Configuration" />
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 pb-3">
        <ChatInput />
      </div>
    </div>
  )
}
