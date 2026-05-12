"use client"

import { useEffect, useRef } from "react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { UserMessage, BotMessage } from "./ChatMessage"
import { ChatThinking } from "./ChatThinking"

export function ChatView() {
  const { messages, chatState, pendingBot } = useAskNanci()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, pendingBot?.content, chatState])

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[800px] flex flex-1 flex-col gap-0 py-4">
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

        {chatState === "thinking" && <ChatThinking />}

        {chatState === "streaming" && pendingBot && (
          <BotMessage
            message={pendingBot}
            displayedContent={pendingBot.content}
            showExtras={false}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
