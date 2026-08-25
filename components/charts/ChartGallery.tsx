"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Switch,
} from "aperia-ds5"
import { useAppTheme } from "@/components/ask-nanci/AppFrame"
import { THEME_IDS, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"
import { PALETTES, type ChartSwatch, type PaletteId } from "@/lib/ask-nanci/data/chart-gallery"
import { createColorResolver } from "@/lib/ask-nanci/resolve-color"
import { Control, SegmentedGroup } from "./controls"
import { resolveSwatch, SPECIMEN_GROUPS, type GalleryOptions, type Specimen } from "./specimens"

const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[]

const INDICATORS = ["dot", "line", "dashed"] as const

// The exact chrome MessageChart.tsx puts around a chart in a chat answer, so a
// specimen here looks the way it will look in the app — not a DS Card approximation.
// (The risk dashboard's DashChartCard is the one variation: no border-b on the title.)
const SpecimenCard = memo(function SpecimenCard({
  specimen, opts,
}: { specimen: Specimen; opts: GalleryOptions }) {
  return (
    <div id={specimen.id} className="scroll-mt-32 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{specimen.name}</span>
      </div>
      <div className="px-3 py-4">{specimen.render(opts)}</div>
    </div>
  )
})

export function ChartGallery() {
  const [brand, setBrand] = useState<ThemeId>("aperia")
  const [palette, setPalette] = useState<PaletteId>("ds5")
  const [indicator, setIndicator] = useState<GalleryOptions["indicator"]>("dot")
  const [grid, setGrid] = useState(true)
  const [legend, setLegend] = useState(true)
  const [mounted, setMounted] = useState(false)
  // Per-dot edits from the swatch strip, kept per palette so switching palettes
  // switches edits with them. An edited dot is a plain hex for both schemes.
  const [overrides, setOverrides] = useState<Partial<Record<PaletteId, Record<number, string>>>>({})
  // The strip's native color inputs need concrete #rrggbb seeds, so the effective
  // swatches (vars, oklch, color-mix) are resolved through a probe element below.
  const [resolvedHex, setResolvedHex] = useState<string[]>([])

  const { resolvedTheme, setTheme } = useTheme()
  useAppTheme(brand)
  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === "dark"
  const paletteOverrides = overrides[palette]
  // The effective ramp: palette swatches with per-dot edits applied. Only the strip,
  // the probe and the page-root CSS vars read this — the charts never see it directly.
  const effective: ChartSwatch[] = PALETTES[palette].swatches.map(
    (s, i) => paletteOverrides?.[i] ?? s,
  )

  // Charts are colored through --gallery-cN vars set on the page root, and opts is
  // memoized on everything except the colors themselves. Dragging in a color picker
  // therefore edits one style attribute and the browser repaints the SVGs — no chart
  // re-renders per tick, which is what made the picker lag.
  const swatches = useMemo<ChartSwatch[]>(
    () => PALETTES[palette].swatches.map((_, i) => `var(--gallery-c${i + 1})`),
    [palette],
  )
  const opts: GalleryOptions = useMemo(
    () => ({ grid, legend, indicator, dark, swatches }),
    [grid, legend, indicator, dark, swatches],
  )
  const rootVars = Object.fromEntries(
    effective.map((s, i) => [`--gallery-c${i + 1}`, resolveSwatch(s, dark)]),
  ) as React.CSSProperties

  // Resolve each effective swatch to hex by letting the browser compute it in the
  // live theme context — a probe on <body> sees data-theme, .dark and the CSS vars.
  const swatchKey = effective.map((s) => (typeof s === "string" ? s : s.light + s.dark)).join("|")
  useEffect(() => {
    const resolver = createColorResolver(document.body)
    setResolvedHex(effective.map((s) => resolver.toHex(resolveSwatch(s, dark))))
    resolver.dispose()
    // swatchKey covers the swatches array; brand re-resolves the CSS vars.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swatchKey, brand, dark, mounted])

  const editSwatch = (i: number, hex: string) =>
    setOverrides((prev) => ({ ...prev, [palette]: { ...prev[palette], [i]: hex } }))
  const resetSwatches = () =>
    setOverrides((prev) => ({ ...prev, [palette]: undefined }))

  return (
    <div className="min-h-screen bg-background" style={rootVars}>
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

            {/* Only the Primary Ramp is mixed from --primary, so only there does the
                brand picker reach the charts — the other two ramps are fixed colors. */}
            {palette === "primary" && (
              <Control label="Brand theme" note="Charts follow this brand's --primary.">
                <Select value={brand} onValueChange={(v) => setBrand(v as ThemeId)}>
                  <SelectTrigger className="w-48 bg-background focus-visible:border-foreground focus-visible:ring-foreground/20"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" align="start">
                    {THEME_IDS.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Control>
            )}

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

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            {/* Each dot is a live color input: edit one and every chart re-renders with
                the edited ramp. Edits are per palette; Reset clears the active one. */}
            <div className="flex gap-1">
              {effective.map((s, i) => (
                <label
                  key={i}
                  title={`chart-${i + 1} — click to edit`}
                  className="relative size-5 cursor-pointer rounded-[3px] ring-1 ring-inset ring-black/10 transition-transform hover:scale-110"
                  style={{ background: resolveSwatch(s, dark) }}
                >
                  <input
                    type="color"
                    value={resolvedHex[i] ?? "#888888"}
                    onChange={(e) => editSwatch(i, e.target.value)}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                </label>
              ))}
            </div>
            {paletteOverrides && (
              <button
                type="button"
                onClick={resetSwatches}
                className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Reset
              </button>
            )}
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
