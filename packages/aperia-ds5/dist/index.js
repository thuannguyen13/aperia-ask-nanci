"use client";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-3GWWZKX7.js";

// components/ui/alert/alert.tsx
import { cva } from "class-variance-authority";

// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// components/ui/alert/alert.tsx
import { jsx } from "react/jsx-runtime";
var alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert(_a) {
  var _b = _a, {
    className,
    variant
  } = _b, props = __objRest(_b, [
    "className",
    "variant"
  ]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className)
    }, props)
  );
}
function AlertTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "alert-title",
      className: cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )
    }, props)
  );
}
function AlertDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "alert-description",
      className: cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )
    }, props)
  );
}
function AlertAction(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "alert-action",
      className: cn("absolute top-2 right-2", className)
    }, props)
  );
}

// components/ui/accordion/accordion.tsx
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function Accordion(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx2(
    AccordionPrimitive.Root,
    __spreadValues({
      "data-slot": "accordion",
      className: cn("flex w-full flex-col", className)
    }, props)
  );
}
function AccordionItem(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx2(
    AccordionPrimitive.Item,
    __spreadValues({
      "data-slot": "accordion-item",
      className: cn("not-last:border-b", className)
    }, props)
  );
}
function AccordionTrigger(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsx2(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
    AccordionPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "accordion-trigger",
      className: cn(
        "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx2(ChevronDownIcon, { "data-slot": "accordion-trigger-icon", className: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" }),
        /* @__PURE__ */ jsx2(ChevronUpIcon, { "data-slot": "accordion-trigger-icon", className: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" })
      ]
    })
  ) });
}
function AccordionContent(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsx2(
    AccordionPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "accordion-content",
      className: "overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
    }, props), {
      children: /* @__PURE__ */ jsx2(
        "div",
        {
          className: cn(
            "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
            className
          ),
          children
        }
      )
    })
  );
}

// components/ui/alert-dialog/alert-dialog.tsx
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

// components/ui/button/button.tsx
import { cva as cva2 } from "class-variance-authority";
import { Slot } from "radix-ui";
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — solid primary bg, near-white text; opacity fade on hover
        default: "bg-primary text-primary-foreground shadow-xs hover:opacity-90",
        // Outline — bordered, background fill; accent bg on hover
        outline: "border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // Secondary — muted bg, subtle hover via opacity
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:opacity-80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // Ghost — no bg/border at rest; accent bg on hover
        ghost: "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-muted/50",
        // Destructive — solid destructive bg (not tinted), white text, opacity fade on hover
        destructive: "bg-destructive text-white shadow-xs hover:opacity-90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/80 dark:hover:opacity-100 dark:hover:bg-destructive dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        // Default — 36px tall, 16px horizontal padding (Figma: Size-default)
        default: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        // Small — 32px tall, 12px horizontal padding (Figma: Size-small)
        sm: "h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        // Large — 40px tall, 24px horizontal padding (Figma: Size=Large)
        lg: "h-10 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        // Extra Large — 48px tall, 32px horizontal padding (Figma: Size=Extra Large)
        xl: "h-12 gap-2 px-8 text-base has-data-[icon=inline-end]:pr-7 has-data-[icon=inline-start]:pl-7",
        // Icon sizes — square, same heights as text sizes
        icon: "size-9",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
        // Rounded — pill-shaped icon button (Figma: Rounded variant)
        "icon-rounded": "size-9 rounded-full"
      },
      // Shape — Default uses rounded-lg from base; Round overrides to pill
      shape: {
        default: "",
        round: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default"
    }
  }
);
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    shape,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "shape",
    "asChild"
  ]);
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx3(
    Comp,
    __spreadValues({
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, shape, className }))
    }, props)
  );
}

// components/ui/alert-dialog/alert-dialog.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function AlertDialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx4(AlertDialogPrimitive.Root, __spreadValues({ "data-slot": "alert-dialog" }, props));
}
function AlertDialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx4(AlertDialogPrimitive.Trigger, __spreadValues({ "data-slot": "alert-dialog-trigger" }, props));
}
function AlertDialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx4(AlertDialogPrimitive.Portal, __spreadValues({ "data-slot": "alert-dialog-portal" }, props));
}
function AlertDialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    AlertDialogPrimitive.Overlay,
    __spreadValues({
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )
    }, props)
  );
}
function AlertDialogContent(_a) {
  var _b = _a, {
    className,
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "size"
  ]);
  return /* @__PURE__ */ jsxs2(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx4(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx4(
      AlertDialogPrimitive.Content,
      __spreadValues({
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )
      }, props)
    )
  ] });
}
function AlertDialogHeader(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    "div",
    __spreadValues({
      "data-slot": "alert-dialog-header",
      className: cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )
    }, props)
  );
}
function AlertDialogFooter(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    "div",
    __spreadValues({
      "data-slot": "alert-dialog-footer",
      className: cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )
    }, props)
  );
}
function AlertDialogMedia(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    "div",
    __spreadValues({
      "data-slot": "alert-dialog-media",
      className: cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )
    }, props)
  );
}
function AlertDialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    AlertDialogPrimitive.Title,
    __spreadValues({
      "data-slot": "alert-dialog-title",
      className: cn(
        "text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )
    }, props)
  );
}
function AlertDialogDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx4(
    AlertDialogPrimitive.Description,
    __spreadValues({
      "data-slot": "alert-dialog-description",
      className: cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )
    }, props)
  );
}
function AlertDialogAction(_a) {
  var _b = _a, {
    className,
    variant = "default",
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ jsx4(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx4(
    AlertDialogPrimitive.Action,
    __spreadValues({
      "data-slot": "alert-dialog-action",
      className: cn(className)
    }, props)
  ) });
}
function AlertDialogCancel(_a) {
  var _b = _a, {
    className,
    variant = "outline",
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ jsx4(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx4(
    AlertDialogPrimitive.Cancel,
    __spreadValues({
      "data-slot": "alert-dialog-cancel",
      className: cn(className)
    }, props)
  ) });
}

// components/ui/aspect-ratio/aspect-ratio.tsx
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import { jsx as jsx5 } from "react/jsx-runtime";
function AspectRatio(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx5(AspectRatioPrimitive.Root, __spreadValues({ "data-slot": "aspect-ratio" }, props));
}

// components/ui/avatar/avatar.tsx
import { Avatar as AvatarPrimitive } from "radix-ui";
import { jsx as jsx6 } from "react/jsx-runtime";
function Avatar(_a) {
  var _b = _a, {
    className,
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "size"
  ]);
  return /* @__PURE__ */ jsx6(
    AvatarPrimitive.Root,
    __spreadValues({
      "data-slot": "avatar",
      "data-size": size,
      className: cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )
    }, props)
  );
}
function AvatarImage(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx6(
    AvatarPrimitive.Image,
    __spreadValues({
      "data-slot": "avatar-image",
      className: cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )
    }, props)
  );
}
function AvatarFallback(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx6(
    AvatarPrimitive.Fallback,
    __spreadValues({
      "data-slot": "avatar-fallback",
      className: cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )
    }, props)
  );
}
function AvatarBadge(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx6(
    "span",
    __spreadValues({
      "data-slot": "avatar-badge",
      className: cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )
    }, props)
  );
}
function AvatarGroup(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx6(
    "div",
    __spreadValues({
      "data-slot": "avatar-group",
      className: cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )
    }, props)
  );
}
function AvatarGroupCount(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx6(
    "div",
    __spreadValues({
      "data-slot": "avatar-group-count",
      className: cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )
    }, props)
  );
}

// components/ui/badge/badge.tsx
import { cva as cva3 } from "class-variance-authority";
import { Slot as Slot2 } from "radix-ui";
import { jsx as jsx7 } from "react/jsx-runtime";
var badgeVariants = cva3(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge(_a) {
  var _b = _a, {
    className,
    variant = "default",
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "asChild"
  ]);
  const Comp = asChild ? Slot2.Root : "span";
  return /* @__PURE__ */ jsx7(
    Comp,
    __spreadValues({
      "data-slot": "badge",
      "data-variant": variant,
      className: cn(badgeVariants({ variant }), className)
    }, props)
  );
}

// components/ui/breadcrumb/breadcrumb.tsx
import { Slot as Slot3 } from "radix-ui";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function Breadcrumb(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx8(
    "nav",
    __spreadValues({
      "aria-label": "breadcrumb",
      "data-slot": "breadcrumb",
      className: cn(className)
    }, props)
  );
}
function BreadcrumbList(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx8(
    "ol",
    __spreadValues({
      "data-slot": "breadcrumb-list",
      className: cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className
      )
    }, props)
  );
}
function BreadcrumbItem(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx8(
    "li",
    __spreadValues({
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1", className)
    }, props)
  );
}
function BreadcrumbLink(_a) {
  var _b = _a, {
    asChild,
    className
  } = _b, props = __objRest(_b, [
    "asChild",
    "className"
  ]);
  const Comp = asChild ? Slot3.Root : "a";
  return /* @__PURE__ */ jsx8(
    Comp,
    __spreadValues({
      "data-slot": "breadcrumb-link",
      className: cn("transition-colors hover:text-foreground", className)
    }, props)
  );
}
function BreadcrumbPage(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx8(
    "span",
    __spreadValues({
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("font-normal text-foreground", className)
    }, props)
  );
}
function BreadcrumbSeparator(_a) {
  var _b = _a, {
    children,
    className
  } = _b, props = __objRest(_b, [
    "children",
    "className"
  ]);
  return /* @__PURE__ */ jsx8(
    "li",
    __spreadProps(__spreadValues({
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className)
    }, props), {
      children: children != null ? children : /* @__PURE__ */ jsx8(ChevronRightIcon, {})
    })
  );
}
function BreadcrumbEllipsis(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsxs3(
    "span",
    __spreadProps(__spreadValues({
      "data-slot": "breadcrumb-ellipsis",
      role: "presentation",
      "aria-hidden": "true",
      className: cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx8(
          MoreHorizontalIcon,
          {}
        ),
        /* @__PURE__ */ jsx8("span", { className: "sr-only", children: "More" })
      ]
    })
  );
}

