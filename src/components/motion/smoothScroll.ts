import type Lenis from "lenis";

/**
 * Apple-like ease — smooth acceleration then soft landing.
 * (Avoid expo-out: it covers ~90% of distance instantly and feels like a jump.)
 */
export function appleEase(t: number) {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

const APPLE_SCROLL = {
  duration: 1.8,
  easing: appleEase,
  offset: 0,
} as const;

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

function resolveTop(
  target: string | number | Element,
  offset = 0,
): number | null {
  if (typeof target === "number") return target + offset;
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;
  const y = el.getBoundingClientRect().top + window.scrollY;
  return y + offset;
}

/** Smooth-scroll to a hash, element, or Y position with Apple easing. */
export function smoothScrollTo(
  target: string | number | Element,
  options?: { offset?: number; duration?: number },
) {
  const offset = options?.offset ?? APPLE_SCROLL.offset;
  const top = resolveTop(target, offset);
  if (top === null) return;

  if (lenis) {
    lenis.start();
    // Apple ease only for click-to-section — wheel uses Lenis lerp separately
    lenis.scrollTo(top, {
      duration: options?.duration ?? APPLE_SCROLL.duration,
      easing: APPLE_SCROLL.easing,
      immediate: false,
      lock: false,
      force: true,
    });
    return;
  }

  const start = window.scrollY;
  const dist = top - start;
  const duration = (options?.duration ?? APPLE_SCROLL.duration) * 1000;
  const t0 = performance.now();

  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + dist * appleEase(p));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
