"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StairsTransition, stairsDurationMs } from "./StairsTransition";

function isInternalNav(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("http")) {
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function resolvePath(href: string) {
  try {
    const url = new URL(href, window.location.href);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function labelForPath(path: string) {
  const clean = path.replace(/\/$/, "") || "/";
  if (clean === "/") return "Home";
  if (clean === "/work" || clean.startsWith("/work/")) return "Work";
  if (clean === "/about") return "About";
  if (clean === "/services" || clean.startsWith("/services/")) return "Services";
  if (clean === "/blog" || clean.startsWith("/blog/")) return "Blog";
  const segment = clean.split("/").filter(Boolean).pop() || "Next";
  return segment.replace(/-/g, " ");
}

/**
 * MW-style page cover on client-side route changes.
 * Close (accent bars + title) → navigate → open (bars exit up).
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
  const [label, setLabel] = useState("Next");
  const pendingHref = useRef<string | null>(null);
  const waitingForPath = useRef<string | null>(null);
  const pathAtClose = useRef<string | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFallback = () => {
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  };

  const onCloseComplete = useCallback(() => {
    const href = pendingHref.current;
    if (!href) {
      setPhase("opening");
      return;
    }
    pendingHref.current = null;
    const next = resolvePath(href);
    const nextPath = next.split("#")[0] || next;
    waitingForPath.current = nextPath;
    pathAtClose.current = pathname;

    if (nextPath === pathname || nextPath === `${pathname}/`) {
      waitingForPath.current = null;
      setPhase("opening");
      return;
    }

    router.push(href);

    clearFallback();
    fallbackTimer.current = setTimeout(() => {
      if (waitingForPath.current) {
        waitingForPath.current = null;
        setPhase("opening");
      }
    }, stairsDurationMs() + 800);
  }, [pathname, router]);

  const onOpenComplete = useCallback(() => {
    clearFallback();
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (!waitingForPath.current) return;
    const target = waitingForPath.current.replace(/\/$/, "") || "/";
    const current = pathname.replace(/\/$/, "") || "/";
    if (current === target || pathname !== pathAtClose.current) {
      waitingForPath.current = null;
      setPhase("opening");
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (phase !== "idle") {
        e.preventDefault();
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a",
      ) as HTMLAnchorElement | null;
      if (!anchor || !isInternalNav(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const next = resolvePath(href);
      const nextPath = (next.split("#")[0] || next).replace(/\/$/, "") || "/";
      const current = pathname.replace(/\/$/, "") || "/";

      if (next.includes("#") && nextPath === current) return;
      if (nextPath === current && !next.includes("?")) return;

      e.preventDefault();
      e.stopPropagation();
      pendingHref.current = href;
      setLabel(labelForPath(nextPath));
      setPhase("closing");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [phase, pathname]);

  useEffect(() => () => clearFallback(), []);

  return (
    <StairsTransition
      phase={phase}
      label={label}
      onCloseComplete={onCloseComplete}
      onOpenComplete={onOpenComplete}
    />
  );
}
