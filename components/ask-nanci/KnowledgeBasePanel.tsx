"use client"

import { useRef, useState } from "react"
import { X, Link2, Upload } from "lucide-react"
import { Button, Switch, Separator, Card, CardContent } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSource, toggleSource, removeSource, readSources } from "@/lib/ask-nanci/source-store"
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
  return (
    <div className={`flex items-center gap-3 py-2.5 ${!source.active ? "opacity-50" : ""}`}>
      <Switch size="sm" checked={source.active} onCheckedChange={onToggle} />
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {source.kind === "file" ? <FileTypeIcon name={source.name} /> : <BankIcon source={source} />}
        <div className="min-w-0">
          <span className="block truncate text-sm text-foreground">{source.name}</span>
          {source.institution && (
            <span className="block truncate text-xs text-muted-foreground">{source.institution}</span>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onRemove}>
        <X className="size-4" />
      </Button>
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function KnowledgeBasePanel() {
  const { kbOpen, setKbOpen, sources, setSources } = useAskNanci()
  const fileRef = useRef<HTMLInputElement>(null)
  const [wizardOpen, setWizardOpen] = useState(false)

  const hasSources = sources.length > 0

  function refresh() { setSources(readSources()) }
  function handleToggle(id: string) { toggleSource(id); refresh() }
  function handleRemove(id: string) { removeSource(id); refresh() }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((f) =>
      addFileSource(f.name, f.type || "application/octet-stream"),
    )
    refresh()
    e.target.value = ""
  }

  return (
    <div
      className={`flex h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background transition-[width,opacity] duration-200 ease-in-out ${
        kbOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-0 pointer-events-none"
      }`}
    >

      {/* Header */}
      <div className="flex w-[480px] shrink-0 items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Knowledge Base</h2>
        <Button variant="ghost" size="icon-sm" onClick={() => setKbOpen(false)}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex w-[480px] flex-1 flex-col gap-5 overflow-y-auto p-4">

        {/* Add Sources card */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {/* Tilted doc illustration */}
              <div className="flex size-14 shrink-0 items-center justify-center">
                <div style={{ transform: "rotate(-13deg)" }}>
                  <svg viewBox="0 0 30 37.5" className="h-12 w-9" fill="none">
                    <path d="M2 0h18l10 10v25.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" className="fill-primary/10 stroke-primary/30" strokeWidth="1" />
                    <path d="M20 0l10 10H22a2 2 0 0 1-2-2V0Z" className="fill-primary/30" />
                    <rect x="5" y="14" width="16" height="2" rx="1" className="fill-primary/40" />
                    <rect x="5" y="19" width="10" height="2" rx="1" className="fill-primary/40" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">Add Sources to Get Started</p>
                <p className="text-xs leading-4 text-muted-foreground">
                  Upload files or add link to import your data. Your imports will be used to enhance Nanci's knowledge base.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setWizardOpen(true)}>
                    <Link2 className="size-3.5" /> Link Accounts
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => fileRef.current?.click()}>
                    <Upload className="size-3.5" /> Upload File
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources section */}
        {hasSources && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Sources</p>
              <p className="text-xs text-muted-foreground">
                Added sources will be used as reference for Ask Nanci when generating responses.
              </p>
            </div>

            {/* Static payment data integration banner */}
            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6" />
              </svg>
              <span className="text-xs font-medium text-primary">Payment data connected</span>
            </div>

            <div className="flex flex-col">
              {sources.map((s, i) => (
                <div key={s.id}>
                  <SourceRow
                    source={s}
                    onToggle={() => handleToggle(s.id)}
                    onRemove={() => handleRemove(s.id)}
                  />
                  {i < sources.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      {wizardOpen && (
        <ConnectWizard
          onClose={() => setWizardOpen(false)}
          onLinked={() => { refresh(); setWizardOpen(false) }}
        />
      )}
    </div>
  )
}
