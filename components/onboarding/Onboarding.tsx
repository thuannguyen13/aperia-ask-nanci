"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { InfoIcon } from "lucide-react"
import { Joyride, EVENTS, STATUS, type Step, type EventData } from "react-joyride"
import { Dialog, DialogContent, DialogTitle } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ONBOARDING_KEY } from "@/lib/ask-nanci/source-store"
import { TutorialModal } from "./TutorialModal"

/**
 * Product tour. Runs once, after the link-accounts dialog has been completed, and
 * remembers where it got to so a mid-tour reload resumes rather than restarting.
 *
 * Exported so the `/onboarding` slash command can re-arm the tour alongside the
 * dialog — otherwise a demo can only ever be seen once per browser.
 */
export const TOUR_DONE_KEY = "ask_nanci_tour_done"
export const TOUR_STEP_KEY = "ask_nanci_tour_step"

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2 flex gap-2 rounded-md bg-blue-50 p-4 text-xs text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
      <InfoIcon size={16} className="shrink-0" />
      {children}
    </div>
  )
}

function StepBody({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-lg font-medium">{heading}</p>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

/**
 * The tour, in order. Array position IS the order — the "Step N of M" title is
 * derived from the index below, so inserting or reordering a step never means
 * hand-editing eight titles that can silently fall out of sync.
 *
 * `target` names the element rather than numbering it; the matching attribute is
 * `data-tour="<target>"`, added at each call site.
 */
const TOUR_STEPS: { target: string; placement: Step["placement"]; content: React.ReactNode }[] = [
  {
    target: "sidebar-toggle",
    placement: "right",
    content: (
      <StepBody heading="Toggle Sidebar">
        Collapse or expand the sidebar to manage your workspace and access conversation history at any time.
      </StepBody>
    ),
  },
  {
    target: "new-chat",
    placement: "right",
    content: (
      <StepBody heading="Start New Conversation">
        Create a fresh chat to begin a new topic or question.
      </StepBody>
    ),
  },
  {
    target: "link-accounts",
    placement: "right",
    content: (
      <StepBody heading="Connect your accounts">
        Before anything else, link your QuickBooks and financial accounts. This is what powers Nanci&apos;s answers. Click &lsquo;Link Accounts&rsquo; in the left panel to get started. You can add more accounts any time.
        <Callout>Your data is stored securely. No passwords are ever exposed.</Callout>
      </StepBody>
    ),
  },
  {
    target: "category-tabs",
    placement: "bottom",
    content: (
      <StepBody heading="Jump to a topic">
        The category tabs — Overview, Top Items, Operations, and more — are shortcuts to common questions by area. Click any tab to start a fresh conversation. They&apos;re available both on the home screen and inside an active chat.
        <Callout>Clicking a category tab always starts a new conversation. It won&apos;t interrupt the one you&apos;re in.</Callout>
      </StepBody>
    ),
  },
  {
    target: "chat-input",
    placement: "bottom",
    content: (
      <StepBody heading="Ask in plain language">
        Type any business question into the chat bar and hit send. Nanci understands plain language, no special phrasing required. Suggested follow-up bubbles will appear after each answer to help you keep digging.
      </StepBody>
    ),
  },
  {
    target: "active-sources",
    placement: "bottom",
    content: (
      <StepBody heading="Active sources">
        See which data sources Nanci is currently drawing from, or connect new ones.
      </StepBody>
    ),
  },
  {
    target: "common-questions",
    placement: "bottom",
    content: (
      <StepBody heading="Explore common questions">
        Browse suggested questions to quickly surface merchant insights — or ask Nanci anything in your own words.
      </StepBody>
    ),
  },
  {
    target: "recent-chats",
    placement: "bottom",
    content: (
      <StepBody heading="Chat history">
        Revisit past conversations with Nanci to reference previous insights or continue where you left off.
      </StepBody>
    ),
  },
]

const steps: Step[] = TOUR_STEPS.map((step, i) => ({
  target: `[data-tour="${step.target}"]`,
  title: `Step ${i + 1} of ${TOUR_STEPS.length}`,
  content: step.content,
  placement: step.placement,
}))

export function Onboarding() {
  const { onboardingOpen, forceOnboarding, setTourActive, tourRequest } = useAskNanci()
  const [run, setRun] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [initialStep, setInitialStep] = useState(0)

  // `/tour` replays it on demand, from the top, ignoring the done flag. Skips the
  // intro modal: asking for the tour by name is already the answer to "do you want
  // the tour?", so showing that question back would be a step in the way.
  const firstRequest = useRef(tourRequest)
  useEffect(() => {
    if (tourRequest === firstRequest.current) return // initial mount, not a request
    setShowIntro(false)
    setInitialStep(0)
    setRun(false)
    // Remount Joyride on the next tick so a replay restarts at step 1 rather than
    // resuming wherever the previous run left its internal cursor.
    const id = setTimeout(() => setRun(true), 0)
    return () => clearTimeout(id)
  }, [tourRequest])

  // Defer until the link-accounts dialog has closed and set ONBOARDING_KEY.
  // Re-runs when onboardingOpen transitions false so the tour gate opens the
  // moment the wizard finishes — not on initial mount alongside the dialog.
  useEffect(() => {
    if (run || showIntro) return
    if (onboardingOpen) return
    if (tourRequest !== firstRequest.current) return // a /tour replay owns the state
    try {
      // `?mode=onboarding` replays the whole first run, so it ignores both the
      // accounts-linked gate and the done flag — the mode never writes either.
      if (!forceOnboarding && localStorage.getItem(ONBOARDING_KEY) !== "1") return
      if (!forceOnboarding && localStorage.getItem(TOUR_DONE_KEY) === "1") return
      const saved = Number(localStorage.getItem(TOUR_STEP_KEY))
      if (!forceOnboarding && Number.isInteger(saved) && saved > 0) {
        setInitialStep(saved) // mid-tour reload: resume the steps, skip the intro
        setRun(true)
      } else {
        setShowIntro(true) // first run: gate the tour behind the intro modal
      }
    } catch {
      setShowIntro(true) // private browsing/quota: still show, just don't persist
    }
  }, [onboardingOpen, run, showIntro, forceOnboarding, tourRequest])

  // The sidebar is a hover rail that collapses to icons, and three of the steps point
  // at things only the expanded rail renders — the Link Accounts card is not in the DOM
  // at all when collapsed. Holding it open for the run is what gives those steps a
  // target to spotlight.
  useEffect(() => {
    setTourActive(run)
    return () => setTourActive(false)
  }, [run, setTourActive])

  const finish = useCallback(() => {
    setRun(false)
    try {
      // A replay demo leaves no trace, exactly as ?mode=onboarding treats the dialog.
      if (!forceOnboarding) localStorage.setItem(TOUR_DONE_KEY, "1")
      localStorage.removeItem(TOUR_STEP_KEY)
    } catch {
      /* ignore persistence failures */
    }
  }, [forceOnboarding])

  const handleEvent = useCallback((data: EventData) => {
    try {
      if (data.type === EVENTS.STEP_BEFORE) {
        if (!forceOnboarding) localStorage.setItem(TOUR_STEP_KEY, String(data.index))
      }
      if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) finish()
    } catch {
      /* ignore persistence failures */
    }
  }, [forceOnboarding, finish])

  const startTour = useCallback(() => {
    setShowIntro(false)
    setRun(true)
  }, [])

  const skipIntro = useCallback(() => {
    setShowIntro(false)
    finish()
  }, [finish])

  if (showIntro) {
    return (
      <Dialog open onOpenChange={(open) => { if (!open) skipIntro() }}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          className="overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-[760px]"
        >
          <DialogTitle className="sr-only">Meet your new assistant</DialogTitle>
          <TutorialModal onSkipClick={skipIntro} onStartTourClick={startTour} />
        </DialogContent>
      </Dialog>
    )
  }

  if (!run) return null // nothing until the client confirms it's a first run

  return (
    <Joyride
      run
      continuous
      initialStepIndex={initialStep}
      onEvent={handleEvent}
      locale={{ last: "Done" }}
      options={{
        buttons: ["skip", "primary", "back"],
        skipBeacon: true,
        overlayClickAction: false,
      }}
      steps={steps}
      floatingOptions={{ hideArrow: true }}
      styles={{
        tooltipContainer: { textAlign: "left" },
        tooltipTitle: {
          color: "var(--primary)",
          fontWeight: "var(--font-weight-medium)",
          fontSize: "var(--font-size-sm)",
        },
        buttonPrimary: {
          backgroundColor: "var(--primary)",
          borderRadius: "var(--radius-md)",
        },
        buttonBack: {
          backgroundColor: "var(--color-secondary)",
          borderRadius: "var(--radius-md)",
        },
        buttonSkip: { fontWeight: "var(--font-weight-medium)" },
      }}
    />
  )
}
