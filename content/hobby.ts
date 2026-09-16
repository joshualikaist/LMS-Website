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
  awards?: { when: string; title: string; place: string }[];
};

export const hobbies: HobbyProject[] = [
  {
    slug: "shelton-lms",
    name: "Shelton LMS",
    handle: "shelton_lms",
    kicker: "HOBBY / SHELTON LMS",
    tagline: "Tennis log under joshualisky.",
    summary:
      "A tennis channel next to the academic portfolio — match days, training, and court notes on Instagram @shelton_lms.",
    about: [
      "Shelton LMS is a tennis page, not a research project: singles and doubles around KAIST, with the public log on Instagram.",
      "If a standalone site ships later, this page can point there instead of the Instagram profile.",
    ],
    url: "https://www.instagram.com/shelton_lms/",
    urlLabel: "Open Instagram",
    instagram: "https://www.instagram.com/shelton_lms/",
    instagramHandle: "shelton_lms",
    year: "2026",
    kind: "Tennis",
    photoDir: "/hobby/shelton-lms",
    awards: [
      {
        when: "2026.03",
        title: "3월 테니스 정산",
        place: "움직임 16,269 Cal · 운동 29시간 · 11일",
      },
      {
        when: "2024 — Present",
        title: "테니스",
        place: "KAIST · 단식 / 복식",
      },
    ],
  },
  {
    slug: "babdoduk",
    name: "밥도둑",
    handle: "babdoduk",
    kicker: "HOBBY / BABDODUK",
    tagline: "Eat-first diary from a KAIST mechanical engineering student.",
    summary:
      "A static site for restaurant maps, a food ledger, events, and campus 꽁밥 notes — plus Instagram @babdodukms.",
    about: [
      "Babdoduk is a Korean food diary: home carousel, monthly spending log, event pages, and a KAIST campus map for leftover-rice (꽁밥) notices.",
      "The public site is on Vercel. Instagram carries the daily photos and recipes.",
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
