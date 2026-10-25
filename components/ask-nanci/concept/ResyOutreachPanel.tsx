"use client"

import { Mail } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW30_SEND, isAwaitingFlow30Send } from "@/lib/ask-nanci/data/flows.concept"
import { SEGMENT, TOP_FIVE, TOP_FIVE_TOTAL, THANK_YOU_EMAIL } from "@/lib/ask-nanci/data/panels/resy-guests"
import { PanelShell, PanelHeader, PanelBody, Callout, formatWholeCurrency } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const PROPOSAL = `Send this email from ${THANK_YOU_EMAIL.from} through Resy to ${SEGMENT.emailable} guests now.`
const WHAT_CHANGES = `What changes in Resy: the email goes to the ${SEGMENT.emailable} guests who opted into ${THANK_YOU_EMAIL.from}'s marketing email and shows in each one's message history. The ${SEGMENT.excluded} without email consent are left out. Nothing sends until you confirm.`

function SegmentCard() {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-base font-bold text-foreground">{SEGMENT.label}</p>
      <p className="mt-1 text-sm tabular-nums text-foreground">{SEGMENT.parties} parties · {SEGMENT.emailable} emailable · {SEGMENT.excluded} without email consent excluded.</p>
    </div>
  )
}

function SendConfirm() {
  return <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} awaiting={isAwaitingFlow30Send} onConfirmTurn={CONCEPT_FLOW30_SEND} />
}

function SendDone() {
  return (
    <Callout variant="green">
      <p className="font-semibold">Sent to {SEGMENT.emailable} guests</p>
      <p className="mt-1">From {THANK_YOU_EMAIL.from} through Resy. It shows in each guest&apos;s message history.</p>
    </Callout>
  )
}

function TopFive() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex items-baseline justify-between gap-3 border-b px-4 py-2.5 text-xs font-semibold text-muted-foreground">
        <span>Top five by lifetime spend</span>
        <span>Across the group</span>
      </div>
      <ol className="divide-y">
        {TOP_FIVE.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <span className="w-4 shrink-0 tabular-nums text-muted-foreground">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">{p.name}</span>
            <span className="shrink-0 tabular-nums text-foreground">{formatWholeCurrency(p.lifetime)}</span>
          </li>
        ))}
      </ol>
      <div className="flex justify-between border-t bg-muted/50 px-4 py-2.5 text-sm font-semibold tabular-nums text-foreground">
        <span>Total</span>
        <span>{formatWholeCurrency(TOP_FIVE_TOTAL)}</span>
      </div>
    </div>
  )
}

function EmailDraft() {
  return (
    <div className="rounded-xl border p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Mail className="size-3.5" />Draft email · from {THANK_YOU_EMAIL.from}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{THANK_YOU_EMAIL.subject}</p>
      <p className="mt-1 text-sm text-foreground">{THANK_YOU_EMAIL.body}</p>
    </div>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { proposed: SendConfirm, done: SendDone }

export function ResyOutreachPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-outreach", "proposed")
  const Body = VIEW_BODY[view] ?? SendConfirm

  return (
    <PanelShell>
      <PanelHeader title="Thank-you email" subtitle={`${SEGMENT.label} · Resy guestbook`} size="lg" onClose={() => closeDynamicPanel("resy-outreach")} />
      <PanelBody className="space-y-4">
        <SegmentCard />
        <Body />
        <TopFive />
        <EmailDraft />
      </PanelBody>
    </PanelShell>
  )
}
