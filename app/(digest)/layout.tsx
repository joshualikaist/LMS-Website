import type { Metadata } from "next";
import DigestFooter from "@/components/digest/DigestFooter";
import DigestNav from "@/components/digest/DigestNav";

export const metadata: Metadata = {
  title: {
    default: "Morning Digest",
    template: "%s — Morning Digest",
  },
  description: "Daily morning snapshot of trend, tech, and design — frozen at 10:00 KST.",
  applicationName: "Morning Digest",
};

export default function DigestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DigestNav />
      {children}
      <DigestFooter />
    </>
  );
}
