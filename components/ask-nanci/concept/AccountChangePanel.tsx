"use client"

import { Landmark, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button, Input, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CURRENT_ACCOUNT, NEW_ACCOUNT, CONFIRMATION_EMAIL, CONFIRMED_AT } from "@/lib/ask-nanci/data/panels/account-change"
import { PanelShell, PanelHeader, Callout } from "@/components/ask-nanci/shared"

function AccountRow({ last4, className }: { last4: string; className?: string }) {
  return (
    <div className={`flex flex-1 items-center gap-3 rounded-lg border px-3 py-3 ${className ?? ""}`}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Landmark className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-mono text-sm text-foreground">••••••••••{last4}</p>
        <p className="text-xs text-muted-foreground">Receiving Deposits</p>
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-routing" className="text-xs">Routing Number</Label>
            <Input id="new-routing" placeholder="9 Digits" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-account" className="text-xs">Account Number</Label>
            <Input id="new-account" placeholder="Enter Account Number" />
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={onSubmit}>Submit</Button>
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
        <div className="flex flex-col items-center gap-2">
          <Label className="text-xs">Verification code</Label>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Input key={i} maxLength={1} className="size-11 text-center font-mono" />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Enter the last 4 digits of the new account number to confirm.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onBack}>Back</Button>
        <Button className="flex-1" onClick={onConfirm}>Confirm</Button>
      </div>
    </div>
  )
}

function Step3() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3 gap-4">
      <Callout variant="blue">
        <span className="font-bold">Account Updated</span> — deposits now route to ••••••••••{NEW_ACCOUNT.last4}. Your next deposit, tomorrow's batch, will go to the new account. A confirmation was sent to {CONFIRMATION_EMAIL} for your records.
      </Callout>

      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">Account Updated</p>
          <p className="text-xs text-muted-foreground">Confirmed today at {CONFIRMED_AT}</p>
        </div>
        <div className="w-full max-w-xs">
          <AccountRow last4={NEW_ACCOUNT.last4} />
        </div>
      </div>
    </div>
  )
}

export function AccountChangePanel() {
  const { closeDynamicPanel, accountChangeStep, submitAccountChangeDetails, goBackAccountChangeStep, confirmAccountChange } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={accountChangeStep === 2 ? "Confirm Account Change" : "Deposit Account"}
        size="lg"
        onClose={() => closeDynamicPanel("account-change")}
      />

      {accountChangeStep === 1 && <Step1 onSubmit={submitAccountChangeDetails} />}
      {accountChangeStep === 2 && <Step2 onBack={goBackAccountChangeStep} onConfirm={confirmAccountChange} />}
      {accountChangeStep === 3 && <Step3 />}
    </PanelShell>
  )
}
