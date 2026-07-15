"use client"

import { CheckCircle2, Clock, MapPin, Landmark, Store, ArrowRight } from "lucide-react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
  Button, Separator,
} from "aperia-ds5"
import type { SheetActionData } from "@/lib/ask-nanci/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SheetActionData
}

function Row({ label, value, muted, highlight, amber }: { label: string; value: string; muted?: boolean; highlight?: boolean; amber?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${muted ? "text-muted-foreground line-through" : amber ? "text-amber-600 dark:text-amber-400" : highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  )
}

// Flow-16-style value card (icon swatch + value + sublabel).
// `highlight` tints it blue (design system: blue = informational) to hint it's the new value.
function ValueCard({ value, sublabel, iconKind, highlight }: { value: string; sublabel: string; iconKind?: "address" | "bank" | "name"; highlight?: boolean }) {
  const Icon = iconKind === "bank" ? Landmark : iconKind === "name" ? Store : MapPin
  // US-style two-line address: street on line 1 (keeps trailing comma), city/state/zip on line 2.
  // Split on the first comma only; gated to addresses so "Company, LLC" name cards stay one line.
  const comma = value.indexOf(",")
  const lines = iconKind === "address" && comma !== -1
    ? [value.slice(0, comma + 1), value.slice(comma + 1).trim()]
    : [value]
  return (
    <div className={`flex flex-1 items-center gap-3 rounded-lg border px-4 py-3.5 ${highlight ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20" : ""}`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        {lines.map((line, i) => (
          <p key={i} className="text-base leading-snug text-foreground">{line}</p>
        ))}
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  )
}

export function ChangeAuditSheet({ open, onOpenChange, data }: Props) {
  const submitted = data.status === "submitted"
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton className={`flex flex-col ${submitted ? "w-[92vw] sm:w-[680px] sm:!max-w-[680px]" : "w-[400px] sm:w-[480px]"}`}>
        <SheetHeader>
          <SheetTitle>{submitted ? "Change Request Submitted" : "Change Confirmation"}</SheetTitle>
          {/* Kept sr-only on the submitted variant for a11y (Radix needs a description). */}
          <SheetDescription className={submitted ? "sr-only" : undefined}>
            {submitted ? "Record of this change request." : "Audit record for this account update."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6 py-4 flex-1">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-400">
                <Clock className="size-7 text-amber-950" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">Request Submitted</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submitted {data.timestamp}{data.reference ? ` · Reference ${data.reference}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-green-600" />
              <span className="text-sm font-medium text-green-800">Update Applied</span>
              <span className="ml-auto text-xs text-green-600">{data.timestamp}</span>
            </div>
          )}

          {submitted && (
            <div className="w-full space-y-2">
              <div className="flex items-center gap-3">
                <p className="flex-1 text-base font-medium text-foreground">Current</p>
                <span className="size-4 shrink-0" />
                <p className="flex-1 text-base font-medium text-foreground">New</p>
              </div>
              <div className="flex items-center gap-3">
                <ValueCard value={data.fromValue} sublabel={data.field} iconKind={data.iconKind} />
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <ValueCard value={data.toValue} sublabel={data.field} iconKind={data.iconKind} highlight />
              </div>
            </div>
          )}

          <Separator />

          <div className="flex flex-col">
            <Row label="Field" value={data.field} />
            <Separator />
            {!submitted && (
              <>
                <Row label="Previous Value" value={data.fromValue} muted />
                <Separator />
                <Row label="New Value" value={data.toValue} highlight />
                <Separator />
              </>
            )}
            {submitted && data.sentTo && (
              <>
                <Row label="Sent To" value={data.sentTo} />
                <Separator />
              </>
            )}
            <Row label={submitted ? "Submitted On" : "Changed At"} value={data.timestamp} />
            <Separator />
            <Row label={submitted ? "Submitted By" : "Changed By"} value="Ask Nanci" />
            <Separator />
            <Row label="Status" value={submitted ? "Pending review" : "Completed"} amber={submitted} />
          </div>
        </div>

        <SheetFooter className="px-6 pb-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
