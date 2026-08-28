"use client"

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart,
  Label, LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar,
  RadarChart, RadialBar, RadialBarChart, ReferenceArea, ReferenceLine, Scatter, ScatterChart,
  Treemap, XAxis, YAxis, ZAxis,
} from "recharts"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from "aperia-ds5"
import { HEATMAP_HOURS, HEATMAP_ROWS } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  GALLERY_ALERT_VOLUME, GALLERY_AUTH_FUNNEL, GALLERY_CHANNEL_MIX, GALLERY_DECLINE_REASONS,
  GALLERY_HEALTH_PROFILE, GALLERY_INTRADAY, GALLERY_MONTHLY, GALLERY_SCATTER, GALLERY_SLA,
  GALLERY_TOP_MERCHANTS, type ChartSwatch,
} from "@/lib/ask-nanci/data/chart-gallery"

// ── Options the gallery controls drive ─────────────────────────────────────────

export interface GalleryOptions {
  grid: boolean
  legend: boolean
  indicator: "dot" | "line" | "dashed"
  /**
   * Recharts specimens read their color from the CSS vars ChartStyle writes, which already
   * carry the light/dark split. The two no-library specimens have no ChartContainer around
   * them, so they need the scheme handed to them to resolve a light/dark pair themselves.
   */
  dark: boolean
  /**
   * The effective ramp: the selected palette's swatches with any per-dot edits from the
   * gallery's swatch strip applied. Specimens never look a palette up themselves — this
   * is the one seam the strip's color pickers write through.
   */
  swatches: readonly ChartSwatch[]
}

/** Picks the half of a light/dark pair the current scheme should show. */
export function resolveSwatch(swatch: ChartSwatch, dark: boolean) {
  return typeof swatch === "string" ? swatch : dark ? swatch.dark : swatch.light
}

/**
 * Turns a series list into a shadcn ChartConfig against the chosen palette. A swatch
 * that is one string becomes `color`; a light/dark pair becomes `theme`, which is what
 * makes ChartStyle emit a second rule under `.dark`. Series beyond the ramp wrap around.
 */
export function buildChartConfig(
  series: readonly { key: string; label: string }[],
  swatches: readonly ChartSwatch[],
): ChartConfig {
  return Object.fromEntries(
    series.map((s, i) => {
      const swatch = swatches[i % swatches.length]
      return [
        s.key,
        typeof swatch === "string"
          ? { label: s.label, color: swatch }
          : { label: s.label, theme: swatch },
      ]
    }),
  )
}

// Axis chrome every cartesian specimen shares. ChartContainer already paints tick text
// muted-foreground and the grid stroke border/50, so nothing here sets a color.
const AXIS = { tickLine: false, axisLine: false, tickMargin: 8 } as const

// Y-axis labels are currency, so they need real width and a left margin of zero. A
// negative left inset (the usual trick for tightening a chart) clips them from the left.
// One margin for every specimen now — legend charts no longer reserve extra
// margin.bottom for recharts' own <Legend>, because they don't use it (see Legend below).
const MARGIN = { top: 4, right: 8, left: 0, bottom: 0 } as const
const MONEY_AXIS_WIDTH = 56

// One height for every specimen, legend or not. A shorter box for no-legend charts
// (used to be 220px against this one's 280px) reads fine in isolation, but the two
// sizes land in the same md:grid-cols-2 row unpredictably — whichever specimen comes
// first in a group pairs with whatever comes second, so rows went jagged as often as
// they matched. One height keeps every row flush regardless of pairing.
const BOX = "aspect-auto h-[280px] w-full"

function Grid({ opts, vertical = false }: { opts: GalleryOptions; vertical?: boolean }) {
  return opts.grid ? <CartesianGrid vertical={vertical} horizontal={!vertical} strokeDasharray="3 3" /> : null
}

// min-w widens the card and the row is justify-between, so the label and its value
// get real air between them instead of nearly touching at the DS min-w-32.
const TOOLTIP_SPACING = "min-w-44 [&_.justify-between]:gap-6"

function Tip({ opts }: { opts: GalleryOptions }) {
  return <ChartTooltip content={<ChartTooltipContent indicator={opts.indicator} className={TOOLTIP_SPACING} />} />
}

