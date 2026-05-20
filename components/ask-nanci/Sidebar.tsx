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
import { ConnectWizard } from "./ConnectWizard"

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
  const { sessions, activeSessionId, startNewChat, resumeSession, deleteSessionById, sources, kbOpen, setKbOpen, openSettings, mobileSidebarOpen, setMobileSidebarOpen, currentUser } = useAskNanci()
  const [collapsed, setCollapsed] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const activeCount = sources.filter((s) => s.active).length

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-2 pl-1 min-w-[256px]">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2">
          {!isMobile && collapsed ? (
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

        {/* Close button */}
        {isMobile ? (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex size-6 items-center justify-center rounded text-foreground hover:bg-muted transition-colors"
          >
            <PanelLeft className="size-4" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(true)}
            className={cn(
              "flex size-6 items-center justify-center rounded text-foreground hover:bg-muted transition-colors",
              collapsed && "pointer-events-none opacity-0",
            )}
          >
            <PanelLeft className="size-4" />
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col overflow-y-auto pb-60 min-w-12">
        <div className={cn("p-2", !isMobile && collapsed && "px-1")}>
          <SidebarItem icon={MessageCirclePlus} label="New Chat" collapsed={!isMobile && collapsed} onClick={startNewChat} />
        </div>

        {/* Recent chats — hidden when collapsed */}
        {(isMobile || !collapsed) && sessions.length > 0 && (
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
                  onClick={() => { resumeSession(session.id); if (isMobile) setMobileSidebarOpen(false) }}
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
          !isMobile && collapsed ? "w-12" : "w-64",
        )}
      >
        {/* Cards — hidden when collapsed */}
        {(isMobile || !collapsed) && (
          <div className="flex flex-col gap-2 mb-4">
            
              <div className="relative bg-card rounded-[10px] border p-4 shadow-sm overflow-hidden">
                <div className="pointer-events-none absolute top-3 -right-3">
                  <Image src="/ask-nanci/img_kb-illustration.png" alt="" width={72} height={72} className="size-20 object-contain" />
                </div>
                <div className="pr-12 flex flex-col items-start gap-1">
                  <p className="text-sm font-semibold text-foreground">Teach Nanci</p>
                  <p className="text-sm text-muted-foreground">
                    Add your financial and bookkeeping accounts to improve Nanci.
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button className="flex-1 mt-3" size="sm" onClick={() => setWizardOpen(true)}>
                  Link Accounts
                </Button>
                <Button className=" mt-3" variant="secondary" size="icon-sm" onClick={() => setKbOpen(true)}>
                  <Settings />
                </Button>
                </div>
                
                
              </div>
            
            <UsageCard />
          </div>
        )}

        {/* User row with dropdown */}
        <DropdownMenu>
          {!isMobile && collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <div className="mt-1 flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-xs">{currentUser?.initials ?? ""}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">{currentUser ? `${currentUser.name} · ${currentUser.email}` : ""}</TooltipContent>
            </Tooltip>
          ) : (
            <DropdownMenuTrigger asChild>
              <div className="mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">{currentUser?.initials ?? ""}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-none text-foreground">{currentUser?.name ?? ""}</p>
                  <p className="truncate text-xs leading-none text-muted-foreground mt-1">{currentUser?.email ?? ""}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {currentUser?.email ?? ""}
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTheme(isDark ? "light" : "dark") }} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Moon className="size-4" /> Dark Mode</span>
              <Switch checked={isDark} className="pointer-events-none" />
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
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
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <>
      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => setWizardOpen(false)}
      />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "relative hidden md:flex h-full shrink-0 flex-col bg-sidebar overflow-hidden transition-[width] duration-200 ease-in-out",
          collapsed ? "w-12" : "w-64",
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col bg-sidebar shadow-xl transition-transform duration-200 ease-in-out md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent(true)}
      </aside>
    </>
  )
}
