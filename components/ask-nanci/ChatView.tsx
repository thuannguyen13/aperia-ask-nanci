"use client"

import { ArrowDown, RotateCcw } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { usePendingBot } from "@/contexts/ChatStreamContext"
import { useChatScroll } from "@/hooks/use-chat-scroll"
import { PanelHeader } from "@/components/shared"
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
// Flip to `true` to activate it (see the useChatScroll JSDoc).
const ENABLE_SCROLL_TO_BOTTOM_BUTTON = false

export function ChatView() {
  const { messages, chatState, chatTitle } = useAskNanci()
  const pendingBot = usePendingBot()
  const { containerRef, spacerRef, lastUserMsgRef, isPinnedToBottom, scrollToBottom } =
    useChatScroll({ phase: chatState === "thinking" ? "awaiting" : chatState })
  const pending = chatState === "streaming" && pendingBot ? pendingBot : null
  const rendered = pending ? [...messages, pending] : messages

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
        {/* The streaming bubble is rendered inside the same list as the committed
            messages, not after it. Its id is the id it commits under, but React only
            matches keys within one sibling list: as a separate child after the map it
            was torn down and rebuilt on commit, which flashed every answer once and
            reloaded the map iframe. In the list, the node survives the handoff. */}
        {rendered.map((msg, i) => {
          const isPending = msg === pending
          const isLastUser = !isPending && i === messages.length - 1 && msg.role === "user"
          return msg.role === "user" ? (
            <div key={msg.id} ref={isLastUser ? lastUserMsgRef : undefined}>
              <UserMessage message={msg} />
            </div>
          ) : (
            <div key={msg.id}>
              <BotMessage
                message={msg}
                displayedContent={msg.content}
                showExtras={!isPending}
              />
            </div>
          )
        })}

        {chatState === "thinking" && <ThinkingIndicator />}

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
