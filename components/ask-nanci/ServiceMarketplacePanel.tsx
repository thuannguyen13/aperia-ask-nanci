"use client"

import { useState } from "react"
import { Check, Search, SearchX } from "lucide-react"
import {
  Badge, Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  InputGroup, InputGroupAddon, InputGroupInput, ScrollArea,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  MARKETPLACE_CATEGORY,
  MARKETPLACE_EMPTY,
  MARKETPLACE_INTRO,
  MARKETPLACE_SEARCH_PLACEHOLDER,
  MARKETPLACE_SERVICES,
  MARKETPLACE_TITLE,
  MARKETPLACE_VENDOR,
  type MarketplaceService,
} from "@/lib/ask-nanci/data/panels/service-marketplace"

// Vendor mark with a text fallback, matching the OfferLogo pattern.
function VendorLogo() {
  const [errored, setErrored] = useState(false)
  if (errored) return <span className="text-xs font-medium text-foreground">{MARKETPLACE_VENDOR.name}</span>
  return (
    <img
      src={MARKETPLACE_VENDOR.logo}
      alt={MARKETPLACE_VENDOR.name}
      className="h-4 w-auto"
      onError={() => setErrored(true)}
    />
  )
}

function ServiceCard({ icon: Icon, title, description, added }: MarketplaceService) {
  return (
    <div className="flex min-h-[200px] flex-col gap-3 rounded-lg border px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <Icon className="size-8 shrink-0 text-foreground" strokeWidth={1.5} />
        {added && (
          <Badge
            variant="outline"
            className="gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
          >
            <Check className="size-3" />
            Added
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Powered by</span>
        <VendorLogo />
      </div>
    </div>
  )
}

/**
 * Marketplace — a full content-area view (not a drawer): it replaces the chat column
 * while open and is toggled from the sidebar's Marketplace nav item.
 */
export function ServiceMarketplacePanel() {
  const { marketplaceOpen } = useAskNanci()
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const services = q
    ? MARKETPLACE_SERVICES.filter((s) => `${s.title} ${s.description}`.toLowerCase().includes(q))
    : MARKETPLACE_SERVICES

  return (
    <div
      className={cn(
        "min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background md:rounded-2xl",
        marketplaceOpen ? "flex" : "hidden",
      )}
    >
      {/* Empty 48px header bar, as in the design — the view is left via the sidebar. */}
      <div className="h-12 shrink-0" />

      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-12">
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
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
