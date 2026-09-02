"use client"

import { createContext, useContext } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogTrigger,
  Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose, DrawerTrigger,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useIsMobile } from "@/hooks/use-is-mobile"

/**
 * A dialog that becomes a bottom sheet on a phone.
 *
 * A centred dialog is a desktop shape: it assumes a pointer, room around it, and a reader
 * who is not holding the device one-handed. On a phone the same content wants to come up
 * from the bottom edge, near the thumb, and close with a downward drag. Nothing swaps it
 * automatically — `Dialog` stays a dialog at every width unless it is told otherwise —
 * so this is the telling.
 *
 * Drop-in for the ds5 parts: swap `Dialog` for `ResponsiveDialog` and so on down the set,
 * and the call site keeps the shape it already had.
 *
 *     <ResponsiveDialog open={open} onOpenChange={setOpen}>
 *       <ResponsiveDialogContent>
 *         <ResponsiveDialogTitle>Settings</ResponsiveDialogTitle>
 *         …
 *       </ResponsiveDialogContent>
 *     </ResponsiveDialog>
 *
 * The root decides once and every part reads that decision from context, so a resize
 * mid-render can never leave a `DrawerContent` inside a `Dialog`.
 */

const MobileContext = createContext(false)

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const Root = isMobile ? Drawer : Dialog
  return (
    <MobileContext.Provider value={isMobile}>
      <Root open={open} onOpenChange={onOpenChange}>
        {children}
      </Root>
    </MobileContext.Provider>
  )
}

export function ResponsiveDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const Trigger = useContext(MobileContext) ? DrawerTrigger : DialogTrigger
  return <Trigger {...props}>{children}</Trigger>
}

export function ResponsiveDialogContent({
  className,
  children,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useContext(MobileContext)
  if (isMobile) {
    return (
      // Drawer caps itself at 80vh, so the sheet never swallows the screen. The bottom
      // padding clears the home indicator; every other edge is already inside the frame.
      //
      // showCloseButton is swallowed rather than forwarded: it is a DialogContent prop,
      // DrawerContent has no matching one, and anything it does not recognise it spreads
      // onto the DOM node. A sheet closes by dragging down or tapping the overlay, so
      // there is nothing for the flag to mean here.
      <DrawerContent className={cn("pb-safe-b", className)} {...props}>
        {children}
      </DrawerContent>
    )
  }
  return (
    <DialogContent className={className} showCloseButton={showCloseButton} {...props}>
      {children}
    </DialogContent>
  )
}

export function ResponsiveDialogHeader(props: React.ComponentProps<typeof DialogHeader>) {
  const Header = useContext(MobileContext) ? DrawerHeader : DialogHeader
  return <Header {...props} />
}

export function ResponsiveDialogFooter(props: React.ComponentProps<typeof DialogFooter>) {
  const Footer = useContext(MobileContext) ? DrawerFooter : DialogFooter
  return <Footer {...props} />
}

export function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const Title = useContext(MobileContext) ? DrawerTitle : DialogTitle
  return <Title {...props} />
}

export function ResponsiveDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
  const Description = useContext(MobileContext) ? DrawerDescription : DialogDescription
  return <Description {...props} />
}

export function ResponsiveDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  const Close = useContext(MobileContext) ? DrawerClose : DialogClose
  return <Close {...props} />
}
