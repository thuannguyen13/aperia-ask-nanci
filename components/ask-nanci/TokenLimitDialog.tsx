"use client"

import { TriangleAlert } from "lucide-react"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogMedia,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

/**
 * Shown when the plan budget is spent and the user tries to type — the design puts the
 * warning at the moment of the attempt rather than on arrival.
 */
export function TokenLimitDialog() {
  const { tokenLimitReached, setTokenLimitReached, usage } = useAskNanci()

  return (
    <AlertDialog open={tokenLimitReached} onOpenChange={(open) => { if (!open) setTokenLimitReached(false) }}>
      <AlertDialogContent>
        {/* AlertDialogHeader sets grid rows but no columns, so both tracks are `auto` and
            stretch to fill — inflating the icon's column from 40px to 73px and opening a
            phantom gap before the title. Pin the first track to the media's width; only
            from sm up, where the DS switches to the icon-beside-text layout. */}
        <AlertDialogHeader className="sm:grid-cols-[auto_1fr]">
          <AlertDialogMedia>
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Usage limit reached</AlertDialogTitle>
          <AlertDialogDescription>Your usage resets at {usage.resetsAt}.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setTokenLimitReached(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
