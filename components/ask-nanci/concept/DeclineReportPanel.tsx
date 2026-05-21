"use client"

import { X, Download } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

const ALL_MERCHANTS = [
  { name: "Bayshore Fuel & Mart",    iso: "Pacific",   rate: 31.2, contact: "Apr 3"  },
  { name: "Delta Auto Body",          iso: "Pacific",   rate: 28.7, contact: "Mar 12" },
  { name: "Peak Performance Gym",     iso: "Summit",    rate: 26.4, contact: "Apr 18" },
  { name: "Coastal Pawn & Trade",     iso: "Coastal",   rate: 24.9, contact: "Feb 28" },
  { name: "Sunset Vape & Smoke",      iso: "Summit",    rate: 23.1, contact: "Apr 5"  },
  { name: "Fast Track Courier",       iso: "National",  rate: 22.8, contact: "Jan 15" },
  { name: "Lucky Star Casino Gifts",  iso: "Pacific",   rate: 22.3, contact: "Apr 21" },
  { name: "Metro Tech Repair",        iso: "Metro",     rate: 21.6, contact: "Mar 30" },
  { name: "Harbor Towing Services",   iso: "Coastal",   rate: 20.4, contact: "Apr 14" },
  { name: "Night Owl Convenience",    iso: "National",  rate: 19.8, contact: "Feb 10" },
  { name: "Pioneer Pawn Shop",        iso: "Metro",     rate: 19.2, contact: "Mar 22" },
  { name: "Ridgeline Car Wash",       iso: "Summit",    rate: 18.7, contact: "Apr 8"  },
  { name: "Valley Smoke Shop",        iso: "National",  rate: 18.1, contact: "Jan 30" },
  { name: "Apex Check Cashing",       iso: "Metro",     rate: 17.9, contact: "Apr 12" },
  { name: "Blue Chip Tattoo",         iso: "Pacific",   rate: 17.4, contact: "Mar 5"  },
  { name: "Frontier Bail Bonds",      iso: "National",  rate: 16.8, contact: "Feb 20" },
  { name: "Canyon Tech Outlet",       iso: "Summit",    rate: 16.3, contact: "Apr 19" },
  { name: "Iron Horse Pawn",          iso: "Coastal",   rate: 16.1, contact: "Apr 1"  },
  { name: "Copper Kettle Diner",      iso: "Metro",     rate: 15.9, contact: "Mar 14" },
  { name: "Sunrise Laundromat",       iso: "Summit",    rate: 15.7, contact: "Mar 28" },
  { name: "Golden Gate Gifts",        iso: "Pacific",   rate: 15.5, contact: "Apr 22" },
  { name: "West End Auto Parts",      iso: "National",  rate: 15.4, contact: "Apr 20" },
  { name: "Pinnacle Pawn",            iso: "Summit",    rate: 15.3, contact: "Apr 16" },
  { name: "Maplewood Deli",           iso: "Metro",     rate: 15.2, contact: "Apr 17" },
  { name: "Crystal Clear Car Audio",  iso: "Coastal",   rate: 15.1, contact: "Apr 23" },
  { name: "Thunder Road Bikes",       iso: "Pacific",   rate: 15.0, contact: "Apr 19" },
  { name: "North Star Tobacco",       iso: "National",  rate: 15.0, contact: "Apr 24" },
  { name: "Crossroads Diner",         iso: "Summit",    rate: 15.0, contact: "Apr 15" },
  { name: "Boulevard Tires",          iso: "Metro",     rate: 15.0, contact: "Apr 21" },
  { name: "Lakeside Bait & Tackle",   iso: "Coastal",   rate: 15.0, contact: "Apr 18" },
  { name: "High Noon Saloon",         iso: "Pacific",   rate: 15.0, contact: "Apr 22" },
  { name: "Main Street Pawn",         iso: "National",  rate: 15.0, contact: "Apr 20" },
  { name: "River City Auto Wash",     iso: "Metro",     rate: 15.0, contact: "Apr 16" },
  { name: "Northside Check Express",  iso: "Coastal",   rate: 15.0, contact: "Apr 19" },
  { name: "Harbor Lights Diner",      iso: "Summit",    rate: 15.0, contact: "Apr 23" },
  { name: "Freedom Financial",        iso: "Pacific",   rate: 15.0, contact: "Apr 17" },
  { name: "Eastside Tech",            iso: "National",  rate: 15.0, contact: "Apr 21" },
  { name: "Silver Creek Market",      iso: "Metro",     rate: 15.0, contact: "Apr 14" },
]

const FILTERED = ALL_MERCHANTS.slice(0, 22)

function rateColor(r: number) {
  if (r >= 25) return "text-red-600 dark:text-red-400"
  if (r >= 20) return "text-orange-500 dark:text-orange-400"
  if (r >= 18) return "text-amber-600 dark:text-amber-400"
  return "text-foreground"
}

function rateBar(r: number) {
  const pct = Math.min(100, (r / 35) * 100)
  const color = r >= 25 ? "bg-red-400" : r >= 20 ? "bg-orange-400" : r >= 18 ? "bg-amber-400" : "bg-muted-foreground/40"
  return { pct, color }
}

export function DeclineReportPanel() {
  const { closePanel, declineReportFiltered } = useAskNanci()
  const rows = declineReportFiltered ? FILTERED : ALL_MERCHANTS

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-2 rounded-full bg-red-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">High-Decline Merchants</span>
              <span className="rounded bg-red-100 px-1.5 py-px font-mono text-[9px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400">{rows.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-muted-foreground">Last week · Above 15%</p>
              {declineReportFiltered && (
                <span className="rounded bg-amber-100 px-1.5 py-px text-[9px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Not contacted 30+ days</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => closePanel("decline-report")} className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-muted/60 backdrop-blur z-10">
            <tr>
              <th className="px-4 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Merchant</th>
              <th className="px-2 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">ISO</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Rate</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Contact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const { pct, color } = rateBar(row.rate)
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 group">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-[32px] h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-foreground truncate max-w-[110px]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-muted-foreground">{row.iso}</td>
                  <td className={cn("px-3 py-2 text-right font-mono font-semibold", rateColor(row.rate))}>
                    {row.rate.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{row.contact}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t px-4 py-2.5">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="size-3.5" /> Export CSV
        </button>
      </div>
    </div>
  )
}
