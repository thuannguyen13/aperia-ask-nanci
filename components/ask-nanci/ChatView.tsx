"use client"

import { ArrowDown, RotateCcw } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { usePendingBot } from "@/contexts/ChatStreamContext"
import { useChatScroll } from "@/hooks/use-chat-scroll"
import { PanelHeader } from "./shared"
import { UserMessage, BotMessage } from "./ChatMessage"
import { ThinkingIndicator } from "./ThinkingIndicator"

// End of a `?flow=` demo: offer to play it again from the top. `replayFlow` is only
// non-null when a flow was routed by URL, so this never appears in a normal chat —
// and `flowFinished` (not `chatState`) is what keeps it off screen mid-demo.
//
// It sits below the last message rather than in the top bar because under `?autoplay`
// the top-bar Ask button is hidden, which left a finished demo with no way to restart
// short of reloading the page.
function RestartDemoButton() {
  const { replayFlow, flowFinished } = useAskNanci()
  if (!replayFlow || !flowFinished) return null
  return (
    <div className="mt-6 flex justify-center">
      <Button variant="secondary" size="sm" onClick={replayFlow} className="gap-1.5">
        <RotateCcw className="size-3.5" />
        Restart demo
      </Button>
    </div>
  )
}

// Dormant: the scroll-to-bottom affordance is fully built below but shipped off.
// Flip to `true` to activate it (see docs/plans / useChatScroll JSDoc).
const ENABLE_SCROLL_TO_BOTTOM_BUTTON = false

export function ChatView() {
  const { messages, chatState, chatTitle } = useAskNanci()
  const pendingBot = usePendingBot()
  const { containerRef, spacerRef, lastUserMsgRef, isPinnedToBottom, scrollToBottom } =
    useChatScroll({ phase: chatState === "thinking" ? "awaiting" : chatState })

  return (
    // data-nest: the conversation is what recedes when a mobile panel sheet opens.
    // See globals.css — the input is deliberately not inside it, so it stays put.
    <div data-nest className="relative flex h-full min-h-0 flex-1 flex-col">
      {/* Conversation title — the shared PanelHeader (no close button), above the
          scroll area so it hugs the left on wide panes instead of centering with
          the messages. `size="lg"` is the borderless, bolder title variant. */}
      {chatTitle && <PanelHeader title={chatTitle} size="lg" />}
      <div className="relative min-h-0 flex-1">
      <div ref={containerRef} className="h-full overflow-y-auto">
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

        {/* Same wrapper + key as committed messages: pendingBot.id equals the
            id it commits under, so React reconciles the two instead of remounting
            (which reloaded the map iframe — a flash between turns). */}
        {chatState === "streaming" && pendingBot && (
          <div key={pendingBot.id}>
            <BotMessage
              message={pendingBot}
              displayedContent={pendingBot.content}
              showExtras={false}
            />
          </div>
        )}

        <RestartDemoButton />

        <div ref={spacerRef} className="shrink-0" />
      </div>
      </div>

      {ENABLE_SCROLL_TO_BOTTOM_BUTTON && !isPinnedToBottom && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to latest"
          className="absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border bg-background shadow-md transition-colors hover:bg-muted"
        >
          <ArrowDown className="size-4 text-foreground" />
        </button>
      )}
      </div>
    </div>
  )
}
