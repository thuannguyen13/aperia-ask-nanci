"use client"

import { useEffect, useRef, useState } from "react"
import { Blocks, MessageCirclePlus, PanelLeft, Pin, PinOff, Settings, Moon } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  Avatar, AvatarFallback, Button, Switch, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuItem,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MARKETPLACE_TITLE } from "@/lib/ask-nanci/data/panels/service-marketplace"
import type { ThemeLogos } from "@/lib/ask-nanci/data/theme-logos"
import { ConnectWizard } from "./ConnectWizard"

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

// When `menu` is provided the rail renders a fixed nav list (e.g. the Aperia Risk
// theme) instead of New Chat + Marketplace, and hides the Teach Nanci / Usage cards.
// `logos` supplies the theme's rail branding (see data/theme-logos.ts); its `sidebar` and
// `sidebarCollapsed` slots are optional and fall back to the Ask Nanci wordmark and
// logomark. Both props optional — default behavior is unchanged. Dark-mode treatment
// of these logos is CSS, keyed off the `data-logo` attributes (globals.css).
type SidebarNavItem = { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }

// Opening is near-instant so the rail feels responsive; closing lags so a cursor that
// clips the rail on its way elsewhere doesn't reflow the content.
const HOVER_OPEN_MS = 100
const HOVER_CLOSE_MS = 250