// components/ui/calendar/calendar.tsx
import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames
} from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon as ChevronRightIcon2, ChevronDownIcon as ChevronDownIcon2 } from "lucide-react";
import { jsx as jsx9 } from "react/jsx-runtime";
function Calendar(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
    locale,
    formatters,
    components
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays",
    "captionLayout",
    "buttonVariant",
    "locale",
    "formatters",
    "components"
  ]);
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx9(
    DayPicker,
    __spreadValues({
      showOutsideDays,
      className: cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      locale,
      formatters: __spreadValues({
        formatMonthDropdown: (date) => date.toLocaleString(locale == null ? void 0 : locale.code, { month: "short" })
      }, formatters),
      classNames: __spreadValues({
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label" ? "text-sm" : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)" : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden)
      }, classNames),
      components: __spreadValues({
        Root: (_a2) => {
          var _b2 = _a2, { className: className2, rootRef } = _b2, props2 = __objRest(_b2, ["className", "rootRef"]);
          return /* @__PURE__ */ jsx9(
            "div",
            __spreadValues({
              "data-slot": "calendar",
              ref: rootRef,
              className: cn(className2)
            }, props2)
          );
        },
        Chevron: (_c) => {
          var _d = _c, { className: className2, orientation } = _d, props2 = __objRest(_d, ["className", "orientation"]);
          if (orientation === "left") {
            return /* @__PURE__ */ jsx9(ChevronLeftIcon, __spreadValues({ className: cn("size-4", className2) }, props2));
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx9(ChevronRightIcon2, __spreadValues({ className: cn("size-4", className2) }, props2));
          }
          return /* @__PURE__ */ jsx9(ChevronDownIcon2, __spreadValues({ className: cn("size-4", className2) }, props2));
        },
        DayButton: (_e) => {
          var props2 = __objRest(_e, []);
          return /* @__PURE__ */ jsx9(CalendarDayButton, __spreadValues({ locale }, props2));
        },
        WeekNumber: (_f) => {
          var _g = _f, { children } = _g, props2 = __objRest(_g, ["children"]);
          return /* @__PURE__ */ jsx9("td", __spreadProps(__spreadValues({}, props2), { children: /* @__PURE__ */ jsx9("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) }));
        }
      }, components)
    }, props)
  );
}
function CalendarDayButton(_a) {
  var _b = _a, {
    className,
    day,
    modifiers,
    locale
  } = _b, props = __objRest(_b, [
    "className",
    "day",
    "modifiers",
    "locale"
  ]);
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    var _a2;
    if (modifiers.focused) (_a2 = ref.current) == null ? void 0 : _a2.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx9(
    Button,
    __spreadValues({
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(locale == null ? void 0 : locale.code),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )
    }, props)
  );
}

// components/ui/card/card.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function Card(_a) {
  var _b = _a, {
    className,
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "size"
  ]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )
    }, props)
  );
}
function CardHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-header",
      className: cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )
    }, props)
  );
}
function CardTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-title",
      className: cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )
    }, props)
  );
}
function CardDescription(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
}
function CardAction(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )
    }, props)
  );
}
function CardContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className)
    }, props)
  );
}
function CardFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )
    }, props)
  );
}

// components/ui/carousel/carousel.tsx
import * as React2 from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon as ChevronLeftIcon2, ChevronRightIcon as ChevronRightIcon3 } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
var CarouselContext = React2.createContext(null);
function useCarousel() {
  const context = React2.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
function Carousel(_a) {
  var _b = _a, {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children
  } = _b, props = __objRest(_b, [
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "className",
    "children"
  ]);
  const [carouselRef, api] = useEmblaCarousel(
    __spreadProps(__spreadValues({}, opts), {
      axis: orientation === "horizontal" ? "x" : "y"
    }),
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React2.useState(false);
  const [canScrollNext, setCanScrollNext] = React2.useState(false);
  const onSelect = React2.useCallback((api2) => {
    if (!api2) return;
    setCanScrollPrev(api2.canScrollPrev());
    setCanScrollNext(api2.canScrollNext());
  }, []);
  const scrollPrev = React2.useCallback(() => {
    api == null ? void 0 : api.scrollPrev();
  }, [api]);
  const scrollNext = React2.useCallback(() => {
    api == null ? void 0 : api.scrollNext();
  }, [api]);
  const handleKeyDown = React2.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );
  React2.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);
  React2.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api == null ? void 0 : api.off("select", onSelect);
    };
  }, [api, onSelect]);
  return /* @__PURE__ */ jsx11(
    CarouselContext.Provider,
    {
      value: {
        carouselRef,
        api,
        opts,
        orientation: orientation || ((opts == null ? void 0 : opts.axis) === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      },
      children: /* @__PURE__ */ jsx11(
        "div",
        __spreadProps(__spreadValues({
          onKeyDownCapture: handleKeyDown,
          className: cn("relative", className),
          role: "region",
          "aria-roledescription": "carousel",
          "data-slot": "carousel"
        }, props), {
          children
        })
      )
    }
  );
}
function CarouselContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsx11(
    "div",
    {
      ref: carouselRef,
      className: "overflow-hidden",
      "data-slot": "carousel-content",
      children: /* @__PURE__ */ jsx11(
        "div",
        __spreadValues({
          className: cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className
          )
        }, props)
      )
    }
  );
}
function CarouselItem(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsx11(
    "div",
    __spreadValues({
      role: "group",
      "aria-roledescription": "slide",
      "data-slot": "carousel-item",
      className: cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )
    }, props)
  );
}
function CarouselPrevious(_a) {
  var _b = _a, {
    className,
    variant = "outline",
    size = "icon-sm"
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxs4(
    Button,
    __spreadProps(__spreadValues({
      "data-slot": "carousel-previous",
      variant,
      size,
      className: cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollPrev,
      onClick: scrollPrev
    }, props), {
      children: [
        /* @__PURE__ */ jsx11(ChevronLeftIcon2, {}),
        /* @__PURE__ */ jsx11("span", { className: "sr-only", children: "Previous slide" })
      ]
    })
  );
}
function CarouselNext(_a) {
  var _b = _a, {
    className,
    variant = "outline",
    size = "icon-sm"
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxs4(
    Button,
    __spreadProps(__spreadValues({
      "data-slot": "carousel-next",
      variant,
      size,
      className: cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollNext,
      onClick: scrollNext
    }, props), {
      children: [
        /* @__PURE__ */ jsx11(ChevronRightIcon3, {}),
        /* @__PURE__ */ jsx11("span", { className: "sr-only", children: "Next slide" })
      ]
    })
  );
}

// components/ui/chart/chart.tsx
import * as React3 from "react";
import * as RechartsPrimitive from "recharts";
import { Fragment, jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
var THEMES = { light: "", dark: ".dark" };
var INITIAL_DIMENSION = { width: 320, height: 200 };
var ChartContext = React3.createContext(null);
function useChart() {
  const context = React3.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
function ChartContainer(_a) {
  var _b = _a, {
    id,
    className,
    children,
    config,
    initialDimension = INITIAL_DIMENSION
  } = _b, props = __objRest(_b, [
    "id",
    "className",
    "children",
    "config",
    "initialDimension"
  ]);
  const uniqueId = React3.useId();
  const chartId = `chart-${id != null ? id : uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx12(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs5(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "chart",
      "data-chart": chartId,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx12(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx12(
          RechartsPrimitive.ResponsiveContainer,
          {
            initialDimension,
            children
          }
        )
      ]
    })
  ) });
}
var ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config2]) => {
      var _a;
      return (_a = config2.theme) != null ? _a : config2.color;
    }
  );
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx12(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            var _a, _b;
            const color = (_b = (_a = itemConfig.theme) == null ? void 0 : _a[theme]) != null ? _b : itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
var ChartTooltip = RechartsPrimitive.Tooltip;
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config } = useChart();
  const tooltipLabel = React3.useMemo(() => {
    var _a, _b, _c, _d;
    if (hideLabel || !(payload == null ? void 0 : payload.length)) {
      return null;
    }
    const [item] = payload;
    const key = `${(_b = (_a = labelKey != null ? labelKey : item == null ? void 0 : item.dataKey) != null ? _a : item == null ? void 0 : item.name) != null ? _b : "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string" ? (_d = (_c = config[label]) == null ? void 0 : _c.label) != null ? _d : label : itemConfig == null ? void 0 : itemConfig.label;
    if (labelFormatter) {
      return /* @__PURE__ */ jsx12("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
    }
    if (!value) {
      return null;
    }
    return /* @__PURE__ */ jsx12("div", { className: cn("font-medium", labelClassName), children: value });
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey
  ]);
  if (!active || !(payload == null ? void 0 : payload.length)) {
    return null;
  }
  const nestLabel = payload.length === 1 && indicator !== "dot";
  return /* @__PURE__ */ jsxs5(
    "div",
    {
      className: cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      ),
      children: [
        !nestLabel ? tooltipLabel : null,
        /* @__PURE__ */ jsx12("div", { className: "grid gap-1.5", children: payload.filter((item) => item.type !== "none").map((item, index) => {
          var _a, _b, _c, _d, _e;
          const key = `${(_b = (_a = nameKey != null ? nameKey : item.name) != null ? _a : item.dataKey) != null ? _b : "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = (_d = color != null ? color : (_c = item.payload) == null ? void 0 : _c.fill) != null ? _d : item.color;
          return /* @__PURE__ */ jsx12(
            "div",
            {
              className: cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              ),
              children: formatter && (item == null ? void 0 : item.value) !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs5(Fragment, { children: [
                (itemConfig == null ? void 0 : itemConfig.icon) ? /* @__PURE__ */ jsx12(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx12(
                  "div",
                  {
                    className: cn(
                      "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed"
                      }
                    ),
                    style: {
                      "--color-bg": indicatorColor,
                      "--color-border": indicatorColor
                    }
                  }
                ),
                /* @__PURE__ */ jsxs5(
                  "div",
                  {
                    className: cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    ),
                    children: [
                      /* @__PURE__ */ jsxs5("div", { className: "grid gap-1.5", children: [
                        nestLabel ? tooltipLabel : null,
                        /* @__PURE__ */ jsx12("span", { className: "text-muted-foreground", children: (_e = itemConfig == null ? void 0 : itemConfig.label) != null ? _e : item.name })
                      ] }),
                      item.value != null && /* @__PURE__ */ jsx12("span", { className: "font-mono font-medium text-foreground tabular-nums", children: typeof item.value === "number" ? item.value.toLocaleString() : String(item.value) })
                    ]
                  }
                )
              ] })
            },
            index
          );
        }) })
      ]
    }
  );
}
var ChartLegend = RechartsPrimitive.Legend;
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}) {
  const { config } = useChart();
  if (!(payload == null ? void 0 : payload.length)) {
    return null;
  }
  return /* @__PURE__ */ jsx12(
    "div",
    {
      className: cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      ),
      children: payload.filter((item) => item.type !== "none").map((item, index) => {
        var _a;
        const key = `${(_a = nameKey != null ? nameKey : item.dataKey) != null ? _a : "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return /* @__PURE__ */ jsxs5(
          "div",
          {
            className: cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            ),
            children: [
              (itemConfig == null ? void 0 : itemConfig.icon) && !hideIcon ? /* @__PURE__ */ jsx12(itemConfig.icon, {}) : /* @__PURE__ */ jsx12(
                "div",
                {
                  className: "h-2 w-2 shrink-0 rounded-[2px]",
                  style: {
                    backgroundColor: item.color
                  }
                }
              ),
              itemConfig == null ? void 0 : itemConfig.label
            ]
          },
          index
        );
      })
    }
  );
}
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}

// components/ui/checkbox/checkbox.tsx
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";
import { jsx as jsx13 } from "react/jsx-runtime";
function Checkbox(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx13(
    CheckboxPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "checkbox",
      className: cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx13(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
          children: /* @__PURE__ */ jsx13(
            CheckIcon,
            {}
          )
        }
      )
    })
  );
}

// components/ui/collapsible/collapsible.tsx
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { jsx as jsx14 } from "react/jsx-runtime";
function Collapsible(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx14(CollapsiblePrimitive.Root, __spreadValues({ "data-slot": "collapsible" }, props));
}
function CollapsibleTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx14(
    CollapsiblePrimitive.CollapsibleTrigger,
    __spreadValues({
      "data-slot": "collapsible-trigger"
    }, props)
  );
}
function CollapsibleContent(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx14(
    CollapsiblePrimitive.CollapsibleContent,
    __spreadValues({
      "data-slot": "collapsible-content"
    }, props)
  );
}

