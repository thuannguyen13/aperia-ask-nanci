"use client"

import Image from "next/image"
import { Button } from "aperia-ds5"

// The summon control every Risk destination puts in its header. Summoning is a
// toggle — pressing it again is how the user puts Nanci away — so callers pass
// whether the panel is currently open rather than only a handler.
//
// Lived inline in the Detection Queue header until the Dashboard needed the same
// button; it is here so the mark, label and pressed state stay one thing.
export function AskNanciButton({ onClick, pressed }: { onClick: () => void; pressed: boolean }) {
  return (
    <Button variant="outline" onClick={onClick} aria-pressed={pressed}>
      <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={16} height={16} className="size-4" />
      Ask Nanci
    </Button>
  )
}
