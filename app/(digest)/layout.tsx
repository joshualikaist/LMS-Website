import type { Metadata } from "next";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNav from "@/components/layout/SiteNav";

export const metadata: Metadata = {
  title: {
    default: "Trend",
    template: "%s — Trend",
  },
  description: "Daily morning snapshot — trend, economy, design, and tech. Updated at 10:00 KST.",
  applicationName: "Trend",
};

export default function DigestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
