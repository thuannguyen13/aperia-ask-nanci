"use client"

import { Check } from "lucide-react"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, Callout, PanelTable, Thead, Th, Td } from "@/components/shared"

const STEPS = ["Verify Identity", "New Account", "Review & Confirm"] as const

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b">
      {STEPS.map((label, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3
        const done = stepNum < current
        const active = stepNum === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              done ? "bg-primary text-white" : active ? "border-2 border-primary text-primary" : "border border-muted-foreground/30 text-muted-foreground",
            )}>
              {done ? <Check className="size-3.5" /> : stepNum}
            </div>
            <span className={cn(
              "text-xs font-medium whitespace-nowrap",
              active ? "text-foreground" : "text-muted-foreground",
            )}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px w-6 shrink-0", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Step1() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <p className="text-sm text-muted-foreground">
        A 6-digit verification code was sent to your phone ending in <span className="font-medium text-foreground">••0142</span>. Enter it below to continue.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label>Verification Code</Label>
        <Input
          type="text"
          maxLength={6}
          placeholder="_ _ _ _ _ _"
          className="h-auto px-3 py-2.5 text-center text-xl font-mono tracking-[0.5em]"
        />
      </div>
      <button className="text-xs text-primary hover:underline underline-offset-2 text-left">
        Resend code
      </button>
      <Callout variant="blue">
        Tell the AI "Done" once you've entered your code.
      </Callout>
    </div>
  )
}

function Step2() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <p className="text-sm text-muted-foreground">
        Identity verified. Enter your new deposit account details below.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Routing Number</Label>
          <Input type="text" placeholder="9-digit routing number" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Account Number</Label>
          <Input type="text" placeholder="Account number" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Account Type</Label>
          {/* Uncontrolled, same as the <select> it replaces: a native select with no
              value shows its first option, so the default is seeded to match. */}
          <Select defaultValue="Checking">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Checking">Checking</SelectItem>
              <SelectItem value="Savings">Savings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Callout variant="blue">
        Tell the AI "Submitted" when you've entered your account details.
      </Callout>
    </div>
  )
}

function Step3({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-col gap-5 p-5 flex-1">
      <p className="text-sm text-muted-foreground">
        Review your account change before confirming.
      </p>
      <PanelTable>
        <Thead>
          <Th>Field</Th>
          <Th>Current</Th>
          <Th>New</Th>
        </Thead>
        <tbody>
          <tr>
            <Td className="font-medium">Routing</Td>
            <Td className="text-muted-foreground">•••• 4892</Td>
            <Td className="font-medium">•••• 1234</Td>
          </tr>
          <tr>
            <Td className="font-medium">Account</Td>
            <Td className="text-muted-foreground">•••• 7823</Td>
            <Td className="font-medium">•••• 5678</Td>
          </tr>
          <tr>
            <Td className="font-medium">Type</Td>
            <Td className="text-muted-foreground">Checking</Td>
            <Td className="font-medium">Checking</Td>
          </tr>
        </tbody>
      </PanelTable>
      <Callout variant="amber">
        Two micro-deposits will be sent to verify the new account. Deposits continue to your current account until verification is complete.
      </Callout>
      <Button className="w-full" onClick={onSubmit}>Confirm & Submit</Button>
    </div>
  )
}

export function StepUpAuthPanel() {
  const { closeDynamicPanel, submitStepUpPanel } = useAskNanci()
  const step = Number(usePanelView("step-up-auth", "1")) as 1 | 2 | 3

  return (
    <PanelShell>
      <PanelHeader
        title="Change Deposit Account"
        size="lg"
        onClose={() => closeDynamicPanel("step-up-auth")}
      />
      <StepIndicator current={step} />
      <div className="flex flex-col flex-1 overflow-auto">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 onSubmit={submitStepUpPanel} />}
      </div>
    </PanelShell>
  )
}
