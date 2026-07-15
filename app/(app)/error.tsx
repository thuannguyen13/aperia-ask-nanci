"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "aperia-ds5"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-4 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        <AlertTriangle className="size-6" />
      </div>
      <div className="flex max-w-[420px] flex-col gap-2">
        <p className="text-xl font-medium text-foreground">Something went wrong</p>
        <p className="text-sm text-muted-foreground">
          An unexpected error interrupted this view. You can try again, and if it keeps
          happening, refreshing the page usually helps.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
