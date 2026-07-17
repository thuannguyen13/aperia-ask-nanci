"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  LOAN_OFFERS, LOAN_APPLICANT, LOAN_LIST_INSIGHT, LOAN_REQUEST_REF, LOAN_SENT_TO, LOAN_SUCCESS_MESSAGE,
  type LoanOffer,
} from "@/lib/ask-nanci/data/panels/business-loan-offer"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, OfferSelect, SectionLabel, StatStrip } from "./offer-shared"

const PANEL_ID = "business-loan-offer"

const loanStats = (l: LoanOffer) => [
  { label: "Max Loan Amount", value: l.maxAmount },
  { label: "Min Interest Rate", value: l.minRate },
  { label: "Funds in", value: l.fundsIn },
  { label: "Term Length", value: l.termLength },
]

const lenderLogo = (l: LoanOffer) => (
  <OfferLogo src={l.logo} alt={l.product} className="size-10" fallback={<BrandMonogram label={l.mark} color={l.color} />} />
)

function OfferList({ onApply }: { onApply: (l: LoanOffer) => void }) {
  return (
    <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
      <NanciInsight>{LOAN_LIST_INSIGHT}</NanciInsight>
      {LOAN_OFFERS.map((l) => (
        <div key={l.id} className="space-y-2 rounded-xl border p-3">
          <div className="flex items-center gap-3">
            {lenderLogo(l)}
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{l.product}</p>
            <Button size="sm" variant="secondary" className="shrink-0" onClick={() => onApply(l)}>
              See Loan Options <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <StatStrip stats={loanStats(l)} />
        </div>
      ))}
    </div>
  )
}

function ApplicationForm({ offer, onBack, onSubmit }: { offer: LoanOffer; onBack: () => void; onSubmit: () => void }) {
  return (
    <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back
      </button>

      <div className="space-y-2 rounded-xl border p-3">
        <div className="flex items-center gap-3">
          {lenderLogo(offer)}
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{offer.product}</p>
        </div>
        <StatStrip stats={loanStats(offer)} />
      </div>

      <ApplicantFields applicant={LOAN_APPLICANT} />

      <div className="flex flex-col gap-3">
        <SectionLabel>Loan Details</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OfferField label="Requested Amount" value={LOAN_APPLICANT.requestedAmount} />
          <OfferSelect label="Repayment Term" value={LOAN_APPLICANT.repaymentTerm} options={["6 months", "60 days", "90 days", "120 days"]} />
          <OfferSelect label="Purpose" value={LOAN_APPLICANT.purpose} options={["Capital Funding", "Payroll", "Inventory", "Equipment", "Other"]} />
          <OfferField label="Avg. Monthly Revenue" value={LOAN_APPLICANT.avgMonthlyRevenue} />
          <OfferSelect label="Funding Account" value={LOAN_APPLICANT.fundingAccount} options={[LOAN_APPLICANT.fundingAccount]} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="loan-consent" defaultChecked />
        <Label htmlFor="loan-consent" className="text-xs text-foreground">I authorize a review of my business financials</Label>
      </div>

      <Button className="w-full" onClick={onSubmit}>Submit Application</Button>
    </div>
  )
}

export function BusinessLoanOfferPanel() {
  const { closeDynamicPanel, submitOfferApplication } = useAskNanci()
  const [selected, setSelected] = useState<LoanOffer | null>(null)

  const submit = () => {
    if (!selected) return
    submitOfferApplication(PANEL_ID, LOAN_SUCCESS_MESSAGE, {
      field: "Loan request",
      requestLabel: "Loan request",
      product: selected.product,
      sentTo: LOAN_SENT_TO,
      reference: LOAN_REQUEST_REF,
      timestamp: "Today, 2:14 PM",
      status: "submitted",
    })
  }

  return (
    <PanelShell>
      <PanelHeader
        title={selected ? selected.product : "Best Small Business Loans of July 2026"}
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
