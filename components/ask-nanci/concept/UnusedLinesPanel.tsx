"use client"

import { Check, Clock } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CARRIER } from "@/lib/ask-nanci/data/carrier"
import {
  UNUSED_LINES_TITLE, IDLE_DAYS, LINES, IDLE_LINES, CURRENT_PLAN, SUGGESTED_PLAN, MONTHLY_DIFFERENCE, YEARLY_DIFFERENCE, LINES_REQUEST, lastUsed,
} from "@/lib/ask-nanci/data/panels/unused-lines"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, SectionHeader, StatCard, Callout, PanelTable, Thead, Th, Td, formatWholeCurrency } from "@/components/shared"

// Views: "proposed" until the owner answers, then "requested" or "kept". The chat turn
// that answers sets the view, so the panel never asks for the same thing twice.
function Outcome({ view }: { view: string }) {
  if (view === "requested") {
    return (
      <Callout variant="amber" icon={Clock} title={`Request sent to ${CARRIER.business}`}>
        <p>Reference {LINES_REQUEST.reference}. Nothing on your account changes until they confirm.</p>
      </Callout>
    )
  }
  if (view === "kept") {
    return (
      <Callout variant="blue" icon={Check} title={`Keeping all ${LINES.length} lines`}>
        <p>Nothing was sent to {CARRIER.business}.</p>
      </Callout>
    )
  }
  return null
}

export function UnusedLinesPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("unused-lines", "proposed")

  return (
    <PanelShell>
      <PanelHeader title={UNUSED_LINES_TITLE} size="lg" onClose={() => closeDynamicPanel("unused-lines")} />

      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>
          {IDLE_LINES.length} of your {LINES.length} lines have had no calls, texts or data in {IDLE_DAYS} days. Dropping them would cost you{" "}
          <span className="font-bold">{formatWholeCurrency(MONTHLY_DIFFERENCE)} less a month</span>.
        </NanciInsight>

        <Outcome view={view} />

        <div>
          <SectionHeader title="Your lines" description={`Marked lines have had no use in ${IDLE_DAYS} days.`} />
          <PanelTable>
            <Thead>
              <Th>Line</Th>
              <Th>Last used</Th>
              <Th>Usage</Th>
            </Thead>
            <tbody>
              {LINES.map((line) => (
                <tr key={line.ending} className={line.idle ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                  <Td>
                    <p className="font-medium">{line.label}</p>
                    <p className="text-muted-foreground">Ending {line.ending}</p>
                  </Td>
                  <Td mono className={cn(line.idle && "text-amber-700 dark:text-amber-400")}>{lastUsed(line.daysSinceUse)}</Td>
                  <Td>
                    {line.idle ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {line.usageLabel}
                      </span>
                    ) : (
                      line.usageLabel
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        </div>

        <div>
          <SectionHeader title="Current and suggested plan" />
          {/* Three across fits the panel; on a phone the two plans share a row and the
              difference takes the width, as on Busiest Times. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
            <StatCard label={CURRENT_PLAN.name} value={`${formatWholeCurrency(CURRENT_PLAN.monthly)}/mo`} sublabel={`${CURRENT_PLAN.lines} lines`} />
            <StatCard label={SUGGESTED_PLAN.name} value={`${formatWholeCurrency(SUGGESTED_PLAN.monthly)}/mo`} sublabel={`${SUGGESTED_PLAN.lines} lines`} />
            <StatCard label="Difference" value={`${formatWholeCurrency(MONTHLY_DIFFERENCE)}/mo`} sublabel={`${formatWholeCurrency(YEARLY_DIFFERENCE)} a year`} emphasis />
          </div>
        </div>

      </PanelBody>
    </PanelShell>
  )
}
