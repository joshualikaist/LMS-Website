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
  awards?: { when: string; title: string; titleEn?: string; place: string }[];
  repo?: string;
  screens?: { title: string; caption: string; image: string }[];
  howItWorks?: { text: string; steps: string[]; image?: string; imageAlt?: string };
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
    awards: [
      {
        when: "2026",
        title: "양구 신인부 단체전 준우승",
        titleEn: "Yanggu Rookie Division Team Runner-up",
        place: "KAIST STROKE",
      },
      {
        when: "2025",
        title: "춘천 은배부 단체전 준우승",
        titleEn: "Chuncheon Silver Cup Team Runner-up",
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
    repo: "https://github.com/joshualikaist/Babdoduk",
    screens: [
      {
        title: "홈",
        caption: "오늘의 꽁밥 달력과 학식 한 줄로 시작해요.",
        image: "/hobby/babdoduk/screen-home.jpg",
      },
      {
        title: "오늘의 꽁밥",
        caption: "지금 참여할 수 있는 무료 음식 일정과 이번 주 학식. 🎁 경품 행사는 따로 모아 봐요.",
        image: "/hobby/babdoduk/screen-ggongbab.jpg",
      },
      {
        title: "밥도둑 매거진",
        caption: "음식 이야기와 '오늘 뭐 먹지?' 메뉴 고르기.",
        image: "/hobby/babdoduk/screen-magazine.jpg",
      },
      {
        title: "소식·이벤트",
        caption: "먹방 월드컵을 시작 화면 그대로 카드에 보여 주고, 지난 활동은 기록으로 남아요.",
        image: "/hobby/babdoduk/screen-event.jpg",
      },
      {
        title: "먹방 월드컵",
        caption:
          "\"오늘의 32강, 뭐가 나올까?\" 카테고리를 고르고 시작하면 700개가 넘는 메뉴 중 32개가 맞붙어요. 8강부터는 검은 화면 \"진출!\", 결승은 두 카드가 부딪혀요.",
        image: "/hobby/babdoduk/screen-worldcup.jpg",
      },
      {
        title: "역사",
        caption: "밥도둑이 걸어온 길.",
        image: "/hobby/babdoduk/screen-history.jpg",
      },
    ],
    howItWorks: {
      text: "빌드 단계가 없는 정적 사이트예요. 브라우저는 같은 사이트의 JSON만 읽어요.",
      steps: ["학식·공지·메일", "GitHub Actions (수집·검증)", "정적 JSON", "페이지", "Vercel"],
      image: "/hobby/babdoduk/screen-home-phone.jpg",
      imageAlt: "휴대폰에서 본 밥도둑 홈",
    },
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
