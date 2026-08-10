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
import { Dashboard as RiskDashboard } from "@/components/risk/dashboard/Dashboard"
import { DetectionQueue as RiskDetectionQueue } from "@/components/risk/DetectionQueue"
import { DetectionQueueInsightPanel } from "@/components/risk/DetectionQueueInsightPanel"
import { BarometerReport as RiskBarometer } from "@/components/risk/BarometerReport"
import { RiskReport as RiskRiskReport } from "@/components/risk/RiskReport"
import { AssignmentManagement as RiskAssignments } from "@/components/risk/AssignmentManagement"

// The single registry of concept panels. Add a panel here (+ its component) and it
// becomes renderable everywhere — `PanelId` is derived from these keys, so there is
// no separate union to keep in sync.
interface PanelDef {
  component: ComponentType
  // Short human name for the panel. Used as the caption under a thumbnail in the
  // mobile panel switcher, where the panel itself is too small to read — so keep it
  // to a couple of words that fit under a card.
  label: string
}

export const PANELS = {
  "case":                { component: CaseDetailPanel,        label: "Case" },
  "transaction-receipt": { component: TransactionReceiptPanel, label: "Receipt" },
  "dispute-draft":       { component: DisputeDraftPanel,      label: "Dispute Draft" },
  "decline-report":      { component: DeclineReportPanel,     label: "Decline Report" },
  "email-draft":         { component: EmailDraftPanel,        label: "Email Draft" },
  "risk-flags":          { component: RiskFlagsPanel,         label: "Risk Flags" },
  "volume-settlement":   { component: VolumeSettlementPanel,  label: "Volume & Settlement" },
  "change-log":          { component: ChangeLogPanel,         label: "Change Log" },
  "work-queue":          { component: WorkQueuePanel,         label: "Work Queue" },
  "detection-queue":     { component: DetectionQueuePanel,    label: "Detection Queue" },
  "barometer-report":    { component: BarometerReportPanel,   label: "Barometer Report" },
  "coastal-risk":        { component: CoastalRiskPanel,       label: "Coastal Risk" },
  "pending-deposits":    { component: PendingDepositsPanel,   label: "Pending Deposits" },
  "fee-summary":         { component: FeeSummaryPanel,        label: "Fee Summary" },
  "sales-snapshot":      { component: SalesSnapshotPanel,     label: "Sales Snapshot" },
  "sales-drilldown":     { component: SalesDrilldownPanel,    label: "Sales Drilldown" },
  "account-change":      { component: AccountChangePanel,     label: "Account Change" },
  "escalation":          { component: EscalationPanel,        label: "Escalation" },
  "menu-performance":    { component: MenuPerformancePanel,   label: "Menu Performance" },
  "menu-cost-detail":    { component: CostDetailPanel,        label: "Cost Detail" },
  "merchant-volume":     { component: MerchantVolumePanel,    label: "Merchant Volume" },
  "bank-account-form":   { component: BankAccountFormPanel,   label: "Bank Account" },
  "step-up-auth":        { component: StepUpAuthPanel,        label: "Verification" },
  "batch-detail":        { component: BatchDetailPanel,       label: "Batch Detail" },
  "credit-card-offer":   { component: CreditCardOfferPanel,   label: "Credit Card Offer" },
  "business-loan-offer": { component: BusinessLoanOfferPanel, label: "Business Loan Offer" },
  "dashboard-insight":   { component: DashboardInsightPanel,  label: "Dashboard Insight" },
  "detection-queue-insight": { component: DetectionQueueInsightPanel, label: "Queue Insight" },
  // Aperia Risk destinations — every risk UI is a registered panel.
  "risk-dashboard":       { component: RiskDashboard,        label: "Dashboard" },
  "risk-detection-queue": { component: RiskDetectionQueue,   label: "Detection Queue" },
  "risk-barometer":       { component: RiskBarometer,        label: "Barometer" },
  "risk-risk-report":     { component: RiskRiskReport,       label: "Risk Report" },
  "risk-assignments":     { component: RiskAssignments,      label: "Assignments" },
} satisfies Record<string, PanelDef>

export type PanelId = keyof typeof PANELS
