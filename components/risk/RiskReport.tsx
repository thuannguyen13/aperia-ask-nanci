"use client"

import { useState } from "react"
import { MoreHorizontal, FileText, FolderPlus, ChevronDown, Check, CircleCheckBig } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { useRiskNav } from "./RiskNavContext"
import { findMerchant, RISK_REPORT_DETAILS, DEFAULT_RISK_DETAIL, TXN_VOLUME_ROWS } from "@/lib/ask-nanci/data/risk-merchants"

function Row({ label, value, pill }: { label: string; value: string; pill?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {pill
        ? <span className={cn("rounded px-2 py-0.5 text-xs font-medium", pill)}>{value}</span>
        : <span className="font-medium text-foreground">{value}</span>}
    </div>
  )
}

function ScoreCard({ brand, score, max, level, deltas, params, extra }: {
  brand: string; score: number; max: number; level: string; deltas: React.ReactNode; params: string; extra?: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold text-foreground">{brand}</p>
        <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{level}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-rose-600 dark:text-rose-400">{score}<span className="text-lg font-medium text-muted-foreground"> /{max}</span></p>
      <p className="mt-1 text-xs text-muted-foreground">{deltas}</p>
      <div className="mt-3 border-t pt-3">
        <div className="flex items-center justify-between py-1 text-sm">
          <span className="text-muted-foreground">Driving Parameters</span>
          <span className="font-medium text-primary">{params}</span>
        </div>
        {extra?.map((e) => (
          <div key={e.label} className="flex items-center justify-between py-1 text-sm">
            <span className="text-muted-foreground">{e.label}</span>
            <span className="font-medium text-foreground">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ACTIVITY_TABS = ["Transactions", "Notes and Case History", "Batch and Chargebacks", "ACH Returns", "Related Merchants"]
const TXN_COLS = ["CB #", "CB % by #", "CB $", "CB % by $", "RDR #", "RDR $"]

export function RiskReport() {
  const nav = useRiskNav()
  const m = findMerchant(nav.merchantId ?? "")
  const d = RISK_REPORT_DETAILS[nav.merchantId ?? ""] ?? DEFAULT_RISK_DETAIL
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState("")
  const [worked, setWorked] = useState(false)

  if (!m) return null

  return (
    <PanelShell>
      <PanelHeader title={m.name} size="lg" onClose={() => nav.go("barometer-report")} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={() => nav.go("detection-queue")} className="hover:text-foreground hover:underline">Detection Queue</button>
        <span>›</span>
        <button onClick={() => nav.go("barometer-report")} className="hover:text-foreground hover:underline">Barometer Report</button>
        <span>›</span>
        <span className="font-medium text-foreground">Risk Report</span>
      </div>

      {/* Mark-work payoff banner */}
      {worked && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          <CircleCheckBig className="size-4 shrink-0" />
          Marked worked — the updated status will reflect on VisionWeb.
        </div>
      )}

      {/* Header */}
      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">⚠ {d.violations} Violations</span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">In {d.inQueues} Queues</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-primary">{d.mid}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          <Button variant="secondary" size="sm" onClick={() => setNoteOpen((o) => !o)}><FileText className="size-4" /> Add Notes</Button>
          <Button variant="secondary" size="sm"><FolderPlus className="size-4" /> Open New Case</Button>
          <Button size="sm" className="justify-between gap-1" onClick={() => setWorked(true)}>
            {worked ? <span className="flex items-center gap-1"><Check className="size-3.5" /> Worked</span> : "Mark Work"}
            <ChevronDown className="size-3.5" />
          </Button>
        </div>

        {/* Add Notes popover */}
        {noteOpen && (
          <div className="absolute right-0 top-11 z-20 w-96 rounded-xl border bg-card p-3 shadow-lg">
            <p className="mb-2 text-sm font-semibold text-foreground">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 7000))}
              placeholder="Enter note..."
              className="h-24 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{note.length}/7,000 characters</span>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setNote(""); setNoteOpen(false) }}>Cancel</Button>
              <Button size="sm" onClick={() => setNoteOpen(false)}>Submit</Button>
            </div>
          </div>
        )}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ScoreCard
          brand="VW Score" score={m.vw} max={100} level={m.risk}
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.vwDelta30}</span> last 30 days</>}
          params={`${d.vwParams} parameters`}
          extra={[{ label: "Last Update", value: d.lastUpdate }]}
        />
        <ScoreCard
          brand="MC Score" score={m.mc} max={1000} level={m.risk}
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta7}</span> last 7 days · <span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta30}</span> last 30 days</>}
          params={`${d.mcParams} parameters`}
          extra={[
            { label: "Confidence", value: d.mcTxns },
            { label: "Score Peer Percentile", value: d.mccPercentile },
            { label: "Last Sync", value: d.lastUpdate },
          ]}
        />
      </div>

      {/* Merchant Information */}
      <h2 className="mb-3 mt-6 text-base font-semibold text-foreground">Merchant Information</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Risk Profile Summary</p>
          <Row label="Watch" value="No" />
          <Row label="Status" value={d.profile.status} pill="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" />
          <Row label="Profile" value={d.profile.profile} />
          <Row label="Multi-Watch" value={d.profile.multiWatch} />
          <Row label="# Worked" value="0" />
          <Row label="# Parameter Worked" value="0" />
          <Row label="Worked in 30 Days" value="—" />
          <Row label="Classification" value={d.profile.classification} />
          <Row label="Risk Level" value={m.risk} />
          <Row label="Risk Score" value={String(m.vw)} />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Merchant Account Details</p>
          <Row label="First Batch Amount" value="—" />
          <Row label="First Batch Date" value="—" />
          <Row label="Last Batch" value={d.account.lastBatch} />
          <Row label="Last Statement" value={d.account.lastStatement} />
          <Row label="SIC/MCC" value={d.account.sicMcc} />
          <Row label="Owner" value="—" />
          <Row label="Phone" value={d.account.phone} />
          <Row label="Address" value={d.account.address} />
          <Row label="URL" value="—" />
          <Row label="Reserve Target" value="—" />
        </div>
      </div>

      {/* Merchant Activity */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Merchant Activity</h2>
      <div className="flex flex-wrap gap-4 border-b text-sm">
        {ACTIVITY_TABS.map((t, i) => (
          <span key={t} className={cn("pb-2", i === 0 ? "border-b-2 border-foreground font-medium text-foreground" : "text-muted-foreground")}>{t}</span>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Time</th>
              {TXN_COLS.map((c) => <th key={c} className="px-4 py-2.5 text-right font-medium">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {TXN_VOLUME_ROWS.map((t) => (
              <tr key={t} className="border-b last:border-0">
                <td className="px-4 py-2.5 font-medium text-foreground">{t}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "0"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "0.00%"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "$0.00"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "0.00%"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "0"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{t === "Contract Expected" ? "N/A" : "$0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </PanelShell>
  )
}
