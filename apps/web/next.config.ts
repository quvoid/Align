import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  env: {
    // Lets the sign-in UI hide the Google button when OAuth keys are absent,
    // instead of calling a provider that isn't registered (which loops back
    // to the sign-in page).
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: String(
      Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    ),
  },
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
  // @branddeals/database ships raw TypeScript (main: ./src/index.ts), so Next
  // has to compile it rather than treat it as a prebuilt dependency.
  transpilePackages: ["@branddeals/database"],
  // Keep Prisma out of the bundler's tracing — it loads a native query engine
  // binary that webpack cannot follow.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
