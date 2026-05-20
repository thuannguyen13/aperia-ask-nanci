"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, ArrowUp, Square, Link2, Upload } from "lucide-react"
import { Button, Textarea, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSources, readSources } from "@/lib/ask-nanci/sourceStore"
import { SlashCommandPopover, type SlashAction } from "./SlashCommandPopover"
import { ConnectWizard } from "./ConnectWizard"
import { ChatActiveSources } from "./ChatActiveSources"

export function ChatInput() {
  const { sendMessage, chatState, stopAnimation, sources, setSources, draft, setDraft, setTokenLimitReached, setOnboardingOpen, isEmbed } = useAskNanci()
  const activeSources = sources.filter((s) => s.active)

  const [value, setValue] = useState("")
  const [wizardOpen, setWizardOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (draft) { setValue(draft); setDraft(""); textareaRef.current?.focus({ preventScroll: true }) }
  }, [draft, setDraft])

  const isIdle = chatState === "idle"
  const isBusy = chatState === "thinking" || chatState === "streaming"
  const showSlash = value.startsWith("/")
  const slashQuery = showSlash ? value.slice(1) : ""

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function submit() {
    if (!value.trim() || !isIdle) return
    sendMessage(value.trim())
    setValue("")
  }

  function handleSlashAction(action: SlashAction) {
    if (action.type === "select") {
      setValue(action.text)
    } else if (action.type === "command") {
      if (action.id === "usage") setTokenLimitReached(true)
      if (action.id === "onboarding") setOnboardingOpen(true)
      setValue("")
    } else {
      setValue("")
    }
    textareaRef.current?.focus()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFileSources(e.target.files)
    setSources(readSources())
    e.target.value = ""
  }

  return (
    <div className="relative">
      {showSlash && (
        <SlashCommandPopover query={slashQuery} onAction={handleSlashAction} />
      )}

      <div className="flex flex-col rounded-xl border bg-background dark:bg-input/30 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Textarea
          ref={textareaRef}
          placeholder="Ask anything"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[72px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 text-sm bg-transparent dark:bg-transparent"
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2">
            {isEmbed ? (
              <Button size="icon-sm" variant="ghost" disabled>
                <Plus />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <Plus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start">
                  <DropdownMenuItem onSelect={() => setWizardOpen(true)}>
                    <Link2 className="size-4" />
                    Link Accounts
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
                    <Upload className="size-4" />
                    Upload File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ChatActiveSources sources={activeSources} />
          </div>

          {isBusy ? (
            <Button size="icon-sm" variant="secondary" onClick={stopAnimation}>
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button size="icon-sm" variant="default" onClick={submit} disabled={isEmbed || !value.trim()}>
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => { setSources(readSources()); setWizardOpen(false) }}
      />
    </div>
  )
}
