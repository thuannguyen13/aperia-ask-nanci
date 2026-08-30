"use client"

import { useRef, useState } from "react"
import { X, Sparkles, Check, ChevronDown } from "lucide-react"
import {
  Button, Input, Label, Checkbox, RadioGroup, RadioGroupItem, Separator,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Popover, PopoverTrigger, PopoverContent,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelHeader, PanelBody } from "@/components/shared"
import {
  MC_PARAMETERS, MC_PARAM_LABEL, ASSIGNED_GROUPS, DATE_WINDOWS, ASSIGNMENT_TYPES,
  NANCI_REVIEW, type McParameter,
} from "@/lib/ask-nanci/data/risk-create-assignment"
import { NanciReviewPanel } from "./NanciReviewPanel"
import { useRiskNav } from "./RiskNavContext"

// Create Assignment (Figma frames 219 → 225): a full-panel form that replaces the
// assignment list. Selecting MC parameters expands a config card per parameter;
// "Review with Ask Nanci" opens the analysis column beside the form, and its
// "Modify the Threshold" chip writes back into the re-alert field.

const LABEL = "text-sm font-medium text-foreground"
const SECTION = "text-base font-semibold text-foreground"

// One "First Alert" / "Re-Alert" tier: an indicator field, plus a $ threshold when
// the parameter defines one.
function Tier({
  title, unit, threshold, indicator, thresholdValue, highlight, onIndicator, ref,
}: {
  title: string
  unit: string
  threshold?: string
  indicator: string
  thresholdValue?: string
  highlight?: boolean
  onIndicator: (v: string) => void
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div ref={ref} className="flex flex-col gap-2 rounded-lg bg-muted p-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <Label className="text-xs text-muted-foreground">Indicator</Label>
          <div className="relative mt-1">
            <Input
              value={indicator}
              onChange={(e) => onIndicator(e.target.value)}
              className={cn("pr-10", highlight && "border-primary bg-primary/5 ring-1 ring-primary")}
            />
            <span className="absolute inset-y-0 right-2 flex items-center gap-1 text-xs text-muted-foreground">
              {highlight && <Sparkles className="size-3 text-primary" />}
              {unit}
            </span>
          </div>
        </div>
        {threshold && (
          <div className="min-w-0 flex-1">
            <Label className="text-xs text-muted-foreground">Threshold</Label>
            <div className="relative mt-1">
              <Input defaultValue={thresholdValue} className="pr-8" />
              <span className="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground">{threshold}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// A selected parameter's config card — header + the two alert tiers.
function ParameterCard({
  param, reAlert, tightened, tunedRef, onReAlert, onRemove,
}: {
  param: McParameter
  reAlert: string
  tightened: boolean
  tunedRef?: React.Ref<HTMLDivElement>
  onReAlert: (v: string) => void
  onRemove: () => void
}) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border bg-card">
      <div className="flex items-start justify-between gap-2 border-b border-dashed px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{MC_PARAM_LABEL(param)}</p>
          <p className="truncate text-xs text-muted-foreground">{param.blurb}</p>
        </div>
        <button onClick={onRemove} className="shrink-0 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Tier
          title="First Alert" unit={param.unit} threshold={param.threshold}
          indicator={param.firstAlert} thresholdValue={param.firstThreshold}
          onIndicator={() => {}}
        />
        <Tier
          title="Re-Alert" unit={param.unit} threshold={param.threshold}
          indicator={reAlert} thresholdValue={param.reThreshold}
          highlight={tightened} onIndicator={onReAlert} ref={tunedRef}
        />
      </div>
    </div>
  )
}

// Approval Date / First Batch Date share one shape: two mutually-exclusive-ish
// checkboxes, each gating a window select.
function DateFilter({ title }: { title: string }) {
  const [newOnly, setNewOnly] = useState(false)
  const [established, setEstablished] = useState(false)
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl bg-muted p-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {([["New Merchants Only", newOnly, setNewOnly], ["Established Merchants", established, setEstablished]] as const).map(
        ([label, checked, set]) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox checked={checked} onCheckedChange={(v) => set(v === true)} />
              {label}
            </label>
            <Select disabled={!checked} defaultValue={DATE_WINDOWS[0]}>
              <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATE_WINDOWS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ),
      )}
    </div>
  )
}