// components/ui/command/command.tsx
import { Command as CommandPrimitive } from "cmdk";

// components/ui/dialog/dialog.tsx
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx15(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx15(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx15(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogClose(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx15(DialogPrimitive.Close, __spreadValues({ "data-slot": "dialog-close" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx15(
    DialogPrimitive.Overlay,
    __spreadValues({
      "data-slot": "dialog-overlay",
      className: cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )
    }, props)
  );
}
function DialogContent(_a) {
  var _b = _a, {
    className,
    children,
    showCloseButton = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ jsxs6(DialogPortal, { children: [
    /* @__PURE__ */ jsx15(DialogOverlay, {}),
    /* @__PURE__ */ jsxs6(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "dialog-content",
        className: cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )
      }, props), {
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsx15(DialogPrimitive.Close, { "data-slot": "dialog-close", asChild: true, children: /* @__PURE__ */ jsxs6(
            Button,
            {
              variant: "ghost",
              className: "absolute top-2 right-2",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ jsx15(
                  XIcon,
                  {}
                ),
                /* @__PURE__ */ jsx15("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      })
    )
  ] });
}
function DialogHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx15(
    "div",
    __spreadValues({
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2", className)
    }, props)
  );
}
function DialogFooter(_a) {
  var _b = _a, {
    className,
    showCloseButton = false,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "showCloseButton",
    "children"
  ]);
  return /* @__PURE__ */ jsxs6(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "dialog-footer",
      className: cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )
    }, props), {
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsx15(DialogPrimitive.Close, { asChild: true, children: /* @__PURE__ */ jsx15(Button, { variant: "outline", children: "Close" }) })
      ]
    })
  );
}
function DialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx15(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn(
        "text-base leading-none font-medium",
        className
      )
    }, props)
  );
}
function DialogDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx15(
    DialogPrimitive.Description,
    __spreadValues({
      "data-slot": "dialog-description",
      className: cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )
    }, props)
  );
}

// components/ui/input-group/input-group.tsx
import { cva as cva4 } from "class-variance-authority";

// components/ui/input/input.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx16(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )
    }, props)
  );
}

// components/ui/textarea/textarea.tsx
import { jsx as jsx17 } from "react/jsx-runtime";
function Textarea(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx17(
    "textarea",
    __spreadValues({
      "data-slot": "textarea",
      className: cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )
    }, props)
  );
}

// components/ui/input-group/input-group.tsx
import { jsx as jsx18 } from "react/jsx-runtime";
function InputGroup(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx18(
    "div",
    __spreadValues({
      "data-slot": "input-group",
      role: "group",
      className: cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className
      )
    }, props)
  );
}
var inputGroupAddonVariants = cva4(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function InputGroupAddon(_a) {
  var _b = _a, {
    className,
    align = "inline-start"
  } = _b, props = __objRest(_b, [
    "className",
    "align"
  ]);
  return /* @__PURE__ */ jsx18(
    "div",
    __spreadValues({
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": align,
      className: cn(inputGroupAddonVariants({ align }), className),
      onClick: (e) => {
        var _a2, _b2;
        if (e.target.closest("button")) {
          return;
        }
        (_b2 = (_a2 = e.currentTarget.parentElement) == null ? void 0 : _a2.querySelector("input")) == null ? void 0 : _b2.focus();
      }
    }, props)
  );
}
var inputGroupButtonVariants = cva4(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function InputGroupButton(_a) {
  var _b = _a, {
    className,
    type = "button",
    variant = "ghost",
    size = "xs"
  } = _b, props = __objRest(_b, [
    "className",
    "type",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ jsx18(
    Button,
    __spreadValues({
      type,
      "data-size": size,
      variant,
      className: cn(inputGroupButtonVariants({ size }), className)
    }, props)
  );
}
function InputGroupText(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx18(
    "span",
    __spreadValues({
      className: cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function InputGroupInput(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx18(
    Input,
    __spreadValues({
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )
    }, props)
  );
}
function InputGroupTextarea(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx18(
    Textarea,
    __spreadValues({
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )
    }, props)
  );
}

// components/ui/command/command.tsx
import { SearchIcon, CheckIcon as CheckIcon2 } from "lucide-react";
import { jsx as jsx19, jsxs as jsxs7 } from "react/jsx-runtime";
function Command(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    CommandPrimitive,
    __spreadValues({
      "data-slot": "command",
      className: cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className
      )
    }, props)
  );
}
function CommandDialog(_a) {
  var _b = _a, {
    title = "Command Palette",
    description = "Search for a command to run...",
    children,
    className,
    showCloseButton = false
  } = _b, props = __objRest(_b, [
    "title",
    "description",
    "children",
    "className",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ jsxs7(Dialog, __spreadProps(__spreadValues({}, props), { children: [
    /* @__PURE__ */ jsxs7(DialogHeader, { className: "sr-only", children: [
      /* @__PURE__ */ jsx19(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx19(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsx19(
      DialogContent,
      {
        className: cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        ),
        showCloseButton,
        children
      }
    )
  ] }));
}
function CommandInput(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19("div", { "data-slot": "command-input-wrapper", className: "p-1 pb-0", children: /* @__PURE__ */ jsxs7(InputGroup, { className: "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!", children: [
    /* @__PURE__ */ jsx19(
      CommandPrimitive.Input,
      __spreadValues({
        "data-slot": "command-input",
        className: cn(
          "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      }, props)
    ),
    /* @__PURE__ */ jsx19(InputGroupAddon, { children: /* @__PURE__ */ jsx19(SearchIcon, { className: "size-4 shrink-0 opacity-50" }) })
  ] }) });
}
function CommandList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    CommandPrimitive.List,
    __spreadValues({
      "data-slot": "command-list",
      className: cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )
    }, props)
  );
}
function CommandEmpty(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    CommandPrimitive.Empty,
    __spreadValues({
      "data-slot": "command-empty",
      className: cn("py-6 text-center text-sm", className)
    }, props)
  );
}
function CommandGroup(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    CommandPrimitive.Group,
    __spreadValues({
      "data-slot": "command-group",
      className: cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )
    }, props)
  );
}
function CommandSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    CommandPrimitive.Separator,
    __spreadValues({
      "data-slot": "command-separator",
      className: cn("-mx-1 h-px bg-border", className)
    }, props)
  );
}
function CommandItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs7(
    CommandPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "command-item",
      className: cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx19(CheckIcon2, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" })
      ]
    })
  );
}
function CommandShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    "span",
    __spreadValues({
      "data-slot": "command-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )
    }, props)
  );
}

