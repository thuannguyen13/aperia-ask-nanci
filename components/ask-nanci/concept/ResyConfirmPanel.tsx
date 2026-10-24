"use client"

import { useState } from "react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { Check, Phone, Users, X } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW28_SEND } from "@/lib/ask-nanci/data/flows.concept"
import { CARD_PER_COVER, FEES_CHARGED, MONTH_TO_DATE, NO_SHOW_COST, NO_SHOW_NET } from "@/lib/ask-nanci/data/panels/resy-group"
import { BOOK_AFTER, BOOK_AS_OF, REPLIES_AS_OF, TONIGHT_DATE, UNCONFIRMED, UNCONFIRMED_COVERS, coversWithReply, partiesWithReply, type ConfirmReply, type UnconfirmedParty } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { formatWholeCurrency } from "@/components/shared/format"
import { PanelShell, PanelHeader, PanelBody } from "@/components/shared"

// How each reply to Resy's follow-up shows on its row, in the sent view only.
const REPLY_STATUS: Record<ConfirmReply, { label: string; className: string; icon: typeof Check; note?: (p: UnconfirmedParty) => string }> = {
  confirmed: { label: "Confirmed", className: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400", icon: Check },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400", icon: X, note: (p) => `Resy alerted the Notify list for ${p.time}.` },
  none: { label: "No reply · call", className: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300", icon: Phone },
}

// The header line for each view: the book before the follow-up, the replies after.
const VIEW_SUBTITLE: Record<string, string> = {
  proposed: `${UNCONFIRMED.length} parties, ${UNCONFIRMED_COVERS} covers · Resy book as of ${BOOK_AS_OF}`,
  sent: `Replies as of ${REPLIES_AS_OF}`,
}

function CostStrip() {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <p className="text-xs font-semibold text-muted-foreground">October so far</p>
      <p className="mt-1 text-sm text-foreground tabular-nums">
        {MONTH_TO_DATE.noShows} no-show covers × {formatWholeCurrency(CARD_PER_COVER)} = {formatWholeCurrency(NO_SHOW_COST)}, less {formatWholeCurrency(FEES_CHARGED)} in fees charged in Resy
      </p>
      <p className="mt-1 text-base font-bold text-foreground tabular-nums">{formatWholeCurrency(NO_SHOW_NET)} net</p>
    </div>
  )
}

function ReplyChip({ party }: { party: UnconfirmedParty }) {
  const status = REPLY_STATUS[party.reply]
  const Icon = status.icon
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", status.className)}>
      <Icon className="size-3.5" />{status.label}
    </span>
  )
}

function ConfirmRow({ party, showReply }: { party: UnconfirmedParty; showReply: boolean }) {
  const note = REPLY_STATUS[party.reply].note
  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-sm font-semibold tabular-nums text-foreground">{party.time}</span>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{party.name}</p>
        <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground"><Users className="size-3.5" />{party.party}</span>
        <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">Booked {party.booked}</span>
        {showReply && <ReplyChip party={party} />}
      </div>
      {showReply && note && <p className="mt-1 pl-13 text-xs text-muted-foreground">{note(party)}</p>}
    </li>
  )
}

function ProposedCard() {
  const { handlePrompt, chatState } = useAskNanci()
  // Pressed once is enough: a second click, or a click while an answer streams, must
  // not send the turn again.
  const [pressed, setPressed] = useState(false)
  const send = () => {
    setPressed(true)
    handlePrompt(CONCEPT_FLOW28_SEND)
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-semibold text-foreground">Send Resy&apos;s confirmation follow-up to {UNCONFIRMED.length} parties for tonight.</p>
      <p className="mt-1 text-sm text-muted-foreground">Guests reply CONFIRM or CANCEL, and Resy updates each booking. Nothing is sent until you confirm.</p>
      <Button className="mt-3" size="sm" onClick={send} disabled={pressed || chatState !== "idle"}>Send</Button>
    </div>
  )
}

function SentSummary() {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300">
      <p className="text-sm font-semibold">Follow-up sent through Resy for {TONIGHT_DATE}.</p>
      <p className="mt-1 text-sm">
        {partiesWithReply("confirmed").length} confirmed ({coversWithReply("confirmed")} covers), {partiesWithReply("cancelled").length} cancelled, {partiesWithReply("none").length} to call.
      </p>
      <p className="mt-2 text-base font-bold tabular-nums">The book now reads {BOOK_AFTER.covers} covers, {BOOK_AFTER.parties} parties.</p>
    </div>
  )
}

export function ResyConfirmPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-confirm", "proposed")
  const isSent = view === "sent"

  return (
    <PanelShell>
      <PanelHeader
        title="Unconfirmed tonight"
        subtitle={VIEW_SUBTITLE[view]}
        size="lg"
        onClose={() => closeDynamicPanel("resy-confirm")}
      />

      <PanelBody className="space-y-4">
        <CostStrip />
        <div className="rounded-xl border">
          <ul className="divide-y">
            {UNCONFIRMED.map((p) => <ConfirmRow key={p.name} party={p} showReply={isSent} />)}
          </ul>
        </div>
        {isSent ? <SentSummary /> : <ProposedCard />}
      </PanelBody>
    </PanelShell>
  )
}
