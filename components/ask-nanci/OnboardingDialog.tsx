"use client"

import Image from "next/image"
import { Link2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogTitle } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ConnectWizard } from "./ConnectWizard"
import { FOUNDATION_SOURCE, ONBOARDING_KEY, readSources } from "@/lib/ask-nanci/sourceStore"


const ROW1 = [
  { src: "/fi/chase.png",      alt: "Chase" },
  { src: "/fi/wellsfargo.png", alt: "Wells Fargo" },
  { src: "/fi/usbank.png",     alt: "US Bank" },
  { src: "/fi/amex.svg",       alt: "American Express" },
  { src: "/fi/bofa.png",       alt: "Bank of America" },
]
const ROW2 = [
  { src: "/fi/citi.png",       alt: "Citi" },
  { src: "/fi/chase.png",      alt: "Chase" },
  { src: "/fi/wellsfargo.png", alt: "Wells Fargo" },
  { src: "/fi/usbank.png",     alt: "US Bank" },
  { src: "/fi/amex.svg",       alt: "American Express" },
]
const ROW3 = [
  { src: "/fi/bofa.png",       alt: "Bank of America" },
  { src: "/fi/citi.png",       alt: "Citi" },
  { src: "/fi/chase.png",      alt: "Chase" },
  { src: "/fi/wellsfargo.png", alt: "Wells Fargo" },
  { src: "/fi/usbank.png",     alt: "US Bank" },
]

function MarqueeRow({ logos, direction }: { logos: typeof ROW1; direction: "left" | "right" }) {
  return (
    <div className="w-full">
      <div className={`flex w-max ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex h-24 w-[156px] shrink-0 items-center justify-center rounded-[14px] border bg-background dark:bg-white p-4 shadow-sm mr-4"
          >
            <Image src={logo.src} alt={logo.alt} width={120} height={48} className="h-10 w-auto object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

type OnboardingStep = 1 | 2  // 1 = welcome, 2 = link accounts

export function OnboardingDialog() {
  const { onboardingOpen, setOnboardingOpen, setSources } = useAskNanci()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [wizardOpen, setWizardOpen] = useState(false)

  useEffect(() => {
    if (onboardingOpen) setStep(1)
  }, [onboardingOpen])

  function handleLinked() {
    setSources([FOUNDATION_SOURCE, ...readSources()])
    setWizardOpen(false)
    setOnboardingOpen(false)
    localStorage.setItem(ONBOARDING_KEY, "1")
  }

  return (
    <>
      <Dialog open={onboardingOpen} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="overflow-hidden p-0 sm:max-w-[720px] gap-0"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Welcome to Ask Nanci</DialogTitle>

          {step === 1 ? (
            <div className="flex h-[22.75rem] overflow-hidden">
              {/* Left panel */}
              <div className="flex w-1/2 flex-col justify-between p-6">
                <div className="flex flex-col gap-6">
                  {/* Logo */}
                  <div className="flex items-center gap-2">
                    <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={32} height={32} />
                    <span className="font-['Questrial',sans-serif] text-2xl text-foreground">Ask Nanci</span>
                  </div>

                  {/* Heading + description */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">
                      Answers built around your business
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Link your accounts and Nanci will learn your transaction history — so every answer it gives you is grounded in your actual numbers.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>

              {/* Right panel — illustration */}
              <div className="flex-1 overflow-hidden relative rounded-xl border-l border-y">
                <Image src="/ask-nanci/img_onboarding.png" alt="" fill className="object-cover object-left-top" />
              </div>
            </div>
          ) : (
            <div className="flex h-[22.75rem] overflow-hidden">
              {/* Left panel — 360px, 24px padding all sides */}
              <div className="flex w-1/2 flex-col justify-between p-6">
                <div className="flex flex-col gap-6">
                  {/* Logo */}
                  <div className="flex items-center gap-2">
                    <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={32} height={32} />
                    <span className="text-lg font-semibold text-foreground">Ask Nanci</span>
                  </div>

                  {/* Heading + description */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold leading-tight text-foreground">
                      The more Nanci knows,<br />the sharper it gets
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Link your financial and accounting accounts and get responses built around your data, the more Nanci knows about your business, the more precise the answers become.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={() => setWizardOpen(true)}>
                    <Link2 className="size-4" />
                    Link Accounts
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    You must link your accounts to get started.
                  </p>
                </div>
              </div>

              {/* Right panel — marquee rows, full height, muted bg */}
              <div className="flex flex-1 flex-col justify-center gap-3 overflow-hidden bg-slate-100 dark:bg-card py-5 rounded-xl border-l border-y">
                <MarqueeRow logos={ROW1} direction="left" />
                <MarqueeRow logos={ROW2} direction="right" />
                <MarqueeRow logos={ROW3} direction="left" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={handleLinked}
      />
    </>
  )
}
