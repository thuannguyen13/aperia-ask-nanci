"use client"

import Image from "next/image"
import { Button } from "aperia-ds5"

// The intro card the product tour opens behind — "take the tour, or explore on your
// own". Every string is a prop so a brand can override the copy without a second
// component; the defaults are what ships.
type TutorialModalProps = {
  title?: string
  description?: string
  skipLabel?: string
  startTourLabel?: string
  imageSrc?: string
  imageAlt?: string
  onSkipClick?: () => void
  onStartTourClick?: () => void
  className?: string
}

export const TutorialModal = ({
  title = "Meet your new assistant!",
  description = "Take a guided tour to get familiar with the key features. Or skip ahead and explore on your own.",
  skipLabel = "Skip",
  startTourLabel = "Start Tour",
  // Same art as the link-accounts dialog, so the two first-run surfaces match.
  imageSrc = "/onboarding/onboarding-thumbnail.png",
  imageAlt = "",
  onSkipClick,
  onStartTourClick,
  className,
}: TutorialModalProps) => {
  return (
    <div
      // Side by side on a desktop, stacked on a phone with the art on top — the same
      // shape (and the same `flex-col-reverse`) OnboardingDialog's first step uses, so
      // the two first-run cards behave alike. The fixed height goes with the row: a
      // stacked card is as tall as its own content.
      className={`flex w-full overflow-hidden rounded-2xl border bg-popover shadow-lg max-sm:flex-col-reverse sm:h-[22.75rem] ${className ?? ""}`}
    >
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 max-sm:w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={32} height={32} />
            <span className="font-['Questrial',sans-serif] text-2xl text-foreground">Ask Nanci</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold leading-8 text-foreground">{title}</h2>
            <p className="text-sm leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Button variant="secondary" type="button" className="flex-1" onClick={onSkipClick}>
            {skipLabel}
          </Button>
          <Button variant="default" type="button" className="flex-1" onClick={onStartTourClick}>
            {startTourLabel}
          </Button>
        </div>
      </div>
      <div className="relative h-full max-w-[300px] flex-1 max-sm:h-36 max-sm:max-w-full max-sm:flex-none">
        <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover" />
      </div>
    </div>
  )
}
