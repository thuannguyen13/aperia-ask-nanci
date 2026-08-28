"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Check, Copy, Smartphone } from "lucide-react"
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "aperia-ds5"
import { SegmentedGroup } from "@/components/charts/controls"
import { SPECIMEN_GROUPS, type GalleryOptions } from "@/components/charts/specimens"
import { PANEL_UI_OPTIONS } from "@/lib/ask-nanci/data/panel-ui"
import { FLOW_DEFS } from "@/lib/ask-nanci/data/flows.concept"
import { MERCHANT_VOLUME_DATA } from "@/lib/ask-nanci/data/merchants"
import { PALETTES } from "@/lib/ask-nanci/data/chart-gallery"
import { PanelTable, Thead, Th, Td, formatCurrency, formatWholeCurrency } from "@/components/ask-nanci/shared"

// ── What this page is ──────────────────────────────────────────────────────────
// The index for how a panel reaches a phone. Option A is what ships; the page
// launches the real app rather than a mock, because what is left to judge (does the
// gesture read, does the browser toolbar eat the drawer, is a 0.45 thumbnail worth
// anything) is only answerable on a device.
//
// Links are built from window.location.origin, so opening this page on the phone
// hands out links that already point at the right host.

// Derived from the registry, not hand-listed: a flow that gains a slug shows up here
// on its own, the same way docs/demo-urls.md is generated rather than maintained.
const FLOWS = [
  { value: "none", label: "None — start on the welcome screen" },
  ...FLOW_DEFS.filter((f) => f.slug).map((f) => ({ value: f.slug as string, label: `${f.slug} · ${f.title}` })),
]

const AUTOPLAY = [
  { value: "on", label: "Autoplay" },
  { value: "off", label: "Manual" },
] as const

