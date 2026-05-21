"use client"

import { CheckCircle2 } from "lucide-react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
  Button, Separator,
} from "aperia-ds5"
import type { SheetActionData } from "@/lib/ask-nanci/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SheetActionData
}

function Row({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${muted ? "text-muted-foreground line-through" : highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  )
}

export function ChangeAuditSheet({ open, onOpenChange, data }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton className="w-[400px] sm:w-[480px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Change Confirmation</SheetTitle>
          <SheetDescription>Audit record for this account update.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6 py-4 flex-1">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
            <CheckCircle2 className="size-4 shrink-0 text-green-600" />
            <span className="text-sm font-medium text-green-800">Update Applied</span>
            <span className="ml-auto text-xs text-green-600">{data.timestamp}</span>
          </div>

          <Separator />

          <div className="flex flex-col">
            <Row label="Field" value={data.field} />
            <Separator />
            <Row label="Previous Value" value={data.fromValue} muted />
            <Separator />
            <Row label="New Value" value={data.toValue} highlight />
            <Separator />
            <Row label="Changed At" value={data.timestamp} />
            <Separator />
            <Row label="Changed By" value="AI — via chat" />
            <Separator />
            <Row label="Status" value="Completed" />
          </div>
        </div>

        <SheetFooter className="px-6 pb-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
