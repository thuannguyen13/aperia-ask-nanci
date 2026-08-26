"use client"

import { useEffect, useState } from "react"
import { Check, Copy, MessageSquare, RotateCcw, SquarePen } from "lucide-react"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, AlertDescription,
  AlertTitle, Avatar, AvatarFallback, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Calendar, Card, CardContent,
  CardDescription, CardHeader, CardTitle, Checkbox, Command, CommandGroup, CommandInput,
  CommandItem, CommandList, Input, Label, Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, Progress, RadioGroup, RadioGroupItem,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton,
  Slider, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs,
  TabsList, TabsTrigger, Textarea, Toggle, ToggleGroup, ToggleGroupItem,
} from "aperia-ds5"
import { Control } from "@/components/charts/controls"
import { createColorResolver } from "@/lib/ask-nanci/resolve-color"
import { THEME_IDS, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"

// ── Token model ────────────────────────────────────────────────────────────────
// Every color token the design system themes, grouped the way a brand thinks about
// them. Keys are the CSS custom-property names (minus the --); the two gradient
// stops are pseudo-tokens composed into --app-gradient. Non-color knobs (radius,
// fonts) are deliberately out of scope. Defined-but-dead vars are also left out
// rather than shown doing nothing — audited 2026-08-25 against the ds5 dist and the
// app source: popover (portals out of the preview scope), destructive-foreground
// (the DS renders destructive as a tint, bg-destructive/10 with text-destructive),
// and sidebar-primary(+foreground) (this DS build ships no sidebar-primary classes,
// and the app's active nav item is bg-muted — the existing brand blocks set the var
// without a single reader). Every exposed token below has real consumers.

interface TokenDef { key: string; label: string; hint?: string }

const TOKEN_GROUPS: { title: string; tokens: TokenDef[] }[] = [
  {
    title: "Brand",
    tokens: [
      { key: "primary", label: "Primary", hint: "Buttons, badges, switches, progress" },
      { key: "primary-foreground", label: "Primary foreground", hint: "Ink on primary surfaces" },
      { key: "ring", label: "Focus ring", hint: "Focused inputs and controls" },
      { key: "gradient-start", label: "Frame gradient start", hint: "Top of the page backdrop" },
      { key: "gradient-end", label: "Frame gradient end", hint: "Where the backdrop fades to" },
    ],
  },
  {
    title: "Neutrals",
    tokens: [
      { key: "background", label: "Background", hint: "The page canvas" },
      { key: "foreground", label: "Foreground", hint: "Default body text" },
      { key: "card", label: "Card", hint: "Card and panel surfaces" },
      { key: "card-foreground", label: "Card foreground", hint: "Text on cards" },
      { key: "secondary", label: "Secondary", hint: "Secondary buttons and badges" },
      { key: "secondary-foreground", label: "Secondary foreground", hint: "Text on secondary surfaces" },
      { key: "muted", label: "Muted", hint: "Subtle fills: tracks, hovers, skeletons" },
      { key: "muted-foreground", label: "Muted foreground", hint: "Captions and secondary text" },
      { key: "accent", label: "Accent", hint: "Hover and selection tint" },
      { key: "accent-foreground", label: "Accent foreground", hint: "Text on the accent tint" },
      { key: "border", label: "Border", hint: "Dividers and outlines" },
      { key: "input", label: "Input border", hint: "Form field borders" },
    ],
  },
  {
    title: "Semantic",
    tokens: [{ key: "destructive", label: "Destructive", hint: "Delete actions and error text" }],
  },
  {
    title: "Sidebar",
    tokens: [
      { key: "sidebar", label: "Surface", hint: "The sidebar background" },
      { key: "sidebar-foreground", label: "Text", hint: "Sidebar labels and items" },
      { key: "sidebar-accent", label: "Hover and active", hint: "Fill behind the hovered or active item" },
      { key: "sidebar-accent-foreground", label: "Hover and active text", hint: "Text on that fill" },
      { key: "sidebar-border", label: "Border", hint: "Sidebar dividers" },
    ],
  },
  {
    title: "Charts",
    tokens: [
      { key: "chart-1", label: "Chart 1", hint: "First series, and any single-series chart" },
      { key: "chart-2", label: "Chart 2", hint: "Second series" },
      { key: "chart-3", label: "Chart 3", hint: "Third series" },
      { key: "chart-4", label: "Chart 4", hint: "Fourth series" },
      { key: "chart-5", label: "Chart 5", hint: "Fifth series" },
      { key: "chart-6", label: "Chart 6", hint: "Sixth series" },
    ],
  },
]

const ALL_TOKENS = TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => t.key))
type Tokens = Record<string, string>

