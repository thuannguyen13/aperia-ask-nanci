"use client"

import Image from "next/image"
import type { Message } from "@/lib/ask-nanci/types"
import { ChatCitedSources } from "./ChatCitedSources"
import { SuggestedQuestions } from "./SuggestedQuestions"
import { MessageChart } from "./MessageChart"

function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part,
  )
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 list-disc">
          {parseMarkdown(line.slice(2))}
        </li>
      )
    }
    if (line === "") return <br key={i} />
    return <p key={i}>{parseMarkdown(line)}</p>
  })
}

export function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-4 py-2">
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
        {message.content}
      </div>
    </div>
  )
}

export function BotMessage({
  message,
  displayedContent,
  showExtras,
}: {
  message: Message
  displayedContent: string
  showExtras: boolean
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
        <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={14} height={14} className="brightness-0 invert" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm leading-relaxed text-foreground">
          <ul>{renderContent(displayedContent)}</ul>
        </div>
        {showExtras && (
          <>
            {message.chart && <MessageChart chart={message.chart} />}
            {message.attributedSources?.length ? (
              <ChatCitedSources sources={message.attributedSources} />
            ) : null}
            {message.suggestions?.length ? (
              <SuggestedQuestions suggestions={message.suggestions} />
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
