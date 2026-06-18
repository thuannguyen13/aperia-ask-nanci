"use client"

import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"
import { Button, Input, Label, Separator } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { SidebarPanelShell } from "@/components/ask-nanci/shared"

export function BankAccountFormPanel() {
  const { formPanelOpen, setFormPanelOpen, submitFormPanel } = useAskNanci()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      submitFormPanel()
      setSubmitted(false)
    }, 1800)
  }

  return (
    <SidebarPanelShell isOpen={formPanelOpen} width="420px" side="left">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Deposit Account Update</p>
          <p className="text-xs text-muted-foreground">Review and confirm to apply changes</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setFormPanelOpen(false)}>
          <X className="size-4" />
        </Button>
      </div>

      {submitted ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <CheckCircle2 className="size-10 text-green-500" />
          <p className="text-sm font-semibold text-foreground">Account Updated</p>
          <p className="text-xs text-center text-muted-foreground">Changes take effect within 1–2 business days.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4 gap-5">
          {/* Pre-filled context */}
          <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Account Holder</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">Oak Street Coffee, LLC</p>
          </div>

          <Separator />

          {/* Bank name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bank-name" className="text-xs">Bank Name</Label>
            <Input id="bank-name" defaultValue="First National Bank" />
          </div>

          {/* Account type */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Account Type</Label>
            <div className="flex gap-4">
              {(["Checking", "Savings"] as const).map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="account-type"
                    defaultChecked={type === "Checking"}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Routing number */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="routing" className="text-xs">Routing Number</Label>
            <Input id="routing" defaultValue="021000021" />
          </div>

          {/* Account number */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account" className="text-xs">Account Number</Label>
            <Input id="account" defaultValue="4847291038" />
          </div>

          {/* Confirm account number */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-confirm" className="text-xs">Confirm Account Number</Label>
            <Input id="account-confirm" placeholder="Re-enter account number" />
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">
            Changes are reviewed for security and take effect within 1–2 business days.
          </p>
        </div>
      )}

      {!submitted && (
        <div className="shrink-0 border-t px-5 py-4">
          <Button className="w-full" onClick={handleSubmit}>Confirm &amp; Submit</Button>
        </div>
      )}
    </SidebarPanelShell>
  )
}
