"use client"

import { Zap } from "lucide-react"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogMedia,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

export function TokenLimitDialog() {
  const { tokenLimitReached, setTokenLimitReached, openSettings } = useAskNanci()

  function handleDismiss() {
    setTokenLimitReached(false)
  }

  function handleUpgrade() {
    setTokenLimitReached(false)
    openSettings()
  }

  return (
    <AlertDialog open={tokenLimitReached} onOpenChange={(open) => { if (!open) setTokenLimitReached(false) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-amber-100">
            <Zap className="size-5 text-amber-600" />
          </AlertDialogMedia>
          <AlertDialogTitle>Daily token limit reached</AlertDialogTitle>
          <AlertDialogDescription>
            Your daily limit resets at midnight. Upgrade to Diamond for more tokens, or come back tomorrow.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDismiss}>Dismiss</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpgrade}>Upgrade to Diamond</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
