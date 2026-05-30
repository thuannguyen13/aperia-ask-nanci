"use client"

import { CornerDownRight, Compass } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ISO_PROMPT_CATEGORIES } from "@/lib/ask-nanci/embed-demo-config"

interface ExplorePromptsProps {
  title?: string
  description?: string
  onPromptClick?: (prompt: string) => void
}

export function ExplorePrompts({ title, description, onPromptClick }: ExplorePromptsProps) {
  const { handlePrompt, embedVariant, promptCategories } = useAskNanci()
  const handleClick = onPromptClick ?? handlePrompt

  const visibleCategories = embedVariant === "iso"
    ? ISO_PROMPT_CATEGORIES
    : embedVariant === "business-owner"
      ? promptCategories.filter(({ id }) => id !== "inventory" && id !== "top-items")
      : promptCategories

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          <Compass className="mt-0.5 size-5 shrink-0 text-foreground" />
          <div>
            <p className="text-base font-medium text-foreground">{title || "Common Questions"}</p>
            <p className="text-sm text-muted-foreground">{description || "Jumpstart your analysis with curated questions."}</p>
          </div>
        </div>
      </div>

      <Tabs key={visibleCategories[0]?.id} defaultValue={visibleCategories[0]?.id} className="w-full">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto scrollbar-none flex-nowrap">
          {visibleCategories.map(({ id, label }) => (
            <TabsTrigger key={id} value={id} className="shrink-0">{label}</TabsTrigger>
          ))}
        </TabsList>

        {visibleCategories.map(({ id, prompts }) => (
          <TabsContent key={id} value={id} className="mt-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleClick(prompt)}
                  className="flex cursor-pointer items-start gap-2 rounded-[10px] border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <CornerDownRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{prompt}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
