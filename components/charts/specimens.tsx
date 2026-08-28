"use client"

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart,
  Label, LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar,
  RadarChart, RadialBar, RadialBarChart, ReferenceArea, ReferenceLine, Scatter, ScatterChart,
  Treemap, XAxis, YAxis, ZAxis,
} from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
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
const MARGIN = { top: 4, right: 8, left: 0, bottom: 0 } as const
// ChartLegend renders via recharts' own absolutely-positioned wrapper anchored to the
// bottom of the chart's fixed-height box — it does NOT push the plot up to make room,
// it draws on top of whatever's there. bottom: 0 (or recharts' un-set default of ~5)
// only avoided visible overlap by accident, on charts whose plot happened to leave
// some empty margin near the axis. A wrapped two-line legend needs real reserved
// space regardless of luck — every specimen with a legend uses this margin instead.
const MARGIN_LEGEND = { ...MARGIN, bottom: 60 } as const
// Polar charts (Radial, Radar) center themselves on half the container height no
// matter what margin.bottom says — margin.bottom only shifts the legend, which
// recharts insets from the container's true bottom edge by that same amount. So for
// these two, a *smaller* bottom margin pulls the legend down toward the real edge
// (more clearance from the plot) instead of eating into it. A shared axis-based
// margin like MARGIN_LEGEND actively works against these two chart types.
const MARGIN_LEGEND_POLAR = { ...MARGIN, bottom: 16 } as const
const MONEY_AXIS_WIDTH = 56

const BOX = "aspect-auto h-[220px] w-full"
// Pairs with MARGIN_LEGEND: +60px of container height matches the +60px of reserved
// bottom margin, so the plot's own drawing area comes out identical to BOX's — the
// legend gets genuinely new space below, not space carved out of the chart.
const BOX_LEGEND = "aspect-auto h-[280px] w-full"

function Grid({ opts, vertical = false }: { opts: GalleryOptions; vertical?: boolean }) {
  return opts.grid ? <CartesianGrid vertical={vertical} horizontal={!vertical} strokeDasharray="3 3" /> : null
}

// min-w widens the card and the row is justify-between, so the label and its value
// get real air between them instead of nearly touching at the DS min-w-32.
const TOOLTIP_SPACING = "min-w-44 [&_.justify-between]:gap-6"

function Tip({ opts }: { opts: GalleryOptions }) {
  return <ChartTooltip content={<ChartTooltipContent indicator={opts.indicator} className={TOOLTIP_SPACING} />} />
}