export function ResponsiveLab() {
  const [flow, setFlow] = useState<string>("2")
  const [autoplay, setAutoplay] = useState<string>("on")
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  // The host is only known in the browser, and it is the point here: the same page
  // opened on the phone gives out phone-reachable links.
  useEffect(() => setOrigin(window.location.origin), [])

  function url(param: string) {
    // Always the full app: the embed drops the sidebar and the welcome screen, and the
    // presentation being judged has to be judged in the shell it ships in.
    const q = new URLSearchParams({ mode: "concept" })
    if (flow !== "none") q.set("flow", flow)
    if (param) q.set("panelui", param)
    // autoplay is a valueless flag in every existing demo URL: keep that shape.
    return `${origin}/?${q}${autoplay === "on" ? "&autoplay" : ""}`
  }

  async function copy(o: { id: string; param: string }) {
    await navigator.clipboard.writeText(url(o.param))
    setCopied(o.id)
    setTimeout(() => setCopied(null), 1500)
  }

  const host = origin.replace("//localhost", "//<your-lan-ip>")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Mobile panel options</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Below <span className="font-mono text-xs">md</span> the chat and the panel column cannot
            sit side by side, so a panel has to arrive some other way. Option A is what ships today;
            the rest are live behind <span className="font-mono text-xs">?panelui=</span>. Pick a
            configuration and launch one on a phone: the gestures, the browser toolbar and whether a
            scaled thumbnail is readable are only answerable on a device.
          </p>
        </header>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Configuration</CardTitle>
            <CardDescription className="text-sm">
              What the launched session runs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-x-8 gap-y-5">
            <Field label="Flow">
              <Select value={flow} onValueChange={setFlow}>
                <SelectTrigger className="w-64 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent position="popper" align="start">
                  {FLOWS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Start">
              <SegmentedGroup value={autoplay} onChange={setAutoplay} options={AUTOPLAY} />
            </Field>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-5">
          {PANEL_UI_OPTIONS.map((o) => (
            <Card key={o.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <CardTitle className="text-base">
                      {o.id.toUpperCase()} · {o.name}
                    </CardTitle>
                    {o.current && <Badge>Ships today</Badge>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => copy(o)}>
                      {copied === o.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copied === o.id ? "Copied" : "Copy link"}
                    </Button>
                    <Button size="sm" asChild>
                      <a href={url(o.param)} target="_blank" rel="noreferrer">
                        Launch
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">{o.blurb}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-3">
                  <Column label="Cost to reach a panel">
                    <p className="text-sm text-foreground">{o.taps}</p>
                  </Column>
                  <Column label="Works">
                    <ul className="flex flex-col gap-1.5">
                      {o.pros.map((t) => (
                        <li key={t} className="text-sm leading-snug text-foreground">{t}</li>
                      ))}
                    </ul>
                  </Column>
                  <Column label="Costs">
                    <ul className="flex flex-col gap-1.5">
                      {o.cons.map((t) => (
                        <li key={t} className="text-sm leading-snug text-muted-foreground">{t}</li>
                      ))}
                    </ul>
                  </Column>
                </div>
                <p className="truncate font-mono text-[11px] text-muted-foreground">{url(o.param)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <header className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Content on mobile</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            How the content <em>inside</em> a panel copes with a narrow screen — a different question
            from how the panel itself arrives. Both previews below are framed at 380px so the effect
            shows without resizing the window.
          </p>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <TablesOnMobile />
          <ChartsOnMobile />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="size-4" />
              Testing on a phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm leading-snug text-muted-foreground">
              <li>
                Open this page on the phone at{" "}
                <span className="font-mono text-xs text-foreground">{host}/responsive</span> and tap
                Launch: the links are built from whatever host you loaded it on.
              </li>
              <li>
                Mobile presentation only exists below the{" "}
                <span className="font-mono text-xs text-foreground">md</span> breakpoint. On a laptop
                the launched URL shows the normal side-by-side panel stack instead.
              </li>
              <li>
                A candidate presentation gets added to{" "}
                <span className="font-mono text-xs text-foreground">lib/ask-nanci/data/panel-ui.ts</span>{" "}
                and appears here with its own launch link.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

// A fixed 380px frame (roughly a small phone's viewport width) so the mobile
// treatment is visible without actually shrinking the browser window.
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[380px] max-w-full overflow-hidden rounded-2xl border bg-background">
      {children}
    </div>
  )
}

// Real merchant-volume rows (same data MerchantVolumePanel shows), forced to
// nowrap so the scroll behavior added to PanelTable is visible regardless of
// frame width — PanelTable's own cells wrap by default, which is the *other*
// half of how it degrades and doesn't need a demo of its own here.
function TablesOnMobile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tables</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Ships in <span className="font-mono text-xs">PanelTable</span> — scrolls sideways instead of
          squeezing columns, no columns hidden, no card-stacking. Cells that wrap (like most panel
          tables) shrink first instead; this is the case where they can&apos;t.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhoneFrame>
          <div className="p-3">
            <PanelTable>
              <Thead>
                <Th className="w-8">#</Th>
                <Th className="whitespace-nowrap">Merchant</Th>
                <Th align="right" className="whitespace-nowrap">Volume</Th>
                <Th align="right" className="whitespace-nowrap">Txns</Th>
                <Th align="right" className="whitespace-nowrap">Avg Ticket</Th>
              </Thead>
              <tbody>
                {MERCHANT_VOLUME_DATA.slice(0, 6).map((row) => (
                  <tr key={row.rank}>
                    <Td mono className="text-muted-foreground">{row.rank}</Td>
                    <Td className="whitespace-nowrap">{row.merchant}</Td>
                    <Td align="right" mono className="whitespace-nowrap">{formatWholeCurrency(row.volume)}</Td>
                    <Td align="right" mono className="whitespace-nowrap">{row.txnCount.toLocaleString()}</Td>
                    <Td align="right" mono className="whitespace-nowrap">{formatCurrency(row.avgTicket)}</Td>
                  </tr>
                ))}
              </tbody>
            </PanelTable>
          </div>
        </PhoneFrame>
      </CardContent>
    </Card>
  )
}

const CHART_PREVIEW = SPECIMEN_GROUPS[0].specimens.find((s) => s.id === "bar-grouped")!

// No mobile-only variant — the desktop chart is the mobile chart. This specimen has
// a 5-series legend, the case that used to overflow; the fix (Key in specimens.tsx
// wraps the legend instead of forcing it onto one line) is what's on display here.
function ChartsOnMobile() {
  const opts: GalleryOptions = {
    grid: true,
    legend: true,
    indicator: "dot",
    dark: false,
    swatches: PALETTES.ds5.swatches,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Charts</CardTitle>
          <Button size="sm" variant="outline" asChild>
            <a href="/charts" target="_blank" rel="noreferrer">
              All 19 specimens on /charts
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          Inherits the desktop chart as-is — no mobile-only treatment. The legend wraps onto
          more than one line instead of overflowing, which is now the shipped behavior at any width.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhoneFrame>
          <div className="p-3">{CHART_PREVIEW.render(opts)}</div>
        </PhoneFrame>
      </CardContent>
    </Card>
  )
}
