// The request step two carrier stories share (Missed Calls, Outage Impact): a short list
// of options, a request filled in from what Ask Nanci found, and the request sent to the
// carrier. Nothing on the carrier account changes here. The carrier confirms first.
import type { LucideIcon } from "lucide-react"
import type { ConceptScriptedTurn, PanelId, SheetActionData } from "../../types"
import { CARRIER } from "../carrier"

export interface CarrierRequestOption {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** Invented example price. No real plan or price is used. */
  monthlyCost: number
  /** Why this option ranks where it does. Shown on a ranked list only. */
  fit?: string
  /** Names the request on the chat card and the audit record. */
  requestLabel: string
  /** The pre-filled request, as label and value rows. */
  fields: { label: string; value: string }[]
  reference: string
  /** The owner's turn the Send button sends, and the key of the answer that follows. */
  sendPrompt: string
}

export const REQUEST_SENT_TITLE = `Request sent to ${CARRIER.business}`
export const REQUEST_HOLD_NOTE = "Nothing on your account changes until they confirm."
// Under the request, before it is sent.
export const REQUEST_DRAFT_NOTE = `Sending asks ${CARRIER.business} to make this change. ${REQUEST_HOLD_NOTE}`

// A panel's view names the step and the option, so the panel keeps no state of its own
// and a turn can set it: "request:forwarding", then "sent:forwarding".
export const requestView = (id: string) => `request:${id}`
export const sentView = (id: string) => `sent:${id}`
export const parseRequestView = (view: string) => {
  const [step, id] = view.split(":")
  return { step, id }
}

/** The answer to a Send press: the request on the record, and the panel showing it sent. */
export function buildRequestConversations(options: CarrierRequestOption[], panel: PanelId, timestamp: string): Record<string, ConceptScriptedTurn[]> {
  return Object.fromEntries(options.map((option) => {
    const sheetAction: SheetActionData = {
      field: option.requestLabel,
      requestLabel: option.requestLabel,
      submittedTitle: `Request Sent to ${CARRIER.business}`,
      product: CARRIER.business,
      sentTo: CARRIER.business,
      reference: option.reference,
      timestamp,
      status: "submitted",
    }
    return [option.sendPrompt, [
      { role: "user", content: option.sendPrompt },
      {
        role: "assistant",
        content: `${REQUEST_SENT_TITLE} for ${option.title.toLowerCase()}, reference ${option.reference}. ${REQUEST_HOLD_NOTE}`,
        sheetAction,
        panel,
        view: sentView(option.id),
      },
    ]]
  }))
}
