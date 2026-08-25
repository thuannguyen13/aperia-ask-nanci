/**
 * Resolves any CSS color expression — var() chains, oklch(), the oklab() results of
 * color-mix() — to a concrete #rrggbb by letting the browser compute it in live theme
 * context, then reading actual channel bytes off a 1px canvas. Computed colors keep
 * their authored syntax, so regex-reading rgb() numbers out of them silently produces
 * garbage (oklch(0.646 0.222 41.116) once became #010029).
 *
 * `scope` decides which CSS vars are visible: pass an element inside the themed DOM.
 * Call dispose() when done — the resolver keeps a probe element in the scope.
 */
export function createColorResolver(scope: HTMLElement) {
  const probe = document.createElement("span")
  scope.appendChild(probe)
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const toHex = (color: string): string => {
    if (!ctx) return "#888888"
    probe.style.color = ""
    probe.style.color = color
    ctx.fillStyle = "#888888"
    ctx.fillStyle = getComputedStyle(probe).color
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  }
  return { probe, toHex, dispose: () => probe.remove() }
}
