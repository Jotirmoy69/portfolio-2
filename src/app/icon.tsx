import { ImageResponse } from "next/og";

/** Favicon — accent rounded square + italic B (site lockup mark), MW-style. */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111010",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#7FA8FF",
            borderRadius: 7,
            color: "#111010",
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1,
            paddingBottom: 2,
          }}
        >
          B
        </div>
      </div>
    ),
    { ...size },
  );
}
