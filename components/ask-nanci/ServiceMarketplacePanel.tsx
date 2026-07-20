"use client"

import { X } from "lucide-react"
import { Button, ScrollArea } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MARKETPLACE_INTRO, MARKETPLACE_SERVICES } from "@/lib/ask-nanci/data/panels/service-marketplace"

export function ServiceMarketplacePanel() {
  const { marketplaceOpen, setMarketplaceOpen } = useAskNanci()

  const panelContent = (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Service Marketplace</h2>
        <Button variant="ghost" size="icon-sm" onClick={() => setMarketplaceOpen(false)}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4 pt-0">
          <p className="text-sm text-muted-foreground">{MARKETPLACE_INTRO}</p>

          {MARKETPLACE_SERVICES.map(({ id, icon: Icon, title, description }) => (
            <div key={id} className="flex flex-col gap-2 rounded-lg border p-4">
              <Icon className="size-6 text-foreground" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  )

  return (
    <>
      {/* Mobile backdrop */}
      {marketplaceOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMarketplaceOpen(false)}
        />
      )}

      {/* Mobile: full-screen slide-in from right */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-200 ease-in-out md:hidden",
          marketplaceOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {panelContent}
      </div>

      {/* Desktop: inline side panel */}
      <div
        className={cn(
          "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background transition-[width,opacity] duration-500 ease-in-out md:flex",
          marketplaceOpen ? "w-[480px] opacity-100 mr-1" : "w-0 opacity-0 border-0 pointer-events-none",
        )}
      >
        {panelContent}
      </div>
    </>
  )
}
