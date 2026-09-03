import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function DigestLink({ className, children }: Props) {
  if (site.digestIsExternal) {
    return (
      <a href={site.digest} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={site.digest} className={className}>
      {children}
    </Link>
  );
}
