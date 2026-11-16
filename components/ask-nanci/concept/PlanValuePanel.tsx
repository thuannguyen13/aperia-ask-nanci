"use client"

import Image from "next/image"
import { Headset, Smartphone, Sparkles, Wifi } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CARRIER } from "@/lib/ask-nanci/data/carrier"
import {
  PLAN_VALUE_TITLE, PLAN_MONTHLY, PLAN_YEARLY, RENEWS_ON_DATE, YEAR_WITH_NANCI, PLAN_INCLUDES,
} from "@/lib/ask-nanci/data/panels/plan-value"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, SectionHeader, StatCard, PanelItem, formatWholeCurrency } from "@/components/shared"

const INCLUDE_ICONS = { lines: Smartphone, internet: Wifi, assistant: Sparkles, support: Headset }

// The year beside the plan's cost. A renewal request opens in its own panel underneath.
export function PlanValuePanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={PLAN_VALUE_TITLE} size="lg" onClose={() => closeDynamicPanel("plan-value")} />

      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>
          A year of Ask Nanci beside what your plan costs over the same 12 months.
        </NanciInsight>

        {/* The year and the plan side by side. Column flow on a four-row grid keeps the
            rows level across the two columns, so savings sit across from the yearly cost.
            On a phone the columns stack, the year first. */}
        <div className="grid gap-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[auto_repeat(3,1fr)]">
          <SectionHeader title="Your Year with Ask Nanci" className="mb-0" />
          <StatCard label="Supplier Price Increases Caught" value={YEAR_WITH_NANCI.priceIncreasesCaught} sublabel="Flagged from your supplier spend" />
          <StatCard label="Bill Questions Answered" value={YEAR_WITH_NANCI.billQuestionsAnswered} sublabel={`About your ${CARRIER.business} bill`} />
          <StatCard label="Estimated Savings" value={formatWholeCurrency(YEAR_WITH_NANCI.estimatedSavings)} sublabel="Only savings with a figure behind them" emphasis />
          <SectionHeader title="Your Plan" className="mb-0 max-sm:mt-2" />
          <StatCard label="Renews" value={RENEWS_ON_DATE} sublabel="Next month, for another 12 months" />
          <StatCard label="Monthly Cost" value={formatWholeCurrency(PLAN_MONTHLY)} sublabel="Lines, internet and Ask Nanci" />
          <StatCard label="Cost Over a Year" value={formatWholeCurrency(PLAN_YEARLY)} sublabel="12 months at the monthly cost" emphasis />
        </div>

        <div>
          <SectionHeader title="What Your Plan Includes" />
          <ul className="flex flex-col gap-2">
            {PLAN_INCLUDES.map((item) => (
              <li key={item.kind}>
                <PanelItem
                  icon={INCLUDE_ICONS[item.kind]}
                  media={item.kind === "assistant" ? <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} /> : undefined}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
