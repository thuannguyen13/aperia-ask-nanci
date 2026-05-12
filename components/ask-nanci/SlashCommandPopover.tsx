"use client"

import { useState } from "react"
import { ALL_QUESTIONS } from "@/lib/ask-nanci/mock-data"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, Input,
} from "aperia-ds5"

const COMMANDS = [
  {
    id: "question-list",
    label: "/question-list",
    description: "Browse all available sample questions",
  },
]

interface Props {
  query: string
  onSelect: (text: string) => void
  onClose: () => void
}

export function SlashCommandPopover({ query, onSelect, onClose }: Props) {
  const [questionSearch, setQuestionSearch] = useState("")
  const [mode, setMode] = useState<"commands" | "questions">("commands")

  const filteredCommands = COMMANDS.filter((c) =>
    c.id.includes(query.toLowerCase().replace("/", "")),
  )

  const filteredQuestions = ALL_QUESTIONS.filter((q) =>
    !questionSearch || q.toLowerCase().includes(questionSearch.toLowerCase()),
  ).slice(0, 20)

  if (mode === "commands" && !filteredCommands.length) return null

  return (
    <DropdownMenu open onOpenChange={(open) => { if (!open) onClose() }}>
      {/* Invisible anchor — positions the content above the input's bottom-left */}
      <DropdownMenuTrigger asChild>
        <span className="absolute bottom-0 left-0 size-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-72">
        {mode === "commands" ? (
          <>
            <DropdownMenuLabel>Commands</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filteredCommands.map((cmd) => (
              <DropdownMenuItem
                key={cmd.id}
                onSelect={(e) => {
                  e.preventDefault()
                  if (cmd.id === "question-list") setMode("questions")
                }}
                className="flex-col items-start gap-0"
              >
                <span className="font-medium text-primary">{cmd.label}</span>
                <span className="text-xs text-muted-foreground">{cmd.description}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <>
            <div className="p-1.5 border-b">
              <Input
                autoFocus
                placeholder="Search questions…"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="h-8 text-sm"
              />
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {filteredQuestions.map((q) => (
                <DropdownMenuItem
                  key={q}
                  onSelect={() => { onSelect(q); onClose() }}
                >
                  {q}
                </DropdownMenuItem>
              ))}
              {!filteredQuestions.length && (
                <p className="px-3 py-3 text-sm text-muted-foreground">No matching questions.</p>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
