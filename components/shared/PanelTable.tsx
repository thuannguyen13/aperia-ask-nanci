"use client"

import { createContext, useContext } from "react"
import { ChevronsUpDown } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableCell } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"

// The shared panel-table recipe, built on the design system's table primitives
// (DS-FIRST): Table / TableHeader / TableRow / TableHead / TableCell all come from
// aperia-ds5. This file only adds the local context ds5 has no opinion on — the
// rounded bordered container, the header tint, the density scale, and the sort
// affordance. Change the look here once, not in every panel.
//
// ponytail: ds5's own defaults are deliberately overridden, not inherited. It ships
// `h-10 px-2` headers, `p-2 whitespace-nowrap` cells and the browser's collapsed
// border model; every override below exists because a panel here needs something
// different, and tailwind-merge inside `cn` resolves each one against ds5's class.

/**
 * Table density — the ONE axis a table is allowed to vary on.
 *
 * `compact`     — 12px, tight rows. Concept side panels, which are narrow drawers
 *                 stacked up to three deep; 14px wraps their columns.
 * `comfortable` — 14px, roomier rows. The whole Aperia Risk console, every table on
 *                 every screen, whether it is page-level content or sitting inside a
 *                 dashboard card. One console, one table.
 *
 * Density follows the container's width, not the table's importance. Anything beyond
 * these two values is drift — do not add a third.
 */
export type PanelTableDensity = "compact" | "comfortable"

// Cells read this instead of taking a prop, so a call site can never put a compact
// cell in a comfortable table.
const DensityContext = createContext<PanelTableDensity>("compact")

// Header and body cells share one padding value by construction — the pair can never
// drift the way the hand-rolled tables did.
const CELL_PADDING: Record<PanelTableDensity, string> = {
  compact: "px-3 py-2",
  comfortable: "px-4 py-2.5",
}

export function PanelTable({ density = "compact", className, children }: { density?: PanelTableDensity; className?: string; children: React.ReactNode }) {
  return (
    <DensityContext.Provider value={density}>
      {/* Scrolls sideways instead of squeezing columns when the table is wider than
          its container (narrow panels, phones). No-op when it already fits — this
          is the one shipped table treatment, not a mobile-only mode. */}
      <div className="overflow-x-auto">
        <Table
          className={cn(
            // border-separate (not ds5's inherited collapse) so the rounded corners and
            // overflow actually clip. Row borders do not paint in the separated model,
            // so the dividers ride on the cells instead.
            "border-separate border-spacing-0 overflow-hidden border",
            "[&_tr:not(:last-child)_td]:border-b",
            density === "comfortable" ? "rounded-xl text-sm" : "rounded-lg text-xs",
            className,
          )}
        >
          {children}
        </Table>
      </div>
    </DensityContext.Provider>
  )
}

// The "label column + right-aligned figure columns" table shape — a wide first
// column, the rest equal-width and right-aligned. Pass the header labels ("" for
// a blank first header) and the <tr> rows as children.
// ponytail: only the first <col> is declared; under table-fixed the remaining
// columns split the leftover width equally, which is what every call site wants.
export function PanelFigureTable({ headers, children }: { headers: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <PanelTable className="table-fixed">
      <colgroup>
        <col className="w-[40%]" />
      </colgroup>
      <Thead>
        {headers.map((header, i) => (
          <Th key={i} align={i === 0 ? "left" : "right"}>{header}</Th>
        ))}
      </Thead>
      <tbody>{children}</tbody>
    </PanelTable>
  )
}

// The header row. Every panel table wrapped its own `<tr className="border-b
// bg-muted/40">` by hand, and one of them had drifted to bg-muted/50.
export function Thead({ children }: { children: React.ReactNode }) {
  // hover:bg-transparent cancels ds5's row hover, which belongs to body rows only.
  return (
    <TableHeader>
      <TableRow className="text-left hover:bg-transparent">{children}</TableRow>
    </TableHeader>
  )
}

// Column header cell — sentence-case, medium weight (matches Figma). Padding and
// font-size come from the table, so a Th renders correctly at either density.
//
// `sortable` draws the unsorted affordance. It is display-only wherever the list
// behind it does not sort yet; the point of it living here is that the console used
// to draw two different icons for the same meaning (ChevronsUpDown on the dashboard
// tables, ArrowUpDown on the assignment list).
export function Th({ align = "left", sortable = false, className, children }: { align?: "left" | "right"; sortable?: boolean; className?: string; children?: React.ReactNode }) {
  const density = useContext(DensityContext)
  return (
    <TableHead
      className={cn(
        // h-auto drops ds5's fixed h-10 so the density padding sets the height.
        // The tint is on the cell, not the row: under border-separate a row
        // background does not paint through its cells and the header loses its band.
        "h-auto border-b bg-muted/40 font-medium text-foreground",
        CELL_PADDING[density],
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {sortable ? (
        <span className={cn("inline-flex items-center gap-1", align === "right" && "flex-row-reverse")}>
          {children}
          <ChevronsUpDown className="size-3 shrink-0 text-muted-foreground" />
        </span>
      ) : (
        children
      )}
    </TableHead>
  )
}

// Body cell. `mono` for numeric columns (amounts/ids/dates), `align="right"` to
// right-align. Padding and font-size come from the table.
export function Td({ align = "left", mono = false, colSpan, className, children }: { align?: "left" | "right"; mono?: boolean; colSpan?: number; className?: string; children?: React.ReactNode }) {
  const density = useContext(DensityContext)
  return (
    <TableCell
      colSpan={colSpan}
      // whitespace-normal drops ds5's nowrap: panel tables carry prose columns
      // ("Suggested action") that must wrap rather than widen the table. A call site
      // that wants nowrap passes it and tailwind-merge lets it win.
      className={cn(
        "whitespace-normal text-foreground",
        CELL_PADDING[density],
        mono && "font-mono",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </TableCell>
  )
}
