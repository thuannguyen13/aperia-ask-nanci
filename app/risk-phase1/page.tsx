import { Suspense } from "react"
import { AskNanciProvider } from "@/contexts/AskNanciContext"
import { ChatStreamProvider } from "@/contexts/ChatStreamContext"
import { RiskConsole } from "@/components/risk/RiskConsole"

// Phase 1 of the Risk pitch: the same console with no assistant in it. Phase 2 is
// /risk, which is this page with `assistant` left at its default. The providers
// stay mounted because the risk screens read panel state from them even when no
// chat UI renders — dropping them would mean forking every screen.
export default function RiskPhase1Page() {
  return (
    <Suspense fallback={null}>
      <ChatStreamProvider>
        <AskNanciProvider isConceptVersion>
          <RiskConsole assistant={false} />
        </AskNanciProvider>
      </ChatStreamProvider>
    </Suspense>
  )
}