// components/ui/context-menu/context-menu.tsx
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { ChevronRightIcon as ChevronRightIcon4, CheckIcon as CheckIcon3 } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs8 } from "react/jsx-runtime";
function ContextMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(ContextMenuPrimitive.Root, __spreadValues({ "data-slot": "context-menu" }, props));
}
function ContextMenuTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "context-menu-trigger",
      className: cn("select-none", className)
    }, props)
  );
}
function ContextMenuGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(ContextMenuPrimitive.Group, __spreadValues({ "data-slot": "context-menu-group" }, props));
}
function ContextMenuPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(ContextMenuPrimitive.Portal, __spreadValues({ "data-slot": "context-menu-portal" }, props));
}
function ContextMenuSub(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(ContextMenuPrimitive.Sub, __spreadValues({ "data-slot": "context-menu-sub" }, props));
}
function ContextMenuRadioGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.RadioGroup,
    __spreadValues({
      "data-slot": "context-menu-radio-group"
    }, props)
  );
}
function ContextMenuContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(ContextMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "context-menu-content",
      className: cn("z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
    }, props)
  ) });
}
function ContextMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "context-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )
    }, props)
  );
}
function ContextMenuSubTrigger(_a) {
  var _b = _a, {
    className,
    inset,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "children"
  ]);
  return /* @__PURE__ */ jsxs8(
    ContextMenuPrimitive.SubTrigger,
    __spreadProps(__spreadValues({
      "data-slot": "context-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx20(ChevronRightIcon4, { className: "ml-auto" })
      ]
    })
  );
}
function ContextMenuSubContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.SubContent,
    __spreadValues({
      "data-slot": "context-menu-sub-content",
      className: cn("z-50 min-w-32 origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
    }, props)
  );
}
function ContextMenuCheckboxItem(_a) {
  var _b = _a, {
    className,
    children,
    checked,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "checked",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs8(
    ContextMenuPrimitive.CheckboxItem,
    __spreadProps(__spreadValues({
      "data-slot": "context-menu-checkbox-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked
    }, props), {
      children: [
        /* @__PURE__ */ jsx20("span", { className: "pointer-events-none absolute right-2", children: /* @__PURE__ */ jsx20(ContextMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx20(
          CheckIcon3,
          {}
        ) }) }),
        children
      ]
    })
  );
}
function ContextMenuRadioItem(_a) {
  var _b = _a, {
    className,
    children,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs8(
    ContextMenuPrimitive.RadioItem,
    __spreadProps(__spreadValues({
      "data-slot": "context-menu-radio-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx20("span", { className: "pointer-events-none absolute right-2", children: /* @__PURE__ */ jsx20(ContextMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx20(
          CheckIcon3,
          {}
        ) }) }),
        children
      ]
    })
  );
}
function ContextMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "context-menu-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )
    }, props)
  );
}
function ContextMenuSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    ContextMenuPrimitive.Separator,
    __spreadValues({
      "data-slot": "context-menu-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className)
    }, props)
  );
}
function ContextMenuShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    "span",
    __spreadValues({
      "data-slot": "context-menu-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className
      )
    }, props)
  );
}

// components/ui/drawer/drawer.tsx
import { Drawer as DrawerPrimitive } from "vaul";
import { jsx as jsx21, jsxs as jsxs9 } from "react/jsx-runtime";
function Drawer(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx21(DrawerPrimitive.Root, __spreadValues({ "data-slot": "drawer" }, props));
}
function DrawerTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx21(DrawerPrimitive.Trigger, __spreadValues({ "data-slot": "drawer-trigger" }, props));
}
function DrawerPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx21(DrawerPrimitive.Portal, __spreadValues({ "data-slot": "drawer-portal" }, props));
}
function DrawerClose(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx21(DrawerPrimitive.Close, __spreadValues({ "data-slot": "drawer-close" }, props));
}
function DrawerOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    DrawerPrimitive.Overlay,
    __spreadValues({
      "data-slot": "drawer-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )
    }, props)
  );
}
function DrawerContent(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs9(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx21(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs9(
      DrawerPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
          className
        )
      }, props), {
        children: [
          /* @__PURE__ */ jsx21("div", { className: "mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      })
    )
  ] });
}
function DrawerHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx21(
    "div",
    __spreadValues({
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left",
        className
      )
    }, props)
  );
}
function DrawerFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx21(
    "div",
    __spreadValues({
      "data-slot": "drawer-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className)
    }, props)
  );
}
function DrawerTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    DrawerPrimitive.Title,
    __spreadValues({
      "data-slot": "drawer-title",
      className: cn(
        "text-base font-medium text-foreground",
        className
      )
    }, props)
  );
}
function DrawerDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    DrawerPrimitive.Description,
    __spreadValues({
      "data-slot": "drawer-description",
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
}

// components/ui/dropdown-menu/dropdown-menu.tsx
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon as CheckIcon4, ChevronRightIcon as ChevronRightIcon5 } from "lucide-react";
import { jsx as jsx22, jsxs as jsxs10 } from "react/jsx-runtime";
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(DropdownMenuPrimitive.Portal, __spreadValues({ "data-slot": "dropdown-menu-portal" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    align = "start",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx22(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      align,
      className: cn("z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
    }, props)
  ) });
}
function DropdownMenuGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(DropdownMenuPrimitive.Group, __spreadValues({ "data-slot": "dropdown-menu-group" }, props));
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )
    }, props)
  );
}
function DropdownMenuCheckboxItem(_a) {
  var _b = _a, {
    className,
    children,
    checked,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "checked",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs10(
    DropdownMenuPrimitive.CheckboxItem,
    __spreadProps(__spreadValues({
      "data-slot": "dropdown-menu-checkbox-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked
    }, props), {
      children: [
        /* @__PURE__ */ jsx22(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-checkbox-item-indicator",
            children: /* @__PURE__ */ jsx22(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx22(
              CheckIcon4,
              {}
            ) })
          }
        ),
        children
      ]
    })
  );
}
function DropdownMenuRadioGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.RadioGroup,
    __spreadValues({
      "data-slot": "dropdown-menu-radio-group"
    }, props)
  );
}
function DropdownMenuRadioItem(_a) {
  var _b = _a, {
    className,
    children,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs10(
    DropdownMenuPrimitive.RadioItem,
    __spreadProps(__spreadValues({
      "data-slot": "dropdown-menu-radio-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx22(
          "span",
          {
            className: "pointer-events-none absolute right-2 flex items-center justify-center",
            "data-slot": "dropdown-menu-radio-item-indicator",
            children: /* @__PURE__ */ jsx22(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx22(
              CheckIcon4,
              {}
            ) })
          }
        ),
        children
      ]
    })
  );
}
function DropdownMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )
    }, props)
  );
}
function DropdownMenuSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.Separator,
    __spreadValues({
      "data-slot": "dropdown-menu-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className)
    }, props)
  );
}
function DropdownMenuShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx22(
    "span",
    __spreadValues({
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )
    }, props)
  );
}
function DropdownMenuSub(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx22(DropdownMenuPrimitive.Sub, __spreadValues({ "data-slot": "dropdown-menu-sub" }, props));
}
function DropdownMenuSubTrigger(_a) {
  var _b = _a, {
    className,
    inset,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "children"
  ]);
  return /* @__PURE__ */ jsxs10(
    DropdownMenuPrimitive.SubTrigger,
    __spreadProps(__spreadValues({
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx22(ChevronRightIcon5, { className: "ml-auto" })
      ]
    })
  );
}
function DropdownMenuSubContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx22(
    DropdownMenuPrimitive.SubContent,
    __spreadValues({
      "data-slot": "dropdown-menu-sub-content",
      className: cn("z-50 min-w-[96px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
    }, props)
  );
}

// components/ui/field/field.tsx
import { useMemo as useMemo2 } from "react";
import { cva as cva5 } from "class-variance-authority";

