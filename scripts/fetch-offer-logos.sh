#!/usr/bin/env bash
# Populate public/logos/ with issuer/lender logos for the credit-card & loan offer
# flows. Panels fall back to an icon when an image is missing, so running this is
# optional. Tries Clearbit, then Google's favicon service. Run from repo root.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/logos
mkdir -p "$OUT"

# offer id -> brand domain
rows=(
  "ink-unlimited chase.com"
  "spark-cash-plus capitalone.com"
  "spark-cash capitalone.com"
  "amex-blue americanexpress.com"
  "ink-preferred chase.com"
  "spark-select capitalone.com"
  "sba-7a sba.gov"
  "fundbox fundbox.com"
  "bluevine bluevine.com"
  "wells-fargo wellsfargo.com"
  "headway headwaycapital.com"
  "accion aofund.org"
  "bofa bankofamerica.com"
)

for row in "${rows[@]}"; do
  id="${row%% *}"; domain="${row##* }"; dest="$OUT/$id.png"
  curl -fsSL --max-time 20 -o "$dest" "https://logo.clearbit.com/$domain?size=128" \
    || curl -fsSL --max-time 20 -o "$dest" "https://www.google.com/s2/favicons?domain=$domain&sz=128" \
    || { echo "  ✗ $id ($domain) — both sources failed"; continue; }
  echo "  ✓ $id ($domain) — $(wc -c < "$dest") bytes"
done

echo "Done. Logos in $OUT/ (icon fallback covers any that failed)."
