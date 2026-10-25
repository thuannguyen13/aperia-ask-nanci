"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { LOW_RATINGS, SURVEY_SUMMARY } from "@/lib/ask-nanci/data/panels/resy-reports"
import { PanelShell, PanelHeader, PanelBody, StatCard } from "@/components/shared"

type Rating = (typeof LOW_RATINGS)[number]

const STATS = [
  { label: "Responses", value: String(SURVEY_SUMMARY.responses) },
  { label: "Average", value: `${SURVEY_SUMMARY.average}★` },
  { label: `${SURVEY_SUMMARY.lowAtMost}★ or less`, value: String(LOW_RATINGS.length) },
]

function RatingCard({ rating }: { rating: Rating }) {
  return (
    <li className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{rating.date} · {rating.time}</p>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">{rating.stars}★</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{rating.facts.join(" · ")}</p>
      {rating.comment && <p className="mt-2 text-sm italic text-foreground">“{rating.comment}”</p>}
    </li>
  )
}

export function ResySurveysPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title="Guest surveys" subtitle={`Resy Surveys · private responses · ${SURVEY_SUMMARY.window}`} size="lg" onClose={() => closeDynamicPanel("resy-surveys")} />
      <PanelBody className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Rated {SURVEY_SUMMARY.lowAtMost}★ or less</p>
          <ul className="space-y-3">
            {LOW_RATINGS.map((r) => <RatingCard key={`${r.date} ${r.time}`} rating={r} />)}
          </ul>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
