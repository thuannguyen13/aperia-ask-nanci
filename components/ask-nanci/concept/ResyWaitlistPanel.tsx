"use client"

import { Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { WAITING, WAITING_GUESTS, WAIT_SUMMARY, WAITLIST_AS_OF, WAITLIST_TITLE, resyUpdatedAt, type WaitParty } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { PanelShell, PanelHeader, PanelBody, PanelItem, StatCard, SectionHeader } from "@/components/shared"

function WaitSummary() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard size="lg" label="Joined" value={String(WAIT_SUMMARY.joined)} sublabel="since 5pm" />
        <StatCard size="lg" label="Seated" value={String(WAIT_SUMMARY.seated)} />
        <StatCard size="lg" label="Left" value={String(WAIT_SUMMARY.left)} sublabel="before seated" tone="amber" />
        <StatCard size="lg" label="Waiting" value={String(WAIT_SUMMARY.waiting)} />
      </div>
      <p className="mt-4 text-base text-muted-foreground">Seated parties waited {WAIT_SUMMARY.avgWaited} min on average against {WAIT_SUMMARY.avgQuoted} quoted.</p>
    </div>
  )
}

function WaitRow({ party }: { party: WaitParty }) {
  return (
    <li>
      <PanelItem icon={Users}>
        <div className="flex min-w-0 flex-1 items-center gap-2 self-stretch text-xs tabular-nums">
          <p className="min-w-0 flex-1 text-sm leading-4 font-medium text-foreground">Party of {party.party}</p>
          <div className="flex-1 space-y-1 text-right">
            <p className="text-muted-foreground">Quoted</p>
            <p className="text-foreground">{party.quoted}m</p>
          </div>
          <div className="flex-1 space-y-1 text-right">
            <p className="text-muted-foreground">Waited</p>
            <p className="font-semibold text-foreground">{party.waited}m</p>
          </div>
        </div>
      </PanelItem>
    </li>
  )
}

export function ResyWaitlistPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={WAITLIST_TITLE}
        subtitle={resyUpdatedAt(WAITLIST_AS_OF)}
        size="lg"
        onClose={() => closeDynamicPanel("resy-waitlist")}
      />

      <PanelBody className="space-y-4">
        <WaitSummary />
        <div>
          <SectionHeader title="Waiting Now" description={`${WAITING.length} parties, ${WAITING_GUESTS} guests`} />
          <ul className="space-y-2">
            {WAITING.map((p) => <WaitRow key={p.id} party={p} />)}
          </ul>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
