"use client"

import { useState } from "react"
import { CornerDownRight, Compass } from "lucide-react"
import { Tabs, TabsContent } from "aperia-ds5"
import { ResponsiveTabsList } from "@/components/shared"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ISO_PROMPT_CATEGORIES, BUSINESS_OWNER_PROMPT_CATEGORIES } from "@/lib/ask-nanci/embed-demo-config"
import { FLOW_DEFS } from "@/lib/ask-nanci/data/flows.concept"

interface ExplorePromptsProps {
  title?: string
  description?: string
  onPromptClick?: (prompt: string) => void
}

// Three flows that each open a panel: a table (2), a chart (15) and a form that ends in
// a request (16). A flow's key is also the prompt that starts it, so the tab needs no
// UI of its own. Three on purpose: the full catalog is `?mode=concept`.
const DEMO_FLOW_NUMS = [2, 15, 16]
const DEMO_CATEGORY = {
  id: "demos",
  label: "Demos",
  prompts: DEMO_FLOW_NUMS.map((num) => FLOW_DEFS.find((f) => f.num === num)!.key),
}

export function ExplorePrompts({ title, description, onPromptClick }: ExplorePromptsProps) {
  const { handlePrompt, embedVariant, promptCategories, isConceptVersion, isEmbed } = useAskNanci()
  const handleClick = onPromptClick ?? handlePrompt

  const baseCategories = embedVariant === "iso"
    ? ISO_PROMPT_CATEGORIES
    : embedVariant === "business-owner"
      ? BUSINESS_OWNER_PROMPT_CATEGORIES
      : promptCategories
  // Only where a flow can actually play: the engine is on and this is the full app.
  const visibleCategories = isConceptVersion && !isEmbed && baseCategories.length
    ? [...baseCategories, DEMO_CATEGORY]
    : baseCategories

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
