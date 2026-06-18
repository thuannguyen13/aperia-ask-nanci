"use client"

import { X, Check } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { SidebarPanelShell } from "@/components/ask-nanci/shared"

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
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
        Tell the AI "Done" once you've entered your code.
      </div>
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
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Account Number</label>
          <input
            type="text"
            placeholder="Account number"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Account Type</label>
          <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Checking</option>
            <option>Savings</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
        Tell the AI "Submitted" when you've entered your account details.
      </div>
    </div>
  )
}

function Step3({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-col gap-5 p-5 flex-1">
      <p className="text-sm text-muted-foreground">
        Review your account change before confirming.
      </p>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Field</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Current</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">New</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium text-foreground">Routing</td>
              <td className="px-4 py-3 text-muted-foreground">•••• 4892</td>
              <td className="px-4 py-3 font-medium text-foreground">•••• 1234</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium text-foreground">Account</td>
              <td className="px-4 py-3 text-muted-foreground">•••• 7823</td>
              <td className="px-4 py-3 font-medium text-foreground">•••• 5678</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-foreground">Type</td>
              <td className="px-4 py-3 text-muted-foreground">Checking</td>
              <td className="px-4 py-3 font-medium text-foreground">Checking</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
        Two micro-deposits will be sent to verify the new account. Deposits continue to your current account until verification is complete.
      </div>
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
  const { stepUpPanelOpen, setStepUpPanelOpen, stepUpPanelStep, submitStepUpPanel } = useAskNanci()

  return (
    <SidebarPanelShell isOpen={stepUpPanelOpen} width="420px" side="right">
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Change Deposit Account</h2>
        <button
          onClick={() => setStepUpPanelOpen(false)}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
      <StepIndicator current={stepUpPanelStep} />
      <div className="flex flex-col flex-1 overflow-auto">
        {stepUpPanelStep === 1 && <Step1 />}
        {stepUpPanelStep === 2 && <Step2 />}
        {stepUpPanelStep === 3 && <Step3 onSubmit={submitStepUpPanel} />}
      </div>
    </SidebarPanelShell>
  )
}
