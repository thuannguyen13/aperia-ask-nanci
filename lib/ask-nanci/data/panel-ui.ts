// How a panel reaches a phone. Below `md` the chat and the panel column cannot sit
// side by side, so one presentation has to carry it. `param` is the ?panelui= value
// that selects it; the option with no param is what ships, so every existing demo URL
// keeps its behaviour.
//
// Add a candidate here and it appears on /responsive with a launch link.

/**
 * Everything the sheet needs to render a presentation. One object per option rather
 * than flags the component re-derives: a fifth candidate is a row here, not an edit
 * in nine branches.
 */
export interface PanelSheetConfig {
  /** The edge the card is anchored to, and the axis it is dragged along. */
  axis: "y" | "x"
  /**
   * How much of the card stays on screen at rest, in px. 0 sends it away entirely and
   * nothing brings it back until the flow opens another panel; anything else leaves a
   * grabbable lip that reopens it.
   */
  lip: number
  /**
   * Whether the card and its scrim go over the composer instead of stopping at it.
   *
   * Everything else here ends at the composer's top edge and sits under it (the sheet
   * is z-20, the composer z-30), so a reader can keep typing with a panel open. This
   * gives the panel the whole screen and takes the composer with it — the trade this
   * option exists to put a number on.
   */
  coversComposer?: boolean
}

export interface PanelUiOption {
  id: string
  name: string
  /** ?panelui= value. Empty for the presentation that ships. */
  param: string
  sheet: PanelSheetConfig
  current?: boolean
  blurb: string
  taps: string
  pros: string[]
  cons: string[]
}

export const PANEL_UI_OPTIONS: PanelUiOption[] = [
  {
    id: "a",
    name: "Bottom sheet",
    param: "away",
    sheet: { axis: "y", lip: 0 },
    blurb: "The panel rises from the bottom and ends above the chat input. Dismissing sends it away for good.",
    taps: "0 taps: it opens itself",
    pros: [
      "Chat input stays visible and usable",
      "Drag down to dismiss, thumb where it rests",
      "Nothing left on screen once dismissed",
    ],
    cons: [
      "A dismissed panel cannot be reopened",
      "Nothing on screen says a panel existed",
      "Loses the composer's height off the panel",
    ],
  },
  {
    id: "b",
    name: "Right-side drawer",
    param: "right",
    sheet: { axis: "x", lip: 0 },
    blurb: "The same card, arriving from the right edge instead, the way the panel sits beside the chat on desktop.",
    taps: "1 tap to bring back, or it opens itself",
    pros: [
      "Matches where the panel lives on desktop",
      "Drag right to dismiss, back-gesture direction",
      "Reads as a place the panel returns to",
    ],
    cons: [
      "Competes with iOS edge-swipe back",
      "Drag strip runs down the left edge, away from the thumb",
      "Nothing on screen says a panel exists",
    ],
  },
  {
    id: "c",
    name: "Swipe to open",
    param: "swipe",
    sheet: { axis: "y", lip: 40 },
    blurb: "The panel never fully leaves: it rests as a handle above the composer and is swiped up to full height, swiped down to rest.",
    taps: "0 taps, one swipe",
    pros: [
      "An open panel is always visible, nothing to go looking for",
      "Reopening costs a swipe, not two taps",
      "The handle sits where the thumb already is",
    ],
    cons: [
      "The lip eats 32px of chat whenever a panel is open",
      "Two resting states to design every panel for",
      "Swiping up competes with scrolling the conversation",
    ],
  },
  {
    id: "d",
    name: "Swipe from the edge",
    param: "edge",
    sheet: { axis: "x", lip: 40 },
    blurb: "The panel rests as a strip against the right edge and is swiped left to full width, swiped right back to the edge.",
    taps: "0 taps, one swipe",
    pros: [
      "The strip sits where a thumb already rests",
      "Reads as the desktop panel parked off-screen",
      "Never covers the conversation while resting",
    ],
    cons: [
      "Fights the iOS back gesture on the same edge",
      "A vertical strip is a smaller target than a full-width lip",
      "Nothing on the strip says which panel it is",
    ],
  },
  {
    id: "e",
    name: "Edge strip, over the composer",
    param: "over-right",
    sheet: { axis: "x", lip: 32, coversComposer: true },
    blurb: "Option D taken to the bottom of the screen: full width over the composer when open, resting as a strip against the right edge when not.",
    taps: "0 taps, one swipe",
    pros: [
      "The panel gets the whole screen, not the screen minus the composer",
      "The strip stays, so a dismissed panel is still a swipe away",
      "The dim reaches every edge, so the panel is unambiguously the layer in front",
    ],
    cons: [
      "The composer cannot be reached while the panel is open",
      "The resting strip is 32px against option D's 40, so it is a smaller target",
      "Fights the iOS back gesture on the same edge",
    ],
  },
  {
    id: "f",
    name: "Bottom sheet, over the composer",
    param: "",
    sheet: { axis: "y", lip: 32, coversComposer: true },
    current: true,
    blurb: "Option C taken to the bottom of the screen: full height over the composer when open, resting as a handle on top of it when not.",
    taps: "0 taps, one swipe",
    pros: [
      "The panel gets the whole screen, not the screen minus the composer",
      "The handle sits at the bottom edge, where the thumb already is",
      "Swiping up to open is the same gesture option C uses",
    ],
    cons: [
      "Two heights to design for, like option C, plus a covered composer",
      "The composer cannot be reached while the panel is open",
      "Swiping up competes with scrolling the conversation",
    ],
  },
]

/**
 * The presentation that ships, named rather than positional. It used to be whichever
 * option sat first in the array, which quietly tied what every demo URL renders to the
 * order of a list that exists to be reordered for comparison.
 */
export const DEFAULT_PANEL_UI: PanelUiOption =
  PANEL_UI_OPTIONS.find((o) => o.current) ?? PANEL_UI_OPTIONS[0]

export function parsePanelUiOption(value: string | null | undefined): PanelUiOption {
  return PANEL_UI_OPTIONS.find((o) => o.param && o.param === value) ?? DEFAULT_PANEL_UI
}