const SHADCN_PRESET = "shadcn"

/**
 * The values app/globals.css :root overrides, restored verbatim from
 * aperia-ds5/styles/base.css for the Shadcn preset — the cascade cannot answer
 * with them because globals re-declares :root after the DS import. Every token not
 * listed here resolves correctly off the probe even for this preset.
 */
const SHADCN_OVERRIDES: Record<string, string> = {
  primary: "oklch(0.21 0.006 285.885)",
  "primary-foreground": "oklch(0.985 0 0)",
  ring: "oklch(0.705 0.015 286.067)",
  "chart-1": "oklch(0.646 0.222 41.116)",
  "chart-2": "oklch(0.6 0.118 184.704)",
  "chart-3": "oklch(0.398 0.07 227.392)",
  "chart-4": "oklch(0.828 0.189 84.429)",
  "chart-5": "oklch(0.769 0.188 70.08)",
}

/** Every current gradient in globals.css follows this exact shape. */
const GRADIENT_RE = /linear-gradient\(180deg,\s*(.+?)\s+0%,\s*(.+?)\s+200px\)/

function buildGradient(t: Tokens) {
  return `linear-gradient(180deg, ${t["gradient-start"]} 0%, ${t["gradient-end"]} 200px)`
}

/**
 * The paste-ready block: every token, explicitly, in the form the compiled app
 * consumes. Verified against the built Tailwind output: the DS's @theme inline
 * makes utilities inline the raw var (.bg-muted reads var(--muted); no
 * --color-muted exists at runtime) — EXCEPT primary and primary-foreground,
 * which globals.css declares as --color-* custom properties, so Tailwind rewires
 * those two utilities to read var(--color-primary[-foreground]) instead. Those
 * two get both forms — the --color- form is the operative one for utilities, the
 * raw form feeds direct var(--primary) readers — the same shape every existing
 * brand block uses.
 */
const HARDCODED_COLOR_FORMS = new Set(["primary", "primary-foreground"])

function buildCss(name: string, t: Tokens) {
  const lines: string[] = []
  for (const key of ALL_TOKENS) {
    if (key.startsWith("gradient-")) continue
    lines.push(`  --${key}: ${t[key]};`)
    if (HARDCODED_COLOR_FORMS.has(key)) lines.push(`  --color-${key}: ${t[key]};`)
  }
  lines.push(`  --app-gradient: ${buildGradient(t)};`)
  return `[data-theme="${name}"] {\n${lines.join("\n")}\n}`
}

// ── Token editor row ───────────────────────────────────────────────────────────

