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
   * How much of the card stays on screen at rest, in px. 0 sends it away entirely, so
   * the brand-bar toggle is the only way back; anything else leaves a grabbable lip.
   */
  lip: number
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
    param: "",
    sheet: { axis: "y", lip: 0 },
    current: true,
    blurb: "The panel rises from the bottom and ends above the chat input. Dismissing sends it away; the bar toggle brings it back.",
    taps: "1 tap to bring back, or it opens itself",
    pros: [
      "Chat input stays visible and usable",
      "Drag down to dismiss, thumb where it rests",
      "Nothing left on screen once dismissed",
    ],
    cons: [
      "Only the badge says a panel exists",
      "Reopening costs a trip to the top bar",
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
      "An open panel is always visible, no badge to notice",
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
]

export function parsePanelUiOption(value: string | null | undefined): PanelUiOption {
  return PANEL_UI_OPTIONS.find((o) => o.param && o.param === value) ?? PANEL_UI_OPTIONS[0]
}
