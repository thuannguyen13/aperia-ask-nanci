"use client"

import { Landmark, ArrowRight, CheckCircle2, Lock } from "lucide-react"
import { Button, Input, Label, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CURRENT_ACCOUNT, NEW_ACCOUNT, CONFIRMATION_EMAIL } from "@/lib/ask-nanci/data/panels/account-change"
import { PanelShell, PanelHeader, Callout, VerificationCode } from "@/components/ask-nanci/shared"

function AccountRow({ last4, className }: { last4: string; className?: string }) {
  return (
    <div className={`flex flex-1 items-center gap-3 rounded-lg border px-4 py-3.5 ${className ?? ""}`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Landmark className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-mono text-base text-foreground">************{last4}</p>
        <p className="text-xs text-muted-foreground">Receiving Deposits</p>
      </div>
    </div>
  )
}

// A field with a "Secure" lock icon on the right; the lock is a tooltip trigger.
function SecureInput({ id, label, placeholder }: { id: string; label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs">{label}</Label>
      <div className="relative">
        <Input id={id} placeholder={placeholder} className="pr-9" />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Secure"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Lock className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Secure</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function Step1({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3 gap-4">
      <div>
        <p className="mb-2 text-base font-bold text-foreground">Current Account</p>
        <AccountRow last4={CURRENT_ACCOUNT.last4} />
      </div>

      <div>
        <p className="mb-2 text-base font-bold text-foreground">New Account</p>
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-col gap-3">
            <SecureInput id="new-routing" label="Routing Number" placeholder="9 Digits" />
            <SecureInput id="new-account" label="Account Number" placeholder="Enter Account Number" />
          </div>
        </TooltipProvider>
      </div>

      <Button className="w-full" onClick={onSubmit}>Request Changes</Button>
    </div>
  )
}

function Step2({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3 gap-4">
      <Callout variant="green">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-4 shrink-0" />
          Routing number checks out — {NEW_ACCOUNT.bank}
        </div>
      </Callout>

      <div>
        <p className="mb-2 text-base font-bold text-foreground">What Will Change</p>
        <div className="flex items-center gap-2">
          <AccountRow last4={CURRENT_ACCOUNT.last4} />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          <AccountRow last4={NEW_ACCOUNT.last4} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-base font-bold text-foreground">Verification</p>
        {/* Left unseeded: this step confirms a money-movement change, so the code is
            typed rather than arriving pre-filled the way the offer gate does. */}
        <VerificationCode email={CONFIRMATION_EMAIL} />
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>Back</Button>
        <Button className="flex-1" onClick={onConfirm}>Confirm</Button>
      </div>
    </div>
  )
}

export function AccountChangePanel() {
  const { closeDynamicPanel, submitAccountChangeDetails, goBackAccountChangeStep, confirmAccountChange } = useAskNanci()
  const view = usePanelView("account-change", "details")

  return (
    <PanelShell>
      <PanelHeader
        title={view === "confirm" ? "Confirm Account Change" : "Deposit Account"}
        size="lg"
        onClose={() => closeDynamicPanel("account-change")}
      />

      {view === "details" && <Step1 onSubmit={submitAccountChangeDetails} />}
      {view === "confirm" && <Step2 onBack={goBackAccountChangeStep} onConfirm={confirmAccountChange} />}
    </PanelShell>
  )
}
