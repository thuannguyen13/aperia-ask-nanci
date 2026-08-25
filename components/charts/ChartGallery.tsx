"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Badge, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, Separator, Switch,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAppTheme } from "@/components/ask-nanci/AppFrame"
import { THEME_IDS, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"
import { PALETTES, type PaletteId } from "@/lib/ask-nanci/data/chart-gallery"
import { resolveSwatch, SPECIMEN_GROUPS, type GalleryOptions, type Specimen } from "./specimens"

const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[]

/** What the brand-theme picker actually does to the charts under each palette. */
const BRAND_REACH: Record<PaletteId, string> = {
  brand: "No effect on charts: --chart-1..6 are declared once in :root.",
  ds5: "No effect on charts: the DS ramp is scheme-aware, not brand-aware.",
  primary: "Charts follow this: the ramp is mixed from --primary.",
}
const INDICATORS = ["dot", "line", "dashed"] as const

function Control({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {/* Always rendered, so one control carrying a note does not push its label out of
          line with the rest of the row. */}
      <span className="min-h-4 text-[10px] leading-tight text-muted-foreground/80">{note}</span>
    </div>
  )
}

function SegmentedGroup<T extends string>({
  options, value, onChange,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border bg-background p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-8 rounded-[5px] px-3 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function SpecimenCard({ specimen, opts }: { specimen: Specimen; opts: GalleryOptions }) {
  return (
    <Card id={specimen.id} className="scroll-mt-32 gap-0 overflow-hidden py-0">
      <CardHeader className="gap-1 border-b px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <CardTitle className="text-sm font-semibold">{specimen.name}</CardTitle>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{specimen.parts}</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{specimen.use}</p>
      </CardHeader>
      <CardContent className="px-4 py-4">{specimen.render(opts)}</CardContent>
      {specimen.inUse && (
        <div className="border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          In the app today: <span className="font-medium text-foreground">{specimen.inUse}</span>
        </div>
      )}
    </Card>
  )
}

const CONFIG_SNIPPET = `const config = {
  volume:   { label: "Volume",   color: "var(--chart-1)" },
  declines: { label: "Declines", theme: { light: "#951B19", dark: "#F87171" } },
} satisfies ChartConfig

<ChartContainer config={config} className="aspect-auto h-56 w-full">
  <BarChart data={rows}>
    <Bar dataKey="volume" fill="var(--color-volume)" />
    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
  </BarChart>
</ChartContainer>`

export function ChartGallery() {
  const [brand, setBrand] = useState<ThemeId>("aperia")
  const [palette, setPalette] = useState<PaletteId>("brand")
  const [indicator, setIndicator] = useState<GalleryOptions["indicator"]>("dot")
  const [grid, setGrid] = useState(true)
  const [legend, setLegend] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { resolvedTheme, setTheme } = useTheme()
  useAppTheme(brand)
  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === "dark"
  const opts: GalleryOptions = { palette, grid, legend, indicator, dark }
  const active = PALETTES[palette]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <header className="max-w-3xl">
          <Badge variant="secondary" className="mb-3">Reference</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Charts</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every chart form this stack can render, and every knob that themes one. Charting is{" "}
            <span className="font-medium text-foreground">Recharts 3.8</span> throughout. The wrapper is{" "}
            <span className="font-medium text-foreground">shadcn&rsquo;s chart component</span>, which the design
            system re-exports from <span className="font-mono text-xs">aperia-ds5</span> as{" "}
            <span className="font-mono text-xs">ChartContainer</span> and friends. Every specimen below goes
            through that wrapper, so the controls apply to all of them at once.
          </p>
        </header>

        {/* Controls. Sticky because the point of the page is watching a change ripple
            across every specimen at once, which means the knobs have to stay reachable. */}
        <div className="sticky top-0 z-20 -mx-6 mt-8 border-y bg-background/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <Control label="Palette">
              <SegmentedGroup
                value={palette}
                onChange={setPalette}
                options={PALETTE_IDS.map((id) => ({ value: id, label: PALETTES[id].label }))}
              />
            </Control>

            <Control label="Brand theme" note={BRAND_REACH[palette]}>
              <Select value={brand} onValueChange={(v) => setBrand(v as ThemeId)}>
                <SelectTrigger className="h-9 w-48 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THEME_IDS.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                </SelectContent>
              </Select>
            </Control>

            <Control label="Scheme">
              <SegmentedGroup
                value={dark ? "dark" : "light"}
                onChange={(v) => setTheme(v)}
                options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
              />
            </Control>

            <Control label="Tooltip indicator">
              <SegmentedGroup
                value={indicator}
                onChange={setIndicator}
                options={INDICATORS.map((i) => ({ value: i, label: i }))}
              />
            </Control>

            <div className="flex items-center gap-5 pb-1.5">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={grid} onCheckedChange={setGrid} />
                Grid
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={legend} onCheckedChange={setLegend} />
                Legend
              </label>
            </div>

            <div className="ml-auto flex items-center gap-2 pb-2 text-muted-foreground">
              {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex gap-1">
              {active.swatches.map((s, i) => (
                <span
                  key={i}
                  title={resolveSwatch(s, dark)}
                  className="size-5 rounded-[3px] ring-1 ring-inset ring-black/10"
                  style={{ background: resolveSwatch(s, dark) }}
                />
              ))}
            </div>
            <p className="max-w-3xl text-[11px] leading-relaxed text-muted-foreground">{active.note}</p>
          </div>
        </div>

        {/* How the theming actually works: the mechanism, not just the result. */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,520px)]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">How a chart gets its colors</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Color never goes on the mark directly. Each series is a key in a{" "}
                <span className="font-mono text-xs text-foreground">ChartConfig</span>, and{" "}
                <span className="font-mono text-xs text-foreground">ChartStyle</span> turns that config into two
                CSS rules scoped to the chart instance: one for{" "}
                <span className="font-mono text-xs">[data-chart=id]</span> and one for{" "}
                <span className="font-mono text-xs">.dark [data-chart=id]</span>. The mark then reads{" "}
                <span className="font-mono text-xs text-foreground">var(--color-&lt;key&gt;)</span>.
              </p>
              <p>
                That is the whole theming seam. A <span className="font-mono text-xs">color</span> entry is one
                value for both schemes; a <span className="font-mono text-xs">theme</span> entry is a light/dark
                pair, and it is the only way to give a series a different color in dark mode without touching
                a stylesheet. The tooltip and legend read labels out of the same config, so a series is named
                once.
              </p>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-[11px] leading-relaxed text-foreground">
            {CONFIG_SNIPPET}
          </pre>
        </section>

        {SPECIMEN_GROUPS.map((group) => (
          <section key={group.title} className="mt-12">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{group.title}</h2>
              <span className="text-xs text-muted-foreground">{group.specimens.length} forms</span>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{group.blurb}</p>
            <Separator className="mt-4" />
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.specimens.map((s) => <SpecimenCard key={s.id} specimen={s} opts={opts} />)}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-lg border bg-muted/30 p-6">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Where the app stands today</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              Five files import Recharts directly: <span className="font-mono text-xs">MessageChart.tsx</span>,{" "}
              <span className="font-mono text-xs">NanciReviewPanel.tsx</span>,{" "}
              <span className="font-mono text-xs">ParamHeatChart.tsx</span>,{" "}
              <span className="font-mono text-xs">ScatterQuadrant.tsx</span>,{" "}
              <span className="font-mono text-xs">Dashboard.tsx</span>. None of them uses{" "}
              <span className="font-mono text-xs">ChartContainer</span>, so each hand-rolls its own tooltip and
              axis chrome.
            </li>
            <li>
              <span className="font-mono text-xs">--chart-1..6</span> in{" "}
              <span className="font-mono text-xs">app/globals.css</span> overrides the design system&rsquo;s ramp
              in <span className="italic">both</span> schemes. The DS ships a separate{" "}
              <span className="font-mono text-xs">.dark</span> block; our <span className="font-mono text-xs">:root</span>{" "}
              rule is declared later, so dark mode keeps the light hexes. Switch the palette control to{" "}
              <span className="font-medium text-foreground">Design-system default</span> and toggle the scheme to
              see the difference.
            </li>
            <li>
              No chart color follows the brand theme. Cycle the theme picker on the{" "}
              <span className="font-medium text-foreground">Brand tokens</span> palette and nothing moves; do it on{" "}
              <span className="font-medium text-foreground">Primary ramp</span> and every chart re-skins.
            </li>
            <li>
              Recharts also ships <span className="font-mono text-xs">Sankey</span> and{" "}
              <span className="font-mono text-xs">Brush</span>, not shown here: neither has a use case in the demo
              yet. It has no heatmap at all, which is why that specimen is CSS.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
