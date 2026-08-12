"use client"

import { CheckCheck } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  CREDIT_CARD_OFFERS, getCardBrand, CARD_APPLICANT, CARD_EMPLOYEE_CARD_OPTIONS, CARD_VALUE, CARD_FEES, CARD_FEES_TITLE,
  CARD_INSIGHT_LEAD, CARD_INSIGHT_BODY, CARD_INSIGHT_OFFER_PRE, CARD_INSIGHT_OFFER_BOLD, CARD_INSIGHT_OFFER_POST,
  CARD_PREFILL_NOTE, CARD_CONSENT, CARD_REQUEST_REF, CARD_SUCCESS_MESSAGE, CARD_VERIFY,
} from "@/lib/ask-nanci/data/panels/credit-card-offer"
import { PanelShell, PanelHeader, NanciInsight, Callout, formatWholeCurrency } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, OfferSelect, OfferVerifyStep, SectionLabel, StatStrip } from "./offer-shared"

const PANEL_ID = "credit-card-offer"

// ponytail: one offer, so no list step and no selection state. The terms are fixed;
// only the issuer identity varies, and that comes from getCardBrand at render.
const offer = CREDIT_CARD_OFFERS[0]

const cardStats = [
  { label: "Annual fee", value: offer.annualFee },
  { label: "Cash back", value: offer.rewardsRate },
  { label: "Intro offer", value: offer.introOffer },
  { label: "Purchase APR", value: offer.purchaseApr },
]

// Derived from the spend and rate, so the monthly figure and the first-year total
// can never disagree with each other.
const monthlyBack = CARD_VALUE.monthlySpend * CARD_VALUE.rate
const firstYearValue = monthlyBack * 12 + CARD_VALUE.introBonus

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

export function CreditCardOfferPanel() {
  const { closeDynamicPanel, submitOfferApplication, setPanelView, genericBrand } = useAskNanci()
  const brand = getCardBrand(genericBrand)
  // Opens on the step-up gate; Confirm swaps to the offer itself. Default view rather
  // than a `view` field on the turn, so every entry point to this panel is gated, not
  // just the one the flow happens to use.
  const view = usePanelView(PANEL_ID, "verify")

  const submit = () => {
    submitOfferApplication(PANEL_ID, CARD_SUCCESS_MESSAGE, {
      field: "Credit card application",
      requestLabel: "Credit card application",
      submittedTitle: "Credit Card Application Submitted",
      product: brand.name,
      sentTo: brand.sentTo,
      reference: CARD_REQUEST_REF,
      timestamp: "Today, 2:14 PM",
      status: "submitted",
    })
  }

  if (view === "verify") {
    return (
      <PanelShell>
        <PanelHeader title={CARD_VERIFY.title} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
        <OfferVerifyStep
          body={CARD_VERIFY.body}
          email={CARD_APPLICANT.email}
          onConfirm={() => setPanelView(PANEL_ID, "offer")}
        />
      </PanelShell>
    )
  }

  return (
    <PanelShell>
      <PanelHeader title="Credit Card Application" size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
        <NanciInsight>
          <span className="block">
            <strong className="font-semibold">{CARD_INSIGHT_LEAD}</strong>{CARD_INSIGHT_BODY}
          </span>
          <span className="mt-2 block">
            {CARD_INSIGHT_OFFER_PRE}<strong className="font-semibold">{CARD_INSIGHT_OFFER_BOLD}</strong>{CARD_INSIGHT_OFFER_POST}
          </span>
        </NanciInsight>

        {/* The offer being applied for is the reason the panel opened — tinted, not a plain row. */}
        <div className="space-y-2 rounded-xl border border-blue-300 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <OfferLogo src={brand.logo} alt={brand.name} className="h-14 w-24" fallback={<BrandMonogram label={brand.mark} color={brand.color} />} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{brand.name}</p>
              <p className="text-xs text-muted-foreground">{offer.bestFor}</p>
            </div>
          </div>
          <StatStrip stats={cardStats} className="bg-background" />
        </div>

        {/* The reason to switch, in dollars — before the form, not after approval. */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{CARD_VALUE.title}</p>
          <ValueRow label={`${CARD_VALUE.vendor} spend, monthly`} value={formatWholeCurrency(CARD_VALUE.monthlySpend)} />
          <ValueRow label={`Cash back at ${offer.rewardsRate}`} value={`${formatWholeCurrency(monthlyBack)}/mo`} />
          <ValueRow label={`Intro bonus (${CARD_VALUE.introThreshold})`} value={formatWholeCurrency(CARD_VALUE.introBonus)} />
          <div className="mt-2 flex items-center justify-between gap-4 border-t pt-3">
            <span className="text-sm font-semibold text-foreground">Estimated first-year value</span>
            <span className="text-sm font-semibold text-foreground">{formatWholeCurrency(firstYearValue)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">{CARD_VALUE.caveat}</p>
        </div>

        <Callout variant="green" className="flex items-start gap-2">
          <CheckCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong className="font-semibold">{CARD_PREFILL_NOTE.title}</strong>
            <br />
            {CARD_PREFILL_NOTE.body}
          </span>
        </Callout>

        <ApplicantFields applicant={CARD_APPLICANT} />

        <div className="flex flex-col gap-3">
          <SectionLabel>Request Info</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OfferField label="Requested Credit Limit" value={CARD_APPLICANT.requestedLimit} hint={CARD_APPLICANT.requestedLimitHint} />
            <OfferField label="Avg. Monthly Card Spend" value={CARD_APPLICANT.avgMonthlyCardSpend} hint={CARD_APPLICANT.avgMonthlyCardSpendHint} />
            <div className="sm:col-span-2">
              <OfferSelect label="Employee Cards" value={CARD_APPLICANT.employeeCards} options={CARD_EMPLOYEE_CARD_OPTIONS} />
            </div>
          </div>
        </div>

        {/* Disclosures before the application, not buried in a follow-up email. */}
        <div className="overflow-hidden rounded-xl border">
          <p className="border-b bg-muted/40 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{CARD_FEES_TITLE}</p>
          <dl className="px-4 py-1">
            {CARD_FEES.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-4 border-b py-2 text-xs last:border-0">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="text-right font-medium text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="cc-consent" className="mt-0.5" />
          <Label htmlFor="cc-consent" className="text-xs font-normal leading-relaxed text-foreground">{CARD_CONSENT}</Label>
        </div>

        <Button className="w-full" onClick={submit}>Submit Application</Button>
      </div>
    </PanelShell>
  )
}
