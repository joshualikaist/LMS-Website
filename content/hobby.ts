export type HobbyProject = {
  slug: string;
  name: string;
  handle: string;
  kicker: string;
  tagline: string;
  summary: string;
  about: string[];
  url: string;
  urlLabel: string;
  instagram: string;
  instagramHandle: string;
  year: string;
  kind: string;
  photoDir: string;
  instagramNote?: string;
  awards?: { when: string; title: string; place: string }[];
};

export const hobbies: HobbyProject[] = [
  {
    slug: "shelton-lms",
    name: "Shelton LMS",
    handle: "shelton_lms",
    kicker: "HOBBY / SHELTON LMS",
    tagline: "Tennis — singles, doubles, and match days.",
    summary: "Match days, training, and court notes.",
    about: [
      "Shelton LMS is my tennis page: singles and doubles around KAIST, with match days and training on Instagram.",
      "Awards are listed here. Day-to-day court notes live on Instagram @shelton_lms.",
    ],
    url: "/hobby/shelton-lms",
    urlLabel: "Open site",
    instagram: "https://www.instagram.com/shelton_lms/",
    instagramHandle: "shelton_lms",
    year: "2026",
    kind: "Tennis",
    photoDir: "/hobby/shelton-lms",
    instagramNote: "Open Instagram for live log",
    awards: [
      {
        when: "2026",
        title: "양구 신인부 단체전 준우승",
        place: "KAIST STROKE",
      },
      {
        when: "2025",
        title: "춘천 은배부 단체전 준우승",
        place: "KAIST STROKE",
      },
    ],
  },
  {
    slug: "babdoduk",
    name: "밥도둑",
    handle: "babdoduk",
    kicker: "HOBBY / BABDODUK",
    tagline: "A food diary — restaurants, spending, and campus 꽁밥.",
    summary:
      "Restaurant maps, a monthly food ledger, event pages, and KAIST 꽁밥 notes.",
    about: [
      "밥도둑 is my food diary: restaurant maps, a monthly spending log, event pages, and a KAIST campus map for leftover-rice (꽁밥) notices.",
      "The site holds the maps and the ledger. Instagram @babdodukms holds the daily photos and recipes.",
    ],
    url: "https://babdoduk.vercel.app",
    urlLabel: "Open site",
    instagram: "https://www.instagram.com/babdodukms/",
    instagramHandle: "babdodukms",
    year: "2026",
    kind: "Food diary",
    photoDir: "/hobby/babdoduk",
  },
];

export function getHobby(slug: string) {
  return hobbies.find((item) => item.slug === slug) ?? null;
}
