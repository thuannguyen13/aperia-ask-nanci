"use client"

import { Badge } from "aperia-ds5"
import { CalendarCheck, Check, CheckCheck, Clock4, Phone, Users, X } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW28_SEND, isAwaitingFlow28Send } from "@/lib/ask-nanci/data/flows.concept"
import { CARD_PER_COVER, FEES_CHARGED, MONTH_TO_DATE, NO_SHOW_COST, NO_SHOW_NET } from "@/lib/ask-nanci/data/panels/resy-group"
import { BOOK_AFTER, BOOK_AS_OF, CONFIRM_TITLE, REPLIES_AS_OF, TONIGHT_DATE, UNCONFIRMED, coversWithReply, partiesWithReply, resyUpdatedAt, type ConfirmReply, type UnconfirmedParty } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { formatWholeCurrency } from "@/components/shared/format"
import { PanelShell, PanelHeader, PanelBody, PanelItem, StatCard, Callout } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

// How each reply to Resy's follow-up shows on its row, in the sent view only.
const REPLY_STATUS: Record<ConfirmReply, { label: string; variant: "default" | "destructive"; className?: string; icon: typeof Check; note?: (p: UnconfirmedParty) => string }> = {
  confirmed: { label: "Confirmed", variant: "default", className: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400", icon: Check },
  cancelled: { label: "Cancelled", variant: "destructive", icon: X, note: (p) => `Resy alerted the Notify list for ${p.time}.` },
  none: { label: "No reply · call", variant: "default", className: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300", icon: Phone },
}

// The book before the follow-up, the replies after.
const VIEW_AS_OF: Record<string, string> = { proposed: BOOK_AS_OF, sent: REPLIES_AS_OF }

function CostCard() {
  return (
    <StatCard
      size="lg"
      label="Month to Date"
      sublabel={`${MONTH_TO_DATE.noShows} no-show covers × ${formatWholeCurrency(CARD_PER_COVER)} = ${formatWholeCurrency(NO_SHOW_COST)}, less ${formatWholeCurrency(FEES_CHARGED)} in fees charged in Resy`}
      value={`${formatWholeCurrency(NO_SHOW_NET)} net`}
    />
  )
}

function ReplyStatus({ party }: { party: UnconfirmedParty }) {
  const status = REPLY_STATUS[party.reply]
  const Icon = status.icon
  return (
    <div className="flex min-w-0 flex-1 flex-col items-end gap-1 text-right">
      <Badge variant={status.variant} className={status.className}><Icon />{status.label}</Badge>
      {status.note && <p className="text-xs text-muted-foreground">{status.note(party)}</p>}
    </div>
  )
}

function ConfirmRow({ party, showReply }: { party: UnconfirmedParty; showReply: boolean }) {
  return (
    <li>
      <PanelItem icon={Clock4}>
        {/* Equal columns, as in the design: three before the follow-up, four after. */}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm leading-4 font-medium text-foreground">{party.name}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{party.time} PM</p>
        </div>
        <p className="hidden min-w-0 flex-1 self-center text-xs text-muted-foreground sm:block">Booked {party.booked}</p>
        <span className="flex min-w-0 flex-1 items-center gap-1 self-center text-xs tabular-nums text-foreground"><Users className="size-4 text-muted-foreground" />{party.party}</span>
        {showReply && <ReplyStatus party={party} />}
      </PanelItem>
    </li>
  )
}

function SentSummary() {
  return (
    <Callout variant="green" icon={CheckCheck} title={`Follow-up sent through Resy for ${TONIGHT_DATE}.`}>
      <p>{partiesWithReply("confirmed").length} confirmed ({coversWithReply("confirmed")} covers), {partiesWithReply("cancelled").length} cancelled, {partiesWithReply("none").length} to call.</p>
      <p className="text-base font-semibold text-green-700 tabular-nums dark:text-green-400">The book now reads {BOOK_AFTER.covers} covers, {BOOK_AFTER.parties} parties.</p>
    </Callout>
  )
}

export function ResyConfirmPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-confirm", "proposed")
  const isSent = view === "sent"

  return (
    <PanelShell>
      <PanelHeader
        title={CONFIRM_TITLE}
        subtitle={resyUpdatedAt(VIEW_AS_OF[view])}
        size="lg"
        onClose={() => closeDynamicPanel("resy-confirm")}
      />

      <PanelBody className="space-y-4">
        <CostCard />
        {isSent ? <SentSummary /> : (
          <ResyConfirmCard
            icon={CalendarCheck}
            title={`Send Resy's confirmation follow-up to ${UNCONFIRMED.length} parties for tonight.`}
            detail="Guests reply CONFIRM or CANCEL, and Resy updates each booking. Nothing is sent until you confirm."
            buttonLabel="Send"
            awaiting={isAwaitingFlow28Send}
            onConfirmTurn={CONCEPT_FLOW28_SEND}
          />
        )}
        <ul className="space-y-2">
          {UNCONFIRMED.map((p) => <ConfirmRow key={p.name} party={p} showReply={isSent} />)}
        </ul>
      </PanelBody>
    </PanelShell>
  )
}
