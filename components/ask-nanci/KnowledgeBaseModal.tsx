"use client"

import { useState, useRef } from "react"
import { X, Plus, FileText, Building2, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { addFileSource, addBankSource, removeSource, toggleSource, readSources } from "@/lib/ask-nanci/source-store"
import type { Source } from "@/lib/ask-nanci/types"

interface Props {
  open: boolean
  onClose: () => void
}

type AddMode = null | "file" | "bank"

function SourceRow({ source, onToggle, onRemove }: { source: Source; onToggle: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-white p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f4ff]">
        {source.kind === "file"
          ? <FileText className="size-4 text-[#002f67]" />
          : <Building2 className="size-4 text-[#002f67]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#0a0a0a]">{source.name}</p>
        <p className="text-xs text-[#737373] capitalize">{source.kind}</p>
      </div>
      <button onClick={onToggle} className="text-[#737373] hover:text-[#002f67] transition-colors">
        {source.active
          ? <ToggleRight className="size-5 text-[#002f67]" />
          : <ToggleLeft className="size-5" />}
      </button>
      <button onClick={onRemove} className="text-[#737373] hover:text-red-500 transition-colors">
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export function KnowledgeBaseModal({ open, onClose }: Props) {
  const { sources, setSources } = useAskNanci()
  const [addMode, setAddMode] = useState<AddMode>(null)
  const [nameInput, setNameInput] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  function handleAddBank() {
    if (!nameInput.trim()) return
    addBankSource(nameInput.trim())
    setSources(readSources())
    setNameInput("")
    setAddMode(null)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    addFileSource(file.name, file.type || "application/octet-stream")
    setSources(readSources())
    e.target.value = ""
    setAddMode(null)
  }

  function handleToggle(id: string) {
    toggleSource(id)
    setSources(readSources())
  }

  function handleRemove(id: string) {
    removeSource(id)
    setSources(readSources())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-lg flex-col gap-0 overflow-hidden rounded-2xl bg-[#fafafa] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] bg-white px-5 py-4">
          <div>
            <p className="text-base font-semibold text-[#0a0a0a]">Nanci Knowledge Base</p>
            <p className="text-xs text-[#737373]">Connect files and data sources for richer answers</p>
          </div>
          <button onClick={onClose} className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto p-5" style={{ maxHeight: "60vh" }}>
          {sources.length === 0 && (
            <p className="py-6 text-center text-sm text-[#737373]">No sources added yet.</p>
          )}
          {sources.map((s) => (
            <SourceRow
              key={s.id}
              source={s}
              onToggle={() => handleToggle(s.id)}
              onRemove={() => handleRemove(s.id)}
            />
          ))}
        </div>

        {/* Add source */}
        <div className="border-t border-[#e5e5e5] bg-white px-5 py-4">
          {addMode === null && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setAddMode("file"); setTimeout(() => fileRef.current?.click(), 50) }}>
                <Plus className="size-4" /> Upload File
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setAddMode("bank")}>
                <Plus className="size-4" /> Add Bank
              </Button>
            </div>
          )}

          {addMode === "bank" && (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Bank / data source name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBank()}
                className="flex-1 rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-sm outline-none focus:border-[#002f67]"
              />
              <Button size="sm" onClick={handleAddBank} className="bg-[#002f67] text-white hover:bg-[#001e44]">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAddMode(null); setNameInput("") }}>Cancel</Button>
            </div>
          )}

          <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  )
}
