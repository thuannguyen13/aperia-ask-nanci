"use client"

import { Phone, Wifi, CheckCircle2, Clock } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  FIRST_LOCATION, NEW_LOCATION, FIRST_LOCATION_USE, COVERAGE, SUGGESTED_SETUP, SECOND_LOCATION_REQUEST,
} from "@/lib/ask-nanci/data/panels/second-location"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, StatCard, PanelItem, SectionHeader, Callout } from "@/components/shared"

const SETUP_ICONS = { lines: Phone, internet: Wifi } as const

// Carrier story 36. The map sits in the conversation; the panel is what the first
// location uses and the setup that follows from it. The chat drives the one view change,
// to "requested", so there is nothing here to click.
export function SecondLocationPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const requested = usePanelView("second-location", "setup") === "requested"

  return (
    <PanelShell>
      <PanelHeader
        title="Second Location"
        subtitle={NEW_LOCATION.address}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("second-location")}
      />

      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>
          Coverage at {NEW_LOCATION.short} supports the same service you have today. Start it with what {FIRST_LOCATION.name} settled on, not what it opened with.
        </NanciInsight>

        <div>
          <SectionHeader title={`What ${FIRST_LOCATION.name} uses`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
            <StatCard label="Lines in daily use" value={FIRST_LOCATION_USE.lines} sublabel="calls and texts" emphasis />
            <StatCard label="Internet" value={FIRST_LOCATION_USE.internet} sublabel="register and card payments" />
            <StatCard label="Opened with" value={`${FIRST_LOCATION_USE.openedWithLines} lines`} sublabel={`added one in month ${FIRST_LOCATION_USE.addedInMonth}`} />
          </div>
        </div>

        <div>
          <SectionHeader title={`Suggested setup for ${NEW_LOCATION.short}`} />
          <div className="flex flex-col gap-2">
            <PanelItem icon={CheckCircle2} iconClassName="text-green-600 dark:text-green-400">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{COVERAGE.status}</p>
                <p className="text-xs text-muted-foreground">{COVERAGE.detail}</p>
              </div>
            </PanelItem>
            {SUGGESTED_SETUP.map((s) => (
              <PanelItem key={s.kind} icon={SETUP_ICONS[s.kind]} iconClassName="text-primary">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.item}</p>
                  <p className="text-xs text-muted-foreground">{s.reason}</p>
                </div>
              </PanelItem>
            ))}
          </div>
        </div>

        {requested && (
          <Callout variant="amber" icon={Clock} title={`Request sent to ${SECOND_LOCATION_REQUEST.sentTo}`}>
            <p>Reference {SECOND_LOCATION_REQUEST.reference}. Nothing on your account changes until they confirm.</p>
          </Callout>
        )}

        <p className="text-xs text-muted-foreground">Example figures</p>
      </PanelBody>
    </PanelShell>
  )
}
