import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  className?: string;
  title?: string;
  children: React.ReactNode;
};

export default function DigestLink({ className, title, children }: Props) {
  if (site.digestIsExternal) {
    return (
      <a href={site.digest} target="_blank" rel="noreferrer" className={className} title={title} aria-label={title}>
        {children}
      </a>
    );
  }

  return (
    <Link href={site.digest} className={className} title={title} aria-label={title}>
      {children}
    </Link>
  );
}
