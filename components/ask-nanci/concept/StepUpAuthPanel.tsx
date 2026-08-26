"use client"

import { Check } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, Callout, PanelTable, Th, Td } from "@/components/ask-nanci/shared"

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
        <label className="text-sm font-medium text-foreground">Verification Code</label>
        <input
          type="text"
          maxLength={6}
          placeholder="_ _ _ _ _ _"
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-center text-xl font-mono tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
          <label className="text-sm font-medium text-foreground">Routing Number</label>
          <input
            type="text"
            placeholder="9-digit routing number"
            className="w-full rounded-lg border bg-background px-3 py-2 text-base md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Account Number</label>
          <input
            type="text"
            placeholder="Account number"
            className="w-full rounded-lg border bg-background px-3 py-2 text-base md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Account Type</label>
          <select className="w-full rounded-lg border bg-background px-3 py-2 text-base md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Checking</option>
            <option>Savings</option>
          </select>
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
        <thead>
          <tr className="border-b bg-muted/40">
            <Th>Field</Th>
            <Th>Current</Th>
            <Th>New</Th>
          </tr>
        </thead>
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
      <button
        onClick={onSubmit}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
      >
        Confirm & Submit
      </button>
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