function TokenRow({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: string; onChange: (hex: string) => void }) {
  return (
    <label className="-mx-2 flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50">
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
        {hint && <span className="block truncate text-[10px] text-muted-foreground">{hint}</span>}
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
      {/* The app itself, skeletonized: the same .app-frame gradient rule and nested
          bg-sidebar card as the real shell, laid out like the concept welcome screen.
          Themed surfaces (gradient, primary, sidebar active, ring) paint for real;
          everything that would be content is a placeholder block. */}
      <div className="app-frame flex h-[500px] flex-col overflow-hidden rounded-xl px-2 pb-2 ring-1 ring-inset ring-black/5">
        <div className="relative flex h-12 shrink-0 items-center justify-between px-3">
          <div className="h-6 w-16 rounded-md bg-white/20" />
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-tight text-white">
            Your Brand
          </span>
          <div className="size-6 rounded-full bg-white/25" />
        </div>
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl bg-sidebar shadow-sm">
          {/* The sidebar consumes its own token family (surface, text, hover/active
              fill, border) so every Sidebar-group picker has a visible consumer.
              The accent seeds to the muted-family value, so this matches the app's
              real look until the token is edited. */}
          <div className="flex w-48 shrink-0 flex-col p-3" style={{ color: "var(--sidebar-foreground)" }}>
            <div className="mb-2 flex items-center gap-2 px-1 pb-1">
              <div className="size-5 rounded-md" style={{ background: "var(--primary)" }} />
              <span className="text-xs font-semibold">Ask Nanci</span>
            </div>
            {/* A list item like the rest of the nav, not a filled button. */}
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium">
              <SquarePen className="size-3.5" />
              New chat
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <Skeleton className="mb-1 h-2.5 w-14" />
              <div
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium"
                style={{ background: "var(--sidebar-accent)", color: "var(--sidebar-accent-foreground)" }}
              >
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="truncate">Saturday sales spike</span>
              </div>
              {/* Real text, not skeleton bars: these rows are what sidebar-foreground
                  paints when nothing is hovered. */}
              {["Refund policy question", "Weekend staffing", "Deposit timing"].map((t) => (
                <div key={t} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs opacity-80">
                  <MessageSquare className="size-3.5 shrink-0" />
                  <span className="truncate">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg border p-2.5" style={{ borderColor: "var(--sidebar-border)" }}>
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="mt-1.5 h-2.5 w-24" />
              <Progress value={62} className="mt-2 h-1.5" />
            </div>
          </div>
          {/* The start page, mirroring ConceptWelcomeView's real structure: centered
              logomark + title + subtitle, the chat input directly under the header,
              then a section label and the flow-card grid — each card a bg-card tile
              with a number circle, title, badge pill (secondary pair), description
              and a full-width Try it button (one primary, like Simulate login). */}
          <div className="m-2 ml-0 flex min-w-0 flex-1 flex-col items-center gap-4 overflow-hidden rounded-xl border bg-background px-6 py-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="size-7 rounded-lg" style={{ background: "var(--primary)" }} />
              <span className="text-sm font-medium">Ask Nanci</span>
              <span className="text-[10px] text-muted-foreground">Each flow demonstrates a distinct AI + panel UX.</span>
            </div>
            <div className="flex w-full max-w-md shrink-0 items-center gap-2">
              <div className="flex h-8 flex-1 items-center rounded-lg border border-ring px-2.5 ring-3 ring-ring/50">
                <span className="text-xs text-muted-foreground">Ask anything…</span>
              </div>
              <Button size="sm">Ask</Button>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Merchant money questions
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { num: 1, title: "Sales snapshot", badge: "Chat + panel", desc: "How did this week compare to last?", primary: false },
                  { num: 2, title: "Pending deposits", badge: "Chat only", desc: "When does Saturday's batch arrive?", primary: false },
                  { num: 3, title: "Proactive alerts", badge: "AI-initiated", desc: "Nanci opens with what she spotted.", primary: true },
                  { num: 4, title: "Busiest times", badge: "Multi-step", desc: "Was Saturday worth it?", primary: false },
                ].map((c) => (
                  <div key={c.num} className="flex flex-col gap-1.5 rounded-xl border bg-card p-3 text-card-foreground">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground">
                          {c.num}
                        </span>
                        <span className="truncate text-[11px] font-semibold">{c.title}</span>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                        style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <span className="text-[10px] leading-snug text-muted-foreground">{c.desc}</span>
                    {c.primary ? (
                      <div
                        className="mt-auto rounded-md px-2 py-1 text-center text-[10px] font-medium"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        Simulate login
                      </div>
                    ) : (
                      <div className="mt-auto rounded-md border px-2 py-1 text-center text-[10px] font-medium">
                        Try it
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
              <Button size="sm" variant="destructive">Delete</Button>
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
              <Label className="text-xs">Notes</Label>
              <Textarea placeholder="Anything the processor should know…" className="min-h-14 text-xs" />
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
            <CardTitle className="text-sm">Selection</CardTitle>
            <CardDescription className="text-xs">Checked and dragged states take primary.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <RadioGroup defaultValue="monthly" className="flex gap-5">
              {["monthly", "quarterly", "annual"].map((v) => (
                <label key={v} className="flex items-center gap-2 text-xs capitalize text-foreground">
                  <RadioGroupItem value={v} /> {v}
                </label>
              ))}
            </RadioGroup>
            <Slider defaultValue={[64]} aria-label="Sample slider" />
            <div className="flex items-center gap-2">
              <Toggle defaultPressed aria-label="Bold sample">Pressed</Toggle>
              <Toggle aria-label="Off sample">Off</Toggle>
              <ToggleGroup type="single" defaultValue="week" variant="outline" spacing={0}>
                {["day", "week", "month"].map((v) => (
                  <ToggleGroupItem key={v} value={v} className="px-3 text-xs capitalize">{v}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Calendar</CardTitle>
            <CardDescription className="text-xs">The selected day takes primary.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* Fixed date: today's date would differ between server and client render. */}
            <Calendar mode="single" selected={new Date(2026, 7, 25)} defaultMonth={new Date(2026, 7, 1)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Navigation</CardTitle>
            <CardDescription className="text-xs">Links and the active page take primary; tabs stay neutral.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem><BreadcrumbLink>Merchants</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink>Harbor View Hotel</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Deposits</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Tabs defaultValue="overview">
              <TabsList>
                {["overview", "activity", "settings"].map((v) => (
                  <TabsTrigger key={v} value={v} className="px-3 capitalize">{v}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious /></PaginationItem>
                <PaginationItem><PaginationLink>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext /></PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex items-center gap-4 text-xs">
              <Button variant="link" className="h-auto p-0 text-xs">Link button</Button>
              <a className="font-medium text-primary underline underline-offset-2">Text link</a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Command</CardTitle>
            <CardDescription className="text-xs">The highlighted row takes the accent tint.</CardDescription>
          </CardHeader>
          <CardContent>
            <Command className="rounded-lg border">
              <CommandInput placeholder="Search merchants…" />
              <CommandList>
                <CommandGroup heading="Merchants">
                  <CommandItem>Harbor View Hotel</CommandItem>
                  <CommandItem>Summit Auto Group</CommandItem>
                  <CommandItem>Coastal Fresh Market</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Content</CardTitle>
            <CardDescription className="text-xs">Tables and accordions stay on the neutral tokens.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Merchant</TableHead>
                  <TableHead className="text-right text-xs">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell className="text-xs">Harbor View Hotel</TableCell><TableCell className="text-right text-xs tabular-nums">$3.2M</TableCell></TableRow>
                <TableRow><TableCell className="text-xs">Summit Auto</TableCell><TableCell className="text-right text-xs tabular-nums">$2.9M</TableCell></TableRow>
              </TableBody>
            </Table>
            <Accordion type="single" collapsible defaultValue="a">
              <AccordionItem value="a">
                <AccordionTrigger className="text-xs">What moves with the theme?</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Primary surfaces, the focus ring, the sidebar active item and the frame gradient.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger className="text-xs">What stays neutral?</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">
                  Borders, muted fills and body text.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Feedback</CardTitle>
            <CardDescription className="text-xs">Alerts, avatars and loading stay on the neutral tokens.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <AlertTitle className="text-xs">Deposit on the way</AlertTitle>
              <AlertDescription className="text-xs">$4,620 arrives tomorrow morning.</AlertDescription>
            </Alert>
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>HV</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>SA</AvatarFallback></Avatar>
              <Badge variant="outline">Outline badge</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                        <CardTitle className="text-sm">Charts</CardTitle>
            <CardDescription className="text-xs">Series map to the chart ramp in order; a single series takes chart-1.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span
                  key={n}
                  title={`chart-${n}`}
                  className="size-4 rounded-[3px] ring-1 ring-inset ring-black/10"
                  style={{ background: `var(--chart-${n})` }}
                />
              ))}
              <span className="ml-1 text-[10px] text-muted-foreground">chart-1..6</span>
            </div>

            {/* Five series stacked — one ramp slot each, like a stacked bar chart. */}
            <div className="flex h-3.5 overflow-hidden rounded-[3px]">
              {[
                { n: 1, w: 35 }, { n: 2, w: 25 }, { n: 3, w: 18 }, { n: 4, w: 12 }, { n: 5, w: 10 },
              ].map((seg) => (
                <div key={seg.n} style={{ width: `${seg.w}%`, background: `var(--chart-${seg.n})` }} />
              ))}
            </div>

            {/* Part-to-whole: the same five series as a donut, with a legend. */}
            <div className="flex items-center gap-5">
              <div
                className="relative size-24 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(var(--chart-1) 0 35%, var(--chart-2) 35% 60%, var(--chart-3) 60% 78%, var(--chart-4) 78% 90%, var(--chart-5) 90% 100%)",
                }}
              >
                <div className="absolute inset-5 rounded-full bg-card" />
              </div>
              <div className="flex flex-col gap-1">
                {["In-person", "Online", "Keyed", "Wallet", "ACH"].map((name, i) => (
                  <div key={name} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="size-2 rounded-[2px]" style={{ background: `var(--chart-${i + 1})` }} />
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* One measure, one color: single-series bars all take chart-1. */}
            <div className="flex flex-col gap-2.5">
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
                      style={{ width: `${r.v}%`, background: "var(--chart-1)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ── The generator ──────────────────────────────────────────────────────────────

export function ThemeGenerator() {
  const [preset, setPreset] = useState<ThemeId | typeof SHADCN_PRESET>(SHADCN_PRESET)
  const [themeName, setThemeName] = useState("new-brand")
  const [tokens, setTokens] = useState<Tokens | null>(null)
  // The values as seeded, so the export can tell an edit from an untouched default.
  const [seeded, setSeeded] = useState<Tokens | null>(null)
  // Bumped by the Reset button to re-run the seeding effect on the same preset.
  const [seedNonce, setSeedNonce] = useState(0)
  const [copied, setCopied] = useState(false)

  // Seed every token from the chosen preset. A brand seeds off a probe div carrying
  // data-theme, which picks up that brand's [data-theme] block through the normal
  // cascade — with :root filling whatever the brand does not set, exactly what the
  // app resolves. The Shadcn preset swaps in the stock values globals.css shadows.
  useEffect(() => {
    const probe = document.createElement("div")
    if (preset !== SHADCN_PRESET) probe.dataset.theme = preset
    document.body.appendChild(probe)
    const resolver = createColorResolver(probe)
    const cs = getComputedStyle(probe)
    const raw = (n: string) => cs.getPropertyValue(n).trim()

    const next: Tokens = {}
    for (const key of ALL_TOKENS) {
      if (key.startsWith("gradient-")) continue
      const stock = preset === SHADCN_PRESET ? SHADCN_OVERRIDES[key] : undefined
      // --color-primary first: two brand blocks set only that form of primary.
      const value = stock ?? (key === "primary" ? raw("--color-primary") || raw("--primary") : raw(`--${key}`))
      next[key] = value ? resolver.toHex(value) : "#888888"
    }
    const gradient = preset === SHADCN_PRESET ? null : raw("--app-gradient").match(GRADIENT_RE)
    next["gradient-start"] = gradient ? resolver.toHex(gradient[1]) : next.primary
    next["gradient-end"] = gradient
      ? resolver.toHex(gradient[2])
      : resolver.toHex(`color-mix(in oklab, ${next.primary} 12%, white)`)

    setTokens(next)
    setSeeded(next)
    resolver.dispose()
    probe.remove()
  }, [preset, seedNonce])

  if (!tokens || !seeded) return <div className="min-h-screen bg-background" />

  const previewVars = Object.fromEntries([
    ...ALL_TOKENS.filter((k) => !k.startsWith("gradient-")).flatMap((k) => [
      [`--${k}`, tokens[k]],
      [`--color-${k}`, tokens[k]],
    ]),
    ["--app-gradient", buildGradient(tokens)],
  ]) as React.CSSProperties

  const css = buildCss(themeName, tokens)

  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const dirty = ALL_TOKENS.some((k) => tokens[k] !== seeded[k])

  const edit = (key: string) => (hexValue: string) =>
    setTokens((prev) => (prev ? { ...prev, [key]: hexValue } : prev))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-[1400px] border-x px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Theme Generator</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Edit the six values a brand theme sets, watch them land on real components, and copy
            the paste-ready CSS block. Add the logo in{" "}
            <span className="font-mono text-xs">theme-logos.ts</span> and the brand is live.
          </p>
        </header>

        <div className="sticky top-0 z-20 -mx-6 mt-8 border-b bg-background/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-5 pb-5">
            <Control label="Preset">
              <div className="flex items-center gap-2">
                <Select value={preset} onValueChange={(v) => setPreset(v as ThemeId | typeof SHADCN_PRESET)}>
                  <SelectTrigger className="w-44 bg-background focus-visible:border-foreground focus-visible:ring-foreground/20"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" align="start" className="p-1">
                    <SelectItem value={SHADCN_PRESET} className="py-1.5 pl-2">shadcn</SelectItem>
                    {THEME_IDS.map((id) => <SelectItem key={id} value={id} className="py-1.5 pl-2">{id}</SelectItem>)}
                  </SelectContent>
                </Select>
                {/* Discards every edit by re-seeding the same preset; inert while clean. */}
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Reset edits"
                  title="Reset edits"
                  disabled={!dirty}
                  onClick={() => setSeedNonce((n) => n + 1)}
                  className="focus-visible:border-foreground focus-visible:ring-foreground/20"
                >
                  <RotateCcw />
                </Button>
              </div>
            </Control>
            <Control label="Theme name">
              <Input
                value={themeName}
                onChange={(e) => setThemeName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                className="h-8 w-72 font-mono text-xs focus-visible:border-foreground focus-visible:ring-foreground/20"
              />
            </Control>
            <div className="ml-auto flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="focus-visible:border-foreground focus-visible:ring-foreground/20">
                    View CSS
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Theme CSS</DialogTitle>
                    <DialogDescription>
                      Paste into app/globals.css, then add the logo in theme-logos.ts.
                    </DialogDescription>
                  </DialogHeader>
                  <pre className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/40 p-4 font-mono text-[11px] leading-relaxed text-foreground">
                    {css}
                  </pre>
                  <DialogFooter>
                    <Button size="sm" onClick={copy} className="bg-foreground text-background hover:bg-foreground/90">
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copied ? "Copied" : "Copy CSS"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={copy} className="bg-foreground text-background hover:bg-foreground/90">
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
            {TOKEN_GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
                {group.title === "Brand" && (
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    The main tokens for a brand theme: start here. The groups
                    below fine-tune the rest of the palette.
                  </p>
                )}
                <div className="mt-2 flex flex-col">
                  {group.tokens.map((row) => (
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
            ))}
          </div>

          {/* bg-background here makes the Background token the wall's canvas — it
              seeds to the page white, so nothing changes until it is edited. */}
          <div id="wall" className="rounded-2xl bg-background" style={previewVars}>
            <Wall />
          </div>
        </div>
      </div>
    </div>
  )
}
