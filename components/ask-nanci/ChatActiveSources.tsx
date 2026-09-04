"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import {
  Popover, PopoverTrigger, PopoverContent,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "aperia-ds5"
import { SourceIcon, getSourceInitials } from "./SourceIcon"
import { ConnectWizard } from "./ConnectWizard"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { readSources } from "@/lib/ask-nanci/source-store"
import type { Source } from "@/lib/ask-nanci/types"

interface Props {
  sources: Source[]
}

/**
 * Two actions that read as one control: the plus links a new account, the avatar
 * stack opens the list of what is already linked. They share a single pill so the
 * pair still looks like one chip in the input row, but each is its own button with
 * its own tooltip — adding and reviewing are different intents, and routing both
 * through one popover meant the plus icon promised something it did not do.
 */
export function ChatActiveSources({ sources }: Props) {
  const { setSources } = useAskNanci()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [tipOpen, setTipOpen] = useState(false)

  // Shared by both halves so the two hover identically. bg-secondary/80 and the
  // muted-to-foreground icon shift are the same treatment the Common Questions and
  // Recent Chats buttons beside them use — one hover language across the input row.
  // h-8: every control in the composer row is 32px, the size of the send button.
  const half = "flex h-8 items-center text-muted-foreground transition-colors bg-secondary hover:bg-secondary/80 hover:text-foreground"

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-center overflow-hidden rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Link Account"
              onClick={() => setWizardOpen(true)}
              className={`${half} ${sources.length ? "pl-2 pr-1.5" : "px-2"}`}
            >
              <Plus className="size-3.5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Link Account</TooltipContent>
        </Tooltip>

        {/* No linked sources means nothing to review — the stack would be an empty
            button, so only the plus shows until there is something to look at. */}
        {sources.length > 0 && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            {/* PopoverTrigger keeps Radix's own open/close (a manual toggle fights its
                dismiss handler — the outside click closes it, then the click reopens it).
                The tooltip is driven from explicit hover state instead of its own
                trigger: stacking two asChild triggers loses one behaviour whichever way
                they nest, and pointerenter does not bubble, so no wrapper element fixes
                it either. */}
            <Tooltip open={tipOpen}>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="View Linked Source"
                    onMouseEnter={() => setTipOpen(true)}
                    onMouseLeave={() => setTipOpen(false)}
                    onFocus={() => setTipOpen(true)}
                    onBlur={() => setTipOpen(false)}
                    className={`${half} pl-0.5 pr-2`}
                  >
                    <div className="flex items-center">
                      {sources.slice(0, 3).map((s, i) => (
                        <div
                          key={s.id}
                          className={`flex size-5 items-center justify-center overflow-hidden rounded-full ring-2 ring-secondary shrink-0 ${s.logo ? "border bg-white" : s.kind === "bank" && s.color ? `${s.color} text-white` : "bg-primary text-primary-foreground"}`}
                          style={{ marginLeft: i > 0 ? "-8px" : 0 }}
                        >
                          {s.logo
                            ? <Image src={s.logo} alt={s.institution ?? s.name} width={16} height={16} className="object-contain p-0.5" />
                            : <span className="text-[9px] font-semibold">{getSourceInitials(s)}</span>
                          }
                        </div>
                      ))}
                      {sources.length > 3 && (
                        <div className="flex size-5 items-center justify-center rounded-full bg-background border border-border ring-2 ring-secondary shrink-0" style={{ marginLeft: "-8px" }}>
                          <span className="text-[9px] font-medium text-foreground">+{sources.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">View Linked Source</TooltipContent>
            </Tooltip>

            {/* Review only. Adding lives on the plus beside it, so this no longer
                carries an "Add New Source" row that duplicated it. */}
            <PopoverContent side="top" align="start" className="w-[320px] p-0 gap-0 overflow-hidden flex flex-col max-h-[360px]">
              <p className="px-3 pt-3 pb-2 text-sm font-medium text-foreground shrink-0">Sources Used</p>
              <div className="overflow-y-auto flex-1 min-h-0 pb-1">
                {sources.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2">
                    <div className="flex size-8 items-center justify-center overflow-hidden rounded-md border border-border bg-white shrink-0">
                      {s.logo
                        ? <Image src={s.logo} alt={s.institution ?? s.name} width={20} height={20} className="object-contain p-0.5" />
                        : <SourceIcon source={s} size="md" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      {s.institution && (
                        <p className="text-xs text-muted-foreground truncate">{s.institution}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => { setSources(readSources()); setWizardOpen(false) }}
      />
    </TooltipProvider>
  )
}
