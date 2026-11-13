"use client"

import { Clock, Headset, Smartphone, Sparkles, Wifi } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CARRIER } from "@/lib/ask-nanci/data/carrier"
import {
  PLAN_VALUE_TITLE, PLAN_MONTHLY, PLAN_YEARLY, RENEWS_ON, YEAR_WITH_NANCI, PLAN_INCLUDES, RENEWAL_REQUEST,
} from "@/lib/ask-nanci/data/panels/plan-value"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, SectionHeader, StatCard, Callout, PanelItem, formatWholeCurrency } from "@/components/shared"

const INCLUDE_ICONS = { lines: Smartphone, internet: Wifi, assistant: Sparkles, support: Headset }

// Views: "summary" until the owner answers, then "renewal-requested" once the renewal
// goes to the carrier. The chat turn that sends it sets the view.
export function PlanValuePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("plan-value", "summary")

  return (
    <PanelShell>
      <PanelHeader title={PLAN_VALUE_TITLE} size="lg" onClose={() => closeDynamicPanel("plan-value")} />

      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>
          Here is the year I can measure, beside what your plan costs over the same 12 months.
        </NanciInsight>

        {view === "renewal-requested" && (
          <Callout variant="amber" icon={Clock} title={`Renewal request sent to ${CARRIER.business}`}>
            <p>Reference {RENEWAL_REQUEST.reference}. Nothing on your account changes until they confirm.</p>
          </Callout>
        )}

        {/* The year and the plan side by side. Column flow on a four-row grid keeps the
            rows level across the two columns, so savings sit across from the yearly cost.
            On a phone the columns stack, the year first. */}
        <div className="grid gap-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[auto_repeat(3,1fr)]">
          <SectionHeader title="Your year with Ask Nanci" className="mb-0" />
          <StatCard label="Supplier price increases caught" value={YEAR_WITH_NANCI.priceIncreasesCaught} sublabel="Flagged from your supplier spend" />
          <StatCard label="Bill questions answered" value={YEAR_WITH_NANCI.billQuestionsAnswered} sublabel={`About your ${CARRIER.business} bill`} />
          <StatCard label="Estimated savings" value={formatWholeCurrency(YEAR_WITH_NANCI.estimatedSavings)} sublabel="Only savings with a figure behind them" emphasis />
          <SectionHeader title="Your plan" className="mb-0 max-sm:mt-2" />
          <StatCard label="Renews" value={`On ${RENEWS_ON}`} sublabel="Next month, for another 12 months" />
          <StatCard label="Monthly cost" value={formatWholeCurrency(PLAN_MONTHLY)} sublabel="Lines and internet together" />
          <StatCard label="Cost over a year" value={formatWholeCurrency(PLAN_YEARLY)} sublabel="12 months at the monthly cost" emphasis />
        </div>

        <div>
          <SectionHeader title="What your plan includes" />
          <ul className="flex flex-col gap-2">
            {PLAN_INCLUDES.map((item) => (
              <li key={item.kind}>
                <PanelItem icon={INCLUDE_ICONS[item.kind]}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">Example figures</p>
      </PanelBody>
    </PanelShell>
  )
}
