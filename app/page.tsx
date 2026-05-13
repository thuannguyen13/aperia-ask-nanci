"use client"

import { CornerDownRight, Clock, Compass, BookOpen } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button, Tabs, TabsList, TabsTrigger } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { WELCOME_SUGGESTIONS } from "@/lib/ask-nanci/mock-data"

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Top Items", value: "top-items" },
  { label: "Inventory", value: "inventory" },
  { label: "Operation", value: "operation" },
  { label: "Refunds & Voids", value: "refunds-voids" },
  { label: "Payment", value: "payment" },
  { label: "Tips", value: "tips" },
]

function WelcomeView() {
  const { sendMessage, sessions, resumeSession, kbOpen, setKbOpen } = useAskNanci()
  const searchParams = useSearchParams()
  const isVariantB = searchParams.get("v") === "b"

  const recentSessions = sessions.slice(0, 3)

  return (
    <div className="flex flex-1 flex-col justify-center items-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
      <div className="flex w-full max-w-[800px] flex-col gap-8">

        {/* Welcome header */}
        <div className="flex flex-col items-center gap-4">
          <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={40} height={40} />
          <div className="text-center">
            <p className="text-2xl font-medium text-foreground">Welcome to Ask Nanci</p>
            <p className="text-2xl font-medium text-foreground">Ready when you are, Teresa.</p>
          </div>
        </div>

        

        {/* Version B: KB banner between chat input and prompts */}
        {isVariantB && (
          <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:border-l-green-500 dark:bg-green-950/20">
            <BookOpen className="size-5 shrink-0 text-green-700 dark:text-green-400" />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Teach Nanci</p>
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Not set up
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your Clover data is already connected. Add your other financial accounts, including your bookkeeping software to give Nanci a complete picture of your business.
              </p>
            </div>
            <Button size="sm" className="shrink-0" onClick={() => setKbOpen(!kbOpen)}>
              {kbOpen ? "Close" : "Link Accounts"}
            </Button>
          </div>
        )}

        {/* Chat input */}
        <ChatInput />

        {/* Prompt suggestions */}
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-nowrap">
              {tabs.map(({ label, value }) => (
                <TabsTrigger key={value} value={value} className="shrink-0">{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-5 shrink-0 text-foreground" />
                <div>
                  <p className="text-base font-medium text-foreground">Explore prompts</p>
                  <p className="text-xs text-muted-foreground">Jumpstart your analysis with curated questions.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">View All</Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {WELCOME_SUGGESTIONS.map((label) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className="flex cursor-pointer items-start gap-2 rounded-[10px] border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <CornerDownRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent chats */}
          {recentSessions.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-5 shrink-0 text-foreground" />
                  <div>
                    <p className="text-base font-medium text-foreground">Pick up where you left off</p>
                    <p className="text-xs text-muted-foreground">Continue a previous conversation.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">View All</Button>
              </div>

              <div className="overflow-hidden rounded-[14px] border">
                {recentSessions.map(({ id, title, updatedAt }, i) => (
                  <button
                    key={id}
                    onClick={() => resumeSession(id)}
                    className={cn(
                      "flex w-full cursor-pointer flex-col gap-1 bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted",
                      i < recentSessions.length - 1 && "border-b",
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{title}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default function AskNanciPage() {
  const { view } = useAskNanci()

  if (view === "chat") {
    return (
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatView />
        <div className="shrink-0 px-3 py-3 md:px-4 md:py-4">
          <div className="mx-auto w-full max-w-[800px]">
            <ChatInput />
          </div>
        </div>
      </div>
    )
  }

  return <WelcomeView />
}
