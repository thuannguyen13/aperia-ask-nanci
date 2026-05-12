"use client"

import { useState } from "react"
import { MessageCirclePlus, PieChart, LifeBuoy, Send, PanelLeft, Settings, ArrowUpRight, CircleHelp, LogOut, Moon } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  Avatar, AvatarFallback, Button, Switch, Tooltip, TooltipTrigger, TooltipContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { UsageCard } from "./UsageCard"

const footerNav = [
  { icon: LifeBuoy, label: "Support" },
  { icon: Send, label: "Feedback" },
]

function SidebarItem({
  icon: Icon,
  label,
  collapsed,
  className,
  onClick,
}: {
  icon: React.ElementType
  label: string
  collapsed: boolean
  className?: string
  onClick?: () => void
}) {
  const button = (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-foreground hover:bg-muted transition-colors",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )

  if (!collapsed) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function Sidebar() {
  const { sessions, activeSessionId, startNewChat, resumeSession, deleteSessionById, sources, kbOpen, setKbOpen, openSettings } = useAskNanci()
  const [collapsed, setCollapsed] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const activeCount = sources.filter((s) => s.active).length

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col bg-sidebar overflow-hidden transition-[width] duration-200 ease-in-out",
        collapsed ? "w-12" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 min-w-[256px]">
        {/* Logo / expand trigger */}
        <div className="flex h-9 shrink-0 items-center gap-2 px-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="group relative flex size-6 items-center justify-center"
                >
                  <Image
                    src="/ask-nanci/ask-nanci-logomark.svg"
                    alt="Ask Nanci"
                    width={24}
                    height={24}
                    className="transition-opacity duration-150 group-hover:opacity-0"
                  />
                  <PanelLeft className="absolute size-4 rotate-180 text-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="Ask Nanci" width={24} height={24} />
              <span className="text-[15px] font-semibold tracking-tight text-foreground whitespace-nowrap">
                Ask Nanci
              </span>
            </>
          )}
        </div>

        {/* Collapse button — only shown when expanded */}
        <button
          onClick={() => setCollapsed(true)}
          className={cn(
            "flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col overflow-y-auto pb-60 min-w-12">
        <div className={cn("p-2", collapsed && "px-1")}>
          <SidebarItem icon={MessageCirclePlus} label="New Chat" collapsed={collapsed} onClick={startNewChat} />
          <SidebarItem icon={PieChart} label="Insights" collapsed={collapsed} />
        </div>

        {/* Recent chats — hidden when collapsed */}
        {!collapsed && sessions.length > 0 && (
          <div className="p-2">
            <p className="mb-1 flex h-8 items-center px-2 text-xs font-medium text-foreground opacity-70">
              Recent Chat
            </p>
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex h-8 w-full items-center rounded-md px-2 text-left hover:bg-muted transition-colors",
                  session.id === activeSessionId && "bg-muted",
                )}
              >
                <button
                  className="min-w-0 flex-1 truncate text-sm text-foreground text-left"
                  onClick={() => resumeSession(session.id)}
                >
                  {session.title}
                </button>
                <button
                  className="ml-1 hidden shrink-0 text-muted-foreground hover:text-red-500 group-hover:block transition-colors"
                  onClick={(e) => { e.stopPropagation(); deleteSessionById(session.id) }}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — pinned to bottom */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-2 pb-3 transition-[width,opacity] duration-200",
          collapsed ? "w-12" : "w-64",
        )}
      >
        {/* Cards — hidden when collapsed */}
        {!collapsed && (
          <div className="flex flex-col gap-2 mb-1">
            {/* Usage card */}
            <UsageCard />

            {/* KB card */}
            <div className="relative overflow-hidden rounded-[10px] border p-4 shadow-sm">
              <div className="pointer-events-none absolute right-2 top-0 flex h-20 w-20 items-center justify-center">
                <div style={{ transform: "rotate(-12.88deg)" }}>
                  <svg viewBox="0 0 30 37.5" className="h-16 w-12 opacity-60" fill="none">
                    <path d="M2 0h18l10 10v25.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
                    <path d="M20 0l10 10H22a2 2 0 0 1-2-2V0Z" fill="#93c5fd" />
                    <rect x="5" y="14" width="16" height="2" rx="1" fill="#3b82f6" opacity=".5" />
                    <rect x="5" y="19" width="10" height="2" rx="1" fill="#3b82f6" opacity=".5" />
                  </svg>
                </div>
              </div>
              <div className="mb-3 pr-12">
                <p className="text-sm font-semibold leading-5 text-foreground">Knowledge Base</p>
                <p className="text-xs font-medium leading-4 text-muted-foreground">
                  Add your own data and documents to improve your Nanci.
                </p>
              </div>
              <Button className="w-full" size="sm" onClick={() => setKbOpen(!kbOpen)}>
                {kbOpen ? "Close Knowledge Base" : "Teach Nanci"}
              </Button>
            </div>
          </div>
        )}

        <div className={cn(collapsed && "px-1")}>
          {footerNav.map(({ icon, label }) => (
            <SidebarItem key={label} icon={icon} label={label} collapsed={collapsed} />
          ))}
        </div>

        {/* User row with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-1 flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-xs">TR</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Teresa R. · teresa@example.com</TooltipContent>
              </Tooltip>
            ) : (
              <div className="mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">TR</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-none text-foreground">Teresa R.</p>
                  <p className="truncate text-xs leading-none text-muted-foreground mt-1">teresa@example.com</p>
                </div>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              teresawalker@titan.com
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTheme(isDark ? "light" : "dark") }} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Moon className="size-4" /> Dark Mode</span>
              <Switch checked={isDark} className="pointer-events-none" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => openSettings("account")}>
              <Settings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openSettings("usage")}>
              <ArrowUpRight className="size-4" /> Upgrade Plan
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleHelp className="size-4" /> Get Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="size-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
