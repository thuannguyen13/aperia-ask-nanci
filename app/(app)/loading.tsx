import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background py-12">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
