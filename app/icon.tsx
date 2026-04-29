import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E2E8F0", // Light gray color
      }}
    >
      {/* Solid Rocket Silhouette SVG for 32x32 Favicon */}
      <svg
        viewBox="0 0 100 100"
        width="26"
        height="26"
        fill="currentColor" // Use foreground color
      >
        <path d="M50 5C40 25 35 45 35 65C35 75 40 85 45 90C47 92 48 93 50 93C52 93 53 92 55 90C60 85 65 75 65 65C65 45 60 25 50 5Z" />
        <path
          d="M30 60C20 70 15 80 15 90H25C25 85 28 75 32 67L30 60Z"
          opacity="0.8"
        />
        <path
          d="M70 60C80 70 85 80 85 90H75C75 85 72 75 68 67L70 60Z"
          opacity="0.8"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
