/**
 * Validates the doc discovery contract that CLAUDE.md depends on.
 *
 * Docs are retrieved on the fly, never by stored path. A doc's address is its `**Read when:**`
 * trigger: you grep for the trigger and open what matches. So a doc without a marker is
 * invisible, and a hardcoded path to a doc is a landmine — it survives the move that
 * invalidates it and nothing notices. This enforces both halves:
 *
 *   1. Every doc carries a marker.
 *   2. Nothing anywhere hardcodes a path to a markered doc. Cite it as
 *      `Read-when **<trigger phrase>**` instead, and that citation must match a real marker.
 *
 * `docs/artifacts/` is the deliberate exception: generated output and raw source material carry
 * no markers and cannot be found by trigger, so those paths stay literal and are existence-checked.
 */
import { readFileSync } from "node:fs"
import { globSync } from "node:fs"
import { existsSync } from "node:fs"

const MARKER = /^\*\*Read when:\*\* (\S.*)$/m
/** How one doc cites another: by trigger phrase, resolved by grep at read time. */
const CITATION = /Read-when \*\*([^*]+)\*\*/g
/** A path to a specific file under docs/ or .claude/, with or without surrounding backticks. */
const FILE_PATH = /(?:docs|\.claude)\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\.[A-Za-z0-9]+/g
/** A directory under docs/ or .claude/, written with a trailing slash. Bare `docs/` is prose. */
const DIR_PATH = /(?:docs|\.claude)\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\//g

/** Retrieved by trigger. A path to one of these is what goes stale. */
const docs = globSync("{docs,.claude}/**/*.md").filter((f) => !f.startsWith("docs/artifacts/"))

/** Everywhere a path or a citation can be written. */
const sources = [
  ...docs,
  "README.md",
  "CLAUDE.md",
  ...globSync("{app,components,lib,scripts}/**/*.{ts,tsx}"),
]

/** The generator must name its own output file; that path is the program, not a reference. */
const PATH_EXEMPT = new Set(["scripts/demo-urls.ts", "scripts/check-docs.ts"])

/** Markdown that opens a new block rather than continuing the line above it. */
const BLOCK_START = /^(\s*([-*+]|\d+[.)])\s|#{1,6}\s|>|\||---|\*\*\*|___|<!--|\s*(```|~~~))/

/**
 * Prose is soft-wrapped by the editor, never hard-wrapped in the file: one paragraph, list item or
 * table row per line. Hard wraps make every later edit reflow a whole block, which buries the real
 * change in a diff full of moved words.
 */
function hardWrapLines(src: string): number[] {
  const lines = src.split("\n")
  const wrapped: number[] = []
  let fence = false
  let html = false

  for (const [i, line] of lines.entries()) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence
      continue
    }
    if (fence) continue
    if (html) {
      if (line.includes("-->")) html = false
      continue
    }
    if (line.trimStart().startsWith("<!--")) {
      html = !line.includes("-->")
      continue
    }
    const prev = lines[i - 1]
    if (
      line.trim() !== "" &&
      prev !== undefined &&
      prev.trim() !== "" &&
      !BLOCK_START.test(line) &&
      !/^\s*(---|\*\*\*|___)\s*$/.test(prev)
    ) {
      wrapped.push(i + 1)
    }
  }
  return wrapped
}

const triggers = new Map<string, string>()
const missingMarker: string[] = []

for (const file of docs) {
  const m = readFileSync(file, "utf8").match(MARKER)
  if (!m) missingMarker.push(file)
  else triggers.set(file, m[1].toLowerCase())
}

const storedPaths: string[] = []
const deadRefs: string[] = []
const deadCitations: string[] = []
const hardWrapped: string[] = []

for (const file of [...docs, "README.md", "CLAUDE.md"]) {
  const at = hardWrapLines(readFileSync(file, "utf8"))
  if (at.length) hardWrapped.push(`${file} — ${at.length} line(s): ${at.slice(0, 6).join(", ")}${at.length > 6 ? ", …" : ""}`)
}

for (const file of sources) {
  const body = readFileSync(file, "utf8")

  // This file quotes the citation syntax to explain it; it cites nothing.
  if (file === "scripts/check-docs.ts") continue

  for (const [, phrase] of body.matchAll(CITATION)) {
    // Citations wrap across lines in prose; match on the collapsed phrase.
    const needle = phrase.replace(/\s+/g, " ").trim().toLowerCase()
    if (![...triggers.values()].some((t) => t.replace(/\s+/g, " ").includes(needle))) {
      deadCitations.push(`${file} → Read-when **${phrase}**`)
    }
  }

  if (PATH_EXEMPT.has(file)) continue
  for (const target of new Set([...(body.match(FILE_PATH) ?? []), ...(body.match(DIR_PATH) ?? [])])) {
    // A path into a markered doc is banned outright, even while it still resolves.
    if (docs.some((d) => d === target || d.startsWith(target))) storedPaths.push(`${file} → ${target}`)
    else if (!existsSync(target)) deadRefs.push(`${file} → ${target}`)
  }
}

// CLAUDE.md must stay path-free: paths there are what goes stale.
const claudeRefs = readFileSync("CLAUDE.md", "utf8").match(FILE_PATH) ?? []

if (
  missingMarker.length ||
  storedPaths.length ||
  deadRefs.length ||
  deadCitations.length ||
  hardWrapped.length ||
  claudeRefs.length
) {
  if (missingMarker.length) {
    console.error(`\n✗ ${missingMarker.length} doc(s) with no "**Read when:**" marker — invisible to discovery:`)
    for (const f of missingMarker) console.error(`    ${f}`)
  }
  if (storedPaths.length) {
    console.error(`\n✗ ${storedPaths.length} hardcoded path(s) to a doc — cite the "Read when" trigger instead:`)
    for (const r of storedPaths) console.error(`    ${r}`)
  }
  if (deadCitations.length) {
    console.error(`\n✗ ${deadCitations.length} citation(s) matching no "Read when" trigger:`)
    for (const r of deadCitations) console.error(`    ${r}`)
  }
  if (deadRefs.length) {
    console.error(`\n✗ ${deadRefs.length} dead reference(s) into docs/artifacts:`)
    for (const r of deadRefs) console.error(`    ${r}`)
  }
  if (hardWrapped.length) {
    console.error(`\n✗ ${hardWrapped.length} doc(s) hard-wrapped — one paragraph, list item or table row per line:`)
    for (const r of hardWrapped) console.error(`    ${r}`)
  }
  if (claudeRefs.length) {
    console.error(`\n✗ CLAUDE.md must not hardcode doc paths — found ${claudeRefs.length}:`)
    for (const r of claudeRefs) console.error(`    ${r}`)
  }
  console.error("")
  process.exit(1)
}

console.log(
  `✓ docs OK — ${docs.length} docs discoverable by trigger and soft-wrapped, ${sources.length} files carry no stored doc paths.`,
)
