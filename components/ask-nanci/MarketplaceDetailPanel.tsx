"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, ScrollArea,
} from "aperia-ds5"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import {
  MARKETPLACE_DETAIL_LABELS as L,
  MARKETPLACE_VENDOR,
  type MarketplaceService,
} from "@/lib/ask-nanci/data/panels/service-marketplace"

// Vendor mark with a text fallback, matching the OfferLogo pattern. Lives here so the
// grid and the detail panel share one mark (the grid imports it from this file).
export function VendorLogo({ className = "h-4 w-auto" }: { className?: string }) {
  const [errored, setErrored] = useState(false)
  if (errored) return <span className="text-sm font-medium text-foreground">{MARKETPLACE_VENDOR.name}</span>
  return (
    <img src={MARKETPLACE_VENDOR.logo} alt={MARKETPLACE_VENDOR.name} className={className} onError={() => setErrored(true)} />
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
  const { icon: Icon, title, description, overview, highlights, sections } = service

  return (
    <PanelShell>
      <PanelHeader title={title} size="lg" onClose={onClose} />

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border">
              <Icon className="size-5 text-foreground" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Meta + the one action. Enabling an add-on is reversible and low-stakes,
              so the button acts directly — no confirm step. */}
          <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{L.builtBy}</p>
              <div className="flex items-center gap-1.5">
                <VendorLogo className="h-5 w-auto" />
                <span className="truncate text-sm font-medium text-foreground">{MARKETPLACE_VENDOR.name}</span>
              </div>
            </div>
            {enabled ? (
              <Button variant="outline" size="sm" className="shrink-0" onClick={onToggle}>
                {L.remove}
              </Button>
            ) : (
              <Button size="sm" className="shrink-0" onClick={onToggle}>
                <Plus className="size-3.5" /> {L.enable}
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
export function AddedBadge() {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
    >
      <Check className="size-3" />
      {L.added}
    </Badge>
  )
}
