"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { UserMessage, BotMessage } from "./ChatMessage"
import { ThinkingIndicator } from "./ThinkingIndicator"

export function ChatView() {
  const { messages, chatState, pendingBot } = useAskNanci()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, pendingBot?.content, chatState])

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto w-full max-w-[800px] flex flex-col gap-0 py-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <BotMessage
              key={msg.id}
              message={msg}
              displayedContent={msg.content}
              showExtras={true}
            />
          ),
        )}

        {chatState === "thinking" && <ThinkingIndicator />}

        {chatState === "streaming" && pendingBot && (
          <BotMessage
            message={pendingBot}
            displayedContent={pendingBot.content}
            showExtras={false}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
