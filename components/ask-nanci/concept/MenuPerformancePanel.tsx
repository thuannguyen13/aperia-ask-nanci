"use client"

import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MENU_ITEMS, HERO_ITEM } from "@/lib/ask-nanci/data/panels/menu-margin"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

const hero = MENU_ITEMS.find((item) => item.name === HERO_ITEM)!
const topProfitItem = [...MENU_ITEMS].sort((a, b) => b.margin - a.margin)[0]
const heroMarginRank = [...MENU_ITEMS].sort((a, b) => b.margin - a.margin).findIndex((item) => item.name === HERO_ITEM) + 1
const heroTotalProfit = hero.unitsSold * hero.margin

const VOLUME_LEADER_CALLOUT = (
  <>The Italian combo is your volume leader — <span className="font-bold">{hero.unitsSold} sold</span>, {formatCurrency(hero.salesAmount)} in sales this month. It&apos;s the sandwich the shop runs on.</>
)

const MARGIN_REVEAL_CALLOUT = (
  <>
    <span className="font-bold">Sorted by margin per sandwich — but not by total profit</span>. {topProfitItem.name} earns the most per unit ({formatCurrency(topProfitItem.margin)}), while the Italian combo ranks {ordinal(heroMarginRank)} on margin ({formatCurrency(hero.margin)}). Even so, the combo&apos;s volume still makes it your top total earner at {formatCurrency(heroTotalProfit)}.
  </>
)

function ordinal(n: number) {
  return n === 1 ? "first" : n === 2 ? "second" : n === 3 ? "third" : n === 4 ? "fourth" : `${n}th`
}

function VolumeTable({ compact }: { compact?: boolean }) {
  const rows = [...MENU_ITEMS].sort((a, b) => b.unitsSold - a.unitsSold)
  return (
    <table className="w-full text-xs border-collapse overflow-hidden rounded-lg border">
      <thead>
        <tr className="border-b bg-muted/40">
          <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Product</th>
          <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Unit Sold</th>
          {!compact && <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Amount</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.name} className="border-b last:border-0">
            <td className="px-3 py-2 text-foreground">{item.name}</td>
            <td className="px-3 py-2 text-right font-mono text-foreground">{item.unitsSold}</td>
            {!compact && <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(item.salesAmount)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ProfitTable({ compact }: { compact?: boolean }) {
  const rows = [...MENU_ITEMS].sort((a, b) => b.margin - a.margin)
  return (
    <table className="w-full text-xs border-collapse overflow-hidden rounded-lg border">
      <thead>
        <tr className="border-b bg-muted/40">
          <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Product</th>
          {!compact && <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Unit Sold</th>}
          <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Margin</th>
          {!compact && <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Amount</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.name} className={item.name === HERO_ITEM ? "border-b bg-amber-50 last:border-0 dark:bg-amber-950/20" : "border-b last:border-0"}>
            <td className="px-3 py-2 text-foreground">{item.name}</td>
            {!compact && <td className="px-3 py-2 text-right font-mono text-foreground">{item.unitsSold}</td>}
            <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(item.margin)}</td>
            {!compact && <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(item.unitsSold * item.margin)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function MenuPerformancePanel() {
  const { closeDynamicPanel, menuMarginPhase } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Sales Performance"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("menu-performance")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>{menuMarginPhase === "margin" ? MARGIN_REVEAL_CALLOUT : VOLUME_LEADER_CALLOUT}</p>
          </div>
        </Callout>

        {menuMarginPhase === "volume" && (
          <div>
            <p className="mb-2 text-base font-bold text-foreground">Products by Volume</p>
            <VolumeTable />
          </div>
        )}

        {menuMarginPhase === "margin" && (
          <div>
            <p className="mb-2 text-base font-bold text-foreground">Products by Profit</p>
            <ProfitTable />
          </div>
        )}

        {menuMarginPhase === "compare" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="mb-2 text-base font-bold text-foreground">Products by Volume</p>
              <VolumeTable compact />
            </div>
            <div className="flex-1">
              <p className="mb-2 text-base font-bold text-foreground">Products by Profit</p>
              <ProfitTable compact />
            </div>
          </div>
        )}
      </div>
    </PanelShell>
  )
}
