"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "aperia-ds5"

export function PanelExportButton() {
  return (
    <div className="flex items-center">
      <Button variant="secondary" size="sm" disabled className="rounded-r-none">
        Export
      </Button>
      <Button variant="secondary" size="icon-sm" disabled className="rounded-l-none">
        <ChevronDown className="size-3.5" />
      </Button>
    </div>
  )
}
