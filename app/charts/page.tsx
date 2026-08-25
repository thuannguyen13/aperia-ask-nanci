import { ChartGallery } from "@/components/charts/ChartGallery"

// Reference page, not part of any demo mode: every chart form the stack renders, with the
// theming controls wired to all of them at once. Standalone by design: no providers and no
// app frame, so nothing here can affect the embedded modes.
export default function ChartsPage() {
  return <ChartGallery />
}
