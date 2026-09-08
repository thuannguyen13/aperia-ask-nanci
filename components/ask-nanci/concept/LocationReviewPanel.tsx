"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import {
  Tabs, Button, Input, Label,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  REVIEW_PERIODS, DEFAULT_REVIEW_PERIOD, REVIEW_LOCATIONS, REVIEW_TOTAL_SALES, REVIEW_TOTAL_CHANGE_PCT,
  REVIEW_LEADER, REVIEW_WATCH, WATCH_TRANSACTIONS, averageTicket, trendFor,
} from "@/lib/ask-nanci/data/panels/location-review"
import {
  PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, StatCard, Callout,
  ResponsiveTabsList, ResponsiveChart, chartTickProps, PanelTable, Thead, Th, Td,
  formatCurrency, formatWholeCurrency,
} from "@/components/shared"

// Flow 24, the mobile adaptation showcase. Nothing in here is mobile-only: every element
// is the shared primitive the rest of the app uses, and what the phone does differently
// (a dropdown instead of a tab strip, fewer axis labels, a table that scrolls under a
// fade) is decided inside those primitives by measuring, not by a breakpoint here.

const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]

const SIGNED_PCT = (pct: number) => `${pct > 0 ? "+" : ""}${pct}%`

export function LocationReviewPanel() {
  const { closeDynamicPanel } = useAskNanci()
  // The follow-up turn sets this view so the table and callout can single out Midtown.
  const watching = usePanelView("location-review", "default") === "watch"

  const [periodId, setPeriodId] = useState(DEFAULT_REVIEW_PERIOD)
  const period = REVIEW_PERIODS.find((p) => p.id === periodId) ?? REVIEW_PERIODS[0]

  const [flagOpen, setFlagOpen] = useState(false)
  const [note, setNote] = useState("")
  const [flagged, setFlagged] = useState(false)

  const legend = REVIEW_LOCATIONS.map((l, i) => ({ label: l.name, color: SERIES_COLORS[i] }))
  const trend = trendFor(period)

  function sendFlag() {
    setFlagged(true)
    setFlagOpen(false)
  }

  return (
    <PanelShell>
      <PanelHeader
        title="Location Review"
        subtitle={`${REVIEW_LOCATIONS.length} locations · ${period.range}`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("location-review")}
      />

      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>
          {watching ? (
            <>
              <span className="font-bold">{REVIEW_WATCH.name}</span> is down {Math.abs(REVIEW_WATCH.changePct)}% on fewer lunch transactions, {WATCH_TRANSACTIONS.to.count.toLocaleString()} in {WATCH_TRANSACTIONS.to.month} against {WATCH_TRANSACTIONS.from.count.toLocaleString()} in {WATCH_TRANSACTIONS.from.month}, while the average ticket held at {formatCurrency(averageTicket(REVIEW_WATCH))}. That points at foot traffic rather than pricing.
            </>
          ) : (
            <>
              <span className="font-bold">{SIGNED_PCT(REVIEW_TOTAL_CHANGE_PCT)} vs last quarter</span> across four locations. {REVIEW_LEADER.name} leads at {formatWholeCurrency(REVIEW_LEADER.sales)}. {REVIEW_WATCH.name} is the one to watch: it fell {Math.abs(REVIEW_WATCH.changePct)}% while the other three grew.
            </>
          )}
        </NanciInsight>

        {/* Six periods: more than a phone can show as tabs, which is what makes the strip
            turn into a dropdown there. Tabs context is required by the triggers inside. */}
        <Tabs value={periodId} onValueChange={setPeriodId}>
          <ResponsiveTabsList
            items={REVIEW_PERIODS.map(({ id, label }) => ({ id, label }))}
            value={periodId}
            onValueChange={setPeriodId}
          />
        </Tabs>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          <StatCard label="Sales" value={formatWholeCurrency(REVIEW_TOTAL_SALES * period.factor)} sublabel={period.range} emphasis />
          <StatCard label="vs prior period" value={SIGNED_PCT(REVIEW_TOTAL_CHANGE_PCT)} sublabel="weighted by sales" />
          <StatCard label="Leader" value={REVIEW_LEADER.name} sublabel={formatWholeCurrency(REVIEW_LEADER.sales * period.factor)} />
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">Sales by location</p>
          <ResponsiveChart height={200} legend={legend}>
            {(narrow) => (
              <BarChart data={trend}>
                <XAxis dataKey="label" {...chartTickProps(narrow)} />
                <YAxis tick={{ fontSize: narrow ? 10 : 11 }} width={narrow ? 36 : 44} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => formatWholeCurrency(Number(v))} />
                {REVIEW_LOCATIONS.map((l, i) => (
                  <Bar key={l.id} dataKey={l.id} name={l.name} stackId="sales" fill={SERIES_COLORS[i]} radius={i === REVIEW_LOCATIONS.length - 1 ? [4, 4, 0, 0] : 0} />
                ))}
              </BarChart>
            )}
          </ResponsiveChart>
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">By location</p>
          {/* Eight columns is wider than a phone and wider than this panel on a desktop.
              PanelTable scrolls it sideways and fades the edge that has more. */}
          <PanelTable pinFirst>
            <Thead>
              <Th>Location</Th>
              <Th align="right">Sales</Th>
              <Th align="right">vs prior</Th>
              <Th align="right">Transactions</Th>
              <Th align="right">Avg ticket</Th>
              <Th align="right">Refunds</Th>
              <Th align="right">Chargebacks</Th>
              <Th>Top item</Th>
              <Th>Manager</Th>
            </Thead>
            <tbody>
              {REVIEW_LOCATIONS.map((l) => {
                const isWatch = watching && l.id === REVIEW_WATCH.id
                const down = l.changePct < 0
                return (
                  <tr key={l.id} className={cn(isWatch && "bg-amber-50 dark:bg-amber-950/20")}>
                    {/* The pinned cell paints its own background so scrolling cells pass under it;
                        the highlight has to beat that, hence the important suffix. */}
                    <Td className={cn("whitespace-nowrap font-medium", isWatch && "bg-amber-50! dark:bg-amber-950/20!")}>{l.name}</Td>
                    <Td align="right" mono>{formatWholeCurrency(l.sales * period.factor)}</Td>
                    <Td align="right" mono className={down ? "font-semibold text-amber-700 dark:text-amber-400" : "text-green-700 dark:text-green-400"}>{SIGNED_PCT(l.changePct)}</Td>
                    <Td align="right" mono>{Math.round(l.transactions * period.factor).toLocaleString()}</Td>
                    <Td align="right" mono>{formatCurrency(averageTicket(l))}</Td>
                    <Td align="right" mono>{Math.round(l.refunds * period.factor)}</Td>
                    <Td align="right" mono>{Math.round(l.chargebacks * period.factor)}</Td>
                    <Td className="whitespace-nowrap">{l.topItem}</Td>
                    <Td className="whitespace-nowrap">{l.manager}</Td>
                  </tr>
                )
              })}
            </tbody>
          </PanelTable>
        </div>

        {watching && (
          flagged ? (
            <Callout variant="green">
              <p className="font-semibold">Flagged for {REVIEW_WATCH.manager}</p>
              <p className="mt-1">The regional manager has the quarter's figures for {REVIEW_WATCH.name}{note ? " and your note" : ""}. You will hear back in the conversation.</p>
            </Callout>
          ) : (
            <Callout variant="amber">
              <p className="font-semibold">{REVIEW_WATCH.name} lost {WATCH_TRANSACTIONS.from.count - WATCH_TRANSACTIONS.to.count} lunch transactions over the quarter</p>
              <p className="mt-1">The ticket did not move, so it is fewer people through the door rather than smaller orders. Sales data cannot say why.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => setFlagOpen(true)}>Flag for regional manager</Button>
                <Button variant="outline" onClick={() => setPeriodId("month")}>Look at June only</Button>
              </div>
            </Callout>
          )
        )}
      </PanelBody>

      {/* A dialog on every screen: a confirmation is a deliberate choice, and a sheet is
          dismissed by dragging. The field is 16px so iOS does not zoom into it. */}
      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Flag {REVIEW_WATCH.name} for {REVIEW_WATCH.manager}</DialogTitle>
            <DialogDescription>
              Sends this quarter&apos;s figures and the lunch transaction drop. Add anything the numbers do not say.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location-review-note">Note</Label>
            <Input
              id="location-review-note"
              placeholder="Anything different in store this quarter?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagOpen(false)}>Cancel</Button>
            <Button onClick={sendFlag}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PanelShell>
  )
}
