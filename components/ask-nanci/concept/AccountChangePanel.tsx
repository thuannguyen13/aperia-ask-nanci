"use client"

import { CheckCircle2, Check } from "lucide-react"
import { Button, Input, Label } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW16_CONFIRM } from "@/lib/ask-nanci/concept-config"
import { CURRENT_ACCOUNT, NEW_ACCOUNT, VALIDATION_COPY } from "@/lib/ask-nanci/data/panels/account-change"
import { PanelShell, PanelHeader, PanelExportButton } from "@/components/ask-nanci/shared"

function Step1() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-5">
      <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
        <p className="text-xs text-muted-foreground">Current Account</p>
        <p className="mt-0.5 font-mono text-sm font-medium text-foreground">Routing {CURRENT_ACCOUNT.routing} · Account {CURRENT_ACCOUNT.account}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-routing" className="text-xs">New Routing Number</Label>
        <Input id="new-routing" placeholder="9-digit routing number" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-account" className="text-xs">New Account Number</Label>
        <Input id="new-account" placeholder="Account number" />
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
        Tell Nanci once you&apos;ve entered your new account details.
      </div>
    </div>
  )
}

function Step2({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-5">
      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
        <Check className="size-4" /> {VALIDATION_COPY}
      </div>

      <div className="space-y-3 text-[11px]">
        <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">What Will Change</p>
        <div>
          <p className="text-[9px] text-muted-foreground mb-1.5">Current account</p>
          <div className="rounded-md border bg-muted/20 px-3 py-2 space-y-1 font-mono">
            <p className="text-foreground">Routing {CURRENT_ACCOUNT.routing}</p>
            <p className="text-foreground">Account {CURRENT_ACCOUNT.account}</p>
            <p className="text-muted-foreground">{CURRENT_ACCOUNT.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[9px] text-muted-foreground">changing to</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground mb-1.5">New account · {NEW_ACCOUNT.bank}</p>
          <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 space-y-1 font-mono">
            <p className="text-foreground">Routing {NEW_ACCOUNT.routing}</p>
            <p className="text-foreground">Account {NEW_ACCOUNT.account}</p>
            <p className="text-muted-foreground">{NEW_ACCOUNT.type}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="verify-last4" className="text-xs">Verify last 4 of new account number</Label>
        <Input id="verify-last4" maxLength={4} placeholder="7715" className="font-mono" />
      </div>

      <Button className="w-full" onClick={onConfirm}>Confirm &amp; Apply</Button>
    </div>
  )
}

function Step3() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
      <CheckCircle2 className="size-10 text-green-500" />
      <p className="text-sm font-semibold text-foreground">Account Updated</p>
      <p className="text-xs text-center text-muted-foreground">
        Deposits will route to the account ending {NEW_ACCOUNT.account.replace("••••", "")} starting with your next batch.
      </p>
    </div>
  )
}

export function AccountChangePanel() {
  const { closePanel, accountChangeStep, handlePrompt } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Deposit Account"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closePanel("account-change")}
      />

      {accountChangeStep === 1 && <Step1 />}
      {accountChangeStep === 2 && <Step2 onConfirm={() => handlePrompt(CONCEPT_FLOW16_CONFIRM)} />}
      {accountChangeStep === 3 && <Step3 />}
    </PanelShell>
  )
}
