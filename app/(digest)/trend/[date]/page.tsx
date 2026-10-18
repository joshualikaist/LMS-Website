import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DigestView from "@/components/digest/DigestView";
import { getEdition, listEditionDates } from "@/content/digest/load";
import styles from "../page.module.css";

type Params = { date: string };

// Only the dates/slugs generated at build time exist. Anything else is a plain 404 and, importantly,
// never makes the server try to render and cache a page for an arbitrary URL.
export const dynamicParams = false;

export function generateStaticParams() {
  return listEditionDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) return { title: "Trend" };
  return {
    title: `Trend · ${date.replaceAll("-", ".")}`,
    description: `Morning trend edition for ${date.replaceAll("-", ".")}.`,
  };
}

export default async function TrendDatePage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) notFound();

  const dates = listEditionDates();

  return (
    <main className={styles.main}>
      <DigestView edition={edition} dates={dates} />
    </main>
  );
}
