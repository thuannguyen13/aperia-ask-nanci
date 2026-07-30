"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, FileText, FolderPlus, ChevronDown, Check, Loader, CircleCheckBig, TriangleAlert, List, ArrowUpDown, Filter, Download, Settings, Pencil, Trash2 } from "lucide-react"
import {
  Badge, Button, Label, Textarea, RadioGroup, RadioGroupItem,
  Popover, PopoverTrigger, PopoverContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Alert, AlertTitle, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarFallback,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelShell } from "@/components/ask-nanci/shared"
import { useRiskNav } from "./RiskNavContext"
import { findMerchant, getVwLevel, getMcLevel, getRiskLevel, formatMcScore, RISK_REPORT_DETAILS, getDefaultRiskDetail, TXN_VOLUME_ROWS, RISK_VIOLATION_CYCLE, VIOLATION_ROWS, CROSS_QUEUE_ROWS, MERCHANT_NOTES_SEED, DEFAULT_MERCHANT_NOTES, type ViolationRow, type NoteEntry, type RiskLevel } from "@/lib/ask-nanci/data/risk-merchants"
import { getRiskLevelStyles } from "./risk-level"

// Parameter Violation Details modal columns (Figma order + widths).
const VIOLATION_COLS: { key: keyof ViolationRow; label: string; blue?: boolean; w: string }[] = [
  { key: "pNum", label: "P#", blue: true, w: "min-w-[80px]" },
  { key: "wk", label: "WK", w: "min-w-[130px]" },
  { key: "alertOn", label: "Alert on", w: "min-w-[180px]" },
  { key: "assignment", label: "Assignment Name", w: "min-w-[300px]" },
  { key: "parameter", label: "Parameter Name", w: "min-w-[140px]" },
  { key: "reAlert", label: "Re-Alert", w: "min-w-[80px]" },
  { key: "paramIndicator", label: "Parameter Indicator", w: "min-w-[140px]" },
  { key: "actualIndicator", label: "Actual Indicator", w: "min-w-[130px]" },
  { key: "paramThreshold", label: "Parameter Threshold", w: "min-w-[150px]" },
  { key: "actualThreshold", label: "Actual Threshold", w: "min-w-[140px]" },
  { key: "disposition", label: "Disposition", w: "min-w-[110px]" },
  { key: "workedOn", label: "Worked On", w: "min-w-[110px]" },
  { key: "userName", label: "User Name", w: "min-w-[110px]" },
  { key: "fileType", label: "File Type", w: "min-w-[120px]" },
]

