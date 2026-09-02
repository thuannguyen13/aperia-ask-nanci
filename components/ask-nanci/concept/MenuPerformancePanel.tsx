"use client"

import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { MENU_ITEMS, HERO_ITEM } from "@/lib/ask-nanci/data/panels/menu-margin"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, PanelTable, Thead, Th, formatCurrency } from "@/components/shared"

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
    <PanelTable>
      <Thead>
        <Th>Product</Th>
        <Th align="right">Unit Sold</Th>
        {!compact && <Th align="right">Amount</Th>}
      </Thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.name} className="border-b last:border-0">
            <td className="px-3 py-2 text-foreground">{item.name}</td>
            <td className="px-3 py-2 text-right font-mono text-foreground">{item.unitsSold}</td>
            {!compact && <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(item.salesAmount)}</td>}
          </tr>
        ))}
      </tbody>
    </PanelTable>
  )
}

function ProfitTable({ compact }: { compact?: boolean }) {
  const rows = [...MENU_ITEMS].sort((a, b) => b.margin - a.margin)
  return (
    <PanelTable>
      <Thead>
        <Th>Product</Th>
        {!compact && <Th align="right">Unit Sold</Th>}
        <Th align="right">Margin</Th>
        {!compact && <Th align="right">Amount</Th>}
      </Thead>
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
    </PanelTable>
  )
}

export function MenuPerformancePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("menu-performance", "volume")

  return (
    <PanelShell>
      <PanelHeader
        title="Sales Performance"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("menu-performance")}
      />

      <PanelBody className="space-y-4">
        <NanciInsight>{view ==="margin" ? MARGIN_REVEAL_CALLOUT : VOLUME_LEADER_CALLOUT}</NanciInsight>

        {view ==="volume" && (
          <div>
            <p className="mb-2 text-base font-bold text-foreground">Products by Volume</p>
            <VolumeTable />
          </div>
        )}

        {view ==="margin" && (
          <div>
            <p className="mb-2 text-base font-bold text-foreground">Products by Profit</p>
            <ProfitTable />
          </div>
        )}

        {view ==="compare" && (
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
      </PanelBody>
    </PanelShell>
  )
}