// `hoverNav` is the Ask Nanci default: rail + hover peek + pin. Aperia Risk opts out
// (`hoverNav={false}`) — its rail is a fixed destination menu for a different product,
// so it keeps the plain collapse toggle.
export function Sidebar({ menu, search, logos, hoverNav = true, initialPinned = false }: { menu?: SidebarNavItem[]; search?: (collapsed: boolean) => React.ReactNode; logos?: ThemeLogos; hoverNav?: boolean; initialPinned?: boolean } = {}) {
  const { startNewChat, setKbOpen, marketplaceOpen, setMarketplaceOpen, mobileSidebarOpen, setMobileSidebarOpen, currentUser, tourActive } = useAskNanci()
  const [collapsed, setCollapsed] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // ── Hover-rail nav (?mode=concept-nav) ──────────────────────────────────────
  // The sidebar is a rail that expands on hover, and the pin is the only thing that
  // holds it open. It starts off, and nothing but the user ever changes it — no
  // welcome-screen exception, no releasing it when a question is asked. Whether the
  // nav is open is a standing preference, not something the app keeps deciding.
  //
  // ponytail: session state, deliberately not persisted. A pin clicked while rehearsing
  // would otherwise decide how the next demo opens.
  // `initialPinned` seeds it open — an autoplaying full-app embed has no one to hover
  // the rail, and its story starts in the sidebar. Still just the starting value: the
  // pin button unpins it like any other session.
  const [pinned, setPinned] = useState(initialPinned)
  const [hovering, setHovering] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }, [])

  const hover = (next: boolean) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHovering(next), next ? HOVER_OPEN_MS : HOVER_CLOSE_MS)
  }

  // The one value the rest of the component reads. Without hoverNav this is the manual
  // collapse toggle exactly as before.
  // The product tour holds the rail open: three of its steps point at things only the
  // expanded sidebar renders, and the Link Accounts card is not in the DOM when collapsed.
  const isCollapsed = tourActive ? false : hoverNav ? !pinned && !hovering : collapsed

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-2 pl-1 min-w-[256px]">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2">
          {!isMobile && isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => (hoverNav ? setPinned(true) : setCollapsed(false))}
                  className="group relative flex size-6 items-center justify-center"
                >
                  <Image
                    data-logo={logos?.sidebarCollapsed ? "sidebar-collapsed" : undefined}
                    src={logos?.sidebarCollapsed?.src ?? "/ask-nanci/ask-nanci-logomark.svg"}
                    alt={logos?.sidebarCollapsed?.alt ?? "Ask Nanci"}
                    width={logos?.sidebarCollapsed?.width ?? 24}
                    height={logos?.sidebarCollapsed?.height ?? 24}
                    className="h-6 w-auto transition-opacity duration-150 group-hover:opacity-0"
                  />
                  <PanelLeft className="absolute size-4 rotate-180 text-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{hoverNav ? "Pin sidebar open" : "Expand sidebar"}</TooltipContent>
            </Tooltip>
          ) : logos?.sidebar ? (
            <Image
              data-logo="sidebar"
              src={logos.sidebar.src}
              alt={logos.sidebar.alt}
              width={logos.sidebar.width}
              height={logos.sidebar.height}
              className="h-8 w-auto"
            />
          ) : (
            <>
              <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="Ask Nanci" width={24} height={24} />
              <span className="text-[15px] font-semibold tracking-tight text-foreground whitespace-nowrap">
                Ask Nanci
              </span>
            </>
          )}
        </div>

        {/* Close button — the pin in hover-rail nav, the collapse toggle otherwise */}
        {isMobile ? (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex size-6 items-center justify-center rounded text-foreground hover:bg-muted transition-colors"
          >
            <PanelLeft className="size-4" />
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                data-tour="sidebar-toggle"
                onClick={() => (hoverNav ? setPinned(!pinned) : setCollapsed(true))}
                className={cn(
                  "flex size-6 items-center justify-center rounded text-foreground hover:bg-muted transition-colors",
                  isCollapsed && "pointer-events-none opacity-0",
                  hoverNav && pinned && "text-primary",
                )}
              >
                {hoverNav ? (
                  pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />
                ) : (
                  <PanelLeft className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {hoverNav ? (pinned ? "Unpin sidebar" : "Pin sidebar open") : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* An optional field above the destinations — the Aperia Risk console puts its
          search here. Given the collapsed state rather than reading it, because only
          the caller knows what its control should shrink to. */}
      {search && (
        <div className={cn("shrink-0 min-w-12 px-2 pb-1", !isMobile && isCollapsed && "px-1")}>
          {search(!isMobile && isCollapsed)}
        </div>
      )}

      {/* Nav list (menu mode) or New Chat — stays onscreen above the scroll area */}
      <div className={cn("shrink-0 min-w-12 p-2 pt-1", !isMobile && isCollapsed && "px-1")}>
        {menu ? (
          menu.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              collapsed={!isMobile && isCollapsed}
              // The drawer is an overlay, so a destination chosen inside it has to
              // dismiss it or the screen it navigated to stays covered. Marketplace
              // below does the same on its own click.
              onClick={() => { item.onClick?.(); if (isMobile) setMobileSidebarOpen(false) }}
              className={item.active ? "bg-muted font-medium" : undefined}
            />
          ))
        ) : (
          <>
            {/* Wrapped so the tour has an element to spotlight — SidebarItem takes no
                arbitrary props, and only New Chat is the target. */}
            <div data-tour="new-chat">
              <SidebarItem
                icon={MessageCirclePlus}
                label="New Chat"
                collapsed={!isMobile && isCollapsed}
                onClick={() => { setMarketplaceOpen(false); startNewChat() }}
              />
            </div>
            {/* Marketplace (Flow 22) — a nav destination that takes over the content area */}
            <SidebarItem
              icon={Blocks}
              label={MARKETPLACE_TITLE}
              collapsed={!isMobile && isCollapsed}
              onClick={() => { setMarketplaceOpen(!marketplaceOpen); if (isMobile) setMobileSidebarOpen(false) }}
              className={marketplaceOpen ? "bg-muted font-medium" : undefined}
            />
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto min-h-0 pb-2 min-w-12" />

      {/* Footer — in-flow, sits below the scroll area (no overlap, no reserved padding) */}
      <div className="shrink-0 bg-sidebar p-2 pb-3 min-w-[256px]">
        {/* Cards — hidden when collapsed or in menu mode */}
        {!menu && (isMobile || !isCollapsed) && (
          <div className="flex flex-col gap-2 mb-4">
            
              <div className="relative bg-card rounded-[10px] border p-4 shadow-sm overflow-hidden">
                <div className="pointer-events-none absolute top-3 -right-3">
                  <Image src="/ask-nanci/img_kb-illustration.png" alt="" width={72} height={72} className="size-20 object-contain" />
                </div>
                <div className="pr-12 flex flex-col items-start gap-1">
                  <p className="text-sm font-semibold text-foreground">Personalize Nanci</p>
                  <p className="text-sm text-muted-foreground">
                    Add your financial and bookkeeping accounts to improve Nanci.
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button data-tour="link-accounts" className="flex-1 mt-3" size="sm" onClick={() => setWizardOpen(true)}>
                  Link Accounts
                </Button>
                <Button className=" mt-3" variant="secondary" size="icon-sm" onClick={() => setKbOpen(true)}>
                  <Settings />
                </Button>
                </div>


              </div>
          </div>
        )}

        {/* User row with dropdown */}
        <DropdownMenu>
          {!isMobile && isCollapsed ? (
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <ConnectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLinked={() => setWizardOpen(false)}
      />

      {/* Desktop sidebar */}
      <aside
        onMouseEnter={hoverNav ? () => hover(true) : undefined}
        onMouseLeave={hoverNav ? () => hover(false) : undefined}
        className={cn(
          "relative hidden md:flex h-full shrink-0 flex-col bg-sidebar overflow-hidden transition-[width] duration-200 ease-in-out",
          isCollapsed ? "w-12" : "w-64",
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
    </TooltipProvider>
  )
}
