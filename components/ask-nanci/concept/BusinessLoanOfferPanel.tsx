"use client"

import { CheckCheck } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  LOAN_OFFERS, LOAN_APPLICANT, LOAN_INSIGHT_PRE, LOAN_INSIGHT_BOLD, LOAN_INSIGHT_POST, LOAN_PREFILL_NOTE,
  LOAN_REQUEST_REF, LOAN_SENT_TO, LOAN_SUBMITTED_TITLE, LOAN_SUCCESS_MESSAGE,
} from "@/lib/ask-nanci/data/panels/business-loan-offer"
import { PanelShell, PanelHeader, NanciInsight, Callout } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, OfferSelect, SectionLabel, StatStrip } from "./offer-shared"

const PANEL_ID = "business-loan-offer"

// ponytail: one offer, so no list step and no selection state — the panel opens on the form.
const offer = LOAN_OFFERS[0]

const loanStats = [
  { label: "Max Loan Amount", value: offer.maxAmount },
  { label: "Min Interest Rate", value: offer.minRate },
  { label: "Funds in", value: offer.fundsIn },
  { label: "Term Length", value: offer.termLength },
]

export function BusinessLoanOfferPanel() {
  const { closeDynamicPanel, submitOfferApplication } = useAskNanci()

  const submit = () => {
    submitOfferApplication(PANEL_ID, LOAN_SUCCESS_MESSAGE, {
      field: "Loan application",
      requestLabel: "Loan application",
      submittedTitle: LOAN_SUBMITTED_TITLE,
      product: offer.product,
      sentTo: LOAN_SENT_TO,
      reference: LOAN_REQUEST_REF,
      timestamp: "Today, 2:14 PM",
      status: "submitted",
    })
  }

  return (
    <PanelShell>
      <PanelHeader title="Business Loan Application" size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
        <NanciInsight>{LOAN_INSIGHT_PRE}<strong className="font-semibold">{LOAN_INSIGHT_BOLD}</strong>{LOAN_INSIGHT_POST}</NanciInsight>

        {/* The offer being applied for is the reason the panel opened — tinted, not a plain row. */}
        <div className="space-y-2 rounded-xl border border-blue-300 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <OfferLogo src={offer.logo} alt={offer.product} className="size-14" fallback={<BrandMonogram label={offer.mark} color={offer.color} />} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{offer.product}</p>
              <p className="text-xs text-muted-foreground">{offer.note}</p>
            </div>
          </div>
          <StatStrip stats={loanStats} className="bg-background" />
        </div>

        <Callout variant="green" className="flex items-start gap-2">
          <CheckCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong className="font-semibold">{LOAN_PREFILL_NOTE.title}</strong>
            <br />
            {LOAN_PREFILL_NOTE.body}
          </span>
        </Callout>

        <ApplicantFields applicant={LOAN_APPLICANT} />

        <div className="flex flex-col gap-3">
          <SectionLabel>Request Info</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OfferField label="Requested Amount" value={LOAN_APPLICANT.requestedAmount} />
            <OfferSelect label="Repayment Term" value={LOAN_APPLICANT.repaymentTerm} options={["6 months", "60 days", "90 days", "120 days"]} placeholder="Select term" />
            <OfferSelect label="Purpose" value={LOAN_APPLICANT.purpose} options={["Capital Funding", "Payroll", "Inventory", "Equipment", "Other"]} placeholder="Select purpose" />
            <OfferField label="Avg. Monthly Revenue" value={LOAN_APPLICANT.avgMonthlyRevenue} readOnly />
            <div className="sm:col-span-2">
              <OfferSelect label="Funding Account" value={LOAN_APPLICANT.fundingAccount} options={[LOAN_APPLICANT.fundingAccount]} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="loan-consent" />
          <Label htmlFor="loan-consent" className="text-xs text-foreground">I authorize a review of my business financials</Label>
        </div>

        <Button className="w-full" onClick={submit}>Submit Application</Button>
      </div>
    </PanelShell>
  )
}
