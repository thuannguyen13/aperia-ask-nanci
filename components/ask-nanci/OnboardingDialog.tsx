"use client"

import Image from "next/image"
import { Link2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "aperia-ds5"
import { Dialog, DialogContent, DialogTitle } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ConnectWizard } from "./ConnectWizard"
import { FOUNDATION_SOURCE, readSources } from "@/lib/ask-nanci/source-store"
import { ONBOARDING_KEY } from "@/lib/ask-nanci/storage-keys"


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

function MarqueeRow({ logos, direction, className = "" }: { logos: typeof ROW1; direction: "left" | "right"; className?: string }) {
  return (
    <div className={`w-full ${className}`}>
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
  const { onboardingOpen, setOnboardingOpen, setSources, forceOnboarding } = useAskNanci()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [wizardOpen, setWizardOpen] = useState(false)

  useEffect(() => {
    if (onboardingOpen) setStep(1)
  }, [onboardingOpen])

  /**
   * The welcome sequence is done. ONBOARDING_KEY means "has seen the welcome", not
   * "has linked an account" — linking is optional, and the product tour that follows
   * is what points the merchant at the sidebar to do it.
   *
   * ?mode=onboarding leaves no trace: recording the run here would mark the browser
   * onboarded for every other mode too, and the point of that URL is that it can be
   * demoed again on the next load without clearing localStorage first.
   */
  function completeWelcome() {
    setOnboardingOpen(false)
    if (!forceOnboarding) localStorage.setItem(ONBOARDING_KEY, "1")
  }

  function handleLinked() {
    setSources([FOUNDATION_SOURCE, ...readSources()])
    setWizardOpen(false)
    completeWelcome()
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
            <div className="flex overflow-hidden max-sm:flex-col-reverse sm:h-[22.75rem]">
              {/* Left panel */}
              <div className="flex w-1/2 flex-col justify-between gap-6 p-6 max-sm:w-full">
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
              <div className="flex-1 overflow-hidden relative rounded-xl border-l border-y max-sm:h-36 max-sm:flex-none max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0">
                {/* `sizes` is what `fill` needs to pick a candidate: without it the optimizer assumes
                    the image spans the viewport and serves the largest one it has. */}
                <Image src="/onboarding/onboarding-thumbnail.png" alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover object-center sm:object-left-top" />
              </div>
            </div>
          ) : (
            <div className="flex overflow-hidden max-sm:flex-col-reverse sm:h-[22.75rem]">
              {/* Left panel — 360px, 24px padding all sides */}
              <div className="flex w-1/2 flex-col justify-between gap-6 p-6 max-sm:w-full">
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
                  {/* The way out of the welcome without the four-step wizard. The tour
                      starts straight after and its third step points back at Link
                      Accounts in the sidebar, so nothing is lost by deferring. */}
                  <Button variant="ghost" className="w-full" onClick={completeWelcome}>
                    Maybe later
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    You can add accounts any time from the sidebar.
                  </p>
                </div>
              </div>

              {/* Right panel — marquee rows, full height, muted bg */}
              <div className="flex flex-1 flex-col justify-center gap-3 overflow-hidden bg-slate-100 dark:bg-card py-5 rounded-xl border-l border-y max-sm:h-36 max-sm:flex-none max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0">
                <MarqueeRow logos={ROW1} direction="left" />
                <MarqueeRow logos={ROW2} direction="right" className="max-sm:hidden" />
                <MarqueeRow logos={ROW3} direction="left" className="max-sm:hidden" />
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
