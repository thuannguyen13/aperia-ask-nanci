"use client"

// The request step the carrier stories share: the options, the pre-filled request, and
// the request sent. It is a panel of its own, opened under the story's findings panel,
// so the findings stay in view while the owner picks.
import { ArrowLeft, CheckCheck, ChevronRight, Info } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { Callout, PanelItem, SectionHeader, PanelShell, PanelHeader, PanelBody, formatWholeCurrency } from "@/components/shared"
import type { Message, PanelId } from "@/lib/ask-nanci/types"
import { REQUEST_DRAFT_NOTE, REQUEST_HOLD_NOTE, REQUEST_SENT_TITLE, parseRequestView, requestView, type CarrierRequestOption } from "@/lib/ask-nanci/data/panels/carrier-request"
import { CALLS_COVER_TITLE, CALLS_OPTIONS, CALLS_OPTIONS_HEADING } from "@/lib/ask-nanci/data/panels/missed-calls"
import { OUTAGE_BACKUP_TITLE, OUTAGE_OPTIONS, OUTAGE_OPTIONS_HEADING } from "@/lib/ask-nanci/data/panels/outage-impact"
import { isAwaitingCallsRequest } from "@/lib/ask-nanci/data/carrier-flows/calls"
import { isAwaitingOutageRequest } from "@/lib/ask-nanci/data/carrier-flows/outage"
import { LINES_REQUEST_TITLE, LINES_OPTION } from "@/lib/ask-nanci/data/panels/unused-lines"
import { isAwaitingLinesRequest } from "@/lib/ask-nanci/data/carrier-flows/lines"
import { OVERAGE_REQUEST_TITLE, OVERAGE_OPTIONS, OVERAGE_OPTIONS_HEADING } from "@/lib/ask-nanci/data/panels/data-overage"
import { isAwaitingOverageRequest } from "@/lib/ask-nanci/data/carrier-flows/handoff"
import { LOCATION_REQUEST_TITLE, LOCATION_OPTION } from "@/lib/ask-nanci/data/panels/second-location"
import { isAwaitingLocationRequest } from "@/lib/ask-nanci/data/carrier-flows/expansion"
import { RENEWAL_REQUEST_TITLE, RENEWAL_OPTION } from "@/lib/ask-nanci/data/panels/plan-value"
import { isAwaitingRenewalRequest } from "@/lib/ask-nanci/data/carrier-flows/renewal"
import { BILL_DATE_TITLE, BILL_DATE_OPTION } from "@/lib/ask-nanci/data/panels/cash-flow"
import { isAwaitingBillDate } from "@/lib/ask-nanci/data/carrier-flows/cash-flow"
import { WINBACK_TITLE, WINBACK_OPTION } from "@/lib/ask-nanci/data/panels/phone-customers"
import { isAwaitingWinback } from "@/lib/ask-nanci/data/carrier-flows/callers"
import { SEASONAL_PAUSE_TITLE, PAUSE_OPTIONS, PAUSE_OPTIONS_HEADING } from "@/lib/ask-nanci/data/panels/seasonal-closure"
import { isAwaitingPauseRequest } from "@/lib/ask-nanci/data/carrier-flows/seasonal"
import { usePanelAutoplay } from "./use-panel-autoplay"

// Under ?autoplay: a beat to read the options before the first is picked, and a beat
// to read the request before it is sent.
const CHOOSE_AT_MS = 3000
const SEND_AT_MS = 3500

const costLine = (option: CarrierRequestOption) => option.monthlyCost === undefined ? null : `Example: ${formatWholeCurrency(option.monthlyCost)} a month`