// components/ui/label/label.tsx
import { Label as LabelPrimitive } from "radix-ui";
import { jsx as jsx23 } from "react/jsx-runtime";
function Label(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx23(
    LabelPrimitive.Root,
    __spreadValues({
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )
    }, props)
  );
}

// components/ui/separator/separator.tsx
import { Separator as SeparatorPrimitive } from "radix-ui";
import { jsx as jsx24 } from "react/jsx-runtime";
function Separator(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal",
    decorative = true
  } = _b, props = __objRest(_b, [
    "className",
    "orientation",
    "decorative"
  ]);
  return /* @__PURE__ */ jsx24(
    SeparatorPrimitive.Root,
    __spreadValues({
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )
    }, props)
  );
}

// components/ui/field/field.tsx
import { jsx as jsx25, jsxs as jsxs11 } from "react/jsx-runtime";
function FieldSet(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx25(
    "fieldset",
    __spreadValues({
      "data-slot": "field-set",
      className: cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )
    }, props)
  );
}
function FieldLegend(_a) {
  var _b = _a, {
    className,
    variant = "legend"
  } = _b, props = __objRest(_b, [
    "className",
    "variant"
  ]);
  return /* @__PURE__ */ jsx25(
    "legend",
    __spreadValues({
      "data-slot": "field-legend",
      "data-variant": variant,
      className: cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )
    }, props)
  );
}
function FieldGroup(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadValues({
      "data-slot": "field-group",
      className: cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )
    }, props)
  );
}
var fieldVariants = cva5(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field(_a) {
  var _b = _a, {
    className,
    orientation = "vertical"
  } = _b, props = __objRest(_b, [
    "className",
    "orientation"
  ]);
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadValues({
      role: "group",
      "data-slot": "field",
      "data-orientation": orientation,
      className: cn(fieldVariants({ orientation }), className)
    }, props)
  );
}
function FieldContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadValues({
      "data-slot": "field-content",
      className: cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )
    }, props)
  );
}
function FieldLabel(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx25(
    Label,
    __spreadValues({
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )
    }, props)
  );
}
function FieldTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadValues({
      "data-slot": "field-label",
      className: cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )
    }, props)
  );
}
function FieldDescription(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx25(
    "p",
    __spreadValues({
      "data-slot": "field-description",
      className: cn(
        "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )
    }, props)
  );
}
function FieldSeparator(_a) {
  var _b = _a, {
    children,
    className
  } = _b, props = __objRest(_b, [
    "children",
    "className"
  ]);
  return /* @__PURE__ */ jsxs11(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "field-separator",
      "data-content": !!children,
      className: cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx25(Separator, { className: "absolute inset-0 top-1/2" }),
        children && /* @__PURE__ */ jsx25(
          "span",
          {
            className: "relative mx-auto block w-fit bg-background px-2 text-muted-foreground",
            "data-slot": "field-separator-content",
            children
          }
        )
      ]
    })
  );
}
function FieldError(_a) {
  var _b = _a, {
    className,
    children,
    errors
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "errors"
  ]);
  const content = useMemo2(() => {
    var _a2;
    if (children) {
      return children;
    }
    if (!(errors == null ? void 0 : errors.length)) {
      return null;
    }
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error == null ? void 0 : error.message, error])).values()
    ];
    if ((uniqueErrors == null ? void 0 : uniqueErrors.length) == 1) {
      return (_a2 = uniqueErrors[0]) == null ? void 0 : _a2.message;
    }
    return /* @__PURE__ */ jsx25("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: uniqueErrors.map(
      (error, index) => (error == null ? void 0 : error.message) && /* @__PURE__ */ jsx25("li", { children: error.message }, index)
    ) });
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadProps(__spreadValues({
      role: "alert",
      "data-slot": "field-error",
      className: cn("text-sm font-normal text-destructive", className)
    }, props), {
      children: content
    })
  );
}

// components/ui/hover-card/hover-card.tsx
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { jsx as jsx26 } from "react/jsx-runtime";
function HoverCard(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Root, __spreadValues({ "data-slot": "hover-card" }, props));
}
function HoverCardTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Trigger, __spreadValues({ "data-slot": "hover-card-trigger" }, props));
}
function HoverCardContent(_a) {
  var _b = _a, {
    className,
    align = "center",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ jsx26(
    HoverCardPrimitive.Content,
    __spreadValues({
      "data-slot": "hover-card-content",
      align,
      sideOffset,
      className: cn(
        "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )
    }, props)
  ) });
}

// components/ui/input-otp/input-otp.tsx
import * as React4 from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { jsx as jsx27, jsxs as jsxs12 } from "react/jsx-runtime";
function InputOTP(_a) {
  var _b = _a, {
    className,
    containerClassName
  } = _b, props = __objRest(_b, [
    "className",
    "containerClassName"
  ]);
  return /* @__PURE__ */ jsx27(
    OTPInput,
    __spreadValues({
      "data-slot": "input-otp",
      containerClassName: cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      ),
      spellCheck: false,
      className: cn("disabled:cursor-not-allowed", className)
    }, props)
  );
}
function InputOTPGroup(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx27(
    "div",
    __spreadValues({
      "data-slot": "input-otp-group",
      className: cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )
    }, props)
  );
}
function InputOTPSlot(_a) {
  var _b = _a, {
    index,
    className
  } = _b, props = __objRest(_b, [
    "index",
    "className"
  ]);
  var _a2;
  const inputOTPContext = React4.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = (_a2 = inputOTPContext == null ? void 0 : inputOTPContext.slots[index]) != null ? _a2 : {};
  return /* @__PURE__ */ jsxs12(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "input-otp-slot",
      "data-active": isActive,
      className: cn(
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      )
    }, props), {
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx27("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx27("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    })
  );
}
function InputOTPSeparator(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx27(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "input-otp-separator",
      className: "flex items-center [&_svg:not([class*='size-'])]:size-4",
      role: "separator"
    }, props), {
      children: /* @__PURE__ */ jsx27(
        MinusIcon,
        {}
      )
    })
  );
}

// components/ui/menubar/menubar.tsx
import { Menubar as MenubarPrimitive } from "radix-ui";
import { CheckIcon as CheckIcon5, ChevronRightIcon as ChevronRightIcon6 } from "lucide-react";
import { jsx as jsx28, jsxs as jsxs13 } from "react/jsx-runtime";
function Menubar(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.Root,
    __spreadValues({
      "data-slot": "menubar",
      className: cn(
        "flex h-8 items-center gap-0.5 rounded-lg border p-[3px]",
        className
      )
    }, props)
  );
}
function MenubarMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx28(MenubarPrimitive.Menu, __spreadValues({ "data-slot": "menubar-menu" }, props));
}
function MenubarGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx28(MenubarPrimitive.Group, __spreadValues({ "data-slot": "menubar-group" }, props));
}
function MenubarPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx28(MenubarPrimitive.Portal, __spreadValues({ "data-slot": "menubar-portal" }, props));
}
function MenubarRadioGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx28(MenubarPrimitive.RadioGroup, __spreadValues({ "data-slot": "menubar-radio-group" }, props));
}
function MenubarTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.Trigger,
    __spreadValues({
      "data-slot": "menubar-trigger",
      className: cn(
        "flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
        className
      )
    }, props)
  );
}
function MenubarContent(_a) {
  var _b = _a, {
    className,
    align = "start",
    alignOffset = -4,
    sideOffset = 8
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "alignOffset",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx28(MenubarPortal, { children: /* @__PURE__ */ jsx28(
    MenubarPrimitive.Content,
    __spreadValues({
      "data-slot": "menubar-content",
      align,
      alignOffset,
      sideOffset,
      className: cn("z-50 min-w-36 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95", className)
    }, props)
  ) });
}
function MenubarItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.Item,
    __spreadValues({
      "data-slot": "menubar-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/menubar-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )
    }, props)
  );
}
function MenubarCheckboxItem(_a) {
  var _b = _a, {
    className,
    children,
    checked,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "checked",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs13(
    MenubarPrimitive.CheckboxItem,
    __spreadProps(__spreadValues({
      "data-slot": "menubar-checkbox-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      checked
    }, props), {
      children: [
        /* @__PURE__ */ jsx28("span", { className: "pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4", children: /* @__PURE__ */ jsx28(MenubarPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx28(
          CheckIcon5,
          {}
        ) }) }),
        children
      ]
    })
  );
}
function MenubarRadioItem(_a) {
  var _b = _a, {
    className,
    children,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "inset"
  ]);
  return /* @__PURE__ */ jsxs13(
    MenubarPrimitive.RadioItem,
    __spreadProps(__spreadValues({
      "data-slot": "menubar-radio-item",
      "data-inset": inset,
      className: cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx28("span", { className: "pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4", children: /* @__PURE__ */ jsx28(MenubarPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx28(
          CheckIcon5,
          {}
        ) }) }),
        children
      ]
    })
  );
}
function MenubarLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.Label,
    __spreadValues({
      "data-slot": "menubar-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-sm font-medium data-inset:pl-7",
        className
      )
    }, props)
  );
}
function MenubarSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.Separator,
    __spreadValues({
      "data-slot": "menubar-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className)
    }, props)
  );
}
function MenubarShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx28(
    "span",
    __spreadValues({
      "data-slot": "menubar-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
        className
      )
    }, props)
  );
}
function MenubarSub(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx28(MenubarPrimitive.Sub, __spreadValues({ "data-slot": "menubar-sub" }, props));
}
function MenubarSubTrigger(_a) {
  var _b = _a, {
    className,
    inset,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "children"
  ]);
  return /* @__PURE__ */ jsxs13(
    MenubarPrimitive.SubTrigger,
    __spreadProps(__spreadValues({
      "data-slot": "menubar-sub-trigger",
      "data-inset": inset,
      className: cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx28(ChevronRightIcon6, { className: "ml-auto size-4" })
      ]
    })
  );
}
function MenubarSubContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx28(
    MenubarPrimitive.SubContent,
    __spreadValues({
      "data-slot": "menubar-sub-content",
      className: cn("z-50 min-w-32 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
    }, props)
  );
}

