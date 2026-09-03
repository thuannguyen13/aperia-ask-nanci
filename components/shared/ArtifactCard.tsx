"use client"

import type { LucideIcon } from "lucide-react"
import { PanelBottomOpen, PanelRightOpen } from "lucide-react"
import { buttonVariants } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useIsMobile } from "@/hooks/use-is-mobile"

/**
 * The block an answer leaves behind for something it opened: a panel, a request, a sheet.
 *
 * One shape, two former copies. `PanelArtifactCard` and the change-request card in
 * `ChatMessage` were built separately and drifted on background, radius, title weight and
 * the trailing control. The Figma `Artifact` component is one block with a Desktop and a
 * Mobile variant, so this is that block and both call sites go through it.
 *
 * The trailing control is drawn with the design system's own button styles rather than a
 * real `<Button>`: the whole card is the click target, and nesting a button inside a
 * button is invalid HTML. Keeping the card as the target also keeps the tap area a thumb
 * can hit, which a small trailing button on its own would not.
 */
export function ArtifactCard({
  icon: Icon,
  title,
  subtitle,
  action,
  actionIcon,
  onClick,
  ariaLabel,
  className,
}: {
  /** Sits inside the white thumbnail. Swappable per the design. */
  icon: LucideIcon
  title: string
  subtitle: string
  action: string
  /** Defaults to the panel icon for the current width: right on desktop, bottom on a phone. `null` shows none. */
  actionIcon?: LucideIcon | null
  onClick: () => void
  ariaLabel?: string
  className?: string
}) {
  const isMobile = useIsMobile()
  // Which edge the panel arrives from is the one thing the icon is saying, so it follows
  // the width rather than being fixed at author time.
  const ActionIcon = actionIcon === null ? null : actionIcon ?? (isMobile ? PanelBottomOpen : PanelRightOpen)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex w-full items-center gap-3 overflow-hidden rounded-lg border bg-muted p-3 text-left transition-colors",
        "hover:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card">
          <Icon className="size-5 text-muted-foreground" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{title}</span>
          <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
        </span>
      </span>

      {/* Styled by the design system, not by hand: the outline variant already encodes the
          height, radius, padding and icon size the design asks for. */}
      <span className={cn(buttonVariants({ variant: "outline", size: "default" }), "shrink-0")}>
        {action}
        {ActionIcon && <ActionIcon />}
      </span>
    </button>
  )
}
