/**
 * Validates the doc discovery contract that CLAUDE.md depends on.
 *
 * CLAUDE.md holds no paths. It tells you to run a grep for `**Read when:**` and open what
 * matches, so a doc without that marker is invisible, and a cross-reference to a moved file
 * is a dead end. Both are silent failures, which is what this catches.
 */
import { readFileSync } from "node:fs"
import { globSync } from "node:fs"
import { existsSync } from "node:fs"

const MARKER = /^\*\*Read when:\*\* \S/m
const REF = /`((?:docs|\.claude)\/[A-Za-z0-9_/.-]+\.(?:md|mhtml))`/g

const files = globSync("{docs,.claude}/**/*.md").filter(
  (f) => !f.startsWith("docs/artifacts/demo-context/"),
)

const missingMarker: string[] = []
const deadRefs: string[] = []

for (const file of files) {
  const body = readFileSync(file, "utf8")
  if (!MARKER.test(body)) missingMarker.push(file)
  for (const [, target] of body.matchAll(REF)) {
    if (!existsSync(target)) deadRefs.push(`${file} → ${target}`)
  }
}

// CLAUDE.md must stay path-free: paths there are what goes stale.
const claudeRefs = [...readFileSync("CLAUDE.md", "utf8").matchAll(REF)].map((m) => m[1])

if (missingMarker.length || deadRefs.length || claudeRefs.length) {
  if (missingMarker.length) {
    console.error(`\n✗ ${missingMarker.length} doc(s) with no "**Read when:**" marker — invisible to discovery:`)
    for (const f of missingMarker) console.error(`    ${f}`)
  }
  if (deadRefs.length) {
    console.error(`\n✗ ${deadRefs.length} dead cross-reference(s):`)
    for (const r of deadRefs) console.error(`    ${r}`)
  }
  if (claudeRefs.length) {
    console.error(`\n✗ CLAUDE.md must not hardcode doc paths — found ${claudeRefs.length}:`)
    for (const r of claudeRefs) console.error(`    ${r}`)
  }
  console.error("")
  process.exit(1)
}

console.log(`✓ docs OK — ${files.length} files, all discoverable, no dead refs, CLAUDE.md path-free.`)
