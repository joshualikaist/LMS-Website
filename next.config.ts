import type { NextConfig } from "next";

// VERCEL_ENV is "production" only on the live site. Lab/previews also load the Vercel preview toolbar
// (it needs a few extra origins), and everything that is not production publishes a stricter
// Report-Only policy so the cost of the script exception below stays visible.
const isProduction = process.env.VERCEL_ENV === "production";
const isPreview = Boolean(process.env.VERCEL_ENV) && !isProduction;

const VERCEL_TOOLBAR = {
  script: ["https://vercel.live"],
  style: ["'unsafe-inline'", "https://vercel.live"],
  img: ["https://vercel.live", "https://vercel.com"],
  font: ["https://vercel.live", "https://assets.vercel.com"],
  connect: ["https://vercel.live", "wss://*.pusher.com"],
  frame: ["https://vercel.live"],
};
const NONE = { script: [], style: [], img: [], font: [], connect: [], frame: [] };

/**
 * Content-Security-Policy.
 *
 * Every resource the site loads is same-origin: fonts are self-hosted by next/font, and images, video
 * and icons live under /public. Nothing is fetched from third parties at runtime.
 *
 * script-src needs 'unsafe-inline' in the enforced policy: Next.js writes its React Server Components
 * payload into every statically rendered page as inline `self.__next_f.push(...)` scripts, and a
 * per-request nonce would force every page to render dynamically. 'unsafe-eval' is not used anywhere.
 * The strict policy drops the exception and is published as Report-Only outside production.
 */
function contentSecurityPolicy({ strictScripts }: { strictScripts: boolean }) {
  const extra = isPreview ? VERCEL_TOOLBAR : NONE;
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...(strictScripts ? [] : ["'unsafe-inline'"]), ...extra.script],
    "style-src": ["'self'", ...extra.style],
    "img-src": ["'self'", "data:", ...extra.img],
    "font-src": ["'self'", ...extra.font],
    "media-src": ["'self'"],
    "connect-src": ["'self'", ...extra.connect],
    "frame-src": extra.frame.length ? extra.frame : ["'none'"],
    "worker-src": ["'self'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return [
    ...Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`),
    // Deployed sites are https-only (HSTS preload). Skipped locally so http://127.0.0.1 keeps working.
    ...(process.env.VERCEL_ENV ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy({ strictScripts: false }) },
  ...(isProduction
    ? []
    : [{ key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy({ strictScripts: true }) }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy twin of frame-ancestors for browsers that ignore CSP.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(self), camera=(), display-capture=(), geolocation=(), gyroscope=(), " +
      "magnetometer=(), microphone=(), midi=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Strict-Transport-Security is intentionally not set here: Vercel already sends
  // max-age=63072000; includeSubDomains; preload, and that stays as it is.
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: true },
      { source: "/notes", destination: "/", permanent: false },
      { source: "/notes/:slug", destination: "/", permanent: false },
      { source: "/digest", destination: "/trend", permanent: true },
      { source: "/digest/:date", destination: "/trend/:date", permanent: true },
    ];
  },
};

export default nextConfig;
