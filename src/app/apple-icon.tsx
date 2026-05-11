import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "white",
          letterSpacing: "-2px",
          lineHeight: 1,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        SQL
      </div>
      <div
        style={{
          width: 90,
          height: 14,
          borderRadius: 7,
          background: "rgba(45,212,191,0.85)",
          marginTop: 10,
        }}
      />
    </div>,
    { ...size }
  );
}