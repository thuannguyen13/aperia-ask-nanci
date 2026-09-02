"use client"

import { Plus } from "lucide-react"
import {
  Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
} from "aperia-ds5"
import { ASSIGNMENTS } from "@/lib/ask-nanci/data/risk-assignments"
import {
  DASH_DATE_RANGES, DASH_SCOPE_ALL, DASH_ANALYSTS, DASH_MORE_FILTERS,
} from "@/lib/ask-nanci/data/risk-dashboard"

// The scope line under the dashboard title: what period, which assignments, whose
// work. ds5 Selects and a Button as they ship — the same controls the offer forms
// and the Barometer toolbar already use, so this row reads as the rest of the
// console rather than as a widget with its own shape.
//
// The choices live in Dashboard, not here: two charts read them through
// DashboardScope, so the row cannot be the one holding them.
//
// Period and scope reach the assignment-keyed views only — the alert-volume bars and
// the re-alert table. The scatter, the high-risk merchants and the parameter heat are
// not keyed by assignment or by day, so they show the same population whatever the
// row says. That is a gap in the data, not in the wiring.

function FilterSelect({ label, value, options, onChange }: {
  /** Prefix shown before the value, e.g. "Analyst". Omitted on the period control. */
  label?: string
  value: string
  options: string[]
  onChange: (next: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      {/* w-auto is the one override: SelectTrigger ships full width, which is right
          in a form column and wrong in a row of four. */}
      <SelectTrigger className="w-auto" aria-label={label ?? "Period"}>
        {/* SelectValue renders the raw choice; the label prefix belongs to the
            trigger, not to each item, or every option would repeat it. */}
        {label && <span className="text-muted-foreground">{label}:</span>}
        <SelectValue />
      </SelectTrigger>
      {/* ds5 defaults SelectContent to item-aligned, which centres the chosen option
          over the trigger — fine for a short list in a form field, but the assignment
          names are far wider than the trigger, so the panel slid off to one side.
          popper + start anchors it under the trigger's left edge like any menu. */}
      <SelectContent position="popper" align="start" className="max-h-72">
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function DashboardFilters({ range, scope, analyst, onRange, onScope, onAnalyst, showing }: {
  range: string
  scope: string
  analyst: string
  onRange: (v: string) => void
  onScope: (v: string) => void
  onAnalyst: (v: string) => void
  /** How many assignments the choices leave standing, or null when they leave all. */
  showing: number | null
}) {
  // Scope reads off the real assignment list, so the control and the console can
  // never name a queue the other does not have.
  const scopes = [DASH_SCOPE_ALL, ...ASSIGNMENTS.map((a) => a.name)]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect value={range} options={DASH_DATE_RANGES} onChange={onRange} />
      <FilterSelect label="Assignment scope" value={scope} options={scopes} onChange={onScope} />
      <FilterSelect label="Owner" value={analyst} options={DASH_ANALYSTS} onChange={onAnalyst} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Plus className="size-3.5" /> Add filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Filter by</DropdownMenuLabel>
          {DASH_MORE_FILTERS.map((f) => (
            <DropdownMenuItem key={f}>{f}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Says what the choices did, so a filter that empties a chart reads as a
          filter rather than as a chart that broke. */}
      {showing !== null && (
        <span className="text-sm text-muted-foreground">
          {showing} of {ASSIGNMENTS.length} assignments
        </span>
      )}
    </div>
  )
}
