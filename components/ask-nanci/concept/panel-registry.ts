import type { ComponentType } from "react"

import { CaseDetailPanel } from "./CaseDetailPanel"
import { TransactionReceiptPanel } from "./TransactionReceiptPanel"
import { DisputeDraftPanel } from "./DisputeDraftPanel"
import { DeclineReportPanel } from "./DeclineReportPanel"
import { EmailDraftPanel } from "./EmailDraftPanel"
import { RiskFlagsPanel } from "./RiskFlagsPanel"
import { VolumeSettlementPanel } from "./VolumeSettlementPanel"
import { ChangeLogPanel } from "./ChangeLogPanel"
import { WorkQueuePanel } from "./WorkQueuePanel"
import { DetectionQueuePanel } from "./DetectionQueuePanel"
import { BarometerReportPanel } from "./BarometerReportPanel"
import { CoastalRiskPanel } from "./CoastalRiskPanel"
import { PendingDepositsPanel } from "./PendingDepositsPanel"
import { FeeSummaryPanel } from "./FeeSummaryPanel"
import { SalesSnapshotPanel } from "./SalesSnapshotPanel"
import { SalesDrilldownPanel } from "./SalesDrilldownPanel"
import { AccountChangePanel } from "./AccountChangePanel"
import { EscalationPanel } from "./EscalationPanel"
import { MenuPerformancePanel } from "./MenuPerformancePanel"
import { CostDetailPanel } from "./CostDetailPanel"
import { MerchantVolumePanel } from "./MerchantVolumePanel"
import { BankAccountFormPanel } from "./BankAccountFormPanel"
import { StepUpAuthPanel } from "./StepUpAuthPanel"
import { BatchDetailPanel } from "./BatchDetailPanel"
import { CreditCardOfferPanel } from "./CreditCardOfferPanel"
import { BusinessLoanOfferPanel } from "./BusinessLoanOfferPanel"
import { DashboardInsightPanel } from "@/components/risk/dashboard/DashboardInsightPanel"

// The single registry of concept panels. Add a panel here (+ its component) and it
// becomes renderable everywhere — `PanelId` is derived from these keys, so there is
// no separate union to keep in sync.
export interface PanelDef {
  component: ComponentType
}

export const PANELS = {
  "case":                { component: CaseDetailPanel },
  "transaction-receipt": { component: TransactionReceiptPanel },
  "dispute-draft":       { component: DisputeDraftPanel },
  "decline-report":      { component: DeclineReportPanel },
  "email-draft":         { component: EmailDraftPanel },
  "risk-flags":          { component: RiskFlagsPanel },
  "volume-settlement":   { component: VolumeSettlementPanel },
  "change-log":          { component: ChangeLogPanel },
  "work-queue":          { component: WorkQueuePanel },
  "detection-queue":     { component: DetectionQueuePanel },
  "barometer-report":    { component: BarometerReportPanel },
  "coastal-risk":        { component: CoastalRiskPanel },
  "pending-deposits":    { component: PendingDepositsPanel },
  "fee-summary":         { component: FeeSummaryPanel },
  "sales-snapshot":      { component: SalesSnapshotPanel },
  "sales-drilldown":     { component: SalesDrilldownPanel },
  "account-change":      { component: AccountChangePanel },
  "escalation":          { component: EscalationPanel },
  "menu-performance":    { component: MenuPerformancePanel },
  "menu-cost-detail":    { component: CostDetailPanel },
  "merchant-volume":     { component: MerchantVolumePanel },
  "bank-account-form":   { component: BankAccountFormPanel },
  "step-up-auth":        { component: StepUpAuthPanel },
  "batch-detail":        { component: BatchDetailPanel },
  "credit-card-offer":   { component: CreditCardOfferPanel },
  "business-loan-offer": { component: BusinessLoanOfferPanel },
  "dashboard-insight":   { component: DashboardInsightPanel },
} satisfies Record<string, PanelDef>

export type PanelId = keyof typeof PANELS
