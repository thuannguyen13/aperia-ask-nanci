"use client"

import { Dialog, DialogContent, DialogTitle } from "aperia-ds5"

interface PreConnectDialogProps {
  open: boolean
  onClose: () => void
  onContinue: () => void
}

export function PreConnectDialog({ open, onClose, onContinue }: PreConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogTitle className="sr-only">Before You Connect</DialogTitle>

        {/* TODO: implement from Figma design */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Design coming from Figma.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
