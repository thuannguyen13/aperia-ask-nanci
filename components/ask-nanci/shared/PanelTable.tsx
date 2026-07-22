"use client"

import { cn } from "aperia-ds5/utils"

// The shared rounded panel-table recipe. border-separate (not collapse) so the
// rounded corners + overflow actually clip; row dividers live on the cells via
// the arbitrary variants below. Change the look here once, not in every panel.
export function PanelTable({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <table
      className={cn(
        "w-full text-xs border-separate border-spacing-0 overflow-hidden rounded-lg border",
        "[&_th]:border-b [&_tr:not(:last-child)_td]:border-b",
        className,
      )}
    >
      {children}
    </table>
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
      <thead>
        <tr className="border-b bg-muted/40">
          {headers.map((header, i) => (
            <Th key={i} align={i === 0 ? "left" : "right"}>{header}</Th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </PanelTable>
  )
}

// Column header cell — sentence-case, muted, medium weight (matches Figma).
// Inherits font-size from the table. Wrap the header row in `<tr className="bg-muted/40">`.
export function Th({ align = "left", className, children }: { align?: "left" | "right"; className?: string; children?: React.ReactNode }) {
  return (
    <th
      className={cn(
        "px-3 py-2 font-medium text-foreground",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </th>
  )
}

// Body cell. `mono` for numeric columns (amounts/ids/dates), `align="right"` to right-align.
export function Td({ align = "left", mono = false, className, children }: { align?: "left" | "right"; mono?: boolean; className?: string; children?: React.ReactNode }) {
  return (
    <td
      className={cn(
        "px-3 py-2 text-foreground",
        mono && "font-mono",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  )
}
