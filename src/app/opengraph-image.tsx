import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111010",
          color: "#edeae4",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#7FA8FF",
              borderRadius: 14,
              color: "#111010",
              fontSize: 36,
              fontStyle: "italic",
              marginRight: 16,
            }}
          >
            B
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#8f8a82",
            }}
          >
            {site.role} · {site.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 12,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#8f8a82",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            NestJS · TypeScript · APIs · Microservices · Kafka · CQRS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#7FA8FF",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Backend · Systems · Full-stack
        </div>
      </div>
    ),
    { ...size },
  );
}
