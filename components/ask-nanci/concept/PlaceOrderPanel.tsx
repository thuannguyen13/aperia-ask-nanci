"use client"

import { CircleCheck, CreditCard, Repeat } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { Button } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  ORDER_LINES, CAN_WAIT, SUPPLIER_ORDERS, ORDER_TOTAL, PAYMENT, ORDER_APPROVE, ORDER_COPY,
} from "@/lib/ask-nanci/data/panels/reorder"
import {
  PanelShell, PanelHeader, PanelBody, Callout, NanciInsight, PanelTable, Thead, Th, Td,
} from "@/components/shared"

const PANEL_ID = "place-order"

// Guided Form + Confirm shape: a draft the merchant reviews, one explicit commit, then a
// distinct success state. Paying is money movement, so the only way to approve is the
// button here — the chat deliberately offers no Approve pill (design rule 4).
//
// The button sends ORDER_APPROVE through handlePrompt, which is the flow's pending user
// turn, so the click lands in the chat as the merchant's reply and the script carries on
// from there. One action, one source of truth for both surfaces.
//
// Views: "draft" (default) → "placed" → "auto", driven by the script's `view` field.
export function PlaceOrderPanel() {
  const { closeDynamicPanel, handlePrompt } = useAskNanci()
  const view = usePanelView(PANEL_ID, "draft")
  const draft = view === "draft"

  return (
    <PanelShell>
      <PanelHeader
        title={draft ? ORDER_COPY.draftTitle : ORDER_COPY.placedTitle}
        size="lg"
        onClose={() => closeDynamicPanel(PANEL_ID)}
      />

      <PanelBody className="flex flex-col gap-5">
        {view === "auto" && (
          <Callout variant="blue" className="flex gap-3">
            <Repeat className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">{ORDER_COPY.autoTitle}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {ORDER_COPY.autoRules.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </Callout>
        )}

        {draft ? (
          <NanciInsight>{ORDER_COPY.insight}</NanciInsight>
        ) : (
          <Callout variant="green" className="flex gap-3">
            <CircleCheck className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">{ORDER_COPY.placedTitleLine}</p>
              <p className="mt-0.5">{ORDER_COPY.placedDetail}</p>
            </div>
          </Callout>
        )}

        <section>
          <SectionHeading>{draft ? "Draft Order" : "Your Order"}</SectionHeading>
          <PanelTable density="comfortable" pinFirst>
            <Thead>
              <Th>Item</Th>
              {draft && <Th align="right">Days Left</Th>}
              <Th align="right">Order</Th>
              <Th align="right">Cost</Th>
              {!draft && <Th align="right">After Delivery</Th>}
            </Thead>
            <tbody>
              {ORDER_LINES.map((l) => (
                <tr key={l.name}>
                  <Td>{l.name}</Td>
                  {draft && (
                    <Td align="right" className={cn(l.critical && "font-medium text-amber-700 dark:text-amber-400")}>{l.daysLeft}</Td>
                  )}
                  <Td align="right">{l.quantity}</Td>
                  <Td align="right">{l.cost}</Td>
                  {!draft && <Td align="right" className="font-medium text-green-700 dark:text-green-400">{l.daysAfter}</Td>}
                </tr>
              ))}
            </tbody>
          </PanelTable>
        </section>

        <section>
          <SectionHeading>Suppliers</SectionHeading>
          <div className="flex flex-col gap-2">
            {SUPPLIER_ORDERS.map((s) => (
              // Stacked on a phone: the times never wrap (the guide keeps a time on one
              // line), so side by side they squeezed the supplier name into two lines.
              <div key={s.name} className="flex flex-col gap-1 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.summary}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="whitespace-nowrap text-[13px] font-medium text-foreground">{s.delivers}</p>
                  <p className="whitespace-nowrap text-xs text-muted-foreground">{draft ? s.cutoff : s.orderRef}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {draft && (
          <>
            <section>
              <SectionHeading>Can Wait</SectionHeading>
              <p className="-mt-1 mb-2 text-sm text-foreground">{ORDER_COPY.canWaitNote}</p>
              <PanelTable density="comfortable" pinFirst>
                <Thead>
                  <Th>Item</Th>
                  <Th align="right">Days Left</Th>
                  <Th align="right">Runs Out</Th>
                </Thead>
                <tbody>
                  {CAN_WAIT.map((i) => (
                    <tr key={i.name}>
                      <Td>{i.name}</Td>
                      <Td align="right">{i.daysLeft}</Td>
                      <Td align="right">{i.runsOut}</Td>
                    </tr>
                  ))}
                </tbody>
              </PanelTable>
            </section>

            <section>
              <SectionHeading>Pay with</SectionHeading>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="size-5 text-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{PAYMENT.card}</p>
                  <p className="text-xs text-muted-foreground">{PAYMENT.detail}</p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">{PAYMENT.limit}</p>
              </div>
            </section>

            <div className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{ORDER_TOTAL}</span>
            </div>

            <Button className="w-full" onClick={() => handlePrompt(ORDER_APPROVE)}>{ORDER_APPROVE}</Button>
          </>
        )}
      </PanelBody>
    </PanelShell>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-base font-semibold text-foreground">{children}</p>
}
