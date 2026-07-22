"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "aperia-ds5"
import { SourceIcon, getSourceInitials } from "./SourceIcon"
import { ConnectWizard } from "./ConnectWizard"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSources, readSources } from "@/lib/ask-nanci/source-store"
import type { Source } from "@/lib/ask-nanci/types"

interface Props {
  sources: Source[]
}

export function ChatActiveSources({ sources }: Props) {
  const { setSources } = useAskNanci()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFileSources(e.target.files)
    setSources(readSources())
    e.target.value = ""
  }

  function handleAddNewSource() {
    setPopoverOpen(false)
    setWizardOpen(true)
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-0.5 text-secondary-foreground transition-colors hover:bg-secondary/80 h-7">
            <Plus className="size-3.5 shrink-0 text-muted-foreground" />
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

        <PopoverContent side="top" align="start" className="w-[320px] p-0 gap-0 overflow-hidden flex flex-col max-h-[360px]">
          {sources.length > 0 && (
            <>
              <p className="px-3 pt-3 pb-2 text-sm font-medium text-foreground shrink-0">Sources Used</p>
              <div className="overflow-y-auto flex-1 min-h-0">
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
            </>
          )}

          {sources.length > 0 && <div className="border-t border-border shrink-0" />}
          <button
            onClick={handleAddNewSource}
            className="flex items-center gap-2 px-3 py-2.5 w-full text-left transition-colors hover:bg-muted shrink-0"
          >
            <div className="flex size-8 items-center justify-center rounded-md border border-border bg-white shrink-0">
              <Plus className="size-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">Add New Source</span>
          </button>
        </PopoverContent>
      </Popover>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => { setSources(readSources()); setWizardOpen(false) }}
      />
    </>
  )
}
