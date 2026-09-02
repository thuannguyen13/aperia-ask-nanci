"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, FileText, FolderPlus, Loader, CircleCheckBig, TriangleAlert, List, Filter, Download, Settings, Pencil, Trash2 } from "lucide-react"
import {
  Badge, Button, Alert, AlertTitle, AlertDescription, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarFallback, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, TableBody, TableRow, Textarea,
} from "aperia-ds5"
import { ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogClose } from "@/components/shared"
import { cn } from "aperia-ds5/utils"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td, formatCurrency, formatPercent } from "@/components/shared"
import { MarkWorkPopover } from "./MarkWorkPopover"
import { useRiskNav } from "./RiskNavContext"
import { findMerchant, getVwLevel, getMcLevel, getRiskLevel, formatMcScore, formatMerchantName, formatTxnConfidence, RISK_REPORT_DETAILS, getDefaultRiskDetail, getMerchantProfile, getTxnVolume, VOLUME_PERIODS, netVolume, chargebackPct, type VolumePeriod, RECENT_AUTHS, AUTH_TOTAL, AUTH_SCORE_ALERT, RISK_VIOLATION_CYCLE, VIOLATION_ROWS, CROSS_QUEUE_ROWS, MERCHANT_NOTES_SEED, DEFAULT_MERCHANT_NOTES, statusForDisposition, type WorkStatus, type ViolationRow, type NoteEntry, type RiskLevel, type RiskReportDetail, type TxnVolumeRow } from "@/lib/ask-nanci/data/risk-merchants"
import { MC_PARAMETERS } from "@/lib/ask-nanci/data/risk-create-assignment"
import { VW_PARAMETERS } from "@/lib/ask-nanci/data/risk-parameters"
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
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Badge asChild className="cursor-pointer bg-red-500 text-white hover:bg-red-600">
          <button type="button"><TriangleAlert /> {count} Violations</button>
        </Badge>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent showCloseButton className="w-[92vw] gap-0 overflow-hidden p-0 sm:max-w-[1400px]">
        <ResponsiveDialogHeader className="px-6 pb-0 pt-6">
          <ResponsiveDialogTitle>Parameter Violation Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">Parameter violations for this merchant.</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex min-w-0 flex-col gap-4 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-base">
              <span className="font-semibold text-foreground">Alert by Risk Cycle</span>{" "}
              <span className="text-muted-foreground">({RISK_VIOLATION_CYCLE})</span>
            </p>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <PanelTable density="comfortable">
              <Thead>
                {VIOLATION_COLS.map((c) => (
                  <Th key={c.key} className={cn("whitespace-nowrap", c.w)}>{c.label}</Th>
                ))}
              </Thead>
              <TableBody>
                {VIOLATION_ROWS.slice(0, count).map((r, i) => (
                  <TableRow key={i}>
                    {VIOLATION_COLS.map((c) => (
                      // explicit blue: this Dialog portals outside the risk theme, so
                      // text-primary would resolve to the wrong brand color
                      <Td key={c.key} className={cn("whitespace-nowrap", c.blue && "font-medium text-blue-500")}>{r[c.key]}</Td>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </PanelTable>
          </div>
        </div>

        <ResponsiveDialogFooter className="m-0 border-t bg-muted/40 px-6 py-4">
          <ResponsiveDialogClose asChild>
            <Button variant="outline" size="sm">Close</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

/**
 * Today's take against the contracted daily net, as a percentage. Derived from the
 * two figures printed beside it so it can never contradict them.
 */
const salesRatio = (d: RiskReportDetail) =>
  d.merchant.contractDailyNet ? Math.round((d.merchant.todayNet / d.merchant.contractDailyNet) * 100) : 0

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
  brand: string; logo?: React.ReactNode; score: string; max: number; level: RiskLevel; deltas: React.ReactNode; params: React.ReactNode; extra?: { label: string; value: string }[]; dark?: boolean
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

/**
 * "N parameters" → this modal. Which measures actually drove the score, so the
 * count on the card is something you can open rather than a number to take on
 * trust. Picked deterministically from the merchant's MID so the list is stable
 * across renders and its length always matches the count beside it.
 */
function DrivingParameters({ mid, count, model }: { mid: string; count: number; model: "VW" | "MC" }) {
  // `pick` keeps the two catalogs' types apart: only the Mastercard rows carry
  // thresholds, and a union here loses that.
  const pick = <T,>(all: T[]) => {
    const offset = Number(mid.slice(-2)) % all.length
    return Array.from({ length: count }, (_, i) => all[(offset + i) % all.length])
  }
  const mcRows = model === "MC" ? pick(MC_PARAMETERS) : []
  const vwRows = model === "VW" ? pick(VW_PARAMETERS) : []

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <button type="button" className="text-left hover:underline">{count} parameters</button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent showCloseButton className="sm:max-w-[760px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{model === "MC" ? "Mastercard" : "VisionWeb"} driving parameters</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            The {count} {count === 1 ? "measure" : "measures"} behind this merchant&apos;s score.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <PanelTable density="comfortable">
          <Thead>
            <Th className="w-24">P#</Th>
            <Th>Parameter</Th>
            <Th>What fires it</Th>
            {model === "MC" && <Th align="right">Alert / re-alert</Th>}
          </Thead>
          <TableBody>
            {/* explicit blue on the P#: this Dialog portals outside the risk theme */}
            {vwRows.map((r, i) => (
              <TableRow key={`${r.id}-${i}`}>
                <Td className="font-medium text-blue-500">{r.id}</Td>
                <Td className="font-medium">{r.name}</Td>
                <Td className="text-muted-foreground">{r.blurb}</Td>
              </TableRow>
            ))}
            {mcRows.map((r, i) => {
              const suffix = r.unit === "%" ? "%" : ""
              return (
                <TableRow key={`${r.id}-${i}`}>
                  <Td className="font-medium text-blue-500">{r.id}</Td>
                  <Td className="font-medium">{r.name}</Td>
                  <Td className="text-muted-foreground">{r.blurb}</Td>
                  <Td mono align="right" className="whitespace-nowrap">
                    {r.firstAlert}{suffix} / {r.reAlert}{suffix}
                  </Td>
                </TableRow>
              )
            })}
          </TableBody>
        </PanelTable>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

// "In N Queues" badge → this modal. Shows every queue the merchant currently alerts in.
function QueuesPill({ count }: { count: number }) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Badge asChild className="cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600">
          <button type="button"><List /> In {count} Queues</button>
        </Badge>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent showCloseButton className="w-[92vw] gap-0 overflow-hidden p-0 sm:max-w-[600px]">
        <ResponsiveDialogHeader className="px-6 pb-0 pt-6">
          <ResponsiveDialogTitle>Cross-Queue Presence</ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">
            This action updates all queues, removes the merchant from Ready-to-Work counts, and records the source queue in the audit trail.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex min-w-0 flex-col gap-4 px-6 py-4">
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <TriangleAlert className="text-amber-600 dark:text-amber-400" />
            <AlertTitle>Queue Assignment Alert</AlertTitle>
            <AlertDescription className="text-amber-800/70 dark:text-amber-200/70">This merchant alerts in {count} queues right now.</AlertDescription>
          </Alert>

          <p className="text-sm text-foreground">
            Marking Worked will mark this merchant as Worked in {count} queues simultaneously and remove it from Ready to Work counts everywhere:
          </p>

          {/* Headerless on purpose — three self-evident columns inside a confirm
              dialog, where a header row would read as a second table to parse. */}
          <PanelTable density="comfortable">
            <TableBody>
              {CROSS_QUEUE_ROWS.slice(0, count).map((r, i) => (
                <TableRow key={i}>
                  {/* explicit blue: Dialog portals outside the risk theme, so text-primary would resolve wrong */}
                  <Td className="text-blue-600">{r.name}</Td>
                  <Td className="w-[140px]">{r.status}</Td>
                  <Td align="right">{r.alertedAt}</Td>
                </TableRow>
              ))}
            </TableBody>
          </PanelTable>
        </div>

        <ResponsiveDialogFooter className="m-0 border-t bg-muted/40 px-6 py-4">
          <ResponsiveDialogClose asChild>
            <Button variant="outline" size="sm">Close</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
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
/**
 * Down the side of the volume table. Net volume and the chargeback share are
 * derived from the measured figures above them, so a column cannot disagree with
 * itself.
 */
const VOLUME_MEASURES: { label: string; value: (p: VolumePeriod) => string }[] = [
  { label: "Gross Sales",  value: (p) => formatCurrency(p.grossSales) },
  { label: "Transactions", value: (p) => p.transactions.toLocaleString() },
  { label: "Returns",      value: (p) => formatCurrency(p.returns) },
  { label: "Net Volume",   value: (p) => formatCurrency(netVolume(p)) },
  { label: "Chargebacks",  value: (p) => formatCurrency(p.chargebacks) },
  { label: "% Sales",      value: (p) => formatPercent(chargebackPct(p), 2) },
]

/**
 * The Transactions sub-views. Volume by period is history — today against the 7 and
 * 30 day windows and the months behind them — so it lives under Transaction History
 * rather than under a label of its own.
 */
const TXN_VIEWS = ["Recent Authorizations", "Transaction Volume Analysis", "Transaction History"]

// One period's six cells, in TXN_COLS order. A null field means the period carries
// no figure for that column — the contract row states a ratio, not a volume.
const txnCells = (r: TxnVolumeRow) =>
  [
    r.cbCount?.toLocaleString(),
    r.cbPctByCount === null ? null : formatPercent(r.cbPctByCount, 2),
    r.cbAmount === null ? null : formatCurrency(r.cbAmount),
    r.cbPctByAmount === null ? null : formatPercent(r.cbPctByAmount, 2),
    r.rdrCount?.toLocaleString(),
    r.rdrAmount === null ? null : formatCurrency(r.rdrAmount),
  ].map((v) => v ?? "N/A")

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
export function RiskReport() {
  const nav = useRiskNav()
  const m = findMerchant(nav.merchantId ?? "")
  const d = m ? (RISK_REPORT_DETAILS[m.id] ?? getDefaultRiskDetail(m)) : null
  const [txnView, setTxnView] = useState(TXN_VIEWS[0])
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState("")
  // The disposition is the single source of truth — "" means untouched, and
  // "Work in Progress" is the one choice that isn't a terminal disposition.
  const [disposition, setDisposition] = useState("")
  const workState: WorkStatus = !disposition ? "mark-work" : statusForDisposition(disposition)
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

  // A closed account settles nothing. All three transaction views read demo data
  // that is not keyed to the account's own state, so without this the two bust-out
  // case studies print this month's figures under a Terminated status and a last
  // batch in 2025. Every branch below is gated, not just the two that showed it
  // first — that omission is exactly how Transaction History kept reporting.
  const closed = d.merchant.accountStatus === "Terminated"
  const noActivity = (
    <p className="py-10 text-center text-sm text-muted-foreground">
      No activity since {d.account.lastBatch}. This account is {d.merchant.accountStatus.toLowerCase()}.
    </p>
  )

  // Both cards below read off these rather than carrying figures of their own — the
  // profile follows the live work state, so marking Worked moves the counts with it.
  const p = getMerchantProfile(m, d, workState)
  const volume = getTxnVolume(m, d.txns30)

  return (
    <PanelShell className="min-w-0 flex-1">
      <PanelHeader
        size="page"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><button onClick={() => nav.go("detection-queue")}>Detection Queue</button></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><button onClick={() => nav.go("barometer-report")}>Barometer Report</button></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Risk Report</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        title={
          <span className="flex flex-wrap items-center gap-2">
            {formatMerchantName(m.name)}
            <ViolationsPill count={d.violations} />
            <QueuesPill count={d.inQueues} />
          </span>
        }
        subtitle={<span className="text-base font-medium tabular-nums text-primary">{m.mid}</span>}
        actions={
          <div className="relative flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon"><MoreHorizontal className="size-4" /></Button>
            <Button variant="outline" onClick={() => setNoteOpen((o) => !o)}><FileText className="size-4" /> Add Notes</Button>
            <Button variant="outline"><FolderPlus className="size-4" /> Open New Case</Button>
            {/* The disposition drives this screen; the same choice is published to
                the shared marks so the queue cards move with it. */}
            <MarkWorkPopover
              status={workState}
              size="default"
              onSubmit={(choice) => {
                setDisposition(choice)
                if (m) nav.markWork(m.id, statusForDisposition(choice))
              }}
            />

            {/* Add Notes popover */}
            {noteOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-96 rounded-xl border bg-card p-3 text-left shadow-lg">
                <p className="mb-2 text-sm font-semibold text-foreground">Note</p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 7000))}
                  placeholder="Enter note..."
                  className="h-24 resize-none"
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
        }
      />

      <PanelBody>
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

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ScoreCard
          brand="VW Score" score={String(m.vw)} max={100} level={getVwLevel(m.vw)}
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.vwDelta30}</span> last 30 days</>}
          params={<DrivingParameters mid={m.mid} count={d.vwParams} model="VW" />}
          extra={[{ label: "Last Update", value: d.lastUpdate }]}
        />
        <ScoreCard
          brand="MC Score" logo={<Image src="/logos/mastercard-logomark.svg" alt="Mastercard" width={34} height={20} className="h-5 w-auto" />}
          score={formatMcScore(m.mc)} max={1000} level={getMcLevel(m.mc)} dark
          deltas={<><span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta7}</span> last 7 days · <span className="font-medium text-rose-600 dark:text-rose-400">{d.mcDelta30}</span> last 30 days</>}
          params={<DrivingParameters mid={m.mid} count={d.mcParams} model="MC" />}
          extra={[
            { label: "Confidence", value: formatTxnConfidence(d.txns30) },
            { label: "Score Peer Percentile", value: `MCC ${m.mcc} · ${d.mccPercentile}` },
            { label: "Last Sync", value: d.lastUpdate },
          ]}
        />
      </div>

      {/* Merchant Information — who the account is, and its risk profile. The old
          Merchant Account Details card is gone: five of its seven rows were a literal
          "—", and the two that carried a value (last batch, last statement) sit on
          Account, which is where the rest of the account already was. */}
      <h2 className="mb-3 mt-6 text-base font-semibold text-foreground">Merchant Information</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Account</p>
          <Row label="DBA" value={d.merchant.dba} />
          <Row label="MID" value={m.mid} />
          <Row label="MCC" value={`${m.mcc} (${m.mccDesc})`} />
          <Row label="Business Age" value={d.merchant.businessAge} />
          <Row label="Watch Status" value={d.merchant.watchStatus} />
          <Row label="ISO / Agent" value={d.merchant.iso} />
          <Row label="Approved" value={d.merchant.approved} />
          <Row label="Contractual Daily Net" value={formatCurrency(d.merchant.contractDailyNet)} />
          {/* Over contract is the shape a bust-out makes, so it is the one value here
              that carries colour — through Row's own badge slot. */}
          <Row
            label="Today's Sales Ratio"
            value={salesRatio(d) > 100 ? `${salesRatio(d)}% — over contract` : `${salesRatio(d)}%`}
            badgeClass={salesRatio(d) > 100 ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : undefined}
          />
          <Row
            label="Status"
            value={d.merchant.accountStatus}
            badgeClass={d.merchant.accountStatus === "Active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              : "bg-muted text-muted-foreground"}
          />
          {/* Who the merchant is, rather than how the account has behaved — so these
              sit here and not in the details card, which is now batches and terms. */}
          <Row label="Owner" value={p.owner} />
          <Row label="Phone" value={d.account.phone} />
          <Row label="Address" value={d.account.address} />
          <Row label="URL" value={p.url} />
          <Row label="Last Batch" value={d.account.lastBatch} />
          <Row label="Last Statement" value={d.account.lastStatement} />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Risk Profile Summary</p>
          <Row label="Watch" value={p.watch} />
          <Row label="Status" value={d.profile.status} badgeClass="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" />
          <Row label="Profile" value={d.profile.profile} />
          <Row label="Multi-Watch" value={d.profile.multiWatch} />
          <Row label="# Worked" value={String(p.workedTotal)} />
          <Row label="# Parameter Worked" value={String(p.paramsWorked)} />
          <Row label="Worked in 30 Days" value={p.workedIn30} />
          <Row label="Classification" value={d.profile.classification} />
          <Row label="Multiplier" value={p.multiplier} />
          <Row label="Risk Level" value={getRiskLevel(m)} />
          <Row label="Risk Score" value={String(m.vw)} />
        </div>
      </div>

      {/* Merchant Activity */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Merchant Activity</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Five tabs run to 719px, so on a phone the strip scrolls rather than
            losing the last three off the edge. Same answer PanelTable gives a wide
            table; the audit's TabsList-to-Select swap is the larger change this
            defers to, not a different verdict. */}
        {/* border-b is ours, not ds5's: the line variant ships the active tab's own
            indicator and no rule for the strip to sit on, so the row floated. It goes
            on the scroller, which stays put while the tabs move under it.
            The strip takes its height from the tabs rather than ds5's fixed h-8, and
            the active indicator sits on the strip's own bottom edge rather than the
            5px below it ds5 ships. That is what closes the gap: the rule and the
            indicator are the same line, and the row is only as tall as a tab. */}
        <div className="-mx-1 overflow-x-auto border-b px-1">
          <TabsList
            variant="line"
            // h-auto! and p-0!: ds5 pins the strip to h-8 through a group-data variant,
            // which outranks a plain utility.
            className="h-auto! w-max min-w-full p-0! [&_[data-slot=tabs-trigger]]:h-auto [&_[data-slot=tabs-trigger]]:py-1.5 [&_[data-slot=tabs-trigger]]:after:-bottom-px"
          >
            {ACTIVITY_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="transactions">
          {/* Transaction sub-tabs. Both views are real now — the placeholder label
              is gone, because the table it was standing in for is the one behind it. */}
          <div className="mt-3 inline-flex gap-1 rounded-lg bg-muted p-1 text-sm">
            {TXN_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setTxnView(v)}
                className={cn(
                  "rounded-md px-3 py-1 transition-colors",
                  txnView === v ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {txnView === "Transaction Volume Analysis" ? (
          <>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">Transaction Volume Analysis</h3>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
          </div>
          <div className="mt-3">
            {closed ? noActivity : (
            <PanelTable density="comfortable">
              <Thead>
                <Th>{""}</Th>
                {VOLUME_PERIODS.map((p) => (
                  <Th key={p.label} align="right">{p.label}</Th>
                ))}
              </Thead>
              <TableBody>
                {VOLUME_MEASURES.map((measure) => (
                  <TableRow key={measure.label}>
                    <Td className="font-medium">{measure.label}</Td>
                    {VOLUME_PERIODS.map((p) => (
                      <Td key={p.label} mono align="right">{measure.value(p)}</Td>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </PanelTable>
            )}
          </div>
          </>
          ) : txnView === "Transaction History" ? (
          <>
          {/* Table heading + actions */}
          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Transaction History</h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm"><Filter className="size-4" /> Filter</Button>
              <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
            </div>
          </div>

          <div className="mt-3">
            {closed ? noActivity : (
            <PanelTable density="comfortable">
              <Thead>
                <Th sortable>Time</Th>
                {TXN_COLS.map((c) => (
                  <Th key={c} sortable align="right">{c}</Th>
                ))}
              </Thead>
              <TableBody>
                {volume.rows.map((r) => (
                  <TableRow key={r.period} className={cn(r.muted && "bg-muted/40")}>
                    <Td className="font-medium">{r.period}</Td>
                    {txnCells(r).map((v, i) => (
                      <Td key={i} mono align="right" className="text-muted-foreground">{v}</Td>
                    ))}
                  </TableRow>
                ))}
                {/* Total */}
                <TableRow className="bg-muted/40 font-semibold text-foreground">
                  <Td>Total</Td>
                  {txnCells(volume.total).map((v, i) => (
                    <Td key={i} mono align="right">{v}</Td>
                  ))}
                </TableRow>
              </TableBody>
            </PanelTable>
            )}
          </div>
          </>
          ) : (
          <>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">Recent Authorizations</h3>
            <p className="text-sm text-muted-foreground">Last {RECENT_AUTHS.length} with MC scoring</p>
          </div>
          <Button variant="outline" size="sm">View all {AUTH_TOTAL}</Button>
        </div>

        <div className="mt-3">
          {closed ? noActivity : (
          <PanelTable density="comfortable">
            <Thead>
              <Th sortable>Date / Time</Th>
              <Th>Card</Th>
              <Th sortable align="right">Amount</Th>
              <Th>Type</Th>
              <Th>Result</Th>
              <Th sortable>MC Score</Th>
              <Th>MC Reason</Th>
            </Thead>
            <TableBody>
              {RECENT_AUTHS.map((a) => {
                const alert = a.mcScore >= AUTH_SCORE_ALERT
                return (
                  <TableRow key={a.at}>
                    <Td mono>{a.at}</Td>
                    <Td mono className="text-muted-foreground">···· {a.card}</Td>
                    <Td mono align="right">{formatCurrency(a.amount)}</Td>
                    <Td>{a.type}</Td>
                    <Td>{a.result}</Td>
                    <Td>
                      {/* Every score is a badge, so the column reads as one scale;
                          the ones at or above the threshold take the destructive
                          treatment and the rest sit quiet. */}
                      <Badge
                        variant={alert ? "destructive" : "secondary"}
                        className="tabular-nums"
                      >
                        {a.mcScore}
                      </Badge>
                    </Td>
                    <Td>
                      {a.mcReason
                        // Amber rather than the grey secondary: the reason is why the
                        // row is worth reading, and ds5 has no warning variant — the
                        // same colour override Row and the violations pill already use.
                        ? <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">{a.mcReason}</Badge>
                        : <span className="text-muted-foreground">—</span>}
                    </Td>
                  </TableRow>
                )
              })}
            </TableBody>
          </PanelTable>
          )}
        </div>
          </>
          )}
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
      </PanelBody>
    </PanelShell>
  )
}
