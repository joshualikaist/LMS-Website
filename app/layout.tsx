import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Inter_Tight } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-tight", display: "swap" });
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
);

const title = "MINSEOK LI — Engineering Field Notes";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: title,
    template: "%s — MINSEOK LI",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Minseok Li", url: "/" }],
  creator: "Minseok Li",
  keywords: [
    "Minseok Li",
    "KAIST",
    "robotics",
    "autonomous systems",
    "UAV navigation",
    "robot learning",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Minseok Li — Engineering Field Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
};

const themeScript = `
  (() => {
    try {
      const saved = localStorage.getItem("theme");
      const theme = saved === "light" || saved === "dark"
        ? saved
        : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = [site.github, site.linkedin, site.instagram, site.googleScholar, site.orcid].filter(Boolean);
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Minseok Li",
    url: siteUrl.toString(),
    jobTitle: "Undergraduate Student Researcher",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Korea Advanced Institute of Science and Technology (KAIST)",
      url: "https://www.kaist.ac.kr/en/",
    },
    knowsAbout: ["Robotics", "Autonomous systems", "UAV navigation", "Robot learning"],
    sameAs,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
