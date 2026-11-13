"use client"

// The request step the carrier panels share: the options, the pre-filled request, and
// the request sent. Each panel keeps its own first view and hands these its options.
import { ArrowLeft, CheckCheck, ChevronRight, Info } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { Callout, PanelItem, SectionHeader, formatWholeCurrency } from "@/components/shared"
import { REQUEST_DRAFT_NOTE, REQUEST_HOLD_NOTE, REQUEST_SENT_TITLE, type CarrierRequestOption } from "@/lib/ask-nanci/data/panels/carrier-request"
import { usePanelAutoplay } from "./use-panel-autoplay"

// Under ?autoplay: a beat to read the options before the first is picked, and a beat
// to read the request before it is sent.
const CHOOSE_AT_MS = 3000
const SEND_AT_MS = 3500

const costLine = (option: CarrierRequestOption) => `Example: ${formatWholeCurrency(option.monthlyCost)} a month`

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
            <button type="button" onClick={() => onChoose(option)} className="block w-full rounded-lg text-left hover:bg-muted/40">
              <PanelItem
                icon={option.icon}
                iconClassName="text-primary"
                className={cn("items-start", ranked && i === 0 && "border-primary/30 bg-primary/5")}
              >
                <div className="min-w-0 flex-1 space-y-1 text-sm">
                  <p className="font-medium text-foreground">{ranked && `${i + 1}. `}{option.title}</p>
                  <p className="text-muted-foreground">{option.description}</p>
                  {option.fit && <p className="text-xs text-foreground">{option.fit}</p>}
                  <p className="text-xs text-muted-foreground tabular-nums">{costLine(option)}</p>
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
      {[...option.fields, { label: "Example monthly cost", value: formatWholeCurrency(option.monthlyCost) }].map((f) => (
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
  onBack: () => void
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
      <SectionHeader title={option.requestLabel} description="Filled in from what I found. Check it, then send." />
      <RequestFields option={option} />
      <Callout variant="blue" className="flex items-start gap-2">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>{REQUEST_DRAFT_NOTE}</span>
      </Callout>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack}><ArrowLeft />Back</Button>
        <Button className="flex-1" onClick={send} disabled={!canSend}>Send request</Button>
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
