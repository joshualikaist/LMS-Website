export type DigestLane = "trend" | "tech" | "design";

export type DigestItem = {
  id: string;
  lane: DigestLane;
  source: string;
  sourceId: string;
  title: string;
  url: string;
  summary: string | null;
  score: number | null;
  scoreLabel: string | null;
  author: string | null;
  publishedAt: string | null;
};

export type DigestFailure = {
  sourceId: string;
  error: string;
};

export type DigestEdition = {
  date: string;
  fetchedAt: string;
  timezone: "Asia/Seoul";
  items: DigestItem[];
  failures: DigestFailure[];
};

export const LANE_ORDER: DigestLane[] = ["trend", "tech", "design"];

export const LANE_LABEL: Record<DigestLane, string> = {
  trend: "Trend",
  tech: "Tech",
  design: "Design",
};
