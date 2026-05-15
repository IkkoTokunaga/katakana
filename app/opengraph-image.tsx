import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "カタカナ れんしゅう";

export const size = {
  width: 1200,
  height: 630,
};

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
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #eff6ff 0%, #f0f9ff 60%, #e0f2fe 100%)",
          color: "#1d4ed8",
        }}
      >
        <div
          style={{
            fontSize: 320,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          ア
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "#1f2937",
          }}
        >
          カタカナ れんしゅう
        </div>
      </div>
    ),
    { ...size },
  );
}
