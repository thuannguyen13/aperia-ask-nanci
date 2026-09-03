"use client"

import { useState } from "react"
import { Check, ChevronDown, Loader } from "lucide-react"
import {
  Button, Label, Popover, PopoverContent, PopoverTrigger, RadioGroup, RadioGroupItem, Textarea,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { DISPOSITIONS, type WorkStatus } from "@/lib/ask-nanci/data/risk-merchants"

// The Mark Work split button and its "Mark Work and Disposition" panel, shared by
// the merchant detail and the Barometer merchant list. Both screens dispose the
// same way, so they use the same control rather than one screen marking straight
// to Worked while the other asks for a reason.
//
// The three states of the button. Hexes sampled from the design: WIP is
// yellow-600 (#ca8a02), Worked is green-600 (#16a34a); the default keeps `primary`.
// The spinner is a status glyph, not a loading affordance — it does not spin.
//
// `cls` must colour the border as well as the fill. The DS button is
// `border border-transparent bg-clip-padding`, so its background stops at the
// padding edge and a transparent border shows the page through — which on two
// touching halves reads as a white seam splitting the group in two.
//
// `divider` is the one line that should be visible: the fill lightened 20%, opaque
// for the same reason (a translucent border would tint the page, not the button).
const WORK_STATES: Record<WorkStatus, { label: string; icon?: typeof Check; cls?: string; divider: string }> = {
  "mark-work": {
    label: "Mark Work",
    cls: "border-primary",
    divider: "border-l-[color-mix(in_srgb,white_20%,var(--primary))]",
  },
  wip: {
    label: "WIP", icon: Loader,
    cls: "border-yellow-600 bg-yellow-600 text-white hover:bg-yellow-600/90",
    divider: "border-l-yellow-500",
  },
  worked: {
    label: "Worked", icon: Check,
    cls: "border-green-600 bg-green-600 text-white hover:bg-green-600/90",
    divider: "border-l-green-500",
  },
}

export function MarkWorkPopover({ status, size = "sm", onSubmit }: {
  status: WorkStatus
  /** Match the row it sits in: `sm` in the merchant table, `default` beside the
   *  full-size actions on the merchant detail header. */
  size?: "sm" | "default"
  onSubmit: (choice: string, note: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState("")
  const [note, setNote] = useState("")
  const { label, icon: Icon, cls, divider } = WORK_STATES[status]
  const iconSize = size === "sm" ? "size-3.5" : "size-4"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Figma "ButtonGroup" (split button) — ds5 has no ButtonGroup, so compose two
          Buttons + a divider: main action on the left, dropdown chevron on the right.
          Flattening the inner corners is what makes the two halves read as one
          control, so nothing may override the radius here. Both halves carry the
          state color, and `-ml-px` pulls the halves' borders into one shared line
          so the divider is 1px rather than two stacked borders. */}
      <div className="inline-flex items-center">
        <Button size={size} className={cn("rounded-r-none", cls)} onClick={() => setOpen(true)}>
          {Icon && <Icon className={iconSize} />} {label}
        </Button>
        <PopoverTrigger asChild>
          <Button size={size} aria-label="Mark work options" className={cn("-ml-px rounded-l-none px-2", cls, divider)}>
            <ChevronDown className={iconSize} />
          </Button>
        </PopoverTrigger>
      </div>
      {/* 440px runs past the right edge of any phone viewport when end-aligned — the
          trigger row itself wraps below `sm` (RiskReport's own actions row), but this
          content never got the same treatment, so opening it still clipped the Submit
          button off-screen. 92vw below `sm` fits any phone with a margin either side. */}
      <PopoverContent align="end" className="w-[92vw] max-w-[440px] p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Mark Work and Disposition</p>
        </div>

        <RadioGroup value={choice} onValueChange={setChoice} className="space-y-4 px-4 py-3">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Mark Work</Label>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Work in Progress" id="mw-wip" />
              <Label htmlFor="mw-wip" className="text-sm font-normal">Work in Progress</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Disposition</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {DISPOSITIONS.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <RadioGroupItem value={d} id={`mw-${d}`} />
                  <Label htmlFor={`mw-${d}`} className="text-sm font-normal">{d}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 7000))}
              placeholder="Enter note..."
              rows={note ? 5 : 1}
              className="resize-none"
            />
            {note && <p className="text-xs text-muted-foreground">{note.length.toLocaleString()}/7,000 characters</p>}
          </div>
        </RadioGroup>

        <div className="flex justify-end gap-2 px-4 pb-3">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" disabled={!choice} onClick={() => { onSubmit(choice, note); setOpen(false) }}>Submit</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
