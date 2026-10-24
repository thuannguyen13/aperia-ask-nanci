"use client"

import { Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CARD_PER_COVER } from "@/lib/ask-nanci/data/panels/resy-group"
import { WAITING, WAITING_GUESTS, WAIT_SUMMARY, WAITLIST_AS_OF, WALKOUT_COVERS, WALKOUT_VALUE, type WaitParty } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { formatWholeCurrency } from "@/components/shared/format"
import { PanelShell, PanelHeader, PanelBody, StatCard, Callout } from "@/components/shared"

function WaitSummary() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Joined" value={String(WAIT_SUMMARY.joined)} sublabel="since 5pm" />
        <StatCard label="Seated" value={String(WAIT_SUMMARY.seated)} />
        <StatCard label="Left" value={String(WAIT_SUMMARY.left)} sublabel="before seated" tone="amber" />
        <StatCard label="Waiting" value={String(WAIT_SUMMARY.waiting)} emphasis />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Seated parties waited {WAIT_SUMMARY.avgWaited} min on average against {WAIT_SUMMARY.avgQuoted} quoted.</p>
    </div>
  )
}

function WaitRow({ party }: { party: WaitParty }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 text-sm">
      <span className="flex min-w-0 flex-1 items-center gap-1.5 font-medium text-foreground"><Users className="size-3.5 text-muted-foreground" />Party of {party.party}</span>
      <span className="w-20 shrink-0 text-right tabular-nums text-muted-foreground">Quoted {party.quoted}m</span>
      <span className="w-20 shrink-0 text-right font-semibold tabular-nums text-foreground">Waited {party.waited}m</span>
    </li>
  )
}

export function ResyWaitlistPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Walk-in waitlist"
        subtitle={`Live as of ${WAITLIST_AS_OF}`}
        size="lg"
        onClose={() => closeDynamicPanel("resy-waitlist")}
      />

      <PanelBody className="space-y-4">
        <WaitSummary />
        <div>
          <p className="mb-2 text-base font-bold text-foreground">Waiting now · {WAITING.length} parties, {WAITING_GUESTS} guests</p>
          <div className="rounded-xl border">
            <ul className="divide-y">
              {WAITING.map((p) => <WaitRow key={p.id} party={p} />)}
            </ul>
          </div>
        </div>
        <Callout variant="amber">
          {WAIT_SUMMARY.left} parties left, {WALKOUT_COVERS} covers. At {formatWholeCurrency(CARD_PER_COVER)} a cover that&apos;s {formatWholeCurrency(WALKOUT_VALUE)} walking out the door.
        </Callout>
      </PanelBody>
    </PanelShell>
  )
}
