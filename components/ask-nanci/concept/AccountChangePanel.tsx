"use client"

import { Landmark, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Button, Input, InputOTP, InputOTPGroup, InputOTPSlot, Label } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CURRENT_ACCOUNT, NEW_ACCOUNT, CONFIRMATION_EMAIL, CONFIRMED_AT, REQUEST_REFERENCE } from "@/lib/ask-nanci/data/panels/account-change"
import { PanelShell, PanelHeader, Callout, NanciInsight } from "@/components/ask-nanci/shared"

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
        <div className="flex flex-col items-center gap-2">
          <Label className="text-xs">Verification Code</Label>
          <InputOTP maxLength={6}>
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="rounded-lg border-l" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <p className="text-center text-xs text-muted-foreground">
            Enter the passcode sent to {CONFIRMATION_EMAIL} to confirm.
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
      <NanciInsight>
        <span className="font-bold">Request Submitted</span> — a request to route deposits to ••••••••••{NEW_ACCOUNT.last4} was sent for verification. Deposits continue going to your current account until it clears, typically within 1–2 business days. A confirmation was sent to {CONFIRMATION_EMAIL} for your records.
      </NanciInsight>

      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
          <Clock className="size-7 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">Request Submitted</p>
          <p className="text-xs text-muted-foreground">Submitted today at {CONFIRMED_AT} · Reference {REQUEST_REFERENCE}</p>
        </div>
        <div className="flex w-full max-w-sm items-end gap-2">
          <div className="flex-1">
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Current</p>
            <AccountRow last4={CURRENT_ACCOUNT.last4} />
          </div>
          <ArrowRight className="mb-3 size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Requested</p>
            <AccountRow last4={NEW_ACCOUNT.last4} />
          </div>
        </div>
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
      {view === "done" && <Step3 />}
    </PanelShell>
  )
}
