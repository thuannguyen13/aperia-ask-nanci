"use client"

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react"
import type { ReactElement } from "react"
import { CartesianGrid, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"

/**
 * The frame every chart renders inside.
 *
 * It is the design system's `ChartContainer` (DS-FIRST): recharts' responsive container
 * plus the axis and grid styling, a `--color-<series>` variable per entry in `config`
 * with its light and dark values, and the context `ChartTooltipContent` reads labels
 * from. What the container does not decide is anything about its width being small, so
 * the three decisions below are made here once instead of chart by chart:
 *
 *  - **Chrome.** The axis, margin, grid and tooltip below are the gallery's (`/charts`),
 *    exported so a panel and the reference page draw with the same parts. The margin is
 *    injected into the chart element so no call site can forget it.
 *  - **The legend.** Recharts' own `<Legend>` (and ds5's `ChartLegend` over it) never
 *    reports its height, so the chart has to guess how much room to leave and gets it
 *    wrong the moment entries wrap onto a second line. `legend` renders the config's
 *    entries below the chart as ordinary markup, where its height is real layout the
 *    chart never has to account for. It carries the container's chart id so the same
 *    colour variables resolve on the swatches.
 *  - **Tick density.** `narrow` is handed back to the caller for `chartAxisProps`, because
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

// The chrome every chart shares with the /charts gallery, which is the reference for
// how a chart here looks. A chart that draws its own axis lines or a solid grid is
// drifting from it.

/** Axis chrome: no axis line, no tick marks, and 8px between the line and its labels. */
export const CHART_AXIS = { tickLine: false, axisLine: false, tickMargin: 8 } as const

/**
 * Left stays 0 because `<YAxis>` reserves its own width; the gap it needs is not
 * margin. Bottom stays 0 because `tickMargin` already holds the x labels off the plot.
 */
export const CHART_MARGIN = { top: 4, right: 8, bottom: 0, left: 0 } as const

/** The dashed grid, horizontal by default. */
export function ChartGrid({ vertical = false }: { vertical?: boolean }) {
  return <CartesianGrid vertical={vertical} horizontal={!vertical} strokeDasharray="3 3" />
}

// min-w widens the card and the row is justify-between, so the label and its value
// get real air between them instead of nearly touching at the DS min-w-32.
const TOOLTIP_SPACING = "min-w-44 [&_.justify-between]:gap-6"

/**
 * The figure in the middle of a donut, with a caption under it.
 *
 * recharts 3 resolves a `position="center"` label against the cartesian box (x, y,
 * width, height) even inside a Pie, so the shadcn pattern that reads `cx` off the
 * viewBox renders nothing. The centre is taken from whichever box arrives.
 */
export function ChartCenterLabel({ value, caption, className }: { value: React.ReactNode; caption?: React.ReactNode; className?: string }) {
  return (
    <Label
      position="center"
      content={({ viewBox }) => {
        if (!viewBox) return null
        const cx = "cx" in viewBox ? viewBox.cx : (viewBox.x ?? 0) + (viewBox.width ?? 0) / 2
        const cy = "cy" in viewBox ? viewBox.cy : (viewBox.y ?? 0) + (viewBox.height ?? 0) / 2
        return (
          <text x={cx} y={cy} textAnchor="middle">
            <tspan x={cx} dy={caption ? "-2" : "6"} className={cn("fill-foreground text-xl font-semibold", className)}>{value}</tspan>
            {caption && <tspan x={cx} dy="18" className="fill-muted-foreground text-[10px]">{caption}</tspan>}
          </text>
        )
      }}
    />
  )
}

/** ds5's tooltip with the house spacing. Takes whatever `ChartTooltipContent` takes. */
export function ChartTip({ className, indicator = "dot", ...props }: React.ComponentProps<typeof ChartTooltipContent>) {
  return <ChartTooltip content={<ChartTooltipContent indicator={indicator} className={cn(TOOLTIP_SPACING, className)} {...props} />} />
}

export function ResponsiveChart({
  height = 200,
  minHeight,
  config = {},
  legend = false,
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
  /**
   * One entry per series, keyed by its `dataKey`. The label names it in the tooltip and
   * the legend; the colour becomes `var(--color-<key>)` for the series to draw with.
   */
  config?: ChartConfig
  /** Render the config's entries below the chart. */
  legend?: boolean
  className?: string
  /**
   * Returns one Recharts chart element — BarChart, LineChart, AreaChart, and so on.
   * A function rather than an element so the axes inside it can see `narrow`, which is
   * measured here and would otherwise be unreachable from the call site.
   */
  children: (narrow: boolean) => ReactElement<{ margin?: object }>
}) {
  const ref = useRef<HTMLDivElement>(null)
  // ChartContainer prefixes the id itself; the legend below repeats the prefixed form so
  // the container's colour variables are in scope on its swatches.
  const id = useId().replace(/:/g, "")
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
    ? cloneElement(chart, { margin: { ...CHART_MARGIN, ...chart.props.margin } })
    : chart

  const entries = Object.entries(config)

  return (
    <div ref={ref} className={className}>
      {/* aspect-auto drops the container's 16:9 default so the height prop rules. */}
      <ChartContainer id={id} config={config} className="aspect-auto w-full" style={{ height, minHeight }}>
        {framed}
      </ChartContainer>

      {legend && entries.length > 0 && (
        <ul
          data-chart={`chart-${id}`}
          className={cn(
            "flex list-none flex-wrap gap-x-4 gap-y-2 pt-4",
            // Centred while the entries fit one line, left-aligned once they wrap, which
            // is the point at which a centred last row reads as a mistake.
            narrow ? "justify-start" : "justify-center",
          )}
        >
          {entries.map(([key, entry]) => (
            <li key={key} className="flex items-center gap-1.5 text-xs text-foreground">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: `var(--color-${key})` }}
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
 * The axis chrome plus the tick density a given width allows. Spread onto every axis;
 * on an `<XAxis>` it is also what lets long labels drop instead of colliding:
 *
 *     <ResponsiveChart height={180} config={{ sales: { label: "Sales", color: "var(--chart-1)" } }}>
 *       {(narrow) => (
 *         <BarChart data={data}>
 *           <ChartGrid />
 *           <XAxis dataKey="month" {...chartAxisProps(narrow)} />
 *           <YAxis {...chartAxisProps(narrow)} width={40} />
 *           <ChartTip />
 *           <Bar dataKey="sales" fill="var(--color-sales)" />
 *         </BarChart>
 *       )}
 *     </ResponsiveChart>
 */
export function chartAxisProps(narrow: boolean) {
  return {
    ...CHART_AXIS,
    tick: { fontSize: narrow ? 10 : 11 },
    // "preserveStartEnd" keeps the first and last label whatever else drops, so a narrow
    // axis still says what range it covers. Never `interval={0}`, which forces every
    // label and switches off collision handling entirely.
    interval: "preserveStartEnd" as const,
    minTickGap: narrow ? 24 : 8,
  }
}
