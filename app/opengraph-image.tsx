import { ImageResponse } from "next/og";
import { resume } from "@/lib/resume";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background:
          "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 32%), linear-gradient(135deg, #0a0a0a 0%, #111827 100%)",
        color: "#f5f5f5",
        padding: "72px",
        fontFamily: "Geist, sans-serif",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(245,245,245,0.72)",
          }}
        >
          Walter Phillips
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.05em",
          }}
        >
          {resume.headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            lineHeight: 1.4,
            color: "rgba(245,245,245,0.82)",
          }}
        >
          Projects, writing, and background in software, markets, and engineering.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: "rgba(245,245,245,0.72)",
        }}
      >
        <div style={{ display: "flex" }}>{resume.location ?? "San Francisco, CA"}</div>
        <div style={{ display: "flex" }}>walter-phillips.github.io</div>
      </div>
    </div>,
    size,
  );
}
