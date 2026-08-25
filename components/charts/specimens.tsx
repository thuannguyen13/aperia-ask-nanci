"use client"

import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, Label, LabelList,
  Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar,
  RadialBarChart, ReferenceArea, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis, ZAxis,
} from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from "aperia-ds5"
import { HEATMAP_HOURS, HEATMAP_ROWS } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  GALLERY_ALERT_VOLUME, GALLERY_AUTH_FUNNEL, GALLERY_DECLINE_REASONS, GALLERY_HEALTH_PROFILE,
  GALLERY_MONTHLY, GALLERY_SCATTER, GALLERY_SLA, GALLERY_TOP_MERCHANTS, PALETTES,
  type ChartSwatch, type PaletteId,
} from "@/lib/ask-nanci/data/chart-gallery"

// ── Options the gallery controls drive ─────────────────────────────────────────

export interface GalleryOptions {
  palette: PaletteId
  grid: boolean
  legend: boolean
  indicator: "dot" | "line" | "dashed"
  /**
   * Recharts specimens read their color from the CSS vars ChartStyle writes, which already
   * carry the light/dark split. The two no-library specimens have no ChartContainer around
   * them, so they need the scheme handed to them to resolve a light/dark pair themselves.
   */
  dark: boolean
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
  palette: PaletteId,
): ChartConfig {
  const { swatches } = PALETTES[palette]
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
const MONEY_AXIS_WIDTH = 56

const BOX = "aspect-auto h-[220px] w-full"

function Grid({ opts, vertical = false }: { opts: GalleryOptions; vertical?: boolean }) {
  return opts.grid ? <CartesianGrid vertical={vertical} horizontal={!vertical} strokeDasharray="3 3" /> : null
}

function Tip({ opts }: { opts: GalleryOptions }) {
  return <ChartTooltip content={<ChartTooltipContent indicator={opts.indicator} />} />
}

function Key({ opts }: { opts: GalleryOptions }) {
  return opts.legend ? <ChartLegend content={<ChartLegendContent />} /> : null
}

const money = (v: number) => `$${Number(v.toFixed(1))}M`
const pct = (v: number) => `${v}%`

// ── Comparison ─────────────────────────────────────────────────────────────────

const MERCHANT_SERIES = [{ key: "volume", label: "Volume" }]

function VerticalBar({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(MERCHANT_SERIES, opts.palette)} className={BOX}>
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

function HorizontalBar({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(MERCHANT_SERIES, opts.palette)} className={BOX}>
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
    <ChartContainer config={buildChartConfig(VOLUME_SERIES, opts.palette)} className={BOX}>
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

const COMBO_SERIES = [
  { key: "volume", label: "Volume" },
  { key: "declines", label: "Decline rate" },
]

function Combo({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(COMBO_SERIES, opts.palette)} className={BOX}>
      <ComposedChart data={GALLERY_MONTHLY} margin={{ ...MARGIN, right: 0 }}>
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

const SCORE_SERIES = [{ key: "merchants", label: "Merchants" }]

function Points({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(SCORE_SERIES, opts.palette)} className={BOX}>
      <ScatterChart margin={MARGIN}>
        {opts.grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis type="number" dataKey="vw" name="VisionWeb" domain={[0, 100]} {...AXIS} />
        <YAxis type="number" dataKey="mc" name="Mastercard" domain={[0, 100]} {...AXIS} width={40} />
        <Tip opts={opts} />
        <Scatter name="merchants" data={GALLERY_SCATTER} fill="var(--color-merchants)" fillOpacity={0.7} />
      </ScatterChart>
    </ChartContainer>
  )
}

function Quadrant({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(SCORE_SERIES, opts.palette)} className={BOX}>
      <ScatterChart margin={MARGIN}>
        <XAxis type="number" dataKey="vw" domain={[0, 100]} {...AXIS} />
        <YAxis type="number" dataKey="mc" domain={[0, 100]} {...AXIS} width={40} />
        <ZAxis type="number" dataKey="mc" range={[24, 260]} />
        <ReferenceArea x1={0} x2={65} y1={65} y2={100} fill="var(--color-merchants)" fillOpacity={0.07} />
        <ReferenceLine x={65} strokeDasharray="4 4" />
        <ReferenceLine y={65} strokeDasharray="4 4" />
        <Tip opts={opts} />
        <Scatter data={GALLERY_SCATTER} fill="var(--color-merchants)" fillOpacity={0.55} />
      </ScatterChart>
    </ChartContainer>
  )
}

// ── Part to whole ──────────────────────────────────────────────────────────────

const DECLINE_SERIES = GALLERY_DECLINE_REASONS.map((d) => ({ key: d.key, label: d.reason }))

function Donut({ opts }: { opts: GalleryOptions }) {
  const config = buildChartConfig(DECLINE_SERIES, opts.palette)
  return (
    <ChartContainer config={config} className={BOX}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
        <Pie
          data={GALLERY_DECLINE_REASONS}
          dataKey="share"
          nameKey="key"
          innerRadius={52}
          outerRadius={82}
          strokeWidth={3}
        >
          {GALLERY_DECLINE_REASONS.map((d) => (
            <Cell key={d.key} fill={`var(--color-${d.key})`} />
          ))}
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
        </Pie>
        {opts.legend && <ChartLegend content={<ChartLegendContent nameKey="key" />} />}
      </PieChart>
    </ChartContainer>
  )
}

const SLA_SERIES = GALLERY_SLA.map((s) => ({ key: s.key, label: s.team }))

function Radial({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(SLA_SERIES, opts.palette)} className={BOX}>
      <RadialBarChart data={GALLERY_SLA} innerRadius="30%" outerRadius="98%" startAngle={90} endAngle={-270}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
        <RadialBar dataKey="attainment" background cornerRadius={6}>
          {GALLERY_SLA.map((s) => (
            <Cell key={s.key} fill={`var(--color-${s.key})`} />
          ))}
        </RadialBar>
        {opts.legend && <ChartLegend content={<ChartLegendContent nameKey="key" />} />}
      </RadialBarChart>
    </ChartContainer>
  )
}


// ── Profile and process ────────────────────────────────────────────────────────

const PROFILE_SERIES = [
  { key: "portfolio", label: "Portfolio avg" },
  { key: "merchant", label: "This merchant" },
]

function Profile({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(PROFILE_SERIES, opts.palette)} className={BOX}>
      <RadarChart data={GALLERY_HEALTH_PROFILE} outerRadius="72%">
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
const FUNNEL_DATA = GALLERY_AUTH_FUNNEL.map((f, i) => ({ ...f, key: `stage${i}` }))

function Drop({ opts }: { opts: GalleryOptions }) {
  return (
    <ChartContainer config={buildChartConfig(FUNNEL_SERIES, opts.palette)} className={BOX}>
      <FunnelChart margin={{ top: 4, right: 96, left: 4, bottom: 4 }}>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
        <Funnel dataKey="count" nameKey="key" data={FUNNEL_DATA} isAnimationActive={false}>
          {FUNNEL_DATA.map((f) => (
            <Cell key={f.key} fill={`var(--color-${f.key})`} />
          ))}
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

// The one shape in the app that deliberately does not use Recharts: a proportional
// div is cheaper than a chart and lines up with the text column beside it.
function CssBars({ opts }: { opts: GalleryOptions }) {
  const color = resolveSwatch(PALETTES[opts.palette].swatches[0], opts.dark)
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
  const color = resolveSwatch(PALETTES[opts.palette].swatches[0], opts.dark)
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
  /** The question this form answers well. */
  use: string
  /** The Recharts pieces it is built from, or "no library". */
  parts: string
  /** Where this shape already appears in the product, if it does. */
  inUse?: string
  render: (opts: GalleryOptions) => React.ReactNode
}

export interface SpecimenGroup {
  title: string
  blurb: string
  specimens: Specimen[]
}

export const SPECIMEN_GROUPS: SpecimenGroup[] = [
  {
    title: "Comparison",
    blurb: "Ranking discrete things against each other. Bars, because length off a shared baseline is the most accurately read encoding there is. Grouped and stacked variants are one more <Bar> (with a stackId) on the same chart.",
    specimens: [
      {
        id: "bar",
        name: "Bar",
        use: "One measure across a handful of named categories.",
        parts: "BarChart · Bar",
        inUse: "MessageChart.tsx, the chat-message bar widget",
        render: (o) => <VerticalBar opts={o} />,
      },
      {
        id: "bar-horizontal",
        name: "Horizontal bar",
        use: "Long category labels, or more than about eight rows. The default for a leaderboard.",
        parts: "BarChart layout=vertical · LabelList",
        inUse: "AlertVolumeBars.tsx renders this shape without Recharts",
        render: (o) => <HorizontalBar opts={o} />,
      },
    ],
  },
  {
    title: "Trend",
    blurb: "Change over an ordered axis. Multi-series, area and stacked-area variants are the same charts with more <Line>/<Area> children.",
    specimens: [
      {
        id: "line",
        name: "Line",
        use: "One measure over time. The workhorse.",
        parts: "LineChart · Line",
        inUse: "MessageChart.tsx · NanciReviewPanel.tsx",
        render: (o) => <SingleLine opts={o} />,
      },
      {
        id: "combo",
        name: "Combo, dual axis",
        use: "A count and a rate together. Two axes need two visibly different marks, or it misleads.",
        parts: "ComposedChart · Bar + Line · YAxis ×2",
        inUse: "ParamHeatChart.tsx",
        render: (o) => <Combo opts={o} />,
      },
    ],
  },
  {
    title: "Relationship",
    blurb: "Whether two measures move together, and which records sit in the corner you care about.",
    specimens: [
      {
        id: "scatter",
        name: "Scatter",
        use: "Correlation across many records. Density is the message, not any one point.",
        parts: "ScatterChart · Scatter",
        render: (o) => <Points opts={o} />,
      },
      {
        id: "quadrant",
        name: "Bubble quadrant",
        use: "Scatter plus a third measure as size, split into named quadrants by threshold.",
        parts: "ScatterChart · ZAxis · ReferenceLine · ReferenceArea",
        inUse: "ScatterQuadrant.tsx, VW vs Mastercard scores",
        render: (o) => <Quadrant opts={o} />,
      },
    ],
  },
  {
    title: "Part to whole",
    blurb: "Shares of a total. Worth it only at five or six slices, and only when the shares are far apart. A plain pie is the donut with innerRadius 0, and usually loses to a sorted bar anyway.",
    specimens: [
      {
        id: "donut",
        name: "Donut",
        use: "A handful of shares with the headline figure parked in the hole.",
        parts: "PieChart · Pie innerRadius · Label",
        render: (o) => <Donut opts={o} />,
      },
      {
        id: "radial",
        name: "Radial gauge",
        use: "A few values against a fixed ceiling, like SLA attainment. Decorative more than precise.",
        parts: "RadialBarChart · RadialBar background",
        render: (o) => <Radial opts={o} />,
      },
    ],
  },
  {
    title: "Profile and process",
    blurb: "Two narrower forms: one record's shape across fixed axes, and drop-off through ordered stages.",
    specimens: [
      {
        id: "radar",
        name: "Radar",
        use: "One subject against a benchmark on 5 to 8 fixed axes. Reads as a silhouette, not as numbers.",
        parts: "RadarChart · PolarGrid · Radar ×n",
        render: (o) => <Profile opts={o} />,
      },
      {
        id: "funnel",
        name: "Funnel",
        use: "Sequential drop-off where every stage is a strict subset of the one above it.",
        parts: "FunnelChart · Funnel · LabelList",
        render: (o) => <Drop opts={o} />,
      },
    ],
  },
  {
    title: "No library",
    blurb: "Shapes small enough that chart chrome costs more than it gives. Neither of these ships any Recharts.",
    specimens: [
      {
        id: "css-bars",
        name: "Proportional bars",
        use: "A ranked list where the bar is one column of a text row. Cheaper and aligns with the type.",
        parts: "No library: width percentage on a div",
        inUse: "AlertVolumeBars.tsx · DeclineReportPanel.tsx · SlowestWindowsPanel.tsx",
        render: (o) => <CssBars opts={o} />,
      },
      {
        id: "heatmap",
        name: "Heatmap",
        use: "Two categorical axes and one intensity. Recharts has no heatmap, so this is a CSS grid.",
        parts: "No library: CSS grid + color-mix",
        inUse: "The Busiest Times panel (flow 23)",
        render: (o) => <Heat opts={o} />,
      },
    ],
  },
]
