"use client"

import { CheckCheck } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  CREDIT_CARD_OFFERS, CARD_APPLICANT, CARD_INSIGHT_LEAD, CARD_INSIGHT_BODY, CARD_PREFILL_NOTE,
  CARD_REQUEST_REF, CARD_SENT_TO, CARD_SUCCESS_MESSAGE,
} from "@/lib/ask-nanci/data/panels/credit-card-offer"
import { PanelShell, PanelHeader, NanciInsight, Callout } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, SectionLabel, StatStrip } from "./offer-shared"

const PANEL_ID = "credit-card-offer"

// ponytail: one offer, so no list step and no selection state — the panel opens on the form.
const offer = CREDIT_CARD_OFFERS[0]

const cardStats = [
  { label: "Annual Fee", value: offer.annualFee },
  { label: "Rewards Rate", value: offer.rewardsRate },
  { label: "Intro Offer", value: offer.introOffer },
]

export function CreditCardOfferPanel() {
  const { closeDynamicPanel, submitOfferApplication } = useAskNanci()

  const submit = () => {
    submitOfferApplication(PANEL_ID, CARD_SUCCESS_MESSAGE, {
      field: "Credit card application",
      requestLabel: "Credit card application",
      submittedTitle: "Credit Card Application Submitted",
      product: offer.name,
      sentTo: CARD_SENT_TO,
      reference: CARD_REQUEST_REF,
      timestamp: "Today, 2:14 PM",
      status: "submitted",
    })
  }

  return (
    <PanelShell>
      <PanelHeader title="Credit Card Application" size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
        <NanciInsight><strong className="font-semibold">{CARD_INSIGHT_LEAD}</strong>{CARD_INSIGHT_BODY}</NanciInsight>

        {/* The offer being applied for is the reason the panel opened — tinted, not a plain row. */}
        <div className="space-y-2 rounded-xl border border-blue-300 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <OfferLogo src={offer.logo} alt={offer.name} className="h-14 w-24" fallback={<BrandMonogram label={offer.mark} color={offer.color} />} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{offer.name}</p>
              <p className="truncate text-xs text-muted-foreground">Best for {offer.bestFor}</p>
            </div>
          </div>
          <StatStrip stats={cardStats} className="bg-background" />
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
            <OfferField label="Requested Credit Limit" value={CARD_APPLICANT.requestedLimit} />
            <OfferField label="Avg. Monthly Card Spend" value={CARD_APPLICANT.avgMonthlyCardSpend} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="cc-consent" />
          <Label htmlFor="cc-consent" className="text-xs text-foreground">I authorize a review of my business financials</Label>
        </div>

        <Button className="w-full" onClick={submit}>Submit Application</Button>
      </div>
    </PanelShell>
  )
}
