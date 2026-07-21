"use client"

import { CheckCheck } from "lucide-react"
import { Button, Checkbox, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  LOAN_OFFERS, LOAN_APPLICANT, LOAN_SUGGESTED, LOAN_COST, LOAN_CONSENT, LOAN_INSIGHT_PRE, LOAN_INSIGHT_BOLD, LOAN_INSIGHT_POST, LOAN_PREFILL_NOTE,
  LOAN_REQUEST_REF, LOAN_SENT_TO, LOAN_SUBMITTED_TITLE, LOAN_SUCCESS_MESSAGE,
} from "@/lib/ask-nanci/data/panels/business-loan-offer"
import { PanelShell, PanelHeader, NanciInsight, Callout, formatCurrency } from "@/components/ask-nanci/shared"
import { ApplicantFields, BrandMonogram, OfferField, OfferLogo, OfferSelect, SectionLabel } from "./offer-shared"

const PANEL_ID = "business-loan-offer"

// ponytail: one offer, so no list step and no selection state — the panel opens on the form.
const offer = LOAN_OFFERS[0]

// Derived from the payment, so the schedule, charge and total can never disagree.
const totalRepaid = LOAN_COST.payments * LOAN_COST.perPayment
const financeCharge = totalRepaid - LOAN_COST.principal

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}


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

        {/* The offer is why the panel opened: what it is (tinted) over what Nanci sized
            for this merchant (plain). Mastercard runs the rails but doesn't underwrite,
            so it sits in a "powered by" line rather than the title slot. */}
        <div className="overflow-hidden rounded-xl border border-blue-500 dark:border-blue-700">
          <div className="flex items-start gap-3 bg-blue-50 p-4 dark:bg-blue-950/20">
            <OfferLogo src={offer.logo} alt={offer.product} className="size-14" fallback={<BrandMonogram label={offer.mark} color={offer.color} />} />
            <div className="min-w-0 space-y-1">
              <p className="text-base font-semibold text-foreground">{offer.product}</p>
              <p className="text-sm text-muted-foreground">{offer.note}</p>
            </div>
          </div>

          <div className="border-t border-blue-200 bg-background p-4 dark:border-blue-900">
            <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-primary">{LOAN_SUGGESTED.eyebrow}</p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
              {LOAN_SUGGESTED.amount}{" "}
              <span className="text-base font-normal tracking-normal text-muted-foreground">{LOAN_SUGGESTED.cadence}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{LOAN_SUGGESTED.why}</p>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground/70">{LOAN_SUGGESTED.range}</p>
          </div>
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
            <OfferSelect label="Repayment Term" value={LOAN_APPLICANT.repaymentTerm} options={["4 weekly payments", "8 weekly payments", "12 weekly payments"]} placeholder="Select term" />
            <OfferSelect label="Purpose" value={LOAN_APPLICANT.purpose} options={["Payroll", "Inventory", "Equipment", "Other"]} placeholder="Select purpose" />
            <OfferField label="Avg. Monthly Revenue" value={LOAN_APPLICANT.avgMonthlyRevenue} readOnly />
            <div className="sm:col-span-2">
              <OfferSelect label="Funding Account" value={LOAN_APPLICANT.fundingAccount} options={[LOAN_APPLICANT.fundingAccount, "Business checking ···· 1190"]} />
            </div>
          </div>
        </div>

        {/* Cost of the money before the commit, not on a confirmation screen after it. */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">{LOAN_COST.title}</p>
          <CostRow label="Amount financed" value={formatCurrency(LOAN_COST.principal)} />
          <CostRow label="Repayment schedule" value={`${LOAN_COST.payments} ${LOAN_COST.cadence} payments of ${formatCurrency(LOAN_COST.perPayment)}`} />
          <CostRow label="Finance charge" value={formatCurrency(financeCharge)} />
          <div className="mt-2 flex items-center justify-between gap-4 border-t pt-3">
            <span className="text-sm font-semibold text-foreground">Total repayment</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(totalRepaid)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
            Estimated APR <span className="font-semibold text-muted-foreground">{LOAN_COST.apr}</span>. {LOAN_COST.note}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="loan-consent" />
          <Label htmlFor="loan-consent" className="text-xs text-foreground">{LOAN_CONSENT}</Label>
        </div>

        <Button className="w-full" onClick={submit}>Submit Application</Button>
      </div>
    </PanelShell>
  )
}
