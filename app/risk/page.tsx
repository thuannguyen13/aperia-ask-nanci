import { Suspense } from "react"
import { AskNanciProvider } from "@/contexts/AskNanciContext"
import { ChatStreamProvider } from "@/contexts/ChatStreamContext"
import { RiskConsole } from "@/components/risk/RiskConsole"

export default function RiskPage() {
  return (
    <Suspense fallback={null}>
      <ChatStreamProvider>
        <AskNanciProvider isConceptVersion>
          <RiskConsole />
        </AskNanciProvider>
      </ChatStreamProvider>
    </Suspense>
  )
}
