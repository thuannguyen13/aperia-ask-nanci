"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button, Checkbox, Input, Label } from "aperia-ds5"
import { Dialog, DialogContent, DialogTitle } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { addBankSource } from "@/lib/ask-nanci/source-store"

const INSTITUTION_GROUPS = [
  { key: "accounting", label: "Accounting" },
  { key: "bank",       label: "Banks" },
]

const INSTITUTIONS = [
  { key: "quickbook",  group: "accounting", name: "QuickBooks",       website: "quickbooks.com",       color: "bg-green-600",  initials: "QB", skipAccountStep: true, logo: "/fi/quickbook.svg" },
  { key: "chase",      group: "bank",       name: "Chase",            website: "chase.com",            color: "bg-blue-700",   initials: "CH", logo: "/fi/chase.png"                    },
  { key: "bofa",       group: "bank",       name: "Bank of America",  website: "bankofamerica.com",    color: "bg-red-600",    initials: "BA", logo: "/fi/bofa.png"                     },
  { key: "wellsfargo", group: "bank",       name: "Wells Fargo",      website: "wellsfargo.com",       color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png"               },
  { key: "amex",       group: "bank",       name: "Amex",             website: "americanexpress.com",  color: "bg-sky-600",    initials: "AX", logo: "/fi/amex.svg"                     },
  { key: "citi",       group: "bank",       name: "Citi",             website: "citi.com",             color: "bg-blue-500",   initials: "CI", logo: "/fi/citi.png"                     },
  { key: "usbank",     group: "bank",       name: "U.S. Bank",        website: "usbank.com",           color: "bg-red-800",    initials: "US", logo: "/fi/usbank.png"                   },
]

const ACCOUNT_TYPES = [
  { key: "checking", label: "Checking ••4821" },
  { key: "business", label: "Business ••3302" },
]

type Institution = typeof INSTITUTIONS[0]

interface Props {
  open: boolean
  onClose: () => void
  onLinked: () => void
}

function FILogo({ institution, size = "md" }: { institution: Institution; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-16" : size === "sm" ? "size-8" : "size-10"
  const imgSize = size === "lg" ? 64 : size === "sm" ? 32 : 40

  if (institution.logo) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center rounded-xl border bg-white p-1.5", sizeClass)}>
        <Image src={institution.logo} alt={institution.name} width={imgSize} height={imgSize} className="object-contain" />
      </div>
    )
  }

  const textSize = size === "lg" ? "text-xl" : size === "sm" ? "text-xs" : "text-sm"
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-xl font-bold text-white", institution.color, textSize, sizeClass)}>
      {institution.initials}
    </div>
  )
}

