"use client"

import { Alert, AlertDescription, Avatar, AvatarFallback, Badge } from "aperia-ds5"
import { CheckCheck, CircleAlert, User } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW30_TAG, isAwaitingFlow30Tag } from "@/lib/ask-nanci/data/flows.concept"
import { CARD_BRANDS, MONTH_TO_DATE } from "@/lib/ask-nanci/data/panels/resy-group"
import { GUEST, GUEST_TITLE, GUEST_UPDATE } from "@/lib/ask-nanci/data/panels/resy-guests"
import { PanelShell, PanelHeader, PanelBody, Callout, StatCard, formatWholeCurrency } from "@/components/shared"
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

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <p className="w-32 shrink-0 text-muted-foreground">{label}</p>
      <div className="min-w-0 flex-1 space-y-1 text-foreground">{children}</div>
    </div>
  )
}

function ProfileSummary({ updated }: { updated: boolean }) {
  const tags = updated ? [...GUEST.tags, GUEST_UPDATE.tag] : GUEST.tags
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-medium text-foreground">Profile Summary</p>
      <SummaryRow label="Tags">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => <Badge key={t} className={TAG_TONE[t]}>{t}</Badge>)}
        </div>
      </SummaryRow>
      <SummaryRow label="Note">
        <p>{GUEST.note}</p>
        {updated && <p>{GUEST_UPDATE.note} <span className="ml-1 text-xs text-muted-foreground">({GUEST_UPDATE.byline})</span></p>}
      </SummaryRow>
    </div>
  )
}

function Profile({ updated }: { updated: boolean }) {
  return (
    <div className="space-y-4 rounded-xl border p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Avatar size="lg"><AvatarFallback><User className="size-4" /></AvatarFallback></Avatar>
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground">{GUEST.name}</p>
          <p className="text-sm tabular-nums text-muted-foreground">Tonight {GUEST.time} · Party of {GUEST.party} · Booth {GUEST.booth}</p>
        </div>
      </div>
      <ProfileSummary updated={updated} />
      <div className="grid grid-cols-3 gap-3">
        <StatCard size="lg" label="Visits" sublabel={`First visit in ${GUEST.firstVisit}`} value={String(GUEST.flagship.visits)} />
        <StatCard size="lg" label="Avg. Spend" value={formatWholeCurrency(GUEST.flagship.averageSpend)} />
        <StatCard size="lg" label="Last Visit" value={GUEST.lastVisit} />
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">Paid with: Amex {GUEST.amexChecks} of {GUEST.matchedChecks} matched visits.</p>
        <p className="text-muted-foreground">Also {visitCount(GUEST.sister.visits)} at {GUEST.sister.venue}, {formatWholeCurrency(GUEST.sister.averageSpend)} average.</p>
        <p className="tabular-nums text-foreground">Lifetime spend across the group: {formatWholeCurrency(GUEST.lifetime)} ({lifetimeSplit()})</p>
      </div>
    </div>
  )
}

function CardStrip() {
  return (
    <Alert>
      <CircleAlert />
      <AlertDescription className="text-foreground tabular-nums">
        October card sales: Amex {CARD_BRANDS.amexSharePct}% ({formatWholeCurrency(CARD_BRANDS.amex.sales)} of {formatWholeCurrency(MONTH_TO_DATE.cardSales)}), average payment {formatWholeCurrency(CARD_BRANDS.amex.averagePayment)} vs {formatWholeCurrency(CARD_BRANDS.other.averagePayment)}.
      </AlertDescription>
    </Alert>
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
      <Callout variant="green" icon={CheckCheck} title={`Saved in Resy: the ${GUEST_UPDATE.tag} tag and the guest note.`}>
        <p>Visit note on tonight&apos;s {GUEST.time} booking: {GUEST_UPDATE.note}.</p>
        <p>{GUEST_UPDATE.byline}.</p>
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
      <PanelHeader title={GUEST_TITLE} size="lg" onClose={() => closeDynamicPanel("resy-guest")} />
      <PanelBody className="space-y-4">
        <Body />
        <CardStrip />
      </PanelBody>
    </PanelShell>
  )
}
