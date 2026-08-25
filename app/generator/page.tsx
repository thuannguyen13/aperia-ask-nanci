import { ThemeGenerator } from "@/components/generator/ThemeGenerator"

// White-label theme generator: edit the values a [data-theme] block in globals.css
// sets, preview them on real DS5 components, export the paste-ready block. Standalone
// like /charts — no providers, no app frame, so nothing here touches the embeds.
export default function GeneratorPage() {
  return <ThemeGenerator />
}
