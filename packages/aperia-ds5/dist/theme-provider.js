"use client";
"use client";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-3GWWZKX7.js";

// components/theme-provider.tsx
import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { jsx, jsxs } from "react/jsx-runtime";
function ThemeProvider(_a) {
  var _b = _a, {
    children
  } = _b, props = __objRest(_b, [
    "children"
  ]);
  return /* @__PURE__ */ jsxs(
    NextThemesProvider,
    __spreadProps(__spreadValues({
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true
    }, props), {
      children: [
        /* @__PURE__ */ jsx(ThemeHotkey, {}),
        children
      ]
    })
  );
}
function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
}
function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();
  React.useEffect(() => {
    function onKeyDown(event) {
      if (event.defaultPrevented || event.repeat) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (event.key.toLowerCase() !== "d") {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [resolvedTheme, setTheme]);
  return null;
}
export {
  ThemeProvider
};