// ChartLegendContent's own container is "flex items-center justify-center gap-4" with
// no wrap, so a series list that doesn't fit one line overflows instead of breaking —
// exactly what makes a narrow chart look broken. flex-wrap fixes it at any width, so
// it's the shipped behavior rather than a mobile-only variant. pt-4 (up from the
// default pt-3) is deliberate: a wrapped, two-line legend sits taller, and the
// default gap read as crowding the plot above it once it wraps.
function Key({ opts, nameKey }: { opts: GalleryOptions; nameKey?: string }) {
  return opts.legend
    ? <ChartLegend content={<ChartLegendContent nameKey={nameKey} className="flex-wrap gap-x-4 gap-y-2 pt-4" />} />
    : null
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
    <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <BarChart data={CHANNEL_MIX_H2} margin={MARGIN_LEGEND}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Key opts={opts} />
        {CHANNEL_SERIES.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

function StackedBar({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <BarChart data={GALLERY_CHANNEL_MIX} margin={MARGIN_LEGEND}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Key opts={opts} />
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
    <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <LineChart data={GALLERY_CHANNEL_MIX} margin={MARGIN_LEGEND}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Key opts={opts} />
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
    <ChartContainer config={buildChartConfig(CHANNEL_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <AreaChart data={GALLERY_CHANNEL_MIX} margin={MARGIN_LEGEND}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <Tip opts={opts} />
        <Key opts={opts} />
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
  )
}

const COMBO_SERIES = [
  { key: "volume", label: "Volume" },
  { key: "declines", label: "Decline rate" },
]

function Combo({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(COMBO_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <ComposedChart data={GALLERY_MONTHLY} margin={{ ...MARGIN_LEGEND, right: 0 }}>
        <Grid opts={opts} />
        <XAxis dataKey="month" {...AXIS} />
        <YAxis yAxisId="left" {...AXIS} tickFormatter={money} width={MONEY_AXIS_WIDTH} />
        <YAxis yAxisId="right" orientation="right" {...AXIS} tickFormatter={pct} width={44} />
        <Tip opts={opts} />
        <Key opts={opts} />
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
    <ChartContainer config={buildChartConfig(SCORE_SERIES, opts.swatches)} className={BOX_LEGEND}>
      <ScatterChart margin={MARGIN_LEGEND}>
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
        <Key opts={opts} />
        {SCATTER_BY_CAT.map((s) => (
          <Scatter key={s.key} name={s.key} data={s.points} fill={`var(--color-${s.key})`} fillOpacity={0.6} />
        ))}
      </ScatterChart>
    </ChartContainer>
  )
}

// ── Part to whole ──────────────────────────────────────────────────────────────

const DECLINE_SERIES = GALLERY_DECLINE_REASONS.map((d) => ({ key: d.key, label: d.reason }))

function Slices({ opts, donut }: { opts: GalleryOptions; donut?: boolean }) {
  const config = buildChartConfig(DECLINE_SERIES, opts.swatches)
  return (
    <ChartContainer config={config} className={BOX_LEGEND}>
      <PieChart margin={MARGIN_LEGEND}>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel className={TOOLTIP_SPACING} />} />
        <Pie
          data={GALLERY_DECLINE_REASONS}
          dataKey="share"
          nameKey="key"
          innerRadius={donut ? 52 : 0}
          outerRadius={82}
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
        <Key opts={opts} nameKey="key" />
      </PieChart>
    </ChartContainer>
  )
}

const SLA_SERIES = GALLERY_SLA.map((s) => ({ key: s.key, label: s.team }))
// fill on the data rows (the shadcn radial pattern): RadialBar reads it for the ring
// AND puts it on the legend payload — Cells color the rings but leave the legend
// dots invisible, and Recharts 3 accepts no external legend payload.
const SLA_DATA = GALLERY_SLA.map((s) => ({ ...s, fill: `var(--color-${s.key})` }))

function Radial({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(SLA_SERIES, opts.swatches)} className={BOX_LEGEND}>
      {/* Fixed pixels, not percentages — recharts scales a percentage radius off the full
          container's min(width, height), ignoring margin, so a taller box (reserving
          legend room) makes a percentage ring bigger instead of leaving it be. Pie/Donut
          already use this fixed-radius pattern for the same reason. Margin is
          MARGIN_LEGEND_POLAR, not MARGIN_LEGEND — see its comment. */}
      <RadialBarChart data={SLA_DATA} innerRadius={18} outerRadius={58} startAngle={90} endAngle={-270} margin={MARGIN_LEGEND_POLAR}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel className={TOOLTIP_SPACING} />} />
        <RadialBar dataKey="attainment" background cornerRadius={6} />
        <Key opts={opts} nameKey="key" />
      </RadialBarChart>
    </ChartContainer>
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
    <ChartContainer config={buildChartConfig(PROFILE_SERIES, opts.swatches)} className={BOX_LEGEND}>
      {/* Fixed pixels, not a percentage — see the note on Radial's outerRadius. Margin is
          MARGIN_LEGEND_POLAR, not MARGIN_LEGEND — see its comment. */}
      <RadarChart data={GALLERY_HEALTH_PROFILE} outerRadius={78} margin={MARGIN_LEGEND_POLAR}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
        <Tip opts={opts} />
        <Key opts={opts} />
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
