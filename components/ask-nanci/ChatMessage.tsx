"use client"

import { memo, useState } from "react"
import { FileText, MessageSquare } from "lucide-react"
import type { Message, SheetActionData } from "@/lib/ask-nanci/types"
import { ChatCitedSources, ChatScriptedSources } from "./ChatCitedSources"
import { SuggestedQuestions } from "./SuggestedQuestions"
import { MessageChart } from "./MessageChart"
import { PanelArtifactCard } from "./PanelArtifactCard"
import { MessageMap } from "./MessageMap"
import { ChangeAuditDialog } from "./concept/ChangeAuditDialog"
import { AiTriageSummaryWidget } from "./AiTriageSummaryWidget"
import { ArtifactCard } from "@/components/shared"
import { DashChartCard } from "@/components/risk/dashboard/DashChartCard"

// The change-request block. Layout and styling live in ArtifactCard; this only supplies
// the copy and which pip the request's state earns.
function ChangeRequestCard({ data, onClick }: { data: SheetActionData; onClick: () => void }) {
  const submitted = data.status === "submitted"
  // Offer-request variant (credit-card/loan): "<X> request submitted" + the offer name.
  const isRequest = !!data.requestLabel
  const title = isRequest
    ? `${data.requestLabel} submitted`
    : submitted ? "Change request submitted" : "Change confirmation"
  const subtitle = isRequest
    ? `${data.product ?? ""}${data.reference ? ` · Ref ${data.reference}` : ""}`
    : submitted
      ? `${data.field}${data.reference ? ` · Ref ${data.reference}` : ""}`
      : `${data.field} · Completed`
  return (
    <ArtifactCard
      className="mt-2"
      icon={FileText}
      title={title}
      subtitle={subtitle}
      action={submitted ? "View request" : "View change"}
      // This one opens a dialog, not a panel, so the panel-edge icon would point at the
      // wrong place. No icon until there is one that reads as "opens a dialog".
      actionIcon={null}
      onClick={onClick}
    />
  )
}

function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part,
  )
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim()
  const cells = trimmed.endsWith("|") ? trimmed.split("|").slice(1, -1) : trimmed.split("|").slice(1)
  return cells.map((cell) => cell.trim())
}

function isSeparatorRow(line: string): boolean {
  return /^\|[\s|:-]+\|$/.test(line.trim())
}

function renderContent(content: string) {
  const lines = content.split("\n")
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trimStart().startsWith("|")) {
      // Collect all consecutive table lines
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith("|")) {
        tableLines.push(lines[i])
        i++
      }

      const nonSep = tableLines.filter((l) => !isSeparatorRow(l))
      if (nonSep.length === 0) continue

      const [headerRow, ...bodyRows] = nonSep
      const headers = parseTableRow(headerRow)

      nodes.push(
        <div key={`table-${i}`} className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border">
                {headers.map((h, j) => (
                  <th key={j} className="py-1.5 pr-4 text-left font-semibold text-foreground last:pr-0">
                    {parseMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/50 last:border-0">
                  {parseTableRow(row).map((cell, ci) => (
                    <td key={ci} className="py-1.5 pr-4 text-muted-foreground last:pr-0">
                      {parseMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith("- ")) {
      const start = i
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2))
        i++
      }
      nodes.push(
        <ul key={`ul-${start}`} className="ml-4 list-disc">
          {items.map((item, j) => (
            <li key={j}>{parseMarkdown(item)}</li>
          ))}
        </ul>
      )
      continue
    } else if (line === "") {
      nodes.push(<br key={i} />)
    } else {
      nodes.push(<p key={i}>{parseMarkdown(line)}</p>)
    }
    i++
  }

  return nodes
}

function UserMessageBase({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-4 py-2">
      {/* Matches the answer at 16px: a question and its answer are one exchange, and a
          smaller question reads as a caption on the reply rather than half of a pair. */}
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-base text-primary-foreground">
        {message.content}
      </div>
    </div>
  )
}

// A text Nanci sent through the carrier's messaging, as the chat keeps it: a card naming
// the sender and that Ask Nanci sent it, with the text and its link in a phone-style
// bubble. The chat is where that link lands, so it opens on the text and the owner's
// first question follows it. It is not an answer, so it carries no sources or panels.
function TextMessageCard({ message }: { message: Message }) {
  return (
    <div className="px-4 py-3">
      <div className="max-w-[85%] rounded-xl border bg-muted/40 p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MessageSquare className="size-3.5" />
          </span>
          <div className="min-w-0 text-xs leading-tight">
            <p className="font-medium text-foreground">Text from {message.textFrom}</p>
            <p className="text-muted-foreground">Sent by Ask Nanci</p>
          </div>
        </div>
        <div className="mt-2.5 w-fit rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm text-foreground shadow-xs">
          <p>{message.content}</p>
          {message.textLink && <p className="text-blue-600 underline underline-offset-2 dark:text-blue-400">{message.textLink}</p>}
        </div>
      </div>
      {message.textLink && <p className="mt-2 text-xs text-muted-foreground">You opened Ask Nanci from this text.</p>}
      {message.suggestions?.length ? <SuggestedQuestions suggestions={message.suggestions} /> : null}
    </div>
  )
}

function BotMessageBase({
  message,
  displayedContent,
  showExtras,
  showPanelCard = true,
}: {
  message: Message
  displayedContent: string
  showExtras: boolean
  /** False when an earlier answer already carries this panel's card. */
  showPanelCard?: boolean
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  if (message.textFrom) return <TextMessageCard message={message} />

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        {/* 16px on every screen, with Tailwind's own 1.5 line height rather than the
            leading-relaxed this used to carry. Question and answer are one exchange and
            share both numbers. */}
        <div className="text-base text-foreground">
          {displayedContent.includes("{{MAP}}") ? (() => {
            const [before, after] = displayedContent.split("{{MAP}}")
            return (
              <>
                <div>{renderContent(before.trimEnd())}</div>
                {message.map && <MessageMap map={message.map} />}
                {after && <div className="mt-3">{renderContent(after)}</div>}
              </>
            )
          })() : (
            <div>{renderContent(displayedContent)}</div>
          )}
        </div>
        {showExtras && message.widget === "ai-triage-summary" && (
          <AiTriageSummaryWidget />
        )}
        {showExtras && message.dashChart && <DashChartCard id={message.dashChart} />}
        {showExtras && showPanelCard && message.panel && <PanelArtifactCard id={message.panel} />}
        {showExtras && message.sheetAction && (
          <>
            <ChangeRequestCard data={message.sheetAction} onClick={() => setSheetOpen(true)} />
            <ChangeAuditDialog open={sheetOpen} onOpenChange={setSheetOpen} data={message.sheetAction} />
          </>
        )}
        {showExtras && (
          <>
            {message.chart && <MessageChart chart={message.chart} />}
            {message.map && !message.content.includes("{{MAP}}") && <MessageMap map={message.map} />}
            {message.attributedSources?.length ? (
              <ChatCitedSources sources={message.attributedSources} />
            ) : null}
            {/* The source sits after everything the answer shows, just above its suggestions. */}
            {message.source && <ChatScriptedSources source={message.source} />}
            {message.suggestions?.length ? (
              <SuggestedQuestions suggestions={message.suggestions} />
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export const UserMessage = memo(UserMessageBase)
export const BotMessage = memo(BotMessageBase)
