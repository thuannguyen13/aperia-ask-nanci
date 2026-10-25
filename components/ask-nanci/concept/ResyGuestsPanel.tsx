"use client"

import { cn } from "aperia-ds5/utils"
import { CreditCard, Users } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW30_TAG, isAwaitingFlow30Tag } from "@/lib/ask-nanci/data/flows.concept"
import { CARD_BRANDS, MONTH_TO_DATE } from "@/lib/ask-nanci/data/panels/resy-group"
import { GUEST, GUEST_UPDATE } from "@/lib/ask-nanci/data/panels/resy-guests"
import { PanelShell, PanelHeader, PanelBody, Callout, formatWholeCurrency } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

// Tag chips share the tone classes the other Resy panels use for status pills.
const TAG_TONE: Record<string, string> = {
  Wine: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  [GUEST_UPDATE.tag]: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
}

const PROPOSAL = `Tag ${GUEST.name} as ${GUEST_UPDATE.tag} and add the guest note "${GUEST_UPDATE.note}".`
const WHAT_CHANGES = `What changes in Resy: the tag and the guest note go on his profile and show on every future booking, and the same note goes on tonight's ${GUEST.time} visit note. Nothing changes in Resy until you confirm.`

const visitCount = (n: number) => `${n} visit${n === 1 ? "" : "s"}`
const lifetimeSplit = () => `${formatWholeCurrency(GUEST.flagship.lifetime)} ${GUEST.flagship.venue} + ${formatWholeCurrency(GUEST.sister.lifetime)} ${GUEST.sister.venue}`

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function Note({ text, byline }: { text: string; byline?: string }) {
  return (
    <div className="border-l-2 border-amber-400 pl-2.5">
      <p className="text-sm text-foreground">{text}</p>
      {byline && <p className="text-xs text-muted-foreground">{byline}</p>}
    </div>
  )
}

function Profile({ updated }: { updated: boolean }) {
  const tags = updated ? [...GUEST.tags, GUEST_UPDATE.tag] : GUEST.tags
  return (
    <div className="rounded-xl border p-4">
      <p className="text-base font-bold text-foreground">{GUEST.name}</p>
      <p className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
        Tonight {GUEST.time} · <Users className="size-3.5" />Party of {GUEST.party} · Booth {GUEST.booth}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => <span key={t} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", TAG_TONE[t])}>{t}</span>)}
      </div>
      <div className="mt-3 space-y-2">
        <Note text={GUEST.note} />
        {updated && <Note text={GUEST_UPDATE.note} byline={GUEST_UPDATE.byline} />}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
        <Stat label="Visits" value={String(GUEST.flagship.visits)} />
        <Stat label="Avg spend" value={formatWholeCurrency(GUEST.flagship.averageSpend)} />
        <Stat label="Last visit" value={GUEST.lastVisit} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">First visit in {GUEST.firstVisit}</p>
      <p className="mt-3 flex items-center gap-1.5 border-t pt-3 text-sm font-medium text-foreground">
        <CreditCard className="size-4 text-muted-foreground" />Paid with: Amex {GUEST.amexChecks} of {GUEST.matchedChecks} matched visits.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">Also {visitCount(GUEST.sister.visits)} at {GUEST.sister.venue}, {formatWholeCurrency(GUEST.sister.averageSpend)} average.</p>
      <p className="mt-1 text-sm tabular-nums text-foreground">Lifetime spend across the group: <span className="font-semibold">{formatWholeCurrency(GUEST.lifetime)}</span> ({lifetimeSplit()})</p>
    </div>
  )
}

function CardStrip() {
  return (
    <p className="rounded-lg bg-muted px-3 py-2 text-xs tabular-nums text-muted-foreground">
      October card sales: Amex {CARD_BRANDS.amexSharePct}% ({formatWholeCurrency(CARD_BRANDS.amex.sales)} of {formatWholeCurrency(MONTH_TO_DATE.cardSales)}), average payment {formatWholeCurrency(CARD_BRANDS.amex.averagePayment)} vs {formatWholeCurrency(CARD_BRANDS.other.averagePayment)}.
    </p>
  )
}

function ProfileView() {
  return <Profile updated={false} />
}

// The confirm sits above the profile so a small phone shows it without scrolling.
function ProposedView() {
  return (
    <>
      <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} awaiting={isAwaitingFlow30Tag} onConfirmTurn={CONCEPT_FLOW30_TAG} />
      <Profile updated={false} />
    </>
  )
}

function DoneView() {
  return (
    <>
      <Callout variant="green">
        <p className="font-semibold">Saved in Resy: the {GUEST_UPDATE.tag} tag and the guest note.</p>
        <p className="mt-1">Visit note on tonight&apos;s {GUEST.time} booking: {GUEST_UPDATE.note}. {GUEST_UPDATE.byline}.</p>
      </Callout>
      <Profile updated />
    </>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { profile: ProfileView, proposed: ProposedView, done: DoneView }

export function ResyGuestsPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-guest", "profile")
  const Body = VIEW_BODY[view] ?? ProfileView

  return (
    <PanelShell>
      <PanelHeader title="Guest profile" subtitle="Resy guestbook · card payments matched through your POS" size="lg" onClose={() => closeDynamicPanel("resy-guest")} />
      <PanelBody className="space-y-4">
        <Body />
        <CardStrip />
      </PanelBody>
    </PanelShell>
  )
}
