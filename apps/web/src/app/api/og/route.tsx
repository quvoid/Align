import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "Align by Schbang";
  const subtitle =
    searchParams.get("subtitle") ||
    "Where Verified Creators Meet India's Top Brands";
  const tag = searchParams.get("tag") || "Creator Marketplace";
  const tier = searchParams.get("tier") || "Brand Collaboration";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar with Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              Align
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#FF4D00",
                lineHeight: 1,
              }}
            >
              .
            </div>
            <div
              style={{
                backgroundColor: "rgba(255, 77, 0, 0.15)",
                color: "#FF4D00",
                fontSize: "14px",
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: "9999px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                border: "1px solid rgba(255, 77, 0, 0.3)",
              }}
            >
              by Schbang
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              padding: "8px 20px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {tier}
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#FF4D00",
              fontSize: "20px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "3px",
            }}
          >
            {tag}
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "1000px",
              letterSpacing: "-1.5px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar / Agency Proof */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "32px", color: "rgba(255, 255, 255, 0.8)", fontSize: "16px", fontWeight: 600 }}>
            <span>⚡ 300+ Verified Brands</span>
            <span>🎯 50K+ Creators</span>
            <span>💰 INR Payout Escrow</span>
          </div>

          <div
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            align.schbang.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
