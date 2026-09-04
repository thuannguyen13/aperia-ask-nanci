"use client"

import { useState } from "react"
import Image from "next/image"
import { RefreshCw, SlidersHorizontal, Plus, ChevronDown, ChevronLeft, ChevronRight, SlidersVertical, Pencil, Copy, Trash2, Download, CircleCheck } from "lucide-react"
import { Badge, Button, TableBody, TableRow } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td } from "@/components/shared"
import { CreateAssignment } from "./CreateAssignment"
import { AM_INTEGRATION, AM_SUMMARY, ASSIGNMENTS, AM_TOTAL, type Assignment, type AssignmentStatus } from "@/lib/ask-nanci/data/risk-assignments"
import { alertsToday } from "@/lib/ask-nanci/data/risk-dashboard"
import { RISK_TODAY } from "@/lib/ask-nanci/data/risk-merchants"
import { EXAMPLE_ASSIGNMENT_NAME } from "@/lib/ask-nanci/data/risk-create-assignment"
import { useRiskNav } from "./RiskNavContext"

const TABS: ("All" | AssignmentStatus)[] = ["All", "Active", "Expired"]

// Colour only. ds5 ships no success variant, so a live status takes the Badge with
// an override — the same shape Row and the violations pill use. Connected reads as
// Active because it is the same state on a different noun.
const STATUS_PILL: Record<AssignmentStatus, string> = {
  Active:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}

export function AssignmentManagement() {
  // Set when the user arrived from a dashboard chart, so the row they clicked is
  // findable in a list of 13 rather than left to be hunted for.
  const focused = useRiskNav().assignmentId
  const [tab, setTab] = useState<"All" | AssignmentStatus>("All")
  // Create Assignment replaces the list in place (Figma 219–225); a submitted
  // assignment lands at the top of the list with a confirmation toast (frame 207).
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<Assignment | null>(null)
  const [toast, setToast] = useState(false)

  const all = created ? [created, ...ASSIGNMENTS] : ASSIGNMENTS
  const rows = tab === "All" ? all : all.filter((a) => a.status === tab)

  const submit = (name: string) => {
    const title = name.trim() || EXAMPLE_ASSIGNMENT_NAME
    // A queue you just made is yours, which is also what puts it inside the
    // dashboard's Analyst filter straight away.
    setCreated({ id: "created", name: title, short: title, owner: "Teresa Walker", type: "DQ", status: "Active", lastProcessed: RISK_TODAY, neverRun: true })
    setCreating(false)
    setToast(true)
  }

  if (creating) return <CreateAssignment onCancel={() => setCreating(false)} onSubmit={submit} />

  return (
    <PanelShell className="relative min-w-0 flex-1">
      <PanelHeader
        title="Assignment Management"
        size="page"
        actions={
          <>
            <Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>
            <Button variant="outline"><SlidersHorizontal className="size-4" /> Advanced Filter</Button>
            <Button className="gap-1" onClick={() => { setToast(false); setCreating(true) }}>
              <Plus className="size-4" /> Create Assignment <ChevronDown className="size-3.5" />
            </Button>
          </>
        }
      />

      {/* Post-submit confirmation (Figma frame 207) */}
      {toast && (
        <div className="absolute right-4 top-3 z-20 flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-md">
          <CircleCheck className="size-4 text-green-600" />
          <span className="text-sm font-medium text-foreground">Assignment created.</span>
          <button onClick={() => setToast(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
        </div>
      )}

      <PanelBody>
      {/* Integration card */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3">
        {/* The real mark, not an MC monogram: this row names the integration, and
            the same asset already tags the Mastercard queue on the Detection Queue.
            Mark and name pair at gap-2 inside the row's gap-3, so the name reads as
            the logo's label rather than as the next item along. */}
        <span className="flex shrink-0 items-center gap-2">
          <Image src="/iso/mastercard.svg" alt="Mastercard" width={28} height={28} className="size-7" />
          <span className="text-sm font-semibold text-foreground">{AM_INTEGRATION.name}</span>
        </span>
        <Badge className={STATUS_PILL.Active}>
          <CircleCheck /> {AM_INTEGRATION.status}
        </Badge>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Last score sync: <span className="font-medium text-foreground">{AM_INTEGRATION.lastSync}</span></span>
          <span>{AM_INTEGRATION.scored}</span>
          <Button variant="secondary"><SlidersVertical className="size-4" /> Configure Risk Score Band</Button>
        </div>
      </div>

      {/* Distinct Merchant Summary */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Distinct Merchant Summary</h2>
      {/* One card per row on a phone: the amounts run to $18,082,415.58, which
          clips at half of 390px. Same shape as the concept stat rows. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AM_SUMMARY.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">{s.label}</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-lg font-semibold tabular-nums text-foreground">{s.count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-lg font-semibold tabular-nums text-foreground">{s.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Summary tabs */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Assignment Summary</h2>
      <div className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors", tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Assignment List</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="secondary"><Download className="size-4" /> Export</Button>
          </div>
        </div>

        <PanelTable density="comfortable">
          <Thead>
            <Th sortable>Assignment name</Th>
            <Th sortable>Type</Th>
            <Th sortable>Alerted merchant count</Th>
            <Th sortable>Status</Th>
            <Th sortable>Last processed date</Th>
            <Th align="right">Actions</Th>
          </Thead>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id} className={cn(a.id === focused && "bg-primary/5")}>
                <Td>
                  <span className="font-medium text-primary">{a.name}</span>
                  {a.system && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">System</span>}
                </Td>
                <Td className="text-muted-foreground">{a.type}</Td>
                {/* Derived, not stored: the same number the dashboard's alert-volume
                    bar plots for this assignment. */}
                <Td mono>{a.neverRun ? "—" : alertsToday(a.id)}</Td>
                <Td><Badge className={STATUS_PILL[a.status]}>{a.status}</Badge></Td>
                <Td mono className="text-muted-foreground">{a.lastProcessed}</Td>
                <Td>
                  {/* ds5 Buttons. Delete keeps a colour override rather than the solid
                      destructive variant: three solid red rows down a table reads as an
                      error state, not as an action you may take. */}
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="outline" size="icon" aria-label={`Edit ${a.name}`}><Pencil /></Button>
                    <Button variant="outline" size="icon" aria-label={`Duplicate ${a.name}`}><Copy /></Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Delete ${a.name}`}
                      className="border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900 dark:bg-rose-950/30"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </PanelTable>

        {/* Pagination */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Showing {rows.length} of {AM_TOTAL}</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 hover:text-foreground"><ChevronLeft className="size-4" /> Previous</button>
            {/* One page: 13 rows against 25 per page. Three numbered pages implied
                three times the assignments the registry holds. */}
            <button className="size-7 rounded border bg-background text-foreground">1</button>
            <button className="flex items-center gap-1 hover:text-foreground">Next <ChevronRight className="size-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            Rows per page
            {/* Matches what the table actually renders: every row fits one page. */}
            <span className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-foreground">25 <ChevronDown className="size-3.5" /></span>
          </div>
        </div>
      </div>
      </PanelBody>
    </PanelShell>
  )
}
