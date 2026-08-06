"use client"

import { useState } from "react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, Input,
} from "aperia-ds5"

const MAX_VISIBLE_QUESTIONS = 20

const COMMANDS = [
  {
    id: "question-list",
    label: "/question-list",
    description: "Browse all available sample questions",
  },
  {
    id: "usage",
    label: "/usage",
    description: "Simulate reaching your daily token limit",
  },
  {
    id: "onboarding",
    label: "/onboarding",
    description: "Re-open the onboarding dialog",
  },
  {
    id: "context-warning",
    label: "/context-warning",
    description: "Simulate approaching the context limit (90%)",
  },
  {
    id: "context-full",
    label: "/context-full",
    description: "Simulate reaching the context limit (100%)",
  },
  {
    id: "context-clear",
    label: "/context-clear",
    description: "Stop simulating and follow the real conversation",
  },
  {
    id: "plan-warning",
    label: "/plan-warning",
    description: "Simulate the plan budget nearly spent (90%)",
  },
  {
    id: "plan-full",
    label: "/plan-full",
    description: "Simulate the plan budget spent (100%)",
  },
  {
    id: "plan-clear",
    label: "/plan-clear",
    description: "Stop simulating and follow the real plan usage",
  },
]

export type SlashAction =
  | { type: "select"; text: string }
  | { type: "command"; id: string }
  | { type: "dismiss" }

interface Props {
  query: string
  onAction: (action: SlashAction) => void
}

export function SlashCommandPopover({ query, onAction }: Props) {
  const [questionSearch, setQuestionSearch] = useState("")
  const [mode, setMode] = useState<"commands" | "questions">("commands")
  const { allQuestions } = useAskNanci()

  const filteredCommands = COMMANDS.filter((c) =>
    c.id.includes(query.toLowerCase().replace("/", "")),
  )

  const filteredQuestions = allQuestions.filter((q) =>
    !questionSearch || q.toLowerCase().includes(questionSearch.toLowerCase()),
  ).slice(0, MAX_VISIBLE_QUESTIONS)

  if (mode === "commands" && !filteredCommands.length) return null

  return (
    <DropdownMenu open onOpenChange={(open) => { if (!open) onAction({ type: "dismiss" }) }}>
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
                  if (cmd.id === "question-list") {
                    setMode("questions")
                  } else {
                    onAction({ type: "command", id: cmd.id })
                  }
                }}
                className="flex-col items-start gap-0"
              >
                {/* foreground, not primary: a light brand color (Woodforest's green)
                    left these unreadable on the white menu */}
                <span className="font-medium text-foreground">{cmd.label}</span>
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
                  onSelect={() => onAction({ type: "select", text: q })}
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
