"use client"

import { useEffect, useRef, useState } from "react"
import { LayoutGrid, X } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { PanelId } from "@/lib/ask-nanci/types"
import { PANELS } from "./panel-registry"

// Below `md` the chat and the panel column cannot sit side by side, so panels move
// behind this switcher: a thumbnail overview (Sheet) that opens one panel at a time
// (Drawer). Two taps at most — trigger, then thumbnail — and one tap whenever there
// is only a single panel open, since an overview of one card is pure friction.
// Desktop is untouched: ConceptPanelArea still renders the real stack at `md:` and up.

// Thumbnails render the live panel scaled down, Safari-tab-manager style, rather than
// an icon standing in for it. The source box is a phone-width slice of the panel; the
// crop is deliberate — a thumbnail is a glance, not a readable copy.
const THUMB_SRC_WIDTH = 390
const THUMB_SRC_HEIGHT = 520
const THUMB_SCALE = 0.45

function PanelThumbnail({ id, onOpen, onClose }: { id: PanelId; onOpen: () => void; onClose: () => void }) {
  const { component: Panel, label } = PANELS[id]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <button
          onClick={onOpen}
          aria-label={`Open ${label}`}
          className="relative block h-[234px] w-full overflow-hidden rounded-xl border bg-background text-left shadow-sm transition-transform active:scale-[0.97]"
        >
          {/* The live panel, scaled. pointer-events-none so taps land on the button. */}
          <div
            className="pointer-events-none absolute left-0 top-0 origin-top-left"
            style={{
              width: THUMB_SRC_WIDTH,
              height: THUMB_SRC_HEIGHT,
              transform: `scale(${THUMB_SCALE})`,
            }}
            aria-hidden
          >
            <Panel />
          </div>
        </button>
        <button
          onClick={onClose}
          aria-label={`Close ${label}`}
          className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm"
        >
          <X className="size-3" />
        </button>
      </div>
      <span className="truncate px-0.5 text-xs font-medium text-foreground">{label}</span>
    </div>
  )
}

export function MobilePanelSwitcher() {
  const { dynamicPanels, closePanel } = useAskNanci()
  const isMobile = useIsMobile()
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [openId, setOpenId] = useState<PanelId | null>(null)
  const prevCount = useRef(dynamicPanels.length)

  // A turn that opens a panel should show it, not just park it behind the trigger —
  // the script says "I've opened the breakdown in the panel" and the panel has to be
  // there. Only growth counts, so closing one never yanks another into view.
  useEffect(() => {
    if (dynamicPanels.length > prevCount.current) {
      const newest = dynamicPanels[dynamicPanels.length - 1]
      setOpenId(newest)
      setOverviewOpen(false)
    }
    prevCount.current = dynamicPanels.length
  }, [dynamicPanels])

  // Derived, not synced: a panel closed from anywhere (its own X, a turn's
  // closePanel, closeAllPanels) leaves the drawer closed on the very next render,
  // with no effect to fall out of step with the stack.
  const activeId = openId && dynamicPanels.includes(openId) ? openId : null

  // Not `md:hidden`: Sheet and Drawer portal onto <body>, so CSS on this wrapper
  // would never reach them and a drawer opened on a phone would stay open when the
  // viewport grows. Skipping the render entirely is what actually keeps desktop clean.
  if (!isMobile || dynamicPanels.length === 0) return null

  const openPanel = PANELS[activeId ?? dynamicPanels[0]]
  const multiple = dynamicPanels.length > 1

  return (
    <>
      {/* Trigger — one tap straight to the panel when there is only one. */}
      <button
        onClick={() => (multiple ? setOverviewOpen(true) : setOpenId(dynamicPanels[0]))}
        aria-label={multiple ? `Show ${dynamicPanels.length} panels` : `Open ${openPanel.label}`}
        // Sits clear of the chat input rather than over it — the composer stays fully
        // tappable while a panel is parked behind the trigger.
        className="fixed bottom-40 right-4 z-30 flex h-10 max-w-[60%] items-center gap-1.5 truncate rounded-full border bg-background px-3.5 text-sm font-medium text-foreground shadow-lg active:scale-95"
      >
        <LayoutGrid className="size-4" />
        {multiple ? dynamicPanels.length : openPanel.label}
      </button>

      {/* Overview — the thumbnail container. */}
      <Sheet open={overviewOpen} onOpenChange={setOverviewOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetTitle className="px-4 pt-4 text-base">Panels</SheetTitle>
          <SheetDescription className="sr-only">
            Open panels. Select one to view it full screen.
          </SheetDescription>
          <div className="grid grid-cols-2 gap-3 p-4">
            {dynamicPanels.map((id) => (
              <PanelThumbnail
                key={id}
                id={id}
                onOpen={() => {
                  setOpenId(id)
                  setOverviewOpen(false)
                }}
                onClose={() => closePanel(id)}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* The opened panel. Near-full height so the panel gets the viewport. */}
      <Drawer open={activeId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DrawerContent className="h-[92vh] !max-h-[92vh]">
          <DrawerTitle className="sr-only">{openPanel.label}</DrawerTitle>
          <DrawerDescription className="sr-only">Panel detail</DrawerDescription>
          {multiple && (
            <button
              onClick={() => {
                setOpenId(null)
                setOverviewOpen(true)
              }}
              className="mx-auto mb-1 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <LayoutGrid className="size-3" />
              All panels
            </button>
          )}
          <div className="min-h-0 flex-1 overflow-hidden">
            {activeId && <openPanel.component />}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
