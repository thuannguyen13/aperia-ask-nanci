"use client"

// Shared building blocks for the two offer flows (credit-card-offer, business-loan-offer):
// the pre-filled Business/Contact field block, the label+input / label+select field
// helpers, and the muted stat strip used on both the list rows and the form summary.

import { useState } from "react"
import {
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"

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

export function OfferField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={LABEL}>{label}</Label>
      <Input defaultValue={value} />
    </div>
  )
}

export function OfferSelect({ label, value, options, placeholder }: { label: string; value: string; options: string[]; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={LABEL}>{label}</Label>
      <Select defaultValue={value || undefined}>
        <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
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
export function StatStrip({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted/50 px-4 py-3 sm:grid-cols-4">
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
export interface Applicant {
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
          <OfferField label="Business Name" value={applicant.businessName} />
          <OfferField label="EIN (Tax ID)" value={applicant.ein} />
          <OfferSelect label="Industry" value={applicant.industry} options={INDUSTRIES} />
          <OfferSelect label="Business Type" value={applicant.businessType} options={BUSINESS_TYPES} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Contact Info</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OfferField label="Owner Full Name" value={applicant.ownerName} />
          <OfferField label="Business Address" value={applicant.businessAddress} />
          <OfferField label="Email" value={applicant.email} />
          <OfferField label="Phone" value={applicant.phone} />
        </div>
      </div>
    </>
  )
}
