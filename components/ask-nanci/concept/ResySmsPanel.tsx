"use client"

import { cn } from "aperia-ds5/utils"
import { Check, CheckCheck, Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { SMS_SLOT, SMS_TEXT, SMS_RECIPIENTS, SMS_GUESTS } from "@/lib/ask-nanci/data/panels/resy-service-day"
import { PanelShell, PanelHeader, PanelBody } from "@/components/shared"

export function ResySmsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Message to ${SMS_SLOT} Guests`}
        size="lg"
        onClose={() => closeDynamicPanel("resy-sms")}
      />

      <PanelBody className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Sent through Resy · {SMS_RECIPIENTS.length} parties, {SMS_GUESTS} guests</p>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
            Hi {"{first name}"}, {SMS_TEXT.charAt(0).toLowerCase() + SMS_TEXT.slice(1)}
          </div>
        </div>

        <div className="rounded-xl border">
          <ul className="divide-y">
            {SMS_RECIPIENTS.map((r) => (
              <li key={r.name} className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{r.name}</p>
                  <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                    <Users className="size-3.5" />{r.party}
                  </span>
                  <span className={cn(
                    "flex w-24 shrink-0 items-center justify-end gap-1 text-xs",
                    r.status === "replied" ? "font-medium text-blue-700 dark:text-blue-400" : "text-muted-foreground",
                  )}>
                    {r.status === "replied" ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" />}
                    {r.status === "replied" ? "Replied" : "Delivered"}
                  </span>
                </div>
                {r.reply && (
                  <div className={cn(
                    "mt-2 max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm",
                    r.flagged ? "border border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-200" : "bg-muted text-foreground",
                  )}>
                    {r.reply}
                    {r.flagged && <p className="mt-1 text-[11px] font-semibold">Flagged for the host stand</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
