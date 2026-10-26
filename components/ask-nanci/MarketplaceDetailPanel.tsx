"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, ScrollArea,
} from "aperia-ds5"
import { PanelShell, PanelHeader } from "@/components/shared"
import {
  MARKETPLACE_DETAIL_LABELS as L,
  MARKETPLACE_VENDOR,
  type MarketplaceService,
  type MarketplaceVendor,
} from "@/lib/ask-nanci/data/panels/service-marketplace"

// Vendor mark with a text fallback, matching the OfferLogo pattern. Lives here so the
// grid and the detail panel share one mark (the grid imports it from this file).
export function VendorLogo({ vendor = MARKETPLACE_VENDOR, className = "h-4 w-auto" }: { vendor?: MarketplaceVendor; className?: string }) {
  const [errored, setErrored] = useState(false)
  if (errored || !vendor.logo) return <span className="text-sm font-medium text-foreground">{vendor.name}</span>
  return (
    <img src={vendor.logo} alt={vendor.name} width={34} height={20} className={className} onError={() => setErrored(true)} />
  )
}

// The listing's top mark: its own logo when it has one, else its icon in a box.
// Shared by the grid card and the detail panel, at their two sizes.
export function ServiceMark({ service, size }: { service: MarketplaceService; size: "card" | "detail" }) {
  const { icon: Icon, logo, title } = service
  const box = size === "card" ? "size-8" : "size-10"
  if (logo) return <img src={logo} alt={title} className={`${box} shrink-0 rounded-lg`} />
  if (size === "card") return <Icon className="size-8 shrink-0 text-foreground" strokeWidth={1.5} />
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border">
      <Icon className="size-5 text-foreground" strokeWidth={1.5} />
    </div>
  )
}

// Detail for one add-on, opened beside the marketplace grid. Layout follows the
// reference: identity block, a meta card carrying the Enable action, overview, then
// collapsed detail sections.
// ponytail: no product screenshots — we have no assets, so the reference's media
// carousel is a "What you get" list instead. Swap it back if art ever lands.
export function MarketplaceDetailPanel({
  service, enabled, onToggle, onClose,
}: {
  service: MarketplaceService
  enabled: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const { title, description, overview, highlights, sections, vendor = MARKETPLACE_VENDOR, enableLabel = L.enable, enabledLabel } = service

  return (
    <PanelShell>
      <PanelHeader title={title} size="lg" onClose={onClose} />

      {/* min-h-0: see the grid's ScrollArea in ServiceMarketplacePanel. */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-start gap-3">
            <ServiceMark service={service} size="detail" />
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Meta + the one action. Enabling an add-on is reversible and low-stakes,
              so the button acts directly — no confirm step. */}
          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{L.builtBy}</p>
              <div className="flex items-center gap-1.5">
                {vendor.logo && <VendorLogo vendor={vendor} className="h-5 w-auto" />}
                <span className="truncate text-sm font-medium text-foreground">{vendor.name}</span>
              </div>
            </div>
            {enabled ? (
              <div className="flex shrink-0 items-center gap-2">
                <AddedBadge label={enabledLabel} />
                <Button variant="outline" onClick={onToggle}>
                  {L.remove}
                </Button>
              </div>
            ) : (
              <Button className="shrink-0" onClick={onToggle}>
                <Plus className="size-3.5" /> {enableLabel}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-medium text-foreground">{L.overview}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{overview}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-medium text-foreground">{L.highlights}</p>
            <ul className="flex flex-col gap-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded bg-primary/10">
                    <Check className="size-2.5 text-primary" />
                  </span>
                  <span className="text-sm text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <Accordion type="multiple" className="rounded-xl border px-3">
            {sections.map((s) => (
              <AccordionItem key={s.title} value={s.title} className="last:border-b-0">
                <AccordionTrigger className="text-sm font-medium">{s.title}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{s.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </PanelShell>
  )
}

// The "Added"/enabled pill shown on a grid card — same shape as the detail's state.
export function AddedBadge({ label = L.added }: { label?: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
    >
      <Check className="size-3" />
      {label}
    </Badge>
  )
}
