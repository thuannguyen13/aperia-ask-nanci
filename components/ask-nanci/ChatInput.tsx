"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, ArrowUp, Square, FileText, Link2, Upload } from "lucide-react"
import { Button, Textarea, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSource, readSources } from "@/lib/ask-nanci/source-store"
import { SlashCommandPopover } from "./SlashCommandPopover"
import { ConnectWizard } from "./ConnectWizard"

export function ChatInput() {
  const { sendMessage, chatState, stopAnimation, sources, setSources, draft, setDraft } = useAskNanci()
  const activeSources = sources.filter((s) => s.active)

  const [value, setValue] = useState("")
  const [pillOpen, setPillOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (draft) { setValue(draft); setDraft(""); textareaRef.current?.focus() }
  }, [draft, setDraft])

  const isIdle = chatState === "idle"
  const isBusy = chatState === "thinking" || chatState === "streaming"
  const showSlash = value.startsWith("/")
  const slashQuery = showSlash ? value.slice(1) : ""

  useEffect(() => {
    if (!pillOpen) return
    function handleClick(e: MouseEvent) {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setPillOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [pillOpen])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function submit() {
    if (!value.trim() || !isIdle) return
    sendMessage(value.trim())
    setValue("")
  }

  function handleSlashSelect(text: string) { setValue(text); textareaRef.current?.focus() }
  function handleSlashClose() { setValue(""); textareaRef.current?.focus() }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach((f) => addFileSource(f.name, f.type || "application/octet-stream"))
    setSources(readSources())
    e.target.value = ""
  }

  return (
    <div className="relative">
      {showSlash && (
        <SlashCommandPopover query={slashQuery} onSelect={handleSlashSelect} onClose={handleSlashClose} />
      )}

      <div className="flex flex-col rounded-xl border bg-background shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Textarea
          ref={textareaRef}
          placeholder="Ask anything"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[72px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 text-sm"
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2">

            {/* Plus button with dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <Plus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem onSelect={() => setWizardOpen(true)}>
                  <Link2 className="size-4" />
                  Link Account
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                  <Upload className="size-4" />
                  Upload File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Active sources pill */}
            {activeSources.length > 0 && (
              <div ref={pillRef} className="relative">
                {pillOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-xl border bg-background shadow-lg">
                    <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active Sources
                    </p>
                    <div className="flex flex-col pb-1">
                      {activeSources.map((s) => {
                        const initials = (s.initials ?? s.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
                        return (
                          <div key={s.id} className="flex items-center gap-2.5 px-3 py-1.5">
                            {s.kind === "bank" ? (
                              <div className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white ${s.color ?? "bg-muted"}`}>
                                {initials}
                              </div>
                            ) : (
                              <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <FileText className="size-3.5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-foreground">{s.name}</p>
                              {s.institution && (
                                <p className="truncate text-[10px] text-muted-foreground">{s.institution}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setPillOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-full hover:bg-muted px-1 py-0.5 transition-colors"
                >
                  {activeSources.slice(0, 3).map((s, i) => {
                    const initials = (s.initials ?? s.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
                    return (
                      <div
                        key={s.id}
                        className={`flex size-5 items-center justify-center rounded-full text-[9px] font-semibold ring-2 ring-background ${s.kind === "bank" && s.color ? `${s.color} text-white` : "bg-primary text-primary-foreground"}`}
                        style={{ marginLeft: i > 0 ? "-6px" : 0 }}
                      >
                        {initials}
                      </div>
                    )
                  })}
                  {activeSources.length > 3 && (
                    <span className="ml-1 text-xs text-muted-foreground">+{activeSources.length - 3}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          {isBusy ? (
            <Button size="icon-sm" variant="secondary" onClick={stopAnimation}>
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button size="icon-sm" variant="default" onClick={submit} disabled={!value.trim()}>
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      {wizardOpen && (
        <ConnectWizard
          onClose={() => setWizardOpen(false)}
          onLinked={() => { setSources(readSources()); setWizardOpen(false) }}
        />
      )}
    </div>
  )
}