// components/ui/navigation-menu/navigation-menu.tsx
import { cva as cva6 } from "class-variance-authority";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { ChevronDownIcon as ChevronDownIcon3 } from "lucide-react";
import { jsx as jsx29, jsxs as jsxs14 } from "react/jsx-runtime";
function NavigationMenu(_a) {
  var _b = _a, {
    className,
    children,
    viewport = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "viewport"
  ]);
  return /* @__PURE__ */ jsxs14(
    NavigationMenuPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "navigation-menu",
      "data-viewport": viewport,
      className: cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )
    }, props), {
      children: [
        children,
        viewport && /* @__PURE__ */ jsx29(NavigationMenuViewport, {})
      ]
    })
  );
}
function NavigationMenuList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    NavigationMenuPrimitive.List,
    __spreadValues({
      "data-slot": "navigation-menu-list",
      className: cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )
    }, props)
  );
}
function NavigationMenuItem(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    NavigationMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "navigation-menu-item",
      className: cn("relative", className)
    }, props)
  );
}
var navigationMenuTriggerStyle = cva6(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
);
function NavigationMenuTrigger(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs14(
    NavigationMenuPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "navigation-menu-trigger",
      className: cn(navigationMenuTriggerStyle(), "group", className)
    }, props), {
      children: [
        children,
        " ",
        /* @__PURE__ */ jsx29(ChevronDownIcon3, { className: "relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180", "aria-hidden": "true" })
      ]
    })
  );
}
function NavigationMenuContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    NavigationMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "navigation-menu-content",
      className: cn(
        "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      )
    }, props)
  );
}
function NavigationMenuViewport(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    "div",
    {
      className: cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      ),
      children: /* @__PURE__ */ jsx29(
        NavigationMenuPrimitive.Viewport,
        __spreadValues({
          "data-slot": "navigation-menu-viewport",
          className: cn(
            "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
            className
          )
        }, props)
      )
    }
  );
}
function NavigationMenuLink(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    NavigationMenuPrimitive.Link,
    __spreadValues({
      "data-slot": "navigation-menu-link",
      className: cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function NavigationMenuIndicator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx29(
    NavigationMenuPrimitive.Indicator,
    __spreadProps(__spreadValues({
      "data-slot": "navigation-menu-indicator",
      className: cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx29("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
    })
  );
}

// components/ui/pagination/pagination.tsx
import { ChevronLeftIcon as ChevronLeftIcon3, ChevronRightIcon as ChevronRightIcon7, MoreHorizontalIcon as MoreHorizontalIcon2 } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs15 } from "react/jsx-runtime";
function Pagination(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx30(
    "nav",
    __spreadValues({
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      className: cn("mx-auto flex w-full justify-center", className)
    }, props)
  );
}
function PaginationContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx30(
    "ul",
    __spreadValues({
      "data-slot": "pagination-content",
      className: cn("flex items-center gap-0.5", className)
    }, props)
  );
}
function PaginationItem(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx30("li", __spreadValues({ "data-slot": "pagination-item" }, props));
}
function PaginationLink(_a) {
  var _b = _a, {
    className,
    isActive,
    size = "icon"
  } = _b, props = __objRest(_b, [
    "className",
    "isActive",
    "size"
  ]);
  return /* @__PURE__ */ jsx30(
    Button,
    {
      asChild: true,
      variant: isActive ? "outline" : "ghost",
      size,
      className: cn(className),
      children: /* @__PURE__ */ jsx30(
        "a",
        __spreadValues({
          "aria-current": isActive ? "page" : void 0,
          "data-slot": "pagination-link",
          "data-active": isActive
        }, props)
      )
    }
  );
}
function PaginationPrevious(_a) {
  var _b = _a, {
    className,
    text = "Previous"
  } = _b, props = __objRest(_b, [
    "className",
    "text"
  ]);
  return /* @__PURE__ */ jsxs15(
    PaginationLink,
    __spreadProps(__spreadValues({
      "aria-label": "Go to previous page",
      size: "default",
      className: cn("pl-1.5!", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx30(ChevronLeftIcon3, { "data-icon": "inline-start" }),
        /* @__PURE__ */ jsx30("span", { className: "hidden sm:block", children: text })
      ]
    })
  );
}
function PaginationNext(_a) {
  var _b = _a, {
    className,
    text = "Next"
  } = _b, props = __objRest(_b, [
    "className",
    "text"
  ]);
  return /* @__PURE__ */ jsxs15(
    PaginationLink,
    __spreadProps(__spreadValues({
      "aria-label": "Go to next page",
      size: "default",
      className: cn("pr-1.5!", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx30("span", { className: "hidden sm:block", children: text }),
        /* @__PURE__ */ jsx30(ChevronRightIcon7, { "data-icon": "inline-end" })
      ]
    })
  );
}
function PaginationEllipsis(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsxs15(
    "span",
    __spreadProps(__spreadValues({
      "aria-hidden": true,
      "data-slot": "pagination-ellipsis",
      className: cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx30(
          MoreHorizontalIcon2,
          {}
        ),
        /* @__PURE__ */ jsx30("span", { className: "sr-only", children: "More pages" })
      ]
    })
  );
}

// components/ui/popover/popover.tsx
import { Popover as PopoverPrimitive } from "radix-ui";
import { jsx as jsx31 } from "react/jsx-runtime";
function Popover(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx31(PopoverPrimitive.Root, __spreadValues({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx31(PopoverPrimitive.Trigger, __spreadValues({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
  var _b = _a, {
    className,
    align = "center",
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "align",
    "sideOffset"
  ]);
  return /* @__PURE__ */ jsx31(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx31(
    PopoverPrimitive.Content,
    __spreadValues({
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )
    }, props)
  ) });
}
function PopoverAnchor(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx31(PopoverPrimitive.Anchor, __spreadValues({ "data-slot": "popover-anchor" }, props));
}
function PopoverHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx31(
    "div",
    __spreadValues({
      "data-slot": "popover-header",
      className: cn("flex flex-col gap-0.5 text-sm", className)
    }, props)
  );
}
function PopoverTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx31(
    "div",
    __spreadValues({
      "data-slot": "popover-title",
      className: cn("font-medium", className)
    }, props)
  );
}
function PopoverDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx31(
    "p",
    __spreadValues({
      "data-slot": "popover-description",
      className: cn("text-muted-foreground", className)
    }, props)
  );
}

// components/ui/progress/progress.tsx
import { Progress as ProgressPrimitive } from "radix-ui";
import { jsx as jsx32 } from "react/jsx-runtime";
function Progress(_a) {
  var _b = _a, {
    className,
    indicatorClassName,
    value
  } = _b, props = __objRest(_b, [
    "className",
    "indicatorClassName",
    "value"
  ]);
  return /* @__PURE__ */ jsx32(
    ProgressPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "progress",
      className: cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx32(
        ProgressPrimitive.Indicator,
        {
          "data-slot": "progress-indicator",
          className: cn("size-full flex-1 bg-primary transition-all", indicatorClassName),
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    })
  );
}

// components/ui/radio-group/radio-group.tsx
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { jsx as jsx33 } from "react/jsx-runtime";
function RadioGroup(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx33(
    RadioGroupPrimitive.Root,
    __spreadValues({
      "data-slot": "radio-group",
      className: cn("grid w-full gap-2", className)
    }, props)
  );
}
function RadioGroupItem(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx33(
    RadioGroupPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "radio-group-item",
      className: cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx33(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "flex size-4 items-center justify-center",
          children: /* @__PURE__ */ jsx33("span", { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" })
        }
      )
    })
  );
}

// components/ui/resizable/resizable.tsx
import * as ResizablePrimitive from "react-resizable-panels";
import { jsx as jsx34 } from "react/jsx-runtime";
function ResizablePanelGroup(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx34(
    ResizablePrimitive.Group,
    __spreadValues({
      "data-slot": "resizable-panel-group",
      className: cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )
    }, props)
  );
}
function ResizablePanel(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx34(ResizablePrimitive.Panel, __spreadValues({ "data-slot": "resizable-panel" }, props));
}
function ResizableHandle(_a) {
  var _b = _a, {
    withHandle,
    className
  } = _b, props = __objRest(_b, [
    "withHandle",
    "className"
  ]);
  return /* @__PURE__ */ jsx34(
    ResizablePrimitive.Separator,
    __spreadProps(__spreadValues({
      "data-slot": "resizable-handle",
      className: cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )
    }, props), {
      children: withHandle && /* @__PURE__ */ jsx34("div", { className: "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" })
    })
  );
}

// components/ui/scroll-area/scroll-area.tsx
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { jsx as jsx35, jsxs as jsxs16 } from "react/jsx-runtime";
function ScrollArea(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs16(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area",
      className: cn("relative", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx35(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx35(ScrollBar, {}),
        /* @__PURE__ */ jsx35(ScrollAreaPrimitive.Corner, {})
      ]
    })
  );
}
function ScrollBar(_a) {
  var _b = _a, {
    className,
    orientation = "vertical"
  } = _b, props = __objRest(_b, [
    "className",
    "orientation"
  ]);
  return /* @__PURE__ */ jsx35(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    __spreadProps(__spreadValues({
      "data-slot": "scroll-area-scrollbar",
      "data-orientation": orientation,
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx35(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "relative flex-1 rounded-full bg-border"
        }
      )
    })
  );
}

