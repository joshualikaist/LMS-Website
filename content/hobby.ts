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
};

export const hobbies: HobbyProject[] = [
  {
    slug: "shelton-lms",
    name: "Shelton LMS",
    handle: "shelton_lms",
    kicker: "HOBBY / SHELTON LMS",
    tagline: "A personal channel under joshualisky.",
    summary:
      "Lifestyle and personal posts connected to Instagram @joshualisky — open the Shelton LMS profile from here.",
    about: [
      "Shelton LMS sits next to the academic portfolio as a personal brand, not a research project.",
      "The live destination is the Instagram profile. If a standalone site ships later, this page can point there instead.",
    ],
    url: "https://www.instagram.com/shelton_lms/",
    urlLabel: "Open Instagram",
    instagram: "https://www.instagram.com/shelton_lms/",
    instagramHandle: "shelton_lms",
    year: "2026",
    kind: "Personal brand",
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
  },
];

export function getHobby(slug: string) {
  return hobbies.find((item) => item.slug === slug) ?? null;
}
