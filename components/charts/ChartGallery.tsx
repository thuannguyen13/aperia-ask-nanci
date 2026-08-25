"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Switch,
  ToggleGroup, ToggleGroupItem,
} from "aperia-ds5"
import { useAppTheme } from "@/components/ask-nanci/AppFrame"
import { THEME_IDS, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"
import { PALETTES, type PaletteId } from "@/lib/ask-nanci/data/chart-gallery"
import { resolveSwatch, SPECIMEN_GROUPS, type GalleryOptions, type Specimen } from "./specimens"

const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[]

/** What the brand-theme picker actually does to the charts under each palette. */
const BRAND_REACH: Record<PaletteId, string> = {
  brand: "No effect: --chart-* is :root only.",
  ds5: "No effect: the DS ramp is scheme-only.",
  primary: "Charts follow this brand's --primary.",
}
const INDICATORS = ["dot", "line", "dashed"] as const

function Control({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col gap-1.5">
      <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {/* Out of the flex flow: in it, the one control carrying a note was taller than the
          rest and knocked its own label off the row's baseline. The row reserves the space. */}
      {note && (
        <span className="absolute left-0 top-full mt-1.5 whitespace-nowrap text-[10px] leading-none text-muted-foreground/80">
          {note}
        </span>
      )}
    </div>
  )
}

// DS5's own segmented control: ToggleGroup at spacing 0 with the outline variant
// renders joined segments with shared borders. Only the on-state is overridden — the
// DS default is bg-muted, and this bar's chrome is deliberately black-on-white so the
// brand-theme picker re-skins the specimens, never the controls (same reason the
// focus ring is foreground/20 instead of --ring).
function SegmentedGroup<T extends string>({
  options, value, onChange,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={0}
      value={value}
      onValueChange={(v) => { if (v) onChange(v as T) }}
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className="px-3 text-xs focus-visible:border-foreground focus-visible:ring-foreground/20 data-[state=on]:bg-foreground data-[state=on]:text-background"
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

// The exact chrome MessageChart.tsx puts around a chart in a chat answer, so a
// specimen here looks the way it will look in the app — not a DS Card approximation.
// (The risk dashboard's DashChartCard is the one variation: no border-b on the title.)
function SpecimenCard({ specimen, opts }: { specimen: Specimen; opts: GalleryOptions }) {
  return (
    <div id={specimen.id} className="scroll-mt-32 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{specimen.name}</span>
      </div>
      <div className="px-3 py-4">{specimen.render(opts)}</div>
    </div>
  )
}

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
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Charts</h1>
        </header>

        {/* Controls. Sticky because the point of the page is watching a change ripple
            across every specimen at once, which means the knobs have to stay reachable. */}
        <div className="sticky top-0 z-20 -mx-6 mt-8 border-y bg-background/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-5 pb-5">
            <Control label="Palette">
              <SegmentedGroup
                value={palette}
                onChange={setPalette}
                options={PALETTE_IDS.map((id) => ({ value: id, label: PALETTES[id].label }))}
              />
            </Control>

            <Control label="Brand theme" note={BRAND_REACH[palette]}>
              <Select value={brand} onValueChange={(v) => setBrand(v as ThemeId)}>
                <SelectTrigger className="w-48 bg-background focus-visible:border-foreground focus-visible:ring-foreground/20"><SelectValue /></SelectTrigger>
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

            <Control label="Show">
              <div className="flex h-8 items-center gap-5">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={grid} onCheckedChange={setGrid} className="data-checked:bg-foreground focus-visible:ring-foreground/20" />
                  Grid
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={legend} onCheckedChange={setLegend} className="data-checked:bg-foreground focus-visible:ring-foreground/20" />
                  Legend
                </label>
              </div>
            </Control>
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
          </div>
        </div>

        {SPECIMEN_GROUPS.map((group) => (
          <section key={group.title} className="mt-12">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{group.title}</h2>
            <Separator className="mt-3" />
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {group.specimens.map((s) => <SpecimenCard key={s.id} specimen={s} opts={opts} />)}
            </div>
          </section>
        ))}

      </div>
    </div>
  )
}
