"use client";

/**
 * Apple squircle SVG filter — from Skiper UI skiper63
 * https://skiper-ui.com/v1/skiper63
 *
 * Mount once (e.g. in Providers), then apply:
 *   style={{ filter: "url(#SkiperSquiCircleFilterLayout)" }}
 */

export function SquiCircleFilterStatic() {
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
          id="SkiperSquiCircleFilterLayout"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="10"
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

export const SQUIRCLE_FILTER = "url(#SkiperSquiCircleFilterLayout)";