export function RequestOptions({ heading, options, ranked = false, onChoose }: {
  heading: { title: string; description: string }
  options: CarrierRequestOption[]
  /** Numbered, with the first marked as the best fit. */
  ranked?: boolean
  onChoose: (option: CarrierRequestOption) => void
}) {
  usePanelAutoplay([{ at: CHOOSE_AT_MS, run: () => onChoose(options[0]) }])
  return (
    <div>
      <SectionHeader title={heading.title} description={heading.description} />
      <ul className="space-y-2">
        {options.map((option, i) => (
          <li key={option.id}>
            <button type="button" onClick={() => onChoose(option)} className="block w-full rounded-xl text-left hover:bg-muted/40">
              <PanelItem
                icon={option.icon}
                iconClassName="text-primary"
                className={cn("items-start", ranked && i === 0 && "border-primary/30 bg-primary/5")}
              >
                <div className="min-w-0 flex-1 space-y-1 text-sm">
                  <p className="font-medium text-foreground">{ranked && `${i + 1}. `}{option.title}</p>
                  <p className="text-muted-foreground">{option.description}</p>
                  {option.fit && <p className="text-xs text-foreground">{option.fit}</p>}
                  {costLine(option) && <p className="text-xs text-muted-foreground tabular-nums">{costLine(option)}</p>}
                </div>
                <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground" />
              </PanelItem>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RequestFields({ option }: { option: CarrierRequestOption }) {
  return (
    <dl className="rounded-xl border px-4 py-1">
      {[...option.fields, ...(option.monthlyCost === undefined ? [] : [{ label: "Example Monthly Cost", value: formatWholeCurrency(option.monthlyCost) }])].map((f) => (
        <div key={f.label} className="flex items-start justify-between gap-4 border-b py-2 text-sm last:border-0">
          <dt className="shrink-0 text-muted-foreground">{f.label}</dt>
          <dd className="text-right font-medium text-foreground">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function RequestDraft({ option, onBack, canSend }: {
  option: CarrierRequestOption
  /** Back to the options. A request with nothing to choose between has none. */
  onBack?: () => void
  /** True only while the story waits on this step, so a second press sends nothing. */
  canSend: boolean
}) {
  const { handlePrompt, dismissPanelSheet } = useAskNanci()
  const send = () => {
    if (!canSend) return
    // On a phone the sheet goes down so the answer is in view. Desktop has no sheet.
    dismissPanelSheet()
    handlePrompt(option.sendPrompt)
  }
  usePanelAutoplay([{ at: SEND_AT_MS, run: send }])
  return (
    <div className="space-y-4">
      <SectionHeader title={option.requestLabel} description="Review the request, then send it." />
      <RequestFields option={option} />
      <Callout variant="blue" className="flex items-start gap-2">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>{REQUEST_DRAFT_NOTE}</span>
      </Callout>
      <div className="flex gap-2">
        {onBack && <Button variant="secondary" onClick={onBack}><ArrowLeft />Back</Button>}
        <Button className="flex-1" onClick={send} disabled={!canSend}>Send Request</Button>
      </div>
    </div>
  )
}

export function RequestSent({ option }: { option: CarrierRequestOption }) {
  return (
    <div className="space-y-4">
      <Callout variant="green" icon={CheckCheck} title={REQUEST_SENT_TITLE}>
        <p>Reference {option.reference}. {REQUEST_HOLD_NOTE}</p>
      </Callout>
      <RequestFields option={option} />
    </div>
  )
}

// One story's request step as a panel: options first, then the request, then sent.
function RequestPanel({ panelId, title, heading, options, ranked = false, isAwaiting }: {
  panelId: PanelId
  title: string
  heading: { title: string; description: string }
  options: CarrierRequestOption[]
  ranked?: boolean
  /** True while the story waits on the Send press. */
  isAwaiting: (messages: Message[], chatState: string) => boolean
}) {
  const { closeDynamicPanel, setPanelView, messages, chatState } = useAskNanci()
  const { step, id } = parseRequestView(usePanelView(panelId, "options"))
  const option = options.find((o) => o.id === id)
  return (
    <PanelShell>
      <PanelHeader title={title} size="lg" onClose={() => closeDynamicPanel(panelId)} />
      <PanelBody className="flex flex-col gap-4">
        {step === "options" && (
          <RequestOptions heading={heading} options={options} ranked={ranked} onChoose={(o) => setPanelView(panelId, requestView(o.id))} />
        )}
        {step === "request" && option && (
          <RequestDraft option={option} onBack={options.length > 1 ? () => setPanelView(panelId, "options") : undefined} canSend={isAwaiting(messages, chatState)} />
        )}
        {step === "sent" && option && <RequestSent option={option} />}
      </PanelBody>
    </PanelShell>
  )
}

export function CallsCoverPanel() {
  return <RequestPanel panelId="calls-cover" title={CALLS_COVER_TITLE} heading={CALLS_OPTIONS_HEADING} options={CALLS_OPTIONS} isAwaiting={isAwaitingCallsRequest} />
}

export function OutageBackupPanel() {
  return <RequestPanel panelId="outage-backup" title={OUTAGE_BACKUP_TITLE} heading={OUTAGE_OPTIONS_HEADING} options={OUTAGE_OPTIONS} ranked isAwaiting={isAwaitingOutageRequest} />
}

export function SeasonalPausePanel() {
  return <RequestPanel panelId="seasonal-pause" title={SEASONAL_PAUSE_TITLE} heading={PAUSE_OPTIONS_HEADING} options={PAUSE_OPTIONS} isAwaiting={isAwaitingPauseRequest} />
}

// A single request needs no options list: the panel opens on the request itself.
const SINGLE = { title: "", description: "" }

export function LinesRequestPanel() {
  return <RequestPanel panelId="lines-request" title={LINES_REQUEST_TITLE} heading={SINGLE} options={[LINES_OPTION]} isAwaiting={isAwaitingLinesRequest} />
}

export function OverageRequestPanel() {
  return <RequestPanel panelId="overage-request" title={OVERAGE_REQUEST_TITLE} heading={OVERAGE_OPTIONS_HEADING} options={OVERAGE_OPTIONS} isAwaiting={isAwaitingOverageRequest} />
}

export function LocationRequestPanel() {
  return <RequestPanel panelId="location-request" title={LOCATION_REQUEST_TITLE} heading={SINGLE} options={[LOCATION_OPTION]} isAwaiting={isAwaitingLocationRequest} />
}

export function RenewalRequestPanel() {
  return <RequestPanel panelId="renewal-request" title={RENEWAL_REQUEST_TITLE} heading={SINGLE} options={[RENEWAL_OPTION]} isAwaiting={isAwaitingRenewalRequest} />
}

export function BillDateRequestPanel() {
  return <RequestPanel panelId="bill-date-request" title={BILL_DATE_TITLE} heading={SINGLE} options={[BILL_DATE_OPTION]} isAwaiting={isAwaitingBillDate} />
}

export function WinbackRequestPanel() {
  return <RequestPanel panelId="winback-request" title={WINBACK_TITLE} heading={SINGLE} options={[WINBACK_OPTION]} isAwaiting={isAwaitingWinback} />
}