// "N Violations" pill → this modal. Table scrolls horizontally over all 14 columns.
function ViolationsPill({ count }: { count: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge asChild className="cursor-pointer bg-red-500 text-white hover:bg-red-600">
          <button type="button"><TriangleAlert /> {count} Violations</button>
        </Badge>
      </DialogTrigger>
      <DialogContent showCloseButton className="w-[92vw] gap-0 overflow-hidden p-0 sm:max-w-[1400px]">
        <DialogHeader className="px-6 pb-0 pt-6">
          <DialogTitle>Parameter Violation Details</DialogTitle>
          <DialogDescription className="sr-only">Parameter violations for this merchant.</DialogDescription>
        </DialogHeader>

        <div className="flex min-w-0 flex-col gap-4 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-base">
              <span className="font-semibold text-foreground">Alert by Risk Cycle</span>{" "}
              <span className="text-muted-foreground">({RISK_VIOLATION_CYCLE})</span>
            </p>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
          </div>

          <div className="min-w-0 overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  {VIOLATION_COLS.map((c) => (
                    <th key={c.key} className={cn("whitespace-nowrap px-3 py-2.5 font-medium", c.w)}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VIOLATION_ROWS.slice(0, count).map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {VIOLATION_COLS.map((c) => (
                      <td key={c.key} className={cn("whitespace-nowrap px-3 py-3", c.blue ? "font-medium text-blue-500" : "text-foreground")}>{r[c.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="m-0 border-t bg-muted/40 px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Card into thirds: label takes 1, value takes 2, value left-aligned at the ⅓ mark.
// `badgeClass` renders the value as a DS Badge with a color override (design has no
// matching variant — e.g. In Review is purple-100, not the gray `secondary` variant).
function Row({ label, value, badgeClass }: { label: string; value: string; badgeClass?: string }) {
  return (
    <div className="grid grid-cols-[1fr_2fr] items-center gap-2 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {badgeClass
        ? <Badge className={badgeClass}>{value}</Badge>
        : <span className="text-foreground">{value}</span>}
    </div>
  )
}

// `dark` is the Mastercard treatment (Figma 1029:28244): near-black card with two
// oversized ellipses bleeding past the edges. Exact hexes from the design — they
// are a fixed brand surface, not theme tokens, so they don't flip in dark mode.
function ScoreCard({ brand, logo, score, max, level, deltas, params, extra, dark }: {
  brand: string; logo?: React.ReactNode; score: string; max: number; level: RiskLevel; deltas: React.ReactNode; params: string; extra?: { label: string; value: string }[]; dark?: boolean
}) {
  const style = getRiskLevelStyles(level, dark)
  return (
    <div className={cn(
      "relative flex h-full flex-col overflow-hidden rounded-xl border",
      dark ? "border-transparent bg-[#20201f]" : "bg-card",
    )}>
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-[206px] -top-[213px] h-[342px] w-[486px] rounded-[50%] bg-black/25" />
          <div className="pointer-events-none absolute -left-[115px] top-[127px] h-[226px] w-[321px] rounded-[50%] bg-black/20" />
        </>
      )}
      <div className="relative p-4">
        <div className="flex items-center gap-2">
          {logo}
          <p className={cn("text-base font-semibold", dark ? "text-white" : "text-foreground")}>{brand}</p>
          {/* Colour follows the level, not the brand — this card is where a High
              VW score and a Low MC score on the same merchant have to read apart. */}
          <Badge variant="destructive" className={cn("border-transparent", style.badge)}>{level}</Badge>
        </div>
        <p className={cn("mt-2 text-3xl font-bold tabular-nums", style.score)}>
          {score}<span className={cn("text-lg font-medium", dark ? "text-[#a3a3a3]" : "text-muted-foreground")}> /{max}</span>
        </p>
        <p className={cn("mt-1 text-xs", dark ? "text-[#a3a3a3]" : "text-muted-foreground")}>{deltas}</p>
      </div>
      <div className={cn("relative flex-1 px-4 py-3", dark ? "bg-[#30302d]" : "border-t bg-muted/40")}>
        <div className="grid grid-cols-[1fr_2fr] items-center gap-2 py-1 text-sm">
          <span className={dark ? "text-[#a3a3a3]" : "text-muted-foreground"}>Driving Parameters</span>
          <span className={dark ? "text-blue-500" : "text-primary"}>{params}</span>
        </div>
        {extra?.map((e) => (
          <div key={e.label} className="grid grid-cols-[1fr_2fr] items-center gap-2 py-1 text-sm">
            <span className={dark ? "text-[#a3a3a3]" : "text-muted-foreground"}>{e.label}</span>
            <span className={dark ? "text-white" : "text-foreground"}>{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// "In N Queues" badge → this modal. Shows every queue the merchant currently alerts in.
function QueuesPill({ count }: { count: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge asChild className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600">
          <button type="button"><List /> In {count} Queues</button>
        </Badge>
      </DialogTrigger>
      <DialogContent showCloseButton className="w-[92vw] gap-0 overflow-hidden p-0 sm:max-w-[600px]">
        <DialogHeader className="px-6 pb-0 pt-6">
          <DialogTitle>Cross-Queue Presence</DialogTitle>
          <DialogDescription className="sr-only">
            This action updates all queues, removes the merchant from Ready-to-Work counts, and records the source queue in the audit trail.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-w-0 flex-col gap-4 px-6 py-4">
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <TriangleAlert className="text-amber-600 dark:text-amber-400" />
            <AlertTitle>Queue Assignment Alert</AlertTitle>
            <AlertDescription className="text-amber-800/70 dark:text-amber-200/70">This merchant alerts in {count} queues right now.</AlertDescription>
          </Alert>

          <p className="text-sm text-foreground">
            Marking Worked will mark this merchant as Worked in {count} queues simultaneously and remove it from Ready to Work counts everywhere:
          </p>

          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <tbody>
                {CROSS_QUEUE_ROWS.slice(0, count).map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {/* explicit blue: Dialog portals outside the risk theme, so text-primary would resolve wrong */}
                    <td className="p-2 text-blue-600">{r.name}</td>
                    <td className="w-[140px] p-2 text-foreground">{r.status}</td>
                    <td className="p-2 text-right text-foreground">{r.alertedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="m-0 border-t bg-muted/40 px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ACTIVITY_TABS = [
  { value: "transactions", label: "Transactions" },
  { value: "notes", label: "Notes and Case History" },
  { value: "batch", label: "Batch and Chargebacks" },
  { value: "ach", label: "ACH Returns" },
  { value: "related", label: "Related Merchants" },
]
const TXN_COLS = ["CB #", "CB % by #", "CB $", "CB % by $", "RDR #", "RDR $"]

// A section header ("Merchant Notes" / "Case History") with its right-aligned actions.
function NotesSectionHeader({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

// "Notes and Case History" tab: the merchant-notes feed (Add Notes appends here) + case history.
function NotesTab({ notes, onDelete }: { notes: NoteEntry[]; onDelete: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Merchant Notes */}
      <div>
        <NotesSectionHeader title="Merchant Notes">
          <Button variant="outline" size="sm"><Settings className="size-4" /> Default Setting</Button>
          <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
          <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
        </NotesSectionHeader>

        {notes.length ? (
          <div className="flex flex-col gap-4">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Avatar size="lg"><AvatarFallback>{n.initials}</AvatarFallback></Avatar>
                <div className="flex flex-1 items-start justify-between gap-2 rounded-lg border px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{n.author}</p>
                      <p className="text-sm text-muted-foreground">{n.timestamp}</p>
                      <Badge variant="secondary">{n.source}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{n.body}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="icon-sm"><Pencil className="size-3.5" /></Button>
                    <Button variant="destructive" size="icon-sm" onClick={() => onDelete(i)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">No data to display.</div>
        )}
      </div>

      {/* Case History */}
      <div>
        <NotesSectionHeader title="Case History">
          <Button variant="outline" size="sm"><Settings className="size-4" /> Default Setting</Button>
          <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
        </NotesSectionHeader>
        <div className="rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">No data to display.</div>
      </div>
    </div>
  )
}

// Row-major order → grid-cols-2 matches the Figma two-column layout.
const DISPOSITIONS = [
  "Cleared — No Action", "Hold Funds",
  "Escalated — Phase 2", "Termination Recommended",
  "Contact Merchant", "Other (Specify)",
]

// The three states of the split button. Hexes sampled from the design: WIP is
// yellow-600 (#ca8a02), Worked is green-600 (#16a34a); the default keeps `primary`.
// The spinner is a status glyph, not a loading affordance — it does not spin.
type WorkState = "none" | "wip" | "worked"
const WORK_STATES: Record<WorkState, { label: string; icon?: typeof Check; cls?: string }> = {
  none:   { label: "Mark Work" },
  wip:    { label: "WIP",    icon: Loader, cls: "bg-yellow-600 text-white hover:bg-yellow-600/90" },
  worked: { label: "Worked", icon: Check,  cls: "bg-green-600 text-white hover:bg-green-600/90" },
}

// "Mark Work and Disposition" — opens from the Mark Work dropdown. One radio group
// (Work in Progress + 6 dispositions are mutually exclusive) plus a note.
function MarkWorkPopover({ state, onSubmit }: { state: WorkState; onSubmit: (choice: string, note: string) => void }) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState("")
  const [note, setNote] = useState("")
  const { label, icon: Icon, cls } = WORK_STATES[state]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Figma "ButtonGroup" (split button) — ds5 has no ButtonGroup, so compose two
          Buttons + a divider: main action on the left, dropdown chevron on the right.
          Both halves carry the state color so the group reads as one control. */}
      <div className="inline-flex items-center">
        <Button size="sm" className={cn("rounded-r-none", cls)} onClick={() => setOpen(true)}>
          {Icon && <Icon className="size-3.5" />} {label}
        </Button>
        <PopoverTrigger asChild>
          <Button size="sm" aria-label="Mark work options" className={cn("rounded-l-none border-l border-white/25 px-2", cls)}>
            <ChevronDown className="size-3.5" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="end" className="w-[440px] p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Mark Work and Disposition</p>
        </div>

        <RadioGroup value={choice} onValueChange={setChoice} className="space-y-4 px-4 py-3">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Mark Work</Label>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Work in Progress" id="mw-wip" />
              <Label htmlFor="mw-wip" className="text-sm font-normal">Work in Progress</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Disposition</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {DISPOSITIONS.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <RadioGroupItem value={d} id={`mw-${d}`} />
                  <Label htmlFor={`mw-${d}`} className="text-sm font-normal">{d}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 7000))}
              placeholder="Enter note..."
              rows={note ? 5 : 1}
              className="resize-none"
            />
            {note && <p className="text-xs text-muted-foreground">{note.length.toLocaleString()}/7,000 characters</p>}
          </div>
        </RadioGroup>

        <div className="flex justify-end gap-2 px-4 pb-3">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" disabled={!choice} onClick={() => { onSubmit(choice, note); setOpen(false) }}>Submit</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function RiskReport() {
  const nav = useRiskNav()
  const m = findMerchant(nav.merchantId ?? "")
  const d = m ? (RISK_REPORT_DETAILS[m.id] ?? getDefaultRiskDetail(m)) : null
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState("")
  // The disposition is the single source of truth — "" means untouched, and
  // "Work in Progress" is the one choice that isn't a terminal disposition.
  const [disposition, setDisposition] = useState("")
  const workState: WorkState = !disposition ? "none" : disposition === "Work in Progress" ? "wip" : "worked"
  const [activeTab, setActiveTab] = useState("transactions")
  const [notes, setNotes] = useState<NoteEntry[]>(MERCHANT_NOTES_SEED[nav.merchantId ?? ""] ?? DEFAULT_MERCHANT_NOTES)

  // Add Notes → prepend to the merchant-notes feed and jump to the Notes tab.
  function addNote(body: string) {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    const h = now.getHours() % 12 || 12
    const timestamp = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(h)}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${now.getHours() < 12 ? "AM" : "PM"}`
    setNotes((prev) => [{ author: "Teresa Walker", initials: "TW", timestamp, source: "Aperia Risk", body }, ...prev])
    setActiveTab("notes")
  }

  if (!m || !d) return null

  return (
    <PanelShell className="min-w-0 flex-1">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={() => nav.go("detection-queue")} className="hover:text-foreground hover:underline">Detection Queue</button>
        <span>›</span>
        <button onClick={() => nav.go("barometer-report")} className="hover:text-foreground hover:underline">Barometer Report</button>
        <span>›</span>
        <span className="font-medium text-foreground">Risk Report</span>
      </div>

      {/* Mark-work payoff banner */}
      {disposition && (
        <div className={cn(
          "mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
          workState === "wip"
            ? "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300"
            : "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300",
        )}>
          {workState === "wip" ? <Loader className="size-4 shrink-0" /> : <CircleCheckBig className="size-4 shrink-0" />}
          {disposition === "Work in Progress"
            ? "Marked Work in Progress — saved to this merchant's case history."
            : `Disposition set to ${disposition} — the updated status will reflect on VisionWeb.`}
        </div>
      )}

      {/* Header */}
      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{m.name}</h1>
            <ViolationsPill count={d.violations} />
            <QueuesPill count={d.inQueues} />
          </div>
          <p className="mt-1 text-base font-medium tabular-nums text-primary">{m.mid}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          <Button variant="secondary" size="sm" onClick={() => setNoteOpen((o) => !o)}><FileText className="size-4" /> Add Notes</Button>
          <Button variant="secondary" size="sm"><FolderPlus className="size-4" /> Open New Case</Button>
          <MarkWorkPopover state={workState} onSubmit={(choice) => setDisposition(choice)} />
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
              <Button size="sm" disabled={!note.trim()} onClick={() => { addNote(note.trim()); setNote(""); setNoteOpen(false) }}>Submit</Button>
            </div>
          </div>
        )}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ScoreCard
          brand="VW Score" score={String(m.vw)} max={100} level={getVwLevel(m.vw)}
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.vwDelta30}</span> last 30 days</>}
          params={`${d.vwParams} parameters`}
          extra={[{ label: "Last Update", value: d.lastUpdate }]}
        />
        <ScoreCard
          brand="MC Score" logo={<Image src="/logos/mastercard-logomark.svg" alt="Mastercard" width={34} height={20} className="h-5 w-auto" />}
          score={formatMcScore(m.mc)} max={1000} level={getMcLevel(m.mc)} dark
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta7}</span> last 7 days · <span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta30}</span> last 30 days</>}
          params={`${d.mcParams} parameters`}
          extra={[
            { label: "Confidence", value: d.mcTxns },
            { label: "Score Peer Percentile", value: `MCC ${m.mcc} · ${d.mccPercentile}` },
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
          <Row label="Status" value={d.profile.status} badgeClass="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" />
          <Row label="Profile" value={d.profile.profile} />
          <Row label="Multi-Watch" value={d.profile.multiWatch} />
          <Row label="# Worked" value="0" />
          <Row label="# Parameter Worked" value="0" />
          <Row label="Worked in 30 Days" value="—" />
          <Row label="Classification" value={d.profile.classification} />
          <Row label="Multiplier" value="—" />
          <Row label="Risk Level" value={getRiskLevel(m)} />
          <Row label="Risk Score" value={String(m.vw)} />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Merchant Account Details</p>
          <Row label="First Batch Amount" value="—" />
          <Row label="First Batch Date" value="—" />
          <Row label="Last Batch" value={d.account.lastBatch} />
          <Row label="Last Statement" value={d.account.lastStatement} />
          <Row label="SIC/MCC" value={`${m.mcc} — ${m.mccDesc}`} />
          <Row label="Owner" value="—" />
          <Row label="Phone" value={d.account.phone} />
          <Row label="Address" value={d.account.address} />
          <Row label="URL" value="—" />
          <Row label="Adv. Deposit %" value="—" />
          <Row label="Reserve Indicator" value="—" />
          <Row label="Reserve Target" value="—" />
        </div>
      </div>

      {/* Merchant Activity */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Merchant Activity</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          {ACTIVITY_TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="transactions">
          {/* Transaction sub-tabs */}
          <div className="mt-3 inline-flex gap-1 rounded-lg bg-muted p-1 text-sm">
            <span className="rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm">Transaction Volume Analysis</span>
            <span className="rounded-md px-3 py-1 text-muted-foreground">Transaction History</span>
          </div>

          {/* Table heading + actions */}
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Transaction Volume Analysis</h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm"><Filter className="size-4" /> Filter</Button>
              <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1">Time <ArrowUpDown className="size-3 text-muted-foreground/60" /></span>
                  </th>
                  {TXN_COLS.map((c) => (
                    <th key={c} className="px-4 py-2.5 text-right font-medium">
                      <span className="inline-flex items-center justify-end gap-1">{c} <ArrowUpDown className="size-3 text-muted-foreground/60" /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TXN_VOLUME_ROWS.map((t) => {
                  const na = t === "Contract Expected"
                  return (
                    <tr key={t} className={cn("border-b", na && "bg-muted/40")}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{t}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "0"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "0.00%"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "$0.00"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "0.00%"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "0"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{na ? "N/A" : "$0.00"}</td>
                    </tr>
                  )
                })}
                {/* Total */}
                <tr className="border-t bg-muted/40 font-semibold text-foreground">
                  <td className="px-4 py-2.5">Total</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">0</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">N/A</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">$0.00</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">N/A</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">0</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <NotesTab notes={notes} onDelete={(i) => setNotes((prev) => prev.filter((_, idx) => idx !== i))} />
        </TabsContent>

        {["batch", "ach", "related"].map((v) => (
          <TabsContent key={v} value={v}>
            <div className="mt-4 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground">No data to display.</div>
          </TabsContent>
        ))}
      </Tabs>
      </div>
    </PanelShell>
  )
}
