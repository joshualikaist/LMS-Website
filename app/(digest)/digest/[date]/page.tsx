import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DigestView from "@/components/digest/DigestView";
import { getEdition, getLatestEdition, listEditionDates } from "@/content/digest/load";
import styles from "../page.module.css";

type Params = { date: string };

export function generateStaticParams() {
  return listEditionDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) return { title: "Digest" };
  return {
    title: `Digest · ${date.replaceAll("-", ".")}`,
    description: `Morning digest for ${date.replaceAll("-", ".")} — trend, tech, and design.`,
  };
}

export default async function DigestDatePage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) notFound();

  const dates = listEditionDates();
  const latest = getLatestEdition();
  const isLatest = latest?.date === edition.date;

  return (
    <main className={`page ${styles.main}`}>
      <DigestView edition={edition} dates={dates} latest={isLatest} />
    </main>
  );
}
