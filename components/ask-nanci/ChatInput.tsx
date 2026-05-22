"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, ArrowUp, Square, Link2, Upload, Bell } from "lucide-react"
import { Button, Textarea, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Popover, PopoverTrigger, PopoverContent } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSources, readSources } from "@/lib/ask-nanci/sourceStore"
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY } from "@/lib/ask-nanci/concept-config"
import { SlashCommandPopover, type SlashAction } from "./SlashCommandPopover"
import { ConnectWizard } from "./ConnectWizard"
import { ChatActiveSources } from "./ChatActiveSources"

const PROACTIVE_CONTENT = CONCEPT_SCRIPTED_CONVERSATIONS[CONCEPT_FLOW6_KEY][0].content

export function ChatInput() {
  const { sendMessage, chatState, stopAnimation, sources, setSources, draft, setDraft, setTokenLimitReached, setOnboardingOpen, isEmbed, isConceptVersion, triggerProactiveFlow, proactiveNotificationActive } = useAskNanci()
  const activeSources = sources.filter((s) => s.active)

  const [value, setValue] = useState("")
  const [wizardOpen, setWizardOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)

  function handleNotifOpen(open: boolean) {
    setNotifOpen(open)
    if (open) setNotifRead(true)
  }

  function handleOpenNanci() {
    setNotifOpen(false)
    triggerProactiveFlow()
  }

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

            {isConceptVersion && proactiveNotificationActive && (
              <Popover open={notifOpen} onOpenChange={handleNotifOpen}>
                <PopoverTrigger asChild>
                  <button className="relative flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Bell className="size-4" />
                    {!notifRead && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-72 p-0">
                  <div className="flex flex-col gap-2.5 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notifications</p>
                    <div className="flex flex-col gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Nanci spotted some issues</p>
                      <p className="whitespace-pre-line text-xs text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                        {PROACTIVE_CONTENT}
                      </p>
                      <button
                        onClick={handleOpenNanci}
                        className="mt-1 self-start rounded-md bg-amber-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 transition-colors dark:bg-amber-600 dark:hover:bg-amber-700"
                      >
                        Open Nanci
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
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
