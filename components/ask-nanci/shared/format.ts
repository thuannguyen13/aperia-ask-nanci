const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })

export function formatCurrency(n: number) {
  return USD.format(n)
}

export function formatPercent(n: number, decimals = 1) {
  return `${n.toFixed(decimals)}%`
}
