"use client";

/**
 * Gooey SVG filter, from Skiper UI skiper64
 * https://skiper-ui.com/v1/skiper64
 *
 * Mount once, then apply: style={{ filter: "url(#SkiperGooeyFilter)" }}
 */

export function SkiperGooeyFilterProvider() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      width={0}
      height={0}
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter
          id="SkiperGooeyFilter"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="4.4"
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

export const GOOEY_FILTER = "url(#SkiperGooeyFilter)";
