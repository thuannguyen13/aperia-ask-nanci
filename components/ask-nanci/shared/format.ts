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