export function CreateAssignment({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (name: string) => void }) {
  const [name, setName] = useState("")
  const [params, setParams] = useState<string[]>([])
  const [reAlerts, setReAlerts] = useState<Record<string, string>>({})
  const [groups, setGroups] = useState<string[]>([])
  const [review, setReview] = useState(false)
  const [tightened, setTightened] = useState(false)
  const { assistant } = useRiskNav()
  const tunedRef = useRef<HTMLDivElement>(null)

  const selected = MC_PARAMETERS.filter((p) => params.includes(p.id))
  const reAlertOf = (p: McParameter) => reAlerts[p.id] ?? p.reAlert
  const setReAlert = (id: string, v: string) => setReAlerts((r) => ({ ...r, [id]: v }))

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  // Nanci's "Modify the Threshold" chip writes her suggestion into the first
  // selected parameter's re-alert indicator — the same field the panel discusses.
  const applyTightening = () => {
    const target = selected[0]
    if (!target) return
    setReAlert(target.id, NANCI_REVIEW.tightenedTo)
    setTightened(true)
    // Scroll the edited field into view — the change is otherwise below the fold.
    requestAnimationFrame(() => tunedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }))
  }

  return (
    <div className="flex h-full min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PanelHeader
          size="page"
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><button onClick={onCancel}>Assignment Management</button></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Create Assignment</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
          title="Create Assignment"
          onClose={onCancel}
        />

        <PanelBody>
          {/* General Information */}
          <h2 className={SECTION}>General Information</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <Label className={LABEL}>Assignment Name</Label>
              <Input className="mt-1.5" placeholder="Enter" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className={LABEL}>Type</Label>
              <Select defaultValue={ASSIGNMENT_TYPES[0]}>
                <SelectTrigger className="mt-1.5 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignment Filters */}
          <h2 className={cn(SECTION, "mt-6")}>Assignment Filters</h2>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <DateFilter title="Approval Date" />
            <DateFilter title="First Batch Date" />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {["Exclude Merchants - Closed Status", "Pause Merchant Alert"].map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm text-foreground"><Checkbox /> {l}</label>
            ))}
          </div>

          {/* Assignment Parameters */}
          <h2 className={cn(SECTION, "mt-6")}>Assignment Parameters</h2>
          <RadioGroup defaultValue="any" className="mt-3 flex gap-6">
            {[["any", "Match Any Parameter"], ["every", "Match Every Parameter"]].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-sm text-foreground">
                <RadioGroupItem value={v} /> {l}
              </label>
            ))}
          </RadioGroup>

          <Label className={cn(LABEL, "mt-4 block")}>MC Parameters</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="mt-1.5 flex min-h-9 w-full items-center gap-1.5 rounded-md border bg-background px-2 py-1.5 text-left">
                {selected.length === 0 && <span className="px-1 text-sm text-muted-foreground">Select parameters</span>}
                {selected.map((p) => (
                  <span key={p.id} className="flex items-center gap-1 rounded border bg-card px-1.5 py-0.5 text-xs text-foreground">
                    {MC_PARAM_LABEL(p)}
                    <X className="size-3 text-muted-foreground" onClick={(e) => { e.stopPropagation(); setParams(toggle(params, p.id)) }} />
                  </span>
                ))}
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-1">
              {MC_PARAMETERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setParams(toggle(params, p.id))}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted"
                >
                  {MC_PARAM_LABEL(p)}
                  {params.includes(p.id) && <Check className="size-4" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {selected.length > 0 && (
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
              {selected.map((p) => (
                <ParameterCard
                  key={p.id}
                  param={p}
                  reAlert={reAlertOf(p)}
                  tightened={tightened && p.id === selected[0].id}
                  tunedRef={p.id === selected[0].id ? tunedRef : undefined}
                  onReAlert={(v) => setReAlert(p.id, v)}
                  onRemove={() => setParams(toggle(params, p.id))}
                />
              ))}
            </div>
          )}

          {/* Group Assignment */}
          <h2 className={cn(SECTION, "mt-6")}>Group Assignment</h2>
          <Label className={cn(LABEL, "mt-3 block")}>Assigned Groups</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="mt-1.5 flex min-h-9 w-full items-center gap-1.5 rounded-md border bg-background px-2 py-1.5 text-left">
                {groups.length === 0 && <span className="px-1 text-sm text-muted-foreground">Select groups to assign</span>}
                {groups.map((g) => (
                  <span key={g} className="flex items-center gap-1 rounded border bg-card px-1.5 py-0.5 text-xs text-foreground">
                    {g}
                    <X className="size-3 text-muted-foreground" onClick={(e) => { e.stopPropagation(); setGroups(toggle(groups, g)) }} />
                  </span>
                ))}
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-1">
              {ASSIGNED_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGroups(toggle(groups, g))}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted"
                >
                  {g}
                  {groups.includes(g) && <Check className="size-4" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </PanelBody>

        {/* Sticky footer */}
        <Separator />
        <div className={cn("flex shrink-0 items-center gap-2 px-4 py-3", assistant ? "justify-between" : "justify-end")}>
          {assistant && (
            <Button variant="outline" size="sm" className="text-primary" onClick={() => setReview(true)}>
              <Sparkles className="size-4" /> Review with Ask Nanci
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" onClick={() => onSubmit(name)}>Submit</Button>
          </div>
        </div>
      </div>

      {assistant && review && (
        <NanciReviewPanel
          name={name}
          tightened={tightened}
          onModify={applyTightening}
          onClose={() => setReview(false)}
        />
      )}
    </div>
  )
}
