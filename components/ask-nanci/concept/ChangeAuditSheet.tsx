"use client"

import { Check, Clock, MapPin, Landmark, Store, Phone, ArrowRight } from "lucide-react"
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
function ValueCard({ value, sublabel, iconKind, highlight }: { value: string; sublabel: string; iconKind?: SheetActionData["iconKind"]; highlight?: boolean }) {
  const Icon = iconKind === "bank" ? Landmark : iconKind === "name" ? Store : iconKind === "phone" ? Phone : MapPin
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
  // Offer-request variant: no from→to change to show, "Field" reads as "File".
  const isRequest = !!data.requestLabel
  // The Current → New cards are the Merchant Money format. Any change with a from→to
  // earns them now, completed or submitted — only the request variant has none to show.
  const showChangeCards = !isRequest
  // Both statuses share one hero so they stay visually identical: same circle, same
  // title scale, same muted line. Only the icon, colour and wording differ.
  const hero = submitted
    ? {
        Icon: Clock, swatch: "bg-amber-400", ink: "text-amber-950",
        title: data.submittedTitle ?? "Request Submitted",
        sub: `Submitted ${data.timestamp}${data.reference ? ` · Reference ${data.reference}` : ""}`,
      }
    : {
        Icon: Check, swatch: "bg-green-400", ink: "text-green-950",
        title: "Update Applied",
        sub: `Applied ${data.timestamp}`,
      }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton className={`flex flex-col ${submitted || showChangeCards ? "w-[92vw] sm:w-[680px] sm:!max-w-[680px]" : "w-[400px] sm:w-[480px]"}`}>
        <SheetHeader>
          <SheetTitle>{isRequest ? (data.submittedTitle ?? "Request Submitted") : submitted ? "Change Request Submitted" : "Change Confirmation"}</SheetTitle>
          {/* sr-only, not removed: Radix needs a description, but the hero below already
              says what this is, so showing it twice is just noise. */}
          <SheetDescription className="sr-only">
            {submitted ? "Record of this change request." : "Audit record for this account update."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6 py-4 flex-1">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className={`flex size-14 items-center justify-center rounded-full ${hero.swatch}`}>
              <hero.Icon className={`size-7 ${hero.ink}`} />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{hero.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{hero.sub}</p>
            </div>
          </div>

          {showChangeCards && (
            // Below `sm` the sheet itself is 92vw (see the SheetContent width above), too
            // narrow for two value cards side by side without wrapping their text — so
            // this stacks at the same breakpoint the sheet's own width already switches on,
            // label above each card instead of a shared header row.
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-base font-medium text-foreground">Current</p>
                <ValueCard value={data.fromValue ?? ""} sublabel={data.field} iconKind={data.iconKind} />
              </div>
              <ArrowRight className="size-4 shrink-0 rotate-90 self-center text-muted-foreground sm:rotate-0" />
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-base font-medium text-foreground">New</p>
                <ValueCard value={data.toValue ?? ""} sublabel={data.field} iconKind={data.iconKind} highlight />
              </div>
            </div>
          )}

          <Separator />

          <div className="flex flex-col">
            <Row label={isRequest ? "File" : "Field"} value={isRequest ? data.requestLabel! : data.field} />
            <Separator />
            {/* The cards already carry from→to; these rows would just repeat them. */}
            {!submitted && !showChangeCards && (
              <>
                <Row label="Previous Value" value={data.fromValue ?? ""} muted />
                <Separator />
                <Row label="New Value" value={data.toValue ?? ""} highlight />
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