// components/ui/select/select.tsx
import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDownIcon as ChevronDownIcon4, CheckIcon as CheckIcon6, ChevronUpIcon as ChevronUpIcon2 } from "lucide-react";
import { jsx as jsx36, jsxs as jsxs17 } from "react/jsx-runtime";
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx36(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectGroup(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx36(
    SelectPrimitive.Group,
    __spreadValues({
      "data-slot": "select-group",
      className: cn("scroll-my-1 p-1", className)
    }, props)
  );
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx36(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
}
function SelectTrigger(_a) {
  var _b = _a, {
    className,
    size = "default",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "children"
  ]);
  return /* @__PURE__ */ jsxs17(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-1 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx36(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx36(ChevronDownIcon4, { className: "pointer-events-none size-4 text-muted-foreground" }) })
      ]
    })
  );
}
function SelectContent(_a) {
  var _b = _a, {
    className,
    children,
    position = "popper",
    align = "start"
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "position",
    "align"
  ]);
  return /* @__PURE__ */ jsx36(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs17(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "select-content",
      "data-align-trigger": position === "item-aligned",
      className: cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align
    }, props), {
      children: [
        /* @__PURE__ */ jsx36(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx36(
          SelectPrimitive.Viewport,
          {
            "data-position": position,
            className: cn(
              "p-1",
              position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx36(SelectScrollDownButton, {})
      ]
    })
  ) });
}
function SelectLabel(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx36(
    SelectPrimitive.Label,
    __spreadValues({
      "data-slot": "select-label",
      className: cn("px-1.5 py-1 text-xs text-muted-foreground", className)
    }, props)
  );
}
function SelectItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs17(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx36("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx36(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx36(CheckIcon6, { className: "pointer-events-none" }) }) }),
        /* @__PURE__ */ jsx36(SelectPrimitive.ItemText, { children })
      ]
    })
  );
}
function SelectSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx36(
    SelectPrimitive.Separator,
    __spreadValues({
      "data-slot": "select-separator",
      className: cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)
    }, props)
  );
}
function SelectScrollUpButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx36(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx36(
        ChevronUpIcon2,
        {}
      )
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx36(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx36(
        ChevronDownIcon4,
        {}
      )
    })
  );
}

// components/ui/sheet/sheet.tsx
import { Dialog as SheetPrimitive } from "radix-ui";
import { XIcon as XIcon2 } from "lucide-react";
import { jsx as jsx37, jsxs as jsxs18 } from "react/jsx-runtime";
function Sheet(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx37(SheetPrimitive.Root, __spreadValues({ "data-slot": "sheet" }, props));
}
function SheetTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx37(SheetPrimitive.Trigger, __spreadValues({ "data-slot": "sheet-trigger" }, props));
}
function SheetClose(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx37(SheetPrimitive.Close, __spreadValues({ "data-slot": "sheet-close" }, props));
}
function SheetPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx37(SheetPrimitive.Portal, __spreadValues({ "data-slot": "sheet-portal" }, props));
}
function SheetOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx37(
    SheetPrimitive.Overlay,
    __spreadValues({
      "data-slot": "sheet-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )
    }, props)
  );
}
function SheetContent(_a) {
  var _b = _a, {
    className,
    children,
    side = "right",
    showCloseButton = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "side",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ jsxs18(SheetPortal, { children: [
    /* @__PURE__ */ jsx37(SheetOverlay, {}),
    /* @__PURE__ */ jsxs18(
      SheetPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn(
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10",
          className
        )
      }, props), {
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsx37(SheetPrimitive.Close, { "data-slot": "sheet-close", asChild: true, children: /* @__PURE__ */ jsxs18(
            Button,
            {
              variant: "ghost",
              className: "absolute top-3 right-3",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ jsx37(
                  XIcon2,
                  {}
                ),
                /* @__PURE__ */ jsx37("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      })
    )
  ] });
}
function SheetHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx37(
    "div",
    __spreadValues({
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-0.5 p-4", className)
    }, props)
  );
}
function SheetFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx37(
    "div",
    __spreadValues({
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className)
    }, props)
  );
}
function SheetTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx37(
    SheetPrimitive.Title,
    __spreadValues({
      "data-slot": "sheet-title",
      className: cn(
        "text-base font-medium text-foreground",
        className
      )
    }, props)
  );
}
function SheetDescription(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx37(
    SheetPrimitive.Description,
    __spreadValues({
      "data-slot": "sheet-description",
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
}

// components/ui/sidebar/sidebar.tsx
import * as React6 from "react";
import { cva as cva7 } from "class-variance-authority";
import { Slot as Slot4 } from "radix-ui";

// hooks/use-mobile.ts
import * as React5 from "react";
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React5.useState(void 0);
  React5.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

// components/ui/skeleton/skeleton.tsx
import { jsx as jsx38 } from "react/jsx-runtime";
function Skeleton(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx38(
    "div",
    __spreadValues({
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-md bg-muted", className)
    }, props)
  );
}

// components/ui/tooltip/tooltip.tsx
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { jsx as jsx39, jsxs as jsxs19 } from "react/jsx-runtime";
function TooltipProvider(_a) {
  var _b = _a, { delayDuration = 0 } = _b, props = __objRest(_b, ["delayDuration"]);
  return /* @__PURE__ */ jsx39(TooltipPrimitive.Provider, __spreadValues({ "data-slot": "tooltip-provider", delayDuration }, props));
}
function Tooltip2(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx39(TooltipProvider, { children: /* @__PURE__ */ jsx39(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx39(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
}
function TooltipContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset",
    "children"
  ]);
  return /* @__PURE__ */ jsx39(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs19(
    TooltipPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md px-3 py-1.5 text-xs text-balance",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx39(TooltipPrimitive.Arrow, { className: "fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// components/ui/sidebar/sidebar.tsx
import { PanelLeftIcon } from "lucide-react";
import { jsx as jsx40, jsxs as jsxs20 } from "react/jsx-runtime";
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React6.createContext(null);
function useSidebar() {
  const context = React6.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider(_a) {
  var _b = _a, {
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children
  } = _b, props = __objRest(_b, [
    "defaultOpen",
    "open",
    "onOpenChange",
    "className",
    "style",
    "children"
  ]);
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React6.useState(false);
  const [_open, _setOpen] = React6.useState(defaultOpen);
  const open = openProp != null ? openProp : _open;
  const setOpen = React6.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React6.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React6.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React6.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx40(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx40(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "sidebar-wrapper",
      style: __spreadValues({
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON
      }, style),
      className: cn(
        "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
        className
      )
    }, props), {
      children
    })
  ) });
}
function Sidebar(_a) {
  var _b = _a, {
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    dir
  } = _b, props = __objRest(_b, [
    "side",
    "variant",
    "collapsible",
    "className",
    "children",
    "dir"
  ]);
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx40(
      "div",
      __spreadProps(__spreadValues({
        "data-slot": "sidebar",
        className: cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className
        )
      }, props), {
        children
      })
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx40(Sheet, __spreadProps(__spreadValues({ open: openMobile, onOpenChange: setOpenMobile }, props), { children: /* @__PURE__ */ jsxs20(
      SheetContent,
      {
        dir,
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs20(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx40(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx40(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx40("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) }));
  }
  return /* @__PURE__ */ jsxs20(
    "div",
    {
      className: "group peer hidden text-sidebar-foreground md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx40(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx40(
          "div",
          __spreadProps(__spreadValues({
            "data-slot": "sidebar-container",
            "data-side": side,
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            )
          }, props), {
            children: /* @__PURE__ */ jsx40(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
                children
              }
            )
          })
        )
      ]
    }
  );
}
function SidebarTrigger(_a) {
  var _b = _a, {
    className,
    onClick
  } = _b, props = __objRest(_b, [
    "className",
    "onClick"
  ]);
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs20(
    Button,
    __spreadProps(__spreadValues({
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon-sm",
      className: cn(className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        toggleSidebar();
      }
    }, props), {
      children: [
        /* @__PURE__ */ jsx40(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx40("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    })
  );
}
function SidebarRail(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx40(
    "button",
    __spreadValues({
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )
    }, props)
  );
}
function SidebarInset(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "main",
    __spreadValues({
      "data-slot": "sidebar-inset",
      className: cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )
    }, props)
  );
}
function SidebarInput(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx40(
    Input,
    __spreadValues({
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      className: cn("h-8 w-full bg-background shadow-none", className)
    }, props)
  );
}
function SidebarHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className)
    }, props)
  );
}
function SidebarFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className)
    }, props)
  );
}
function SidebarSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx40(
    Separator,
    __spreadValues({
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      className: cn("mx-2 bg-sidebar-border", className)
    }, props)
  );
}
function SidebarContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )
    }, props)
  );
}
function SidebarGroup(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className)
    }, props)
  );
}
function SidebarGroupLabel(_a) {
  var _b = _a, {
    className,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "asChild"
  ]);
  const Comp = asChild ? Slot4.Root : "div";
  return /* @__PURE__ */ jsx40(
    Comp,
    __spreadValues({
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )
    }, props)
  );
}
function SidebarGroupAction(_a) {
  var _b = _a, {
    className,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "asChild"
  ]);
  const Comp = asChild ? Slot4.Root : "button";
  return /* @__PURE__ */ jsx40(
    Comp,
    __spreadValues({
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      className: cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )
    }, props)
  );
}
function SidebarGroupContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className)
    }, props)
  );
}
function SidebarMenu(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "ul",
    __spreadValues({
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-0", className)
    }, props)
  );
}
function SidebarMenuItem(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "li",
    __spreadValues({
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className)
    }, props)
  );
}
var sidebarMenuButtonVariants = cva7(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton(_a) {
  var _b = _a, {
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className
  } = _b, props = __objRest(_b, [
    "asChild",
    "isActive",
    "variant",
    "size",
    "tooltip",
    "className"
  ]);
  const Comp = asChild ? Slot4.Root : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx40(
    Comp,
    __spreadValues({
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className)
    }, props)
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs20(Tooltip2, { children: [
    /* @__PURE__ */ jsx40(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx40(
      TooltipContent,
      __spreadValues({
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile
      }, tooltip)
    )
  ] });
}
function SidebarMenuAction(_a) {
  var _b = _a, {
    className,
    asChild = false,
    showOnHover = false
  } = _b, props = __objRest(_b, [
    "className",
    "asChild",
    "showOnHover"
  ]);
  const Comp = asChild ? Slot4.Root : "button";
  return /* @__PURE__ */ jsx40(
    Comp,
    __spreadValues({
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
        className
      )
    }, props)
  );
}
function SidebarMenuBadge(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx40(
    "div",
    __spreadValues({
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      className: cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className
      )
    }, props)
  );
}
function SidebarMenuSkeleton(_a) {
  var _b = _a, {
    className,
    showIcon = false
  } = _b, props = __objRest(_b, [
    "className",
    "showIcon"
  ]);
  const [width] = React6.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });
  return /* @__PURE__ */ jsxs20(
    "div",
    __spreadProps(__spreadValues({
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className)
    }, props), {
      children: [
        showIcon && /* @__PURE__ */ jsx40(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx40(
          Skeleton,
          {
            className: "h-4 max-w-(--skeleton-width) flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    })
  );
}
function SidebarMenuSub(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx40(
    "ul",
    __spreadValues({
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        className
      )
    }, props)
  );
}
function SidebarMenuSubItem(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx40(
    "li",
    __spreadValues({
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: cn("group/menu-sub-item relative", className)
    }, props)
  );
}
function SidebarMenuSubButton(_a) {
  var _b = _a, {
    asChild = false,
    size = "md",
    isActive = false,
    className
  } = _b, props = __objRest(_b, [
    "asChild",
    "size",
    "isActive",
    "className"
  ]);
  const Comp = asChild ? Slot4.Root : "a";
  return /* @__PURE__ */ jsx40(
    Comp,
    __spreadValues({
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        className
      )
    }, props)
  );
}

// components/ui/slider/slider.tsx
import * as React7 from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { jsx as jsx41, jsxs as jsxs21 } from "react/jsx-runtime";
function Slider(_a) {
  var _b = _a, {
    className,
    defaultValue,
    value,
    min = 0,
    max = 100
  } = _b, props = __objRest(_b, [
    "className",
    "defaultValue",
    "value",
    "min",
    "max"
  ]);
  const _values = React7.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxs21(
    SliderPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx41(
          SliderPrimitive.Track,
          {
            "data-slot": "slider-track",
            className: "relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
            children: /* @__PURE__ */ jsx41(
              SliderPrimitive.Range,
              {
                "data-slot": "slider-range",
                className: "absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsx41(
          SliderPrimitive.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          },
          index
        ))
      ]
    })
  );
}

