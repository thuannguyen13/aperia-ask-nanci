"use client"

import { useState } from "react"
import { CornerDownRight, Compass } from "lucide-react"
import { Tabs, TabsContent } from "aperia-ds5"
import { ResponsiveTabsList } from "@/components/shared"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ISO_PROMPT_CATEGORIES, BUSINESS_OWNER_PROMPT_CATEGORIES } from "@/lib/ask-nanci/embed-demo-config"

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
      ? BUSINESS_OWNER_PROMPT_CATEGORIES
      : promptCategories

  // Controlled, because the strip and the dropdown are two renderings of one selection:
  // swapping between them at a resize must not reset which category is open. Derived,
  // not synced in an effect: when the category set changes under it the stored id
  // simply stops matching and the first tab wins.
  const firstId = visibleCategories[0]?.id
  const [picked, setActive] = useState(firstId)
  const active = visibleCategories.some((c) => c.id === picked) ? picked : firstId

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          <Compass className="mt-0.5 size-5 shrink-0 text-foreground" />
          <div>
            <p className="text-base font-medium text-foreground">{title || "How can I help?"}</p>
            <p className="text-sm text-muted-foreground">{description || "Frequently asked questions by businesses like yours."}</p>
          </div>
        </div>
      </div>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <ResponsiveTabsList
          data-tour="category-tabs"
          items={visibleCategories.map(({ id, label }) => ({ id, label }))}
          value={active ?? ""}
          onValueChange={setActive}
        />

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
