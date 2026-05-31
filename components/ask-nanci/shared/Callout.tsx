"use client"

import { cn } from "aperia-ds5/utils"

type CalloutVariant = "red" | "amber" | "green" | "blue"

const VARIANT_CLS: Record<CalloutVariant, string> = {
  red:   "border-red-200 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-950/20 dark:text-red-300",
  amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300",
  green: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300",
  blue:  "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300",
}

interface CalloutProps {
  variant: CalloutVariant
  className?: string
  children: React.ReactNode
}

export function Callout({ variant, className, children }: CalloutProps) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", VARIANT_CLS[variant], className)}>
      {children}
    </div>
  )
}
