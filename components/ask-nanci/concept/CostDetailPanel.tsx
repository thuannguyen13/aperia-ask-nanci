"use client"

import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { HERO_ITEM, COMBO_COST_BREAKDOWN, COMBO_MENU_PRICE, COMBO_TOTAL_INGREDIENT_COST, COMBO_MARGIN } from "@/lib/ask-nanci/data/panels/menu-margin"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function CostDetailPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`${HERO_ITEM} · Cost Details`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("menu-cost-detail")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>Three imported meats carry it. Prosciutto and mortadella together are 60% of the ingredient cost. The provolone and bread are minor. Nothing here is wrong — it&apos;s just an expensive sandwich to build.</p>
          </div>
        </Callout>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Ingredient Cost per Sandwich</p>
          <table className="w-full text-xs border-collapse overflow-hidden rounded-lg border">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Ingredient</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Cost</th>
              </tr>
            </thead>
            <tbody>
              {COMBO_COST_BREAKDOWN.map((row) => (
                <tr key={row.ingredient} className="border-b last:border-0">
                  <td className="px-3 py-2 text-foreground">{row.ingredient}</td>
                  <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(row.cost)}</td>
                </tr>
              ))}
              <tr className="border-b bg-muted/20">
                <td className="px-3 py-2 text-foreground">Menu Price</td>
                <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(COMBO_MENU_PRICE)}</td>
              </tr>
              <tr className="border-b bg-muted/20">
                <td className="px-3 py-2 text-foreground">Total Ingredient Cost</td>
                <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(COMBO_TOTAL_INGREDIENT_COST)}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-foreground">Margin per Sandwich</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-foreground">{formatCurrency(COMBO_MARGIN)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PanelShell>
  )
}
