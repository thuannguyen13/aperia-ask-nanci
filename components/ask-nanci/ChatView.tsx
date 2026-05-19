"use client"

import { useEffect, useRef } from "react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { UserMessage, BotMessage } from "./ChatMessage"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { ExplorePrompts } from "./ExplorePrompts"

export function ChatView() {
  const { messages, chatState, pendingBot } = useAskNanci()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages, pendingBot?.content, chatState])

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-[800px] flex flex-col gap-0 py-4">
        {messages.map((msg, i) => {
          const isLastMsg = i === messages.length - 1
          return msg.role === "user" ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <div key={msg.id}>
              <BotMessage
                message={msg}
                displayedContent={msg.content}
                showExtras={true}
              />
              {isLastMsg && chatState === "idle" && (
                <div className="mt-6">
                  <ExplorePrompts title="Ask More" description="Pick another question to keep the conversation going." />
                </div>
              )}
            </div>
          )
        })}

        {chatState === "thinking" && <ThinkingIndicator />}

        {chatState === "streaming" && pendingBot && (
          <BotMessage
            message={pendingBot}
            displayedContent={pendingBot.content}
            showExtras={false}
          />
        )}

        <div ref={bottomRef} className="h-8 shrink-0" />
      </div>
    </div>
  )
}
