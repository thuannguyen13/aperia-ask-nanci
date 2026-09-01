"use client"

import { useEffect } from "react"
import { Search, Store, ClipboardList } from "lucide-react"
import {
  Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut,
} from "aperia-ds5"
import { RISK_MERCHANTS, formatMerchantName } from "@/lib/ask-nanci/data/risk-merchants"
import { ASSIGNMENTS } from "@/lib/ask-nanci/data/risk-assignments"
import { useRiskNav } from "./RiskNavContext"

// A way into the records the console holds. Without it a merchant is only reachable
// through page one of the Barometer Report and an assignment only through Assignment
// Management, so knowing the name is not enough — you have to know which screen lists
// it. Both destinations already exist on RiskNavContext; this adds no navigation of
// its own, only a way to reach one by name.
//
// Records only, not screens: the rail already names all three and is on screen at the
// same time, so listing them here would be a second answer to a question nothing asks.
//
// The trigger sits at the top of the rail, above the destinations, so search reads as
// one of the ways around rather than as part of whichever page is open. It is drawn
// as a field rather than a menu row, because what it opens is a field. The console
// owns whether the dialog is open, since the rail is the console's.
//
// A live input here would still be the wrong control: it competes with the Barometer's
// own list filter, which is a different job (narrow 357 rows in place, not jump to
// one), and the results need a surface the 256px rail does not have.

/**
 * The rail's trigger. Reads as an input and behaves as a button: pressing it opens the
 * palette, which is where the typing actually happens. Collapsed, the rail is 48px, so
 * it drops to the icon alone rather than a field too narrow to read as one.
 */
export function RiskSearchField({ collapsed, onOpen }: { collapsed: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title="Search merchants and assignments"
      className={
        collapsed
          ? "flex h-8 w-full items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
          : "flex h-8 w-full items-center gap-2 rounded-md border bg-background px-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
      }
    >
      <Search className="size-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">Search</span>
          <kbd className="shrink-0 rounded border bg-muted/60 px-1 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
        </>
      )}
    </button>
  )
}

/** cmdk matches on this string, so a merchant is findable by MID as well as by name. */
const merchantValue = (name: string, mid: string) => `${formatMerchantName(name)} ${mid}`

export function RiskSearchDialog({ open, onOpenChange }: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const nav = useRiskNav()

  // Cmd-K / Ctrl-K, the shortcut the rail item advertises.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  const run = (go: () => void) => { onOpenChange(false); go() }

  return (
    <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Search"
        description="Find a merchant or an assignment."
        // Wider than ds5's dialog default: a result row carries a merchant name and
        // its 16-digit MID, which the default width truncates into uselessness.
        className="sm:max-w-[760px]"
      >
        {/* ds5's CommandDialog is the Dialog only — it does not wrap its children in
            Command, so the cmdk store has to be opened here or every item throws. */}
        <Command>
        <CommandInput placeholder="Search merchants, assignments…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>

          <CommandGroup heading="Merchants">
            {RISK_MERCHANTS.map((m) => (
              <CommandItem
                key={m.id}
                value={merchantValue(m.name, m.mid)}
                onSelect={() => run(() => nav.openMerchant(m.id))}
              >
                <Store className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{formatMerchantName(m.name)}</span>
                <CommandShortcut className="font-mono">{m.mid}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Assignments">
            {ASSIGNMENTS.map((a) => (
              <CommandItem
                key={a.id}
                value={a.name}
                onSelect={() => run(() => nav.openAssignment(a.id))}
              >
                <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{a.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>
        </Command>
    </CommandDialog>
  )
}
