const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })

export function formatCurrency(n: number) {
  return USD.format(n)
}

export function formatPercent(n: number, decimals = 1) {
  return `${n.toFixed(decimals)}%`
}

// Whole dollars, for headline figures where cents are noise ("$18,420", not
// "$18,420.00"). Deliberately drops the cents off formatCurrency rather than
// using maximumFractionDigits: 0 — Intl would *round* where this *truncates*,
// and the demo has figures that differ between the two (4620.8 -> "$4,620"
// here, "$4,621" rounded). Keep the truncating behaviour.
export function formatWholeCurrency(n: number) {
  return formatCurrency(n).replace(/\.\d\d$/, "")
}

/**
 * Masks every digit except the last `visible`, leaving non-digits where they are —
 * "84-1029384" becomes "••-•••9384", "4111 1111 1111 1234" becomes
 * "•••• •••• •••• 1234". Enough of an identifier to recognise, not enough to copy
 * off a shared screen.
 *
 * Positional rather than a per-format template, so one function covers tax IDs,
 * account and card numbers, and phone numbers without knowing which it was handed.
 * Uses "•" to match the masked account numbers already in the demo data.
 */
export function maskDigits(value: string, visible = 4) {
  const chars = [...value]
  const digitPositions = chars.reduce<number[]>((acc, c, i) => (/\d/.test(c) ? [...acc, i] : acc), [])
  // slice(-0) is slice(0), which keeps the whole array — so visible: 0 would reveal
  // everything it was asked to hide. Guarded rather than relying on the negative index.
  const keep = new Set(visible > 0 ? digitPositions.slice(-visible) : [])
  return chars.map((c, i) => (/\d/.test(c) && !keep.has(i) ? "•" : c)).join("")
}
