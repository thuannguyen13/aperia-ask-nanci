"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot, Label } from "aperia-ds5"

// The six-box passcode entry used by every step-up confirmation. Lifted out of
// AccountChangePanel when the offer flows needed the same thing — it was about to be
// a third and fourth copy, and StepUpAuthPanel had already drifted to a hand-rolled
// <input maxLength={6}> that looks nothing like this one.
//
// Uncontrolled and always empty: the code is something the person entered, and a
// seeded field reads as a mock the moment anyone looks closely.
export function VerificationCode({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label className="text-xs">Verification Code</Label>
      <InputOTP maxLength={6}>
        <InputOTPGroup className="gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} className="rounded-lg border-l" />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="text-center text-xs text-muted-foreground">
        Enter the passcode sent to {email} to confirm.
      </p>
    </div>
  )
}
