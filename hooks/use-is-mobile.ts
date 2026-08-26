"use client"

import { useEffect, useState } from "react"

// Tailwind's `md` breakpoint — the width at which the chat and the panel column can
// finally sit side by side.
const MD = 768

// Viewport test for code that CSS cannot gate. `md:hidden` is the right tool almost
// everywhere, but it cannot reach a Radix/vaul portal: Sheet and Drawer mount their
// content on <body>, outside whatever wrapper carried the class, so a portal opened
// below md stays open at desktop widths. Components that portal must not render at
// all above md, which is a render-time decision, not a styling one.
export function useIsMobile() {
  // Starts false so the server and the first client paint agree, and so a desktop
  // render never briefly mounts a portal it is about to discard.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MD - 0.02}px)`)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return isMobile
}
