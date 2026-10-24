"use client"

import { useState } from "react"
import { ArrowRight, Check, Plus } from "lucide-react"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, ScrollArea,
} from "aperia-ds5"
import { PanelShell, PanelHeader, Callout } from "@/components/shared"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW_SLUGS } from "@/lib/ask-nanci/data/flows.concept"
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
  const { icon: Icon, title, description, overview, highlights, sections, vendor = MARKETPLACE_VENDOR, enableLabel = L.enable, connected } = service

  return (
    <PanelShell>
      <PanelHeader title={title} size="lg" onClose={onClose} />

      {/* min-h-0: see the grid's ScrollArea in ServiceMarketplacePanel. */}
      <ScrollArea className="min-h-0 flex-1">
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
                {vendor.logo && <VendorLogo vendor={vendor} className="h-5 w-auto" />}
                <span className="truncate text-sm font-medium text-foreground">{vendor.name}</span>
              </div>
            </div>
            {enabled ? (
              <Button variant="outline" className="shrink-0" onClick={onToggle}>
                {L.remove}
              </Button>
            ) : (
              <Button className="shrink-0" onClick={onToggle}>
                <Plus className="size-3.5" /> {enableLabel}
              </Button>
            )}
          </div>

          {enabled && <ConnectedCallout connected={connected} />}

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

// What changed once an integration is on, with links that leave the marketplace and
// start each flow, the same as its catalog card's Try it.
function ConnectedCallout({ connected }: { connected: MarketplaceService["connected"] }) {
  const { setMarketplaceOpen, handlePrompt } = useAskNanci()
  if (!connected) return null
  const tryFlow = (prompt: string) => {
    setMarketplaceOpen(false)
    handlePrompt(prompt)
  }
  return (
    <Callout variant="green">
      <p className="font-semibold">{connected.message}</p>
      <div className="mt-2 flex flex-col items-start gap-1.5">
        {connected.flowSlugs.map((slug) => CONCEPT_FLOW_SLUGS[slug]).filter(Boolean).map((prompt) => (
          <button key={prompt} onClick={() => tryFlow(prompt)} className="flex items-center gap-1.5 font-medium underline-offset-2 hover:underline">
            <ArrowRight className="size-3.5" /> {prompt}
          </button>
        ))}
      </div>
    </Callout>
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
