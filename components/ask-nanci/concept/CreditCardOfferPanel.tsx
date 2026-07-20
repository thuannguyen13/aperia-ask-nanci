"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  CREDIT_CARD_OFFERS, CARD_APPLICANT, CARD_LIST_INSIGHT, CARD_REQUEST_REF, CARD_SUCCESS_MESSAGE,
  type CardOffer,
} from "@/lib/ask-nanci/data/panels/credit-card-offer"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, SectionLabel, StatStrip } from "./offer-shared"

const PANEL_ID = "credit-card-offer"

const cardStats = (c: CardOffer) => [
  { label: "Annual Fee", value: c.annualFee },
  { label: "Rewards Rate", value: c.rewardsRate },
  { label: "Intro Offer", value: c.introOffer },
  { label: "Approval Chance", value: c.approvalChance },
]

const cardLogo = (c: CardOffer) => (
  <OfferLogo src={c.logo} alt={c.name} className="h-9 w-14" fallback={<BrandMonogram label={c.mark} color={c.color} />} />
)

function OfferList({ onApply }: { onApply: (c: CardOffer) => void }) {
  return (
    <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
      <NanciInsight>{CARD_LIST_INSIGHT}</NanciInsight>
      {CREDIT_CARD_OFFERS.map((c) => (
        <div key={c.id} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center gap-3">
            {cardLogo(c)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">Best for {c.bestFor}</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0" onClick={() => onApply(c)}>
              Apply This <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <StatStrip stats={cardStats(c)} />
        </div>
      ))}
    </div>
  )
}

function ApplicationForm({ offer, onBack, onSubmit }: { offer: CardOffer; onBack: () => void; onSubmit: () => void }) {
  return (
    <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="size-3.5" /> Back
      </Button>

      <div className="space-y-2 rounded-xl border p-3">
        <div className="flex items-center gap-3">
          {cardLogo(offer)}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{offer.name}</p>
            <p className="truncate text-xs text-muted-foreground">Best for {offer.bestFor}</p>
          </div>
        </div>
        <StatStrip stats={cardStats(offer)} />
      </div>

      <ApplicantFields applicant={CARD_APPLICANT} />

      <div className="flex flex-col gap-3">
        <SectionLabel>Business Info</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OfferField label="Requested Credit Limit" value={CARD_APPLICANT.requestedLimit} />
          <OfferField label="Avg. Monthly Card Spend" value={CARD_APPLICANT.avgMonthlyCardSpend} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="cc-consent" />
        <Label htmlFor="cc-consent" className="text-xs text-foreground">I authorize a review of my business financials</Label>
      </div>

      <Button className="w-full" onClick={onSubmit}>Submit Application</Button>
    </div>
  )
}

export function CreditCardOfferPanel() {
  const { closeDynamicPanel, submitOfferApplication } = useAskNanci()
  const [selected, setSelected] = useState<CardOffer | null>(null)

  const submit = () => {
    if (!selected) return
    submitOfferApplication(PANEL_ID, CARD_SUCCESS_MESSAGE, {
      field: "Credit card application",
      requestLabel: "Credit card application",
      submittedTitle: "Credit Card Application Submitted",
      product: selected.name,
      sentTo: selected.name.replace(/ Business Card$/, ""), // "Silicon Valley Bank Business Card" → "Silicon Valley Bank"
      reference: CARD_REQUEST_REF,
      timestamp: "Today, 2:14 PM",
      status: "submitted",
    })
  }

  return (
    <PanelShell>
      <PanelHeader
        title={selected ? "Credit Card Application" : "Best Business Credit Cards of July 2026"}
        size="lg"
        actions={selected ? undefined : <PanelExportButton />}
        onClose={() => closeDynamicPanel(PANEL_ID)}
      />
      {selected
        ? <ApplicationForm offer={selected} onBack={() => setSelected(null)} onSubmit={submit} />
        : <OfferList onApply={setSelected} />}
    </PanelShell>
  )
}
