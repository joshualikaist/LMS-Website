import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const siteUrl = new URL(site.url);
const isProduction = process.env.VERCEL_ENV === "production";

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
  openGraph: {
    type: "profile",
    locale: "en_US",
    siteName: site.name,
    title,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Minseok Li — Engineering Field Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og.jpg"],
  },
  // Lab and preview deployments stay out of search results.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
};

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
      className={`${inter.variable} ${plexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
