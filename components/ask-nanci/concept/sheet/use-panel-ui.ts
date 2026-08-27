"use client"

import { useSearchParams } from "next/navigation"
import { parsePanelUiOption, type PanelUiOption } from "@/lib/ask-nanci/data/panel-ui"

/**
 * Which mobile panel presentation this session runs, from `?panelui=`. Defaults to the
 * one that ships, so every existing demo URL keeps its behaviour and a candidate only
 * appears when a link asks for it (see /responsive).
 *
 * Read here rather than threaded through AskNanciContext: it is a URL switch for an
 * experiment, not app state, and the layout already sits inside a Suspense boundary.
 */
export function usePanelUi(): PanelUiOption {
  return parsePanelUiOption(useSearchParams().get("panelui"))
}
