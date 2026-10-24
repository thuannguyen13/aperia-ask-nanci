"use client"

import { cn } from "aperia-ds5/utils"
import { Users } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  NO_SHOW_NIGHTS, NO_SHOW_TOTALS, RECOVERED_PCT, PARTY_SIZES, PEAK_NIGHTS, PEAK_LARGE_SEATS, PEAK_LARGE_SHARE_PCT,
  CHECK_PER_COVER, PERIOD, DEPOSIT_POLICY, DEPOSIT_WOULD_HAVE_KEPT, BOOK_DATE, BOOK_PREVIEW, BOOK_HELD, BOOK_AWAITING,
} from "@/lib/ask-nanci/data/panels/resy-no-shows"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, StatCard, Callout, formatWholeCurrency } from "@/components/shared"

// Empty seats per cell. Red, because every seat here is money that did not arrive.
const levelCls = (seats: number) =>
  seats === 0 ? "bg-muted text-muted-foreground/60"
  : seats < 5 ? "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200"
  : seats < 10 ? "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-100"
  : seats < 25 ? "bg-red-400 text-white dark:bg-red-700"
  : "bg-red-600 text-white dark:bg-red-600"

const formatThousands = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`)

const initials = (name: string) => name.split(" ").map((w) => w[0]).join("")

export function ResyNoShowsPanel() {
  const { closeDynamicPanel } = useAskNanci()
  // "peak" rings the Friday and Saturday large-party cells; "deposit" adds the policy now
  // live in Resy and the first Friday's book under it.
  const view = usePanelView("resy-no-shows", "default")
  const peakHighlighted = view === "peak" || view === "deposit"
  const isPeakCell = (night: string, sizeIndex: number) => peakHighlighted && sizeIndex === PARTY_SIZES.length - 1 && PEAK_NIGHTS.includes(night)

  return (
    <PanelShell>
      <PanelHeader
        title="No-Show Cost"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-no-shows")}
      />

      <PanelBody className="space-y-4">
        {view === "deposit" && (
          <>
            <Callout variant="green">
              <p className="font-semibold">Deposit policy live in Resy</p>
              <p className="mt-1">
                ${DEPOSIT_POLICY.perGuest} per guest on {DEPOSIT_POLICY.nights} bookings of {DEPOSIT_POLICY.minParty}+, refundable up to {DEPOSIT_POLICY.refundWindowHours} hours before. Starts {DEPOSIT_POLICY.startsOn}. October's pattern would have kept {formatWholeCurrency(DEPOSIT_WOULD_HAVE_KEPT)}.
              </p>
            </Callout>

            <div className="rounded-xl border">
              <div className="flex items-baseline justify-between border-b px-4 py-3">
                <p className="text-base font-bold text-foreground">{BOOK_DATE} · large parties</p>
                <p className="text-xs text-muted-foreground tabular-nums">{formatWholeCurrency(BOOK_HELD)} held · {BOOK_AWAITING.length} awaiting</p>
              </div>
              <ul className="divide-y">
                {BOOK_PREVIEW.map((b) => (
                  <li key={b.guest} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-14 shrink-0 text-xs font-semibold tabular-nums text-foreground">{b.time}</span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{initials(b.guest)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{b.guest}</p>
                      {b.note && <p className="truncate text-xs text-muted-foreground">{b.note}</p>}
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                      <Users className="size-3.5" />{b.party}
                    </span>
                    <span className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                      b.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                    )}>
                      {b.status === "paid" ? "Paid" : "Requested"} {formatWholeCurrency(b.deposit)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <NanciInsight>
          <span className="font-bold">{formatWholeCurrency(NO_SHOW_TOTALS.lostRevenue)} walked out the door</span>: {NO_SHOW_TOTALS.parties} parties and {NO_SHOW_TOTALS.seats} seats never showed, at your {formatWholeCurrency(CHECK_PER_COVER)} average check per cover. Fees won back {RECOVERED_PCT}% of it.
        </NanciInsight>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          <StatCard label="Seats lost" value={String(NO_SHOW_TOTALS.seats)} sublabel={`${NO_SHOW_TOTALS.parties} parties`} />
          <StatCard label="Lost revenue" value={formatWholeCurrency(NO_SHOW_TOTALS.lostRevenue)} sublabel={`at ${formatWholeCurrency(CHECK_PER_COVER)} per cover`} tone="amber" />
          <StatCard label="Fees charged" value={formatWholeCurrency(NO_SHOW_TOTALS.feesCharged)} sublabel={`${RECOVERED_PCT}% recovered`} />
        </div>

        <div>
          <p className="text-base font-bold text-foreground">Empty seats by night and party size</p>
          <p className="mb-3 text-sm text-muted-foreground">{PERIOD} · reservations from Resy, spend from your card transactions</p>

          <div className="flex flex-col gap-[5px]">
            <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-[5px]">
              <span />
              {NO_SHOW_NIGHTS.map((n) => (
                <span key={n.night} className="text-center text-[10px] font-semibold text-muted-foreground">{n.night.slice(0, 3)}</span>
              ))}
            </div>
            {PARTY_SIZES.map((size, s) => (
              <div key={size} className="grid grid-cols-[40px_repeat(7,1fr)] items-center gap-[5px]">
                <span className="text-[10px] font-semibold text-muted-foreground">{size}</span>
                {NO_SHOW_NIGHTS.map((n) => (
                  <span
                    key={n.night}
                    title={`${n.night}, parties of ${size}: ${n.seatsBySize[s]} seats`}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-shadow",
                      levelCls(n.seatsBySize[s]),
                      isPeakCell(n.night, s) && "ring-2 ring-amber-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    {n.seatsBySize[s] || "·"}
                  </span>
                ))}
              </div>
            ))}
            <div className="mt-1 grid grid-cols-[40px_repeat(7,1fr)] gap-[5px] border-t pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground">Lost</span>
              {NO_SHOW_NIGHTS.map((n) => (
                <span key={n.night} className="text-center text-[11px] font-semibold tabular-nums text-foreground">{formatThousands(n.lostRevenue)}</span>
              ))}
            </div>
          </div>
        </div>

        {peakHighlighted && (
          <Callout variant="amber">
            <span className="font-semibold">{PEAK_NIGHTS.join(" and ")}, parties of {DEPOSIT_POLICY.minParty}+:</span> {PEAK_LARGE_SEATS} empty seats, {PEAK_LARGE_SHARE_PCT}% of the month, from just two cells. A deposit on those bookings alone covers most of the loss without asking anything of a table for two.
          </Callout>
        )}
      </PanelBody>
    </PanelShell>
  )
}
