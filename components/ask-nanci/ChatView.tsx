"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { useChatScroll } from "@/hooks/useChatScroll"
import { UserMessage, BotMessage } from "./ChatMessage"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { ExplorePrompts } from "./ExplorePrompts"

export function ChatView() {
  const { messages, chatState, pendingBot, isConceptVersion } = useAskNanci()
  const { containerRef, spacerRef, lastUserMsgRef } = useChatScroll(chatState, pendingBot?.content)

  return (
    <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-[800px] flex flex-col gap-0 pt-4">
        {messages.map((msg, i) => {
          const isLastMsg = i === messages.length - 1
          const isLastUser = isLastMsg && msg.role === "user"
          return msg.role === "user" ? (
            <div key={msg.id} ref={isLastUser ? lastUserMsgRef : undefined}>
              <UserMessage message={msg} />
            </div>
          ) : (
            <div key={msg.id}>
              <BotMessage
                message={msg}
                displayedContent={msg.content}
                showExtras={true}
              />
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

        <div ref={spacerRef} className="shrink-0" />
      </div>
    </div>
  )
}
