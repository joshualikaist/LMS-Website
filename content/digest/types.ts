export type DigestLane = "trend" | "economy" | "design" | "tech";

export type DigestItem = {
  id: string;
  lane: DigestLane;
  source: string;
  sourceId: string;
  title: string;
  url: string;
  summary: string | null;
  comment: string | null;
  score: number | null;
  scoreLabel: string | null;
  author: string | null;
  publishedAt: string | null;
  interestHits: string[];
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

export const ITEMS_PER_LANE = 5;

export const LANE_ORDER: DigestLane[] = ["trend", "economy", "design", "tech"];

export const LANE_LABEL: Record<DigestLane, string> = {
  trend: "Trend",
  economy: "Economy",
  design: "Design",
  tech: "Tech",
};