// Not ds5's ChartLegend/ChartLegendContent (recharts' <Legend>) — that renders through
// its own absolutely-positioned wrapper, sized off a worst-case guess (a fixed
// margin.bottom reservation) because recharts never tells the chart how tall the
// legend actually turned out. Neither ResponsiveContainer nor ChartContainer are
// legend-aware; the reservation is a hand-built guess layered on top of both, not
// something either one manages. That guess is either too small (clipped/overlapping)
// or too big (a dead gap below a legend that only needed one line) depending on how
// many items actually wrap at the current width.
//
// This renders as a normal sibling below ChartContainer instead — real flow, real
// height, sized to what's actually there. It reads straight off the same `series`
// list + swatches every specimen already builds its ChartConfig from, so the dot
// colors always match the chart exactly.
function Legend({ opts, series }: { opts: GalleryOptions; series: readonly { key: string; label: string }[] }) {
  if (!opts.legend) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4">
      {series.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1.5 text-xs">
          <div
            className="h-2 w-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: resolveSwatch(opts.swatches[i % opts.swatches.length], opts.dark) }}
          />
          <span className="text-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

const money = (v: number) => `$${Number(v.toFixed(1))}M`
const pct = (v: number) => `${v}%`

// ── Comparison ─────────────────────────────────────────────────────────────────

const MERCHANT_SERIES = [{ key: "volume", label: "Volume" }]

// One measure, one color: the bars are all the same series, so they share a swatch.
function VerticalBar({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(MERCHANT_SERIES, opts.swatches)} className={BOX}>
      <BarChart data={GALLERY_TOP_MERCHANTS} margin={MARGIN}>
        <Grid opts={opts} />
        <XAxis dataKey="merchant" {...AXIS} interval={0} tickFormatter={(v: string) => v.split(" ")[0]} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const CHANNEL_SERIES = [
  { key: "cardPresent", label: "Card present" },
  { key: "ecom", label: "E-commerce" },
  { key: "keyed", label: "Keyed" },
  { key: "wallet", label: "Mobile wallet" },
  { key: "ach", label: "ACH" },
]

// Five series over twelve months is legible stacked but not grouped — the grouped
// specimen shows the year's second half so its bars stay wide enough to read.
const CHANNEL_MIX_H2 = GALLERY_CHANNEL_MIX.slice(6)

function GroupedBar({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX}>
        <BarChart data={CHANNEL_MIX_H2} margin={MARGIN}>
          <Grid opts={opts} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
          <Tip opts={opts} />
          {CHANNEL_SERIES.map((s) => (
            <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ChartContainer>
      <Legend opts={opts} series={CHANNEL_SERIES} />
    </div>
  )
}

function StackedBar({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX}>
        <BarChart data={GALLERY_CHANNEL_MIX} margin={MARGIN}>
          <Grid opts={opts} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
          <Tip opts={opts} />
          {CHANNEL_SERIES.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="mix"
              fill={`var(--color-${s.key})`}
              radius={i === CHANNEL_SERIES.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <Legend opts={opts} series={CHANNEL_SERIES} />
    </div>
  )
}

function HorizontalBar({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(MERCHANT_SERIES, opts.swatches)} className={BOX}>
      <BarChart
        layout="vertical"
        data={GALLERY_TOP_MERCHANTS}
        margin={{ ...MARGIN, right: 34 }}
      >
        <Grid opts={opts} vertical />
        <XAxis type="number" dataKey="volume" {...AXIS} tickFormatter={money} />
        <YAxis type="category" dataKey="merchant" {...AXIS} width={110} />
        <Tip opts={opts} />
        <Bar dataKey="volume" fill="var(--color-volume)" radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="volume"
            position="right"
            formatter={(v) => money(Number(v))}
            className="fill-muted-foreground text-[10px]"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

// ── Trend ──────────────────────────────────────────────────────────────────────

const VOLUME_SERIES = [{ key: "volume", label: "Volume" }]

function SingleLine({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(VOLUME_SERIES, opts.swatches)} className={BOX}>
      <LineChart data={GALLERY_MONTHLY} margin={MARGIN}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Line dataKey="volume" type="monotone" stroke="var(--color-volume)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}

function MultiLine({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX}>
        <LineChart data={GALLERY_CHANNEL_MIX} margin={MARGIN}>
          <Grid opts={opts} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
          <Tip opts={opts} />
          {CHANNEL_SERIES.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="monotone"
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <Legend opts={opts} series={CHANNEL_SERIES} />
    </div>
  )
}

function SingleArea({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(VOLUME_SERIES, opts.swatches)} className={BOX}>
      <AreaChart data={GALLERY_MONTHLY} margin={MARGIN}>
        <defs>
          <linearGradient id="gallery-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-volume)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-volume)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Area
          dataKey="volume"
          type="monotone"
          stroke="var(--color-volume)"
          strokeWidth={2}
          fill="url(#gallery-area-fill)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

function StackedArea({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX}>
        <AreaChart data={GALLERY_CHANNEL_MIX} margin={MARGIN}>
          <Grid opts={opts} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
          <Tip opts={opts} />
          {CHANNEL_SERIES.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              type="monotone"
              stackId="mix"
              stroke={`var(--color-${s.key})`}
              fill={`var(--color-${s.key})`}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ChartContainer>
      <Legend opts={opts} series={CHANNEL_SERIES} />
    </div>
  )
}

const COMBO_SERIES = [
  { key: "volume", label: "Volume" },
  { key: "declines", label: "Decline rate" },
]

function Combo({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(COMBO_SERIES, opts.swatches)} className={BOX}>
        <ComposedChart data={GALLERY_MONTHLY} margin={{ ...MARGIN, right: 0 }}>
          <Grid opts={opts} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis yAxisId="left" {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
          <YAxis yAxisId="right" orientation="right" {...AXIS} tickFormatter={pct} width={44} />
          <Tip opts={opts} />
          <Bar yAxisId="left" dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            dataKey="declines"
            type="monotone"
            stroke="var(--color-declines)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ChartContainer>
      <Legend opts={opts} series={COMBO_SERIES} />
    </div>
  )
}

// ── Relationship ───────────────────────────────────────────────────────────────

// One series per quadrant category, so the scatter carries four ramp colors.
const SCORE_SERIES = [
  { key: "both", label: "Flagged by both" },
  { key: "mc", label: "Mastercard only" },
  { key: "vw", label: "VisionWeb only" },
  { key: "none", label: "Not flagged" },
] as const
const SCATTER_BY_CAT = SCORE_SERIES.map((s) => ({
  ...s, points: GALLERY_SCATTER.filter((p) => p.cat === s.key),
}))

const MERCHANTS_SERIES = [{ key: "merchants", label: "Merchants" }]

function Points({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(MERCHANTS_SERIES, opts.swatches)} className={BOX}>
      <ScatterChart margin={MARGIN}>
        {opts.grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis type="number" dataKey="vw" name="VisionWeb score" domain={[0, 100]} {...AXIS} />
        <YAxis type="number" dataKey="mc" name="Mastercard score" domain={[0, 100]} {...AXIS} width={40} />
        <Tip opts={opts} />
        <Scatter name="merchants" data={GALLERY_SCATTER} fill="var(--color-merchants)" fillOpacity={0.7} />
      </ScatterChart>
    </ChartContainer>
  )
}

function Quadrant({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(SCORE_SERIES, opts.swatches)} className={BOX}>
        {/* bottom: 24 is this chart's own axis title ("VisionWeb score"), not a legend
            reservation — at margin 0 its "insideBottom" position renders past the SVG's
            bottom edge and gets clipped entirely. */}
        <ScatterChart margin={{ ...MARGIN, bottom: 24 }}>
          <XAxis
            type="number" dataKey="vw" domain={[0, 100]} {...AXIS}
            label={{ value: "VisionWeb score", position: "insideBottom", offset: -12, fontSize: 10, style: { textAnchor: "middle" } }}
          />
          <YAxis
            type="number" dataKey="mc" domain={[0, 100]} {...AXIS} width={56}
            label={{ value: "Mastercard score", angle: -90, position: "insideLeft", offset: 6, fontSize: 10, style: { textAnchor: "middle" } }}
          />
          <ZAxis type="number" dataKey="mc" range={[24, 260]} />
          <ReferenceArea x1={0} x2={65} y1={65} y2={100} fill="var(--color-mc)" fillOpacity={0.07} />
          <ReferenceLine x={65} strokeDasharray="4 4" />
          <ReferenceLine y={65} strokeDasharray="4 4" />
          <Tip opts={opts} />
          {SCATTER_BY_CAT.map((s) => (
            <Scatter key={s.key} name={s.key} data={s.points} fill={`var(--color-${s.key})`} fillOpacity={0.6} />
          ))}
        </ScatterChart>
      </ChartContainer>
      <Legend opts={opts} series={SCORE_SERIES} />
    </div>
  )
}

// ── Part to whole ──────────────────────────────────────────────────────────────

const DECLINE_SERIES = GALLERY_DECLINE_REASONS.map((d) => ({ key: d.key, label: d.reason }))

function Slices({ opts, donut }: { opts: GalleryOptions; donut?: boolean }) {
  const config = buildChartConfig(DECLINE_SERIES, opts.swatches)
  return (
    <div className="flex flex-col">
      <ChartContainer config={config} className={BOX}>
        <PieChart margin={MARGIN}>
          <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel className={TOOLTIP_SPACING} />} />
          <Pie
            data={GALLERY_DECLINE_REASONS}
            dataKey="share"
            nameKey="key"
            innerRadius={donut ? 70 : 0}
            outerRadius={110}
            strokeWidth={donut ? 3 : 1}
          >
            {GALLERY_DECLINE_REASONS.map((d) => (
              <Cell key={d.key} fill={`var(--color-${d.key})`} />
            ))}
            {donut && (
              <Label
                position="center"
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan x={viewBox.cx} dy="-2" className="fill-foreground text-xl font-semibold">
                        8.4%
                      </tspan>
                      <tspan x={viewBox.cx} dy="18" className="fill-muted-foreground text-[10px]">
                        decline rate
                      </tspan>
                    </text>
                  ) : null
                }
              />
            )}
          </Pie>
        </PieChart>
      </ChartContainer>
      <Legend opts={opts} series={DECLINE_SERIES} />
    </div>
  )
}

const SLA_SERIES = GALLERY_SLA.map((s) => ({ key: s.key, label: s.team }))
// fill on the data rows (the shadcn radial pattern): RadialBar reads it for the ring
// AND puts it on the legend payload — Cells color the rings but leave the legend
// dots invisible, and Recharts 3 accepts no external legend payload.
const SLA_DATA = GALLERY_SLA.map((s) => ({ ...s, fill: `var(--color-${s.key})` }))

function Radial({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(SLA_SERIES, opts.swatches)} className={BOX}>
        {/* Fixed pixels, not percentages — recharts scales a percentage radius off the
            full container's min(width, height), ignoring margin. Pie/Donut use the same
            fixed-radius pattern. */}
        <RadialBarChart data={SLA_DATA} innerRadius={35} outerRadius={110} startAngle={90} endAngle={-270} margin={MARGIN}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel className={TOOLTIP_SPACING} />} />
          <RadialBar dataKey="attainment" background cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>
      <Legend opts={opts} series={SLA_SERIES} />
    </div>
  )
}

const TREEMAP_SERIES = [{ key: "blocks", label: "Volume" }]
const TREEMAP_PEAK = Math.max(...GALLERY_TOP_MERCHANTS.map((m) => m.volume))
// One hue, intensity scaled to value (45%..100% of the swatch toward the background).
// The shade lives on the data rows so the block rect AND the tooltip dot read the same
// fill — computed inside the block, the tooltip had no color at all.
const TREEMAP_DATA = GALLERY_TOP_MERCHANTS.map((m) => ({
  name: m.merchant,
  size: m.volume,
  fill: `color-mix(in oklab, var(--color-blocks) ${Math.round(45 + (m.volume / TREEMAP_PEAK) * 55)}%, var(--background))`,
}))

/** Blocks are laid out at render time, so the label has to be clipped to the box it landed in. */
function truncateToWidth(text: string, px: number) {
  const max = Math.floor(px / 5.6) // 10px medium Inter averages a shade under 6px per glyph
  return text.length <= max ? text : `${text.slice(0, Math.max(max - 1, 0)).trimEnd()}\u2026`
}

/**
 * Recharts' default treemap block drops the label on all but the largest few. This one
 * paints the row's fill (the value-scaled shade above) and keeps the label wherever it
 * fits, outlined so it reads on the lighter fills too.
 */
function TreemapBlock(props: unknown) {
  const { x = 0, y = 0, width = 0, height = 0, name = "", size = 0, fill = "var(--color-blocks)" } =
    props as { x?: number; y?: number; width?: number; height?: number; name?: string; size?: number; fill?: string }
  const fits = width > 76 && height > 40
  return (
    <g>
      <rect
        x={x} y={y} width={width} height={height}
        fill={fill}
        stroke="var(--background)"
        strokeWidth={2}
      />
      {fits && (
        <text
          x={x + 8} y={y + 20}
          paintOrder="stroke"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth={2.5}
          className="fill-white text-[10px] font-medium"
        >
          <tspan>{truncateToWidth(name, width - 16)}</tspan>
          <tspan x={x + 8} dy="14" className="tabular-nums">{money(size)}</tspan>
        </text>
      )}
    </g>
  )
}

function Blocks({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(TREEMAP_SERIES, opts.swatches)} className={BOX}>
      <Treemap
        data={TREEMAP_DATA}
        dataKey="size"
        nameKey="name"
        content={<TreemapBlock />}
        isAnimationActive={false}
      >
        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel className={TOOLTIP_SPACING} />} />
      </Treemap>
    </ChartContainer>
  )
}

// ── Profile and process ────────────────────────────────────────────────────────

const PROFILE_SERIES = [
  { key: "portfolio", label: "Portfolio avg" },
  { key: "merchant", label: "This merchant" },
  { key: "topQuartile", label: "Top quartile" },
]

function Profile({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex flex-col">
      <ChartContainer config={buildChartConfig(PROFILE_SERIES, opts.swatches)} className={BOX}>
        {/* Fixed pixels, not a percentage — see the note on Radial's outerRadius. */}
        <RadarChart data={GALLERY_HEALTH_PROFILE} outerRadius={100} margin={MARGIN}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
          <Tip opts={opts} />
          {PROFILE_SERIES.map((s) => (
            <Radar
              key={s.key}
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              fill={`var(--color-${s.key})`}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ChartContainer>
      <Legend opts={opts} series={PROFILE_SERIES} />
    </div>
  )
}

const FUNNEL_SERIES = GALLERY_AUTH_FUNNEL.map((f, i) => ({ key: `stage${i}`, label: f.stage }))
// fill on the data rows, not Cells: the tooltip dot resolves payload.fill, which a
// Cell never reaches — same fix as the radial gauge's legend.
const FUNNEL_DATA = GALLERY_AUTH_FUNNEL.map((f, i) => ({
  ...f, key: `stage${i}`, fill: `var(--color-stage${i})`,
}))

function Drop({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(FUNNEL_SERIES, opts.swatches)} className={BOX}>
      <FunnelChart margin={{ top: 4, right: 96, left: 4, bottom: 4 }}>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel className={TOOLTIP_SPACING} />} />
        <Funnel dataKey="count" nameKey="key" data={FUNNEL_DATA} isAnimationActive={false}>
          <LabelList
            dataKey="stage"
            position="right"
            className="fill-muted-foreground text-[10px]"
            stroke="none"
          />
        </Funnel>
      </FunnelChart>
    </ChartContainer>
  )
}

// ── Micro ──────────────────────────────────────────────────────────────────────

function Spark({ opts }: { opts: GalleryOptions }) {
  return (
    <div className="flex items-end gap-4">
      <div>
        <div className="text-2xl font-semibold tabular-nums text-foreground">1,284</div>
        <div className="text-[11px] text-muted-foreground">transactions today</div>
      </div>
      <ChartContainer
        config={buildChartConfig(VOLUME_SERIES, opts.swatches)}
        className="aspect-auto h-14 flex-1"
      >
        <AreaChart data={GALLERY_INTRADAY} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Area
            dataKey="txns"
            type="monotone"
            stroke="var(--color-volume)"
            strokeWidth={1.5}
            fill="var(--color-volume)"
            fillOpacity={0.15}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// The one shape in the app that deliberately does not use Recharts: a proportional
// div is cheaper than a chart and lines up with the text column beside it.
function CssBars({ opts }: { opts: GalleryOptions }) {
  const color = resolveSwatch(opts.swatches[0], opts.dark)
  const max = Math.max(...GALLERY_ALERT_VOLUME.map((a) => a.count))
  return (
    <div className="flex h-[220px] flex-col justify-center gap-2.5">
      {GALLERY_ALERT_VOLUME.map((a) => (
        <div key={a.name} className="flex items-center gap-3 text-xs">
          <span className="w-40 shrink-0 truncate text-right text-muted-foreground">{a.name}</span>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className="h-3.5 rounded-[2px]"
              style={{ width: `${Math.max((a.count / max) * 100, 2)}%`, background: color }}
            />
            <span className="shrink-0 tabular-nums text-foreground">{a.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const HEAT_STEPS = [0.08, 0.24, 0.44, 0.68, 1]

function Heat({ opts }: { opts: GalleryOptions }) {
  const color = resolveSwatch(opts.swatches[0], opts.dark)
  return (
    <div className="flex h-[220px] flex-col justify-center gap-1">
      <div className="flex gap-1 pl-8">
        {HEATMAP_HOURS.map((h) => (
          <span key={h} className="flex-1 text-center text-[9px] text-muted-foreground">{h}</span>
        ))}
      </div>
      {HEATMAP_ROWS.map((row) => (
        <div key={row.day} className="flex items-center gap-1">
          <span className="w-7 shrink-0 text-[10px] text-muted-foreground">{row.day}</span>
          {row.levels.map((level, i) => (
            <div
              key={i}
              className="h-4 flex-1 rounded-[2px]"
              style={{ background: `color-mix(in oklab, ${color} ${HEAT_STEPS[level] * 100}%, var(--muted))` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Registry ───────────────────────────────────────────────────────────────────

export interface Specimen {
  id: string
  name: string
  render: (opts: GalleryOptions) => React.ReactNode
  /**
   * Renders on its own row, capped to this pixel width, instead of joining the
   * md:grid-cols-2 pairing — for a specimen that doesn't need a full card's width
   * (a single-number sparkline stretched to ~630px reads worse, not better).
   */
  maxWidth?: number
}

export interface SpecimenGroup {
  title: string
  specimens: Specimen[]
}

export const SPECIMEN_GROUPS: SpecimenGroup[] = [
  {
    title: "Comparison",
    specimens: [
      {
        id: "bar",
        name: "Bar",
        render: (o) => <VerticalBar opts={o} />,
      },
      {
        id: "bar-grouped",
        name: "Grouped bar",
        render: (o) => <GroupedBar opts={o} />,
      },
      {
        id: "bar-stacked",
        name: "Stacked bar",
        render: (o) => <StackedBar opts={o} />,
      },
      {
        id: "bar-horizontal",
        name: "Horizontal bar",
        render: (o) => <HorizontalBar opts={o} />,
      },
    ],
  },
  {
    title: "Trend",
    specimens: [
      {
        id: "line",
        name: "Line",
        render: (o) => <SingleLine opts={o} />,
      },
      {
        id: "line-multi",
        name: "Multi-line",
        render: (o) => <MultiLine opts={o} />,
      },
      {
        id: "area",
        name: "Area",
        render: (o) => <SingleArea opts={o} />,
      },
      {
        id: "area-stacked",
        name: "Stacked area",
        render: (o) => <StackedArea opts={o} />,
      },
      {
        id: "combo",
        name: "Combo, dual axis",
        render: (o) => <Combo opts={o} />,
      },
    ],
  },
  {
    title: "Relationship",
    specimens: [
      {
        id: "scatter",
        name: "Scatter",
        render: (o) => <Points opts={o} />,
      },
      {
        id: "quadrant",
        name: "Bubble quadrant",
        render: (o) => <Quadrant opts={o} />,
      },
    ],
  },
  {
    title: "Part to whole",
    specimens: [
      {
        id: "pie",
        name: "Pie",
        render: (o) => <Slices opts={o} />,
      },
      {
        id: "donut",
        name: "Donut",
        render: (o) => <Slices opts={o} donut />,
      },
      {
        id: "radial",
        name: "Radial gauge",
        render: (o) => <Radial opts={o} />,
      },
      {
        id: "treemap",
        name: "Treemap",
        render: (o) => <Blocks opts={o} />,
      },
    ],
  },
  {
    title: "Profile and process",
    specimens: [
      {
        id: "radar",
        name: "Radar",
        render: (o) => <Profile opts={o} />,
      },
      {
        id: "funnel",
        name: "Funnel",
        render: (o) => <Drop opts={o} />,
      },
    ],
  },
  {
    title: "Micro and no-library",
    specimens: [
      {
        id: "spark",
        name: "Sparkline",
        render: (o) => <Spark opts={o} />,
        maxWidth: 400,
      },
      {
        id: "css-bars",
        name: "Proportional bars",
        render: (o) => <CssBars opts={o} />,
      },
      {
        id: "heatmap",
        name: "Heatmap",
        render: (o) => <Heat opts={o} />,
      },
    ],
  },
]
