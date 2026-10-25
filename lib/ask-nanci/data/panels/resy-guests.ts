// Flow 30: knowing the guests at the Tallis flagship, today, Sat Oct 24. Every figure
// is sample data. Profiles, tags, notes, visits and spend come from the Resy guestbook,
// with spend from Resy's POS link. The card brand on a check comes from card payments
// matched to Resy tables through the POS. Authored figures are the rows below, and every
// total is derived from them, so the chat and the panels quote the same numbers.

// ─── Step 1: the guest at 8:15 ────────────────────────────────────────────────

// Visits by venue. Profiles are unified across the group, so both venues show.
const VISITS = [
  { venue: "Tallis", visits: 6, averageSpend: 236 },
  { venue: "Little Tallis", visits: 2, averageSpend: 188 },
]
const withLifetime = (v: (typeof VISITS)[number]) => ({ ...v, lifetime: v.visits * v.averageSpend })
const [FLAGSHIP_VISITS, SISTER_VISITS] = VISITS.map(withLifetime)

export const GUEST = {
  name: "Rafael Ortiz",
  party: 2,
  booth: 14,
  time: "8:15",
  tags: ["Wine"],
  note: "Prefers a booth.",
  firstVisit: "March",
  lastVisit: "Oct 3",
  flagship: FLAGSHIP_VISITS,
  sister: SISTER_VISITS,
  /** Lifetime spend across the group. */
  lifetime: FLAGSHIP_VISITS.lifetime + SISTER_VISITS.lifetime,
  // Of his flagship checks, those matched to a card payment, and those paid with an Amex.
  matchedChecks: 6,
  amexChecks: 5,
}

// ─── Step 2: the tag and the notes Nanci adds ─────────────────────────────────

/** The tag and the note added with the owner's OK. The guest note stays on the profile;
 *  the visit note carries the same text on tonight's booking only. */
export const GUEST_UPDATE = { tag: "Regular", note: "Wife: shellfish allergy", byline: "Added via Ask Nanci" }

// ─── Step 3: September's anniversary guests ───────────────────────────────────

type Paid = "amex" | "other" | null // brand on the anniversary check; null when no payment matched

interface AnniversaryParty {
  name: string
  lifetime: number // group-wide lifetime spend, from Resy
  paid: Paid
  consent: boolean // opted into Tallis marketing email
}

const party = (name: string, lifetime: number, paid: Paid, consent = true): AnniversaryParty => ({ name, lifetime, paid, consent })

// Parties with an anniversary occasion on a September visit.
const SEPTEMBER_ANNIVERSARIES: AnniversaryParty[] = [
  party("Nora Whitcombe", 4210, "amex"),
  party("Marcus Bellwether", 3180, "amex"),
  party("Ines Calloway", 2760, "other"),
  party("Theo Marchetti", 2450, "amex"),
  party("June Halloran", 2220, "amex"),
  party("Sam Reyes", 2140, "amex"),
  party("Clara Voss", 1980, "amex"),
  party("Dev Raman", 1860, "amex"),
  party("Lena Sorensen", 1720, "other"),
  party("Owen Pritchard", 1640, "amex"),
  party("Maya Castellano", 1510, "amex"),
  party("Felix Abara", 1390, "amex"),
  party("Hana Kowalczyk", 1280, null),
  party("Ruth Delgado", 1170, "amex"),
  party("Elliot Kim", 1050, "amex"),
  party("Priya Venkatesh", 960, "other"),
  party("Gus Lindgren", 880, "amex"),
  party("Tessa Moreau", 790, "amex"),
  party("Ari Feldstein", 720, null),
  party("Bea Thornton", 640, "amex"),
  party("Cal Whitaker", 560, "amex"),
  party("Ivo Brennan", 2380, "amex", false),
  party("Sofia Linares", 1430, "other", false),
  party("Max Duvall", 990, null, false),
  party("Rina Takeda", 820, "amex", false),
  party("Joel Harker", 610, "other", false),
]

const emailable = SEPTEMBER_ANNIVERSARIES.filter((p) => p.consent)
const matched = emailable.filter((p) => p.paid !== null)

export const SEGMENT = {
  label: "Sept anniversaries",
  month: "September",
  parties: SEPTEMBER_ANNIVERSARIES.length,
  emailable: emailable.length,
  excluded: SEPTEMBER_ANNIVERSARIES.length - emailable.length,
  /** Emailable parties whose anniversary check matched a card payment, and those paid with an Amex. */
  matched: matched.length,
  amex: matched.filter((p) => p.paid === "amex").length,
}

/** The five emailable parties with the highest lifetime spend across the group. */
export const TOP_FIVE = [...emailable].sort((a, b) => b.lifetime - a.lifetime).slice(0, 5)
export const TOP_FIVE_TOTAL = TOP_FIVE.reduce((total, p) => total + p.lifetime, 0)

export const THANK_YOU_EMAIL = {
  from: "Tallis",
  subject: "Thank you for celebrating with us",
  body: "Hi {first name}, thank you for spending your anniversary at Tallis last month. It meant a lot to be part of it. We hope to see you again soon. The Tallis team.",
}
