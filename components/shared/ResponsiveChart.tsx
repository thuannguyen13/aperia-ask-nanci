"use client"

import { cloneElement, isValidElement, useEffect, useRef, useState } from "react"
import type { ReactElement } from "react"
import { ResponsiveContainer } from "recharts"
import { cn } from "aperia-ds5/utils"

/**
 * The frame every chart renders inside.
 *
 * Recharts already redraws a chart at whatever width its parent has, and already drops
 * x-axis labels that would collide. What it does not decide is anything about that width
 * being small, so the three decisions below are made here once instead of chart by chart:
 *
 *  - **Margins.** The Recharts default is 5px on every side, which clips a long or turned
 *    label. The gaps here leave room for one line of tick text.
 *  - **The legend.** Recharts' own `<Legend>` never reports its height, so the chart has
 *    to guess how much room to leave and gets it wrong the moment entries wrap onto a
 *    second line. Passing `legend` renders it below the chart as ordinary markup, where
 *    its height is real layout the chart never has to account for.
 *  - **Tick density.** `narrow` is handed back to the caller for `chartTickProps`, because
 *    Recharts measures collisions in pixels and a 390px axis has room for two or three
 *    dates, not eight.
 *
 * Width comes from a ResizeObserver on this element, not from `useIsMobile`: a chart in a
 * narrow side panel on a desktop is exactly as cramped as the same chart on a phone, and
 * the viewport cannot tell those apart.
 */

// Below this the chart is treated as narrow. 400px is a phone at 390px plus a little, and
// it is also about where a concept side panel lands.
const NARROW = 400

// Wider than Recharts' 5px default, which exists to be overridden. Left stays 0 because
// `<YAxis>` reserves its own width; the gap it needs is not margin.
const MARGIN = { top: 8, right: 12, bottom: 8, left: 0 } as const
const MARGIN_NARROW = { top: 8, right: 8, bottom: 8, left: 0 } as const

export type ChartLegendEntry = {
  label: string
  color: string
}

export function ResponsiveChart({
  height = 200,
  minHeight,
  legend,
  className,
  children,
}: {
  /**
   * A number, or "100%" for a chart that fills a flex parent. The percentage form
   * needs `minHeight` with it: recharts measures once, and a percentage against a
   * parent that has not been laid out yet resolves to 0 and never re-measures.
   */
  height?: number | `${number}%`
  minHeight?: number
  legend?: ChartLegendEntry[]
  className?: string
  /**
   * Returns one Recharts chart element — BarChart, LineChart, AreaChart, and so on.
   * A function rather than an element so the axes inside it can see `narrow`, which is
   * measured here and would otherwise be unreachable from the call site.
   */
  children: (narrow: boolean) => ReactElement<{ margin?: object }>
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Starts false, meaning wide: the server and the first client paint agree, and a chart
  // that is actually wide never flashes the narrow layout.
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < NARROW)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const chart = children(narrow)
  // The margin is injected rather than asked for, so no call site can forget it. A chart
  // that genuinely needs its own still wins: its prop is spread last.
  const framed = isValidElement(chart)
    ? cloneElement(chart, { margin: { ...(narrow ? MARGIN_NARROW : MARGIN), ...chart.props.margin } })
    : chart

  return (
    <div ref={ref} className={className}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        {framed}
      </ResponsiveContainer>

      {legend && legend.length > 0 && (
        <ul
          className={cn(
            "mt-2 flex list-none flex-wrap gap-x-3 gap-y-1 px-1",
            // Centred while the entries fit one line, left-aligned once they wrap, which
            // is the point at which a centred last row reads as a mistake.
            narrow ? "justify-start" : "justify-center",
          )}
        >
          {legend.map((entry) => (
            <li key={entry.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: entry.color }}
              />
              {entry.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * The tick props an axis needs at a given width. Spread onto any `<XAxis>` whose labels
 * are long enough to collide:
 *
 *     <ResponsiveChart height={180}>
 *       {(narrow) => (
 *         <BarChart data={data}>
 *           <XAxis dataKey="month" {...chartTickProps(narrow)} />
 *         </BarChart>
 *       )}
 *     </ResponsiveChart>
 */
export function chartTickProps(narrow: boolean) {
  return {
    tick: { fontSize: narrow ? 10 : 11 },
    // "preserveStartEnd" keeps the first and last label whatever else drops, so a narrow
    // axis still says what range it covers. Never `interval={0}`, which forces every
    // label and switches off collision handling entirely.
    interval: "preserveStartEnd" as const,
    minTickGap: narrow ? 24 : 8,
  }
}
