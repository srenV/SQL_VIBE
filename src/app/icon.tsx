import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <div style={{ width: 18, height: 5, borderRadius: 2.5, background: "white" }} />
      <div style={{ width: 18, height: 5, borderRadius: 2.5, background: "rgba(255,255,255,0.72)" }} />
      <div style={{ width: 18, height: 4, borderRadius: 2, background: "rgba(45,212,191,0.85)" }} />
    </div>,
    { ...size }
  );
}
