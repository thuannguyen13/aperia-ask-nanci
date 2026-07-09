export const DRIVER_SUMMARY = { deltaAmount: 117.1, volumeChangePct: 18, chargebackFee: 15.0 }

export const EFFECTIVE_RATE = { april: "2.67%", may: "2.71%", change: "+0.04%" }

export const VOLUME = { april: 22300.0, may: 26300.0, changeAmount: 4000.0, changePct: 18 }

export const FEES = [
  { type: "Processing (per-transaction)", sublabel: "Scales with volume",   april: 568.90, may: 671.00, change: 102.10 },
  { type: "Chargeback Fee",               sublabel: "Case CS-8821 · May 3", april:   0.00, may:  15.00, change:  15.00 },
  { type: "Monthly Statement Fee",        sublabel: "Flat",                 april:   9.00, may:   9.00, change:  null  },
  { type: "PCI Compliance Fee",           sublabel: "Flat",                 april:  17.00, may:  17.00, change:  null  },
]

export const FEES_TOTAL = { april: 594.90, may: 712.00, change: 117.10 }
