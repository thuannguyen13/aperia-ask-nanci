"use client"

import { useState } from "react"
import { ArrowLeft, X, CheckCircle2 } from "lucide-react"
import { Button, Checkbox } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { addBankSource } from "@/lib/ask-nanci/source-store"

const INSTITUTIONS = [
  { key: "chase", name: "Chase", website: "chase.com", color: "bg-blue-700", initials: "CH" },
  { key: "bofa", name: "Bank of America", website: "bankofamerica.com", color: "bg-red-600", initials: "BA" },
  { key: "wellsfargo", name: "Wells Fargo", website: "wellsfargo.com", color: "bg-yellow-600", initials: "WF" },
  { key: "amex", name: "Amex", website: "americanexpress.com", color: "bg-sky-600", initials: "AX" },
  { key: "citi", name: "Citi", website: "citi.com", color: "bg-blue-500", initials: "CI" },
  { key: "usbank", name: "U.S. Bank", website: "usbank.com", color: "bg-red-800", initials: "US" },
]

const ACCOUNT_TYPES = [
  { key: "checking", label: "Checking ••4821" },
  { key: "business", label: "Business ••3302" },
]

interface Props {
  onClose: () => void
  onLinked: () => void
}

function FILogo({ institution, size = "md" }: { institution: typeof INSTITUTIONS[0]; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-16 text-xl" : size === "sm" ? "size-8 text-xs" : "size-10 text-sm"
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-xl font-bold text-white", institution.color, sizeClass)}>
      {institution.initials}
    </div>
  )
}

export function ConnectWizard({ onClose, onLinked }: Props) {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<typeof INSTITUTIONS[0] | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [accounts, setAccounts] = useState<string[]>([])

  function toggleAccount(key: string) {
    setAccounts((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  function handleSelectFI(fi: typeof INSTITUTIONS[0]) {
    setSelected(fi)
    setStep(2)
  }

  function handleDone() {
    if (selected) {
      accounts.forEach((k) => {
        const account = ACCOUNT_TYPES.find((a) => a.key === k)
        addBankSource(account?.label ?? k, {
          institution: selected.name,
          color: selected.color,
          initials: selected.initials,
        })
      })
    }
    onLinked()
    onClose()
  }

  const canProceedStep2 = username.trim().length > 0 && password.trim().length > 0
  const canProceedStep3 = accounts.length > 0

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border bg-background shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          {/* Back button — hidden on step 1 */}
          <button
            onClick={() => setStep((s) => s - 1)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors",
              step === 1 || step === 4 ? "invisible" : "",
            )}
          >
            <ArrowLeft className="size-4" />
          </button>

          {/* Plaid-style logo placeholder */}
          <div className="flex items-center gap-2">
            {selected && step > 1 && step < 4 && <FILogo institution={selected} size="sm" />}
            <span className="text-sm font-semibold text-foreground">
              {step === 1 && "Link Account"}
              {step === 2 && `Log in to ${selected?.name}`}
              {step === 3 && "Select Accounts"}
              {step === 4 && "Account Linked"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step content */}
        <div className="flex flex-col gap-4 p-5">

          {/* Step 1 — Select institution */}
          {step === 1 && (
            <>
              <p className="text-sm text-muted-foreground">Select your financial institution to connect.</p>
              <div className="grid grid-cols-2 gap-2">
                {INSTITUTIONS.map((fi) => (
                  <button
                    key={fi.key}
                    onClick={() => handleSelectFI(fi)}
                    className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted hover:border-primary/30"
                  >
                    <FILogo institution={fi} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{fi.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{fi.website}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — Credentials */}
          {step === 2 && selected && (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <FILogo institution={selected} size="lg" />
                <p className="text-sm text-muted-foreground">
                  Enter your <strong className="text-foreground">{selected.name}</strong> credentials to connect your account to Ask Nanci.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <Button className="w-full" disabled={!canProceedStep2} onClick={() => setStep(3)}>
                Next
              </Button>
            </>
          )}

          {/* Step 3 — Select accounts */}
          {step === 3 && selected && (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <FILogo institution={selected} size="lg" />
                <p className="text-sm text-muted-foreground">
                  Select the <strong className="text-foreground">{selected.name}</strong> accounts you want to share with Ask Nanci.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {ACCOUNT_TYPES.map((account) => (
                  <label
                    key={account.key}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      accounts.includes(account.key) ? "border-primary/40 bg-primary/5" : "hover:bg-muted",
                    )}
                  >
                    <Checkbox
                      checked={accounts.includes(account.key)}
                      onCheckedChange={() => toggleAccount(account.key)}
                    />
                    <span className="text-sm font-medium text-foreground">{account.label}</span>
                  </label>
                ))}
              </div>
              <Button className="w-full" disabled={!canProceedStep3} onClick={() => setStep(4)}>
                Next
              </Button>
            </>
          )}

          {/* Step 4 — Success */}
          {step === 4 && selected && (
            <>
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="relative">
                  <FILogo institution={selected} size="lg" />
                  <CheckCircle2 className="absolute -bottom-1 -right-1 size-5 fill-green-500 text-background" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">Account Linked</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your <strong className="text-foreground">{selected.name}</strong> account has been successfully linked to Ask Nanci.
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {accounts.map((k) => (
                    <span key={k} className="rounded-full border px-3 py-1">
                      {ACCOUNT_TYPES.find((a) => a.key === k)?.label}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleDone}>
                Close
              </Button>
            </>
          )}

        </div>

        {/* Step dots */}
        {step < 4 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  s === step ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
