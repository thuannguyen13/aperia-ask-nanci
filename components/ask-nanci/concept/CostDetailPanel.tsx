"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { HERO_ITEM, COMBO_COST_BREAKDOWN, COMBO_MENU_PRICE, COMBO_TOTAL_INGREDIENT_COST, COMBO_MARGIN } from "@/lib/ask-nanci/data/panels/menu-margin"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, PanelTable, Thead, Th, formatCurrency } from "@/components/shared"

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

      <PanelBody className="space-y-4">
        <NanciInsight>Three imported meats carry it. Prosciutto and mortadella together are 60% of the ingredient cost. The provolone and bread are minor. Nothing here is wrong — it&apos;s just an expensive sandwich to make.</NanciInsight>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Ingredient Cost per Sandwich</p>
          <PanelTable>
            <Thead>
              <Th>Ingredient</Th>
              <Th align="right">Cost</Th>
            </Thead>
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
          </PanelTable>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
