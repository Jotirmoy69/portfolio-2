import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 148,
            height: 148,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#7FA8FF",
            borderRadius: 36,
            color: "#111010",
            fontSize: 108,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1,
            paddingBottom: 8,
          }}
        >
          B
        </div>
      </div>
    ),
    { ...size },
  );
}
