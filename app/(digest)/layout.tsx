import type { Metadata } from "next";
import DigestFooter from "@/components/digest/DigestFooter";
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
      <DigestFooter />
    </>
  );
}