// components/ui/sonner/sonner.tsx
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";
import { jsx as jsx42 } from "react/jsx-runtime";
var Toaster = (_a) => {
  var props = __objRest(_a, []);
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx42(
    Sonner,
    __spreadValues({
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsx42(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx42(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx42(TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ jsx42(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx42(Loader2Icon, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      toastOptions: {
        classNames: {
          toast: "cn-toast"
        }
      }
    }, props)
  );
};

// components/ui/switch/switch.tsx
import { Switch as SwitchPrimitive } from "radix-ui";
import { jsx as jsx43 } from "react/jsx-runtime";
function Switch(_a) {
  var _b = _a, {
    className,
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "size"
  ]);
  return /* @__PURE__ */ jsx43(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx43(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
        }
      )
    })
  );
}

// components/ui/table/table.tsx
import { jsx as jsx44 } from "react/jsx-runtime";
function Table(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsx44(
        "table",
        __spreadValues({
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className)
        }, props)
      )
    }
  );
}
function TableHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "thead",
    __spreadValues({
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className)
    }, props)
  );
}
function TableBody(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "tbody",
    __spreadValues({
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className)
    }, props)
  );
}
function TableFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "tfoot",
    __spreadValues({
      "data-slot": "table-footer",
      className: cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )
    }, props)
  );
}
function TableRow(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "tr",
    __spreadValues({
      "data-slot": "table-row",
      className: cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )
    }, props)
  );
}
function TableHead(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "th",
    __spreadValues({
      "data-slot": "table-head",
      className: cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )
    }, props)
  );
}
function TableCell(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx44(
    "td",
    __spreadValues({
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )
    }, props)
  );
}
function TableCaption(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx44(
    "caption",
    __spreadValues({
      "data-slot": "table-caption",
      className: cn("mt-4 text-sm text-muted-foreground", className)
    }, props)
  );
}

// components/ui/tabs/tabs.tsx
import { cva as cva8 } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { jsx as jsx45 } from "react/jsx-runtime";
function Tabs(_a) {
  var _b = _a, {
    className,
    orientation = "horizontal"
  } = _b, props = __objRest(_b, [
    "className",
    "orientation"
  ]);
  return /* @__PURE__ */ jsx45(
    TabsPrimitive.Root,
    __spreadValues({
      "data-slot": "tabs",
      "data-orientation": orientation,
      className: cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )
    }, props)
  );
}
var tabsListVariants = cva8(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function TabsList(_a) {
  var _b = _a, {
    className,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "variant"
  ]);
  return /* @__PURE__ */ jsx45(
    TabsPrimitive.List,
    __spreadValues({
      "data-slot": "tabs-list",
      "data-variant": variant,
      className: cn(tabsListVariants({ variant }), className)
    }, props)
  );
}
function TabsTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx45(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )
    }, props)
  );
}
function TabsContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx45(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 text-sm outline-none", className)
    }, props)
  );
}

// components/ui/toggle/toggle.tsx
import { cva as cva9 } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import { jsx as jsx46 } from "react/jsx-runtime";
var toggleVariants = cva9(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted"
      },
      size: {
        default: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Toggle(_a) {
  var _b = _a, {
    className,
    variant = "default",
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size"
  ]);
  return /* @__PURE__ */ jsx46(
    TogglePrimitive.Root,
    __spreadValues({
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className }))
    }, props)
  );
}

// components/ui/toggle-group/toggle-group.tsx
import * as React8 from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { jsx as jsx47 } from "react/jsx-runtime";
var ToggleGroupContext = React8.createContext({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal"
});
function ToggleGroup(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    spacing = 0,
    orientation = "horizontal",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "spacing",
    "orientation",
    "children"
  ]);
  return /* @__PURE__ */ jsx47(
    ToggleGroupPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "toggle-group",
      "data-variant": variant,
      "data-size": size,
      "data-spacing": spacing,
      "data-orientation": orientation,
      style: { "--gap": spacing },
      className: cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx47(
        ToggleGroupContext.Provider,
        {
          value: { variant, size, spacing, orientation },
          children
        }
      )
    })
  );
}
function ToggleGroupItem(_a) {
  var _b = _a, {
    className,
    children,
    variant = "default",
    size = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "variant",
    "size"
  ]);
  const context = React8.useContext(ToggleGroupContext);
  return /* @__PURE__ */ jsx47(
    ToggleGroupPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "toggle-group-item",
      "data-variant": context.variant || variant,
      "data-size": context.size || size,
      "data-spacing": context.spacing,
      className: cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size
        }),
        className
      )
    }, props), {
      children
    })
  );
}
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertAction,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  AspectRatio,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  CalendarDayButton,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  Skeleton,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip2 as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  badgeVariants,
  buttonVariants,
  navigationMenuTriggerStyle,
  toggleVariants,
  useCarousel,
  useSidebar
};
