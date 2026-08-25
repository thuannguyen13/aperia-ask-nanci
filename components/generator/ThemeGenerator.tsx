"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox,
  Input, Label, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator, Switch,
} from "aperia-ds5"
import { Control } from "@/components/charts/controls"
import { createColorResolver } from "@/lib/ask-nanci/resolve-color"
import { THEME_IDS, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"

// ── Token model ────────────────────────────────────────────────────────────────
// The six knobs a brand block in app/globals.css actually sets. The export below
// emits exactly that block shape, so the output is paste-ready white-labeling.

interface BrandTokens {
  primary: string
  primaryForeground: string
  ring: string
  sidebarPrimary: string
  gradientStart: string
  gradientEnd: string
}

const TOKEN_ROWS: { key: keyof BrandTokens; label: string; hint: string }[] = [
  { key: "primary", label: "Primary", hint: "Buttons, badges, switches, progress" },
  { key: "primaryForeground", label: "Primary foreground", hint: "Ink on primary surfaces" },
  { key: "ring", label: "Focus ring", hint: "Focused inputs and controls" },
  { key: "sidebarPrimary", label: "Sidebar active", hint: "The active nav item" },
  { key: "gradientStart", label: "Frame gradient start", hint: "Top of the page backdrop" },
  { key: "gradientEnd", label: "Frame gradient end", hint: "Where the backdrop fades to" },
]

/** Every current gradient in globals.css follows this exact shape. */
const GRADIENT_RE = /linear-gradient\(180deg,\s*(.+?)\s+0%,\s*(.+?)\s+200px\)/

function buildGradient(t: BrandTokens) {
  return `linear-gradient(180deg, ${t.gradientStart} 0%, ${t.gradientEnd} 200px)`
}

function buildCss(name: string, t: BrandTokens) {
  return `[data-theme="${name}"] {
  --primary: ${t.primary};
  --color-primary: ${t.primary};
  --primary-foreground: ${t.primaryForeground};
  --color-primary-foreground: ${t.primaryForeground};
  --ring: ${t.ring};
  --sidebar-primary: ${t.sidebarPrimary};
  --sidebar-primary-foreground: ${t.primaryForeground};
  --app-gradient: linear-gradient(180deg, ${t.gradientStart} 0%, ${t.gradientEnd} 200px);
}`
}

// ── Token editor row ───────────────────────────────────────────────────────────

function TokenRow({
  label, hint, value, onChange,
}: { label: string; hint: string; value: string; onChange: (hex: string) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50">
      <span
        className="relative size-6 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
        style={{ background: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-foreground">{label}</span>
        <span className="block truncate text-[10px] text-muted-foreground">{hint}</span>
      </span>
      <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
    </label>
  )
}

// ── Specimen wall ──────────────────────────────────────────────────────────────
// Real DS5 components inside the preview scope. Portal-mounted surfaces (Select's
// dropdown, dialogs) escape the scope and keep the page theme — deliberately left
// off the wall rather than shown mis-themed.

function Wall() {
  return (
    <div className="flex flex-col gap-5">
      {/* The app frame: the gradient bar every brand theme paints behind the app. */}
      <div
        className="flex h-16 items-center rounded-xl px-5"
        style={{ background: "var(--app-gradient)" }}
      >
        <span className="text-lg font-semibold tracking-tight text-white">Your Brand</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions</CardTitle>
            <CardDescription className="text-xs">Primary drives all of these.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Switch defaultChecked aria-label="Sample switch on" />
              <Switch aria-label="Sample switch off" />
              <Checkbox defaultChecked aria-label="Sample checkbox" />
            </div>
            <Progress value={64} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Form</CardTitle>
            <CardDescription className="text-xs">The ring shows on focus.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Business name</Label>
              <Input placeholder="Harbor View Hotel" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Focused</Label>
              {/* A held focus state, so the ring is visible without interacting. */}
              <div className="flex h-8 items-center rounded-lg border border-ring px-2.5 text-sm ring-3 ring-ring/50">
                <span className="text-muted-foreground">hello@yourbrand.com</span>
              </div>
            </div>
            <Button className="mt-1 w-full">Continue</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sidebar</CardTitle>
            <CardDescription className="text-xs">The active item takes sidebar-primary.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {["Dashboard", "Transactions", "Reports"].map((item, i) => (
              <div
                key={item}
                className="rounded-md px-3 py-2 text-xs font-medium"
                style={
                  i === 0
                    ? { background: "var(--sidebar-primary)", color: "var(--sidebar-primary-foreground, #fff)" }
                    : undefined
                }
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data</CardTitle>
            <CardDescription className="text-xs">Single-measure bars take primary.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-2.5">
            {[
              { name: "Card present", v: 100 },
              { name: "E-commerce", v: 62 },
              { name: "Keyed", v: 31 },
              { name: "Mobile wallet", v: 18 },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 truncate text-right text-muted-foreground">{r.name}</span>
                <div className="min-w-0 flex-1">
                  <div
                    className="h-3.5 rounded-[2px]"
                    style={{ width: `${r.v}%`, background: "var(--primary)" }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ── The generator ──────────────────────────────────────────────────────────────

export function ThemeGenerator() {
  const [seedBrand, setSeedBrand] = useState<ThemeId>("aperia")
  const [themeName, setThemeName] = useState("new-brand")
  const [tokens, setTokens] = useState<BrandTokens | null>(null)
  const [copied, setCopied] = useState(false)

  // Seed the tokens from an existing brand: a probe div carrying data-theme picks up
  // that brand's [data-theme] block through the normal cascade, with :root and the DS
  // defaults filling whatever the brand does not set — exactly what the app resolves.
  useEffect(() => {
    const probe = document.createElement("div")
    probe.dataset.theme = seedBrand
    document.body.appendChild(probe)
    const resolver = createColorResolver(probe)
    const cs = getComputedStyle(probe)
    const raw = (name: string) => cs.getPropertyValue(name).trim()
    const hex = (value: string, fallback: string) => (value ? resolver.toHex(value) : fallback)

    const primary = hex(raw("--color-primary") || raw("--primary"), "#280086")
    const gradient = raw("--app-gradient").match(GRADIENT_RE)
    setTokens({
      primary,
      primaryForeground: hex(raw("--color-primary-foreground") || raw("--primary-foreground"), "#fafafa"),
      ring: hex(raw("--ring"), primary),
      sidebarPrimary: hex(raw("--sidebar-primary"), primary),
      gradientStart: gradient ? resolver.toHex(gradient[1]) : primary,
      gradientEnd: gradient ? resolver.toHex(gradient[2]) : "#ffffff",
    })
    resolver.dispose()
    probe.remove()
  }, [seedBrand])

  if (!tokens) return <div className="min-h-screen bg-background" />

  const previewVars = {
    "--primary": tokens.primary,
    "--color-primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--color-primary-foreground": tokens.primaryForeground,
    "--ring": tokens.ring,
    "--color-ring": tokens.ring,
    "--sidebar-primary": tokens.sidebarPrimary,
    "--color-sidebar-primary": tokens.sidebarPrimary,
    "--sidebar-primary-foreground": tokens.primaryForeground,
    "--app-gradient": buildGradient(tokens),
  } as React.CSSProperties

  const css = buildCss(themeName, tokens)

  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const edit = (key: keyof BrandTokens) => (hexValue: string) =>
    setTokens((prev) => (prev ? { ...prev, [key]: hexValue } : prev))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Theme Generator</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Edit the six values a brand theme sets, watch them land on real components, and copy
            the paste-ready CSS block. Add the logo in{" "}
            <span className="font-mono text-xs">theme-logos.ts</span> and the brand is live.
          </p>
        </header>

        <div className="sticky top-0 z-20 -mx-6 mt-8 border-y bg-background/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <Control label="Start from">
              <Select value={seedBrand} onValueChange={(v) => setSeedBrand(v as ThemeId)}>
                <SelectTrigger className="w-44 bg-background focus-visible:border-foreground focus-visible:ring-foreground/20"><SelectValue /></SelectTrigger>
                <SelectContent position="popper" align="start">
                  {THEME_IDS.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                </SelectContent>
              </Select>
            </Control>
            <Control label="Theme name">
              <Input
                value={themeName}
                onChange={(e) => setThemeName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className="h-8 w-44 font-mono text-xs focus-visible:border-foreground focus-visible:ring-foreground/20"
              />
            </Control>
            <div className="ml-auto">
              <Button size="sm" onClick={copy} className="bg-foreground text-background hover:bg-foreground/90">
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <section>
              <h2 className="text-sm font-semibold text-foreground">Brand tokens</h2>
              <Separator className="mt-2" />
              <div className="mt-2 flex flex-col">
                {TOKEN_ROWS.map((row) => (
                  <TokenRow
                    key={row.key}
                    label={row.label}
                    hint={row.hint}
                    value={tokens[row.key]}
                    onChange={edit(row.key)}
                  />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-foreground">CSS</h2>
              <Separator className="mt-2" />
              <pre className="mt-3 overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed text-foreground">
                {css}
              </pre>
            </section>
          </div>

          <div style={previewVars}>
            <Wall />
          </div>
        </div>
      </div>
    </div>
  )
}
