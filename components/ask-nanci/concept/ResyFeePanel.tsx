"use client"

import { cn } from "aperia-ds5/utils"
import { FileText, Users } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW31_CHARGE, isAwaitingFlow31Charge } from "@/lib/ask-nanci/data/flows.concept"
import { FEE_POLICY } from "@/lib/ask-nanci/data/panels/resy-group"
import { NO_SHOW_BOOKING, NO_SHOW_FEE, FEES_AFTER_CHARGE, EVIDENCE_TIMELINE } from "@/lib/ask-nanci/data/panels/resy-deposits"
import { PanelShell, PanelHeader, PanelBody, Callout, formatWholeCurrency } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const FEE = formatWholeCurrency(NO_SHOW_FEE)
const PROPOSAL = `Charge ${FEE} to the ${NO_SHOW_BOOKING.guest}s' card on file in Resy. It will show as charged by you, through Ask Nanci.`
const WHAT_CHANGES = `What changes in Resy: Resy charges ${FEE} to the card on file. It pays out through your Stripe account. Nothing changes until you confirm.`
const POLICY = `${formatWholeCurrency(FEE_POLICY.perGuest)} per guest no-show fee, cancel by ${FEE_POLICY.cancelByHours} hours before`

const STATUS = {
  eligible: { text: "Eligible, not charged.", tone: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300" },
  charged: { text: `Charged ${FEE}`, tone: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
}

function Booking({ status }: { status: keyof typeof STATUS }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-base font-bold text-foreground">{NO_SHOW_BOOKING.guest} party</p>
      <p className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
        {NO_SHOW_BOOKING.date}, {NO_SHOW_BOOKING.time} · <Users className="size-3.5" />Party of {NO_SHOW_BOOKING.party} · Table {NO_SHOW_BOOKING.table}
      </p>
      <p className="mt-3 text-sm text-foreground">Policy: {POLICY}.</p>
      <span className={cn("mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS[status].tone)}>{STATUS[status].text}</span>
    </div>
  )
}

// The confirm sits directly under the header so a small phone shows it without scrolling.
function ProposedView() {
  return (
    <>
      <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} buttonLabel="Charge" awaiting={isAwaitingFlow31Charge} onConfirmTurn={CONCEPT_FLOW31_CHARGE} />
      <Booking status="eligible" />
    </>
  )
}

function ChargedView() {
  return (
    <>
      <Callout variant="green">
        <p className="font-semibold">Charged {FEE}</p>
        <p className="mt-1">Charged by you via Ask Nanci. Shows as charged on Resy&apos;s Xcl/No Show list.</p>
        <p className="mt-1">It pays out through your Stripe account, not your card deposits.</p>
      </Callout>
      <Booking status="charged" />
      <p className="rounded-lg bg-muted px-3 py-2 text-xs tabular-nums text-muted-foreground">October no-show fees: {formatWholeCurrency(FEES_AFTER_CHARGE)}</p>
    </>
  )
}

function EvidenceView() {
  return (
    <>
      <div className="rounded-xl border p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><FileText className="size-4 text-muted-foreground" />Evidence pack</p>
        <ol className="mt-3 space-y-2.5 border-l-2 border-muted pl-3">
          {EVIDENCE_TIMELINE.map((s) => (
            <li key={s.at} className="text-sm">
              <p className="text-xs tabular-nums text-muted-foreground">{s.label}</p>
              <p className="text-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <Callout variant="blue">
        <p className="font-semibold">Evidence pack ready · upload it in Stripe if a dispute arrives.</p>
        <p className="mt-1">A dispute on this charge arrives in your Stripe account, not your card processing.</p>
      </Callout>
    </>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { proposed: ProposedView, charged: ChargedView, evidence: EvidenceView }

export function ResyFeePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-fee", "proposed")
  const Body = VIEW_BODY[view] ?? ProposedView

  return (
    <PanelShell>
      <PanelHeader title="No-show fee" subtitle="Resy reservations · pays out through your Stripe account" size="lg" onClose={() => closeDynamicPanel("resy-fee")} />
      <PanelBody className="space-y-4">
        <Body />
      </PanelBody>
    </PanelShell>
  )
}
