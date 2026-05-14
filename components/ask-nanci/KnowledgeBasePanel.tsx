"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { X, Link2, Upload } from "lucide-react"
import { Button, Switch, Separator, Card, CardContent, ScrollArea } from "aperia-ds5"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CLOVER_SOURCE, addFileSource, toggleSource, removeSource, readSources } from "@/lib/ask-nanci/sourceStore"
import type { Source } from "@/lib/ask-nanci/types"
import { ConnectWizard } from "./ConnectWizard"

// ─── Source icons ─────────────────────────────────────────────────────────────

const EXT_COLORS: Record<string, string> = {
  pdf: "text-red-600",
  csv: "text-green-600",
  xlsx: "text-green-600",
  xls: "text-green-600",
  txt: "text-amber-600",
  docx: "text-blue-600",
  doc: "text-blue-600",
  pptx: "text-orange-600",
}

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  const colorClass = EXT_COLORS[ext] ?? "text-muted-foreground"
  return (
    <div className="relative flex size-9 shrink-0 items-end justify-center">
      <svg viewBox="0 0 30 37.5" className="absolute inset-0 size-full" fill="none">
        <path d="M2 0h18l10 10v25.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" className="fill-muted stroke-border" strokeWidth="1" />
        <path d="M20 0l10 10H22a2 2 0 0 1-2-2V0Z" className="fill-border" />
      </svg>
      <span className={`relative z-10 mb-1 text-[8px] font-semibold uppercase ${colorClass}`}>
        {ext || "file"}
      </span>
    </div>
  )
}

function BankIcon({ source }: { source: Source }) {
  if (source.logo) {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border bg-white p-1">
        <Image src={source.logo} alt={source.institution ?? source.name} width={28} height={28} className="object-contain" />
      </div>
    )
  }
  const initials = (source.initials ?? source.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "BK"
  const colorClass = source.color ?? "bg-muted"
  const textClass = source.color ? "text-white" : "text-muted-foreground"
  return (
    <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold ${colorClass} ${textClass}`}>
      {initials}
    </div>
  )
}

// ─── Source row ──────────────────────────────────────────────────────────────

function SourceRow({ source, onToggle, onRemove }: { source: Source; onToggle: () => void; onRemove: () => void }) {
  const isBuiltIn = source.id === CLOVER_SOURCE.id
  return (
    <div className={`flex items-center gap-3 py-2.5 ${!source.active ? "opacity-50" : ""}`}>
      {isBuiltIn
        ? <div className="size-6 shrink-0" />
        : <Switch size="sm" checked={source.active} onCheckedChange={onToggle} />
      }
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {source.kind === "file" ? <FileTypeIcon name={source.name} /> : <BankIcon source={source} />}
        <div className="min-w-0">
          <span className="block truncate text-sm text-foreground">{source.name}</span>
          {source.institution && (
            <span className="block truncate text-xs text-muted-foreground">{source.institution}</span>
          )}
        </div>
      </div>
      {!isBuiltIn && (
        <Button variant="ghost" size="icon-sm" onClick={onRemove}>
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function KnowledgeBasePanel() {
  const { kbOpen, setKbOpen, sources, setSources } = useAskNanci()
  const fileRef = useRef<HTMLInputElement>(null)
  const [wizardOpen, setWizardOpen] = useState(false)

  const userSources = sources.filter((s) => s.id !== CLOVER_SOURCE.id)
  const hasSources = userSources.length > 0

  function refresh() { setSources([CLOVER_SOURCE, ...readSources()]) }
  function handleToggle(id: string) { toggleSource(id); refresh() }
  function handleRemove(id: string) { removeSource(id); refresh() }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((f) =>
      addFileSource(f.name, f.type || "application/octet-stream"),
    )
    refresh()
    e.target.value = ""
  }

  const panelContent = (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Knowledge Base</h2>
        <Button variant="ghost" size="icon-sm" onClick={() => setKbOpen(false)}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-5 p-4 pt-0 pt-[1px]">

          {/* Add Sources card */}
          <Card>
            <CardContent>
              <div className="flex items-start gap-4">
                <Image src="/ask-nanci/img_kb-illustration.png" alt="" width={72} height={72} className="size-18 shrink-0 object-contain -ml-2 -mt-2" />
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">Add Sources to Get Started</p>
                    <p className="text-sm text-muted-foreground">
                      Add sources by linking your accounts or uploading files to give Nanci a more complete picture of your business.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setWizardOpen(true)}>
                      Link Accounts
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => fileRef.current?.click()}>
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Sources</p>
              <p className="text-sm text-muted-foreground">
                Added sources will be used as reference for Ask Nanci when generating responses.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-md border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 px-3 py-2">
              <Image src="/ask-nanci/clover-logo-color.svg" alt="Clover" width={16} height={16} className="size-4 shrink-0" />
              <span className="text-sm font-medium text-green-600">Clover Data Added</span>
            </div>

            {hasSources ? (
              <div className="flex flex-col">
                {userSources.map((s, i) => (
                  <div key={s.id}>
                    <SourceRow
                      source={s}
                      onToggle={() => handleToggle(s.id)}
                      onRemove={() => handleRemove(s.id)}
                    />
                    {i < userSources.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Upload />
                  </EmptyMedia>
                  <EmptyTitle>No sources added yet</EmptyTitle>
                  <EmptyDescription>Upload a file or link an account to get started.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </ScrollArea>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => { refresh(); setWizardOpen(false) }}
      />
    </>
  )

  return (
    <>
      {/* Mobile backdrop */}
      {kbOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setKbOpen(false)}
        />
      )}

      {/* Mobile: full-screen slide-in from right */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-200 ease-in-out md:hidden",
          kbOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {panelContent}
      </div>

      {/* Desktop: inline side panel */}
      <div
        className={cn(
          "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background transition-[width,opacity] duration-200 ease-in-out md:flex",
          kbOpen ? "w-[480px] opacity-100 mr-1" : "w-0 opacity-0 border-0 pointer-events-none",
        )}
      >
        {panelContent}
      </div>
    </>
  )
}
