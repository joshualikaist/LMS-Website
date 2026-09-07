import SiteFooter from "@/components/layout/SiteFooter";
import SiteNav from "@/components/layout/SiteNav";
import SkyShell from "./SkyShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SkyShell>
      <SiteNav />
      {children}
      <SiteFooter />
    </SkyShell>
  );
}
