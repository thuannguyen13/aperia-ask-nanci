"use client"

import { useState } from "react"
import { Search, SearchX } from "lucide-react"
import {
  Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  InputGroup, InputGroupAddon, InputGroupInput, ScrollArea,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MarketplaceDetailPanel, AddedBadge, VendorLogo } from "./MarketplaceDetailPanel"
import {
  MARKETPLACE_CATEGORY,
  MARKETPLACE_EMPTY,
  MARKETPLACE_INTRO,
  MARKETPLACE_SEARCH_PLACEHOLDER,
  MARKETPLACE_SERVICES,
  MARKETPLACE_TITLE,
  type MarketplaceService,
} from "@/lib/ask-nanci/data/panels/service-marketplace"

function ServiceCard({ service, enabled, selected, onClick }: { service: MarketplaceService; enabled: boolean; selected: boolean; onClick: () => void }) {
  const { icon: Icon, title, description } = service
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-h-[200px] flex-col gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:border-ring hover:bg-muted/40",
        selected && "border-primary ring-1 ring-primary",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className="size-8 shrink-0 text-foreground" strokeWidth={1.5} />
        {enabled && <AddedBadge />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Powered by</span>
        <VendorLogo />
      </div>
    </button>
  )
}

/**
 * Marketplace — a full content-area view (not a drawer): it replaces the chat column
 * while open and is toggled from the sidebar's Marketplace nav item.
 */
export function ServiceMarketplacePanel() {
  const { marketplaceOpen } = useAskNanci()
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Which add-ons are on. Seeded from the data's `added` flag, then owned here so the
  // grid badge and the detail panel's Enable button can never disagree.
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(MARKETPLACE_SERVICES.filter((s) => s.added).map((s) => s.id)),
  )
  const toggle = (id: string) => setEnabled((prev) => {
    const next = new Set(prev)
    if (!next.delete(id)) next.add(id)
    return next
  })
  const selected = MARKETPLACE_SERVICES.find((s) => s.id === selectedId) ?? null

  const q = query.trim().toLowerCase()
  const services = q
    ? MARKETPLACE_SERVICES.filter((s) => `${s.title} ${s.description}`.toLowerCase().includes(q))
    : MARKETPLACE_SERVICES

  return (
    <div className={cn("min-w-0 flex-1 gap-1", marketplaceOpen ? "flex" : "hidden")}>
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background md:rounded-2xl">
      {/* md:pt-12 is the empty 48px header bar of the design, where the view is left via
          the sidebar. Padding on the scroll area's root rather than a spacer element:
          the root does not scroll, so the gap holds still like a header would. On a
          phone the brand bar sits directly above and a blank 48px bar reads as a gap,
          so the content carries an ordinary 24px top inset instead, the same as the
          chat view's phone padding, and it scrolls away with the page.

          min-h-0: a flex child defaults to min-height auto and grows to its content, so
          without it the grid ran past the column and the clipped overflow had nothing
          to scroll. Fits on desktop, where three columns are short; a phone's single
          column is not. */}
      <ScrollArea className="min-h-0 flex-1 md:pt-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pt-6 pb-12 md:pt-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium text-foreground">{MARKETPLACE_TITLE}</h1>
            <p className="text-sm text-muted-foreground">{MARKETPLACE_INTRO}</p>
          </div>

          <InputGroup className="h-12 rounded-lg">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder={MARKETPLACE_SEARCH_PLACEHOLDER}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>

          <div className="flex flex-col gap-4">
            <p className="text-base font-medium text-foreground">{MARKETPLACE_CATEGORY}</p>
            {services.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchX />
                  </EmptyMedia>
                  <EmptyTitle>{MARKETPLACE_EMPTY.title}</EmptyTitle>
                  <EmptyDescription>{MARKETPLACE_EMPTY.description}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    enabled={enabled.has(service.id)}
                    selected={service.id === selectedId}
                    onClick={() => setSelectedId(service.id === selectedId ? null : service.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>

      {/* Detail opens as a sibling column, grid stays visible beside it. */}
      <div
        className={cn(
          "hidden h-full shrink-0 flex-col overflow-hidden rounded-xl border bg-background transition-[width,opacity] duration-200 ease-in-out md:flex md:rounded-2xl",
          selected ? "w-[420px] opacity-100" : "w-0 border-transparent opacity-0 pointer-events-none",
        )}
      >
        {selected && (
          <MarketplaceDetailPanel
            service={selected}
            enabled={enabled.has(selected.id)}
            onToggle={() => toggle(selected.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  )
}
