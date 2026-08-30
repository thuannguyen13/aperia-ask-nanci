"use client"

// Shared building blocks for the two offer flows (credit-card-offer, business-loan-offer):
// the pre-filled Business/Contact field block, the label+input / label+select field
// helpers, and the muted stat strip used on both the list rows and the form summary.

import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import {
  Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { VerificationCode, maskDigits } from "@/components/shared"

// Step-up gate both offer panels open on, before any terms are shown. The offer is
// derived from the merchant's own financial data, so the panel establishes who is
// asking before it reveals what they qualify for — the same reasoning as the
// deposit-account change, and the same passcode control.
//
// There is no Back button on purpose: this is the first view, so back is nowhere.
// Closing the panel is the way out, and PanelHeader already carries that.
export function OfferVerifyStep({ body, email, onConfirm }: { body: string; email: string; onConfirm: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-3">
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/20">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-foreground">{body}</p>
      </div>

      <div>
        <p className="mb-2 text-base font-bold text-foreground">Verification</p>
        <VerificationCode email={email} />
      </div>

      <Button className="w-full" onClick={onConfirm}>Confirm</Button>
    </div>
  )
}

// Brand logo with an icon fallback: shows the offer's `logo` image if it loads,
// otherwise the provided monogram. Images are optional — the panels look complete
// whether or not the art has been dropped into public/<flow>-offer/.
export function OfferLogo({ src, alt, fallback, className }: { src?: string; alt: string; fallback: React.ReactNode; className?: string }) {
  const [errored, setErrored] = useState(false)
  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white", className)}>
      {src && !errored
        ? <img src={src} alt={alt} className="size-full object-contain p-1" onError={() => setErrored(true)} />
        : fallback}
    </div>
  )
}

// Brand-colored monogram — the always-visible fallback when a logo image is absent.
// Fills the OfferLogo box, so it reads as a real mark rather than a generic icon.
export function BrandMonogram({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex size-full items-center justify-center font-bold leading-none text-white" style={{ backgroundColor: color }}>
      <span className="px-0.5 text-[10px] tracking-tight">{label}</span>
    </div>
  )
}

const LABEL = "text-[13px] font-medium text-foreground"

// Pre-filled-from-connected-data fields render read-only: gray fill, no border,
// full-opacity text (not DS `disabled`, which fades to 50%). Matches the Figma forms.
const READONLY_FIELD = "bg-muted border-transparent text-foreground cursor-default"

export function OfferField({ label, value, readOnly, hint }: { label: string; value: string; readOnly?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={LABEL}>{label}</Label>
      <Input defaultValue={value} readOnly={readOnly} className={cn(readOnly && READONLY_FIELD)} />
      {/* Says where a pre-filled number came from, so it reads as reasoned, not guessed. */}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function OfferSelect({ label, value, options, placeholder, readOnly }: { label: string; value: string; options: string[]; placeholder?: string; readOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={LABEL}>{label}</Label>
      <Select defaultValue={value || undefined} disabled={readOnly}>
        <SelectTrigger className={cn("w-full", readOnly && `${READONLY_FIELD} disabled:opacity-100`)}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-bold text-foreground">{children}</p>
}

// A stat is one label-over-value cell; the strip is the muted rounded box holding them.
export function StatStrip({ stats, className }: { stats: { label: string; value: string }[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted/50 px-4 py-3 sm:grid-cols-4", className)}>
      {stats.map((s) => (
        <div key={s.label} className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{s.label}</p>
          <p className="truncate text-[13px] font-medium text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
  )
}

// Business Info + Contact Info — identical across both offer forms. The trailing
// details section (card limit vs loan terms) is rendered by each panel after this.
interface Applicant {
  businessName: string
  ein: string
  industry: string
  businessType: string
  ownerName: string
  businessAddress: string
  email: string
  phone: string
}

const BUSINESS_TYPES = ["LLC", "Sole Prop", "Corp", "Partnership"]
const INDUSTRIES = ["Restaurant", "Retail", "Services", "Other"]

export function ApplicantFields({ applicant }: { applicant: Applicant }) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <SectionLabel>Business Info</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OfferField label="Business Name" value={applicant.businessName} readOnly />
          <OfferField label="EIN (Tax ID)" value={maskDigits(applicant.ein)} readOnly />
          <OfferSelect label="Industry" value={applicant.industry} options={INDUSTRIES} readOnly />
          <OfferSelect label="Business Type" value={applicant.businessType} options={BUSINESS_TYPES} readOnly />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Contact Info</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OfferField label="Owner Full Name" value={applicant.ownerName} readOnly />
          <OfferField label="Business Address" value={applicant.businessAddress} readOnly />
          <OfferField label="Email" value={applicant.email} readOnly />
          <OfferField label="Phone" value={applicant.phone} readOnly />
        </div>
      </div>
    </>
  )
}