export function ConnectWizard({ open, onClose, onLinked }: Props) {
  const [step, setStep] = useState(1)
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [accounts, setAccounts] = useState<string[]>([])

  function reset() {
    setStep(1)
    setInstitution(null)
    setUsername("")
    setPassword("")
    setAccounts([])
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) { reset(); onClose() }
  }

  function handleSelectFI(fi: Institution) {
    setInstitution(fi)
    setStep(2)
  }

  // Step transition map — next/back destinations depend on whether the FI skips the account step
  const STEPS = {
    1: { next: () => 2,                                        back: () => null },
    2: { next: () => institution?.skipAccountStep ? 4 : 3,       back: () => 1    },
    3: { next: () => 4,                                        back: () => 2    },
    4: { next: () => null, back: () => institution?.skipAccountStep ? 2 : 3       },
  } as const

  function goNext() { const n = STEPS[step as keyof typeof STEPS].next(); if (n !== null) setStep(n) }
  function goBack() { const b = STEPS[step as keyof typeof STEPS].back(); if (b !== null) setStep(b) }

  function handleDone() {
    if (institution) {
      const linkedAccounts = institution.skipAccountStep
        ? [{ key: "preset", label: `${institution.name} — ${username}` }]
        : accounts.map((k) => ACCOUNT_TYPES.find((a) => a.key === k)!)

      linkedAccounts.forEach((account) => {
        addBankSource(account.label, {
          institution: institution.name,
          color: institution.color,
          initials: institution.initials,
          logo: institution.logo,
        })
      })
    }
    onLinked()
    reset()
    onClose()
  }

  function toggleAccount(key: string) {
    setAccounts((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const canProceedStep2 = username.trim().length > 0 && password.trim().length > 0
  const canProceedStep3 = accounts.length > 0
  const showBack = step > 1 && step < 4
  const stepTitle =
    step === 1 ? "Link Account" :
    step === 2 ? `Log in to ${institution?.name}` :
    step === 3 ? "Select Accounts" :
    "Account Linked"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-[100dvh] max-sm:max-h-none max-sm:w-screen max-sm:max-w-full max-sm:rounded-none max-sm:flex max-sm:flex-col">
        <DialogTitle className="sr-only">Link Accounts</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted",
              !showBack && "invisible",
            )}
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            {institution && step > 1 && step < 4 && <FILogo institution={institution} size="sm" />}
            {step === 1
              ? <Image src="/logos/plaid.svg" alt="Plaid" width={55} height={20} />
              : <span className="text-sm font-semibold text-foreground">{stepTitle}</span>
            }
          </div>

          <button
            onClick={() => { reset(); onClose() }}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
          >
            <span className="text-base leading-none">✕</span>
          </button>
        </div>

        {/* Step content */}
        <div className="flex flex-col gap-4">

          {/* Step 1 — Pick institution */}
          {step === 1 && (
            <>
              <p className="text-sm text-muted-foreground">Select your financial institution to connect.</p>
              {INSTITUTION_GROUPS.map((group) => {
                const fis = INSTITUTIONS.filter((fi) => fi.group === group.key)
                return (
                  <div key={group.key} className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {fis.map((fi) => (
                        <button
                          key={fi.key}
                          onClick={() => handleSelectFI(fi)}
                          className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
                        >
                          <FILogo institution={fi} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{fi.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{fi.website}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* Step 2 — Credentials */}
          {step === 2 && institution && (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <FILogo institution={institution} size="lg" />
                <p className="text-sm text-muted-foreground">
                  Enter your <strong className="text-foreground">{institution.name}</strong> credentials to connect your account to Ask Nanci.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Username</Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <Button className="w-full" disabled={!canProceedStep2} onClick={goNext}>
                Next
              </Button>
            </>
          )}

          {/* Step 3 — Select accounts (bank only) */}
          {step === 3 && institution && (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <FILogo institution={institution} size="lg" />
                <p className="text-sm text-muted-foreground">
                  Select the <strong className="text-foreground">{institution.name}</strong> accounts you want to share with Ask Nanci.
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
              <Button className="w-full" disabled={!canProceedStep3} onClick={goNext}>
                Next
              </Button>
            </>
          )}

          {/* Step 4 — Success */}
          {step === 4 && institution && (
            <>
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="relative">
                  <FILogo institution={institution} size="lg" />
                  <CheckCircle2 className="absolute -bottom-1 -right-1 size-5 fill-green-500 text-background" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">Account Linked</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your <strong className="text-foreground">{institution.name}</strong> account has been successfully linked to Ask Nanci.
                  </p>
                </div>
                {!institution.skipAccountStep && (
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {accounts.map((k) => (
                      <span key={k} className="rounded-full border px-3 py-1">
                        {ACCOUNT_TYPES.find((a) => a.key === k)?.label}
                      </span>
                    ))}
                  </div>
                )}
                {institution.skipAccountStep && (
                  <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {institution.name} — {username}
                  </span>
                )}
              </div>
              <Button className="w-full" onClick={handleDone}>
                Close
              </Button>
            </>
          )}

        </div>

      </DialogContent>
    </Dialog>
  )
}
