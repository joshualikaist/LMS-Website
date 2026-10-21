// Production address; NEXT_PUBLIC_SITE_URL overrides it once a custom domain is set.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshualisky.vercel.app").replace(/\/$/, "");
const digestUrl = (process.env.NEXT_PUBLIC_DIGEST_URL ?? "/trend").replace(/\/$/, "");

// Single place for identity, links, and values that must be filled in by hand.
// null means "not configured yet" — pages render an explicit placeholder instead.
export const site = {
  name: "MINSEOK LI",
  url: siteUrl,
  tagline: "ENGINEERING FIELD NOTES",
  location: "KAIST — DAEJEON, KR",
  description:
    "Personal research archive and engineering portfolio — robotics, autonomous systems, and learning-based UAV navigation at KAIST.",
  email: "joshualiuniv@gmail.com",
  emailKaist: "joshualisky@kaist.ac.kr",
  github: "https://github.com/joshualikaist",
  githubHandle: "joshualikaist",
  motarRepo: "https://github.com/joshualikaist/MOTAR",
  linkedin: "https://www.linkedin.com/in/minseok-li-533b85420",
  instagram: "https://www.instagram.com/joshualisky",
  googleScholar: null as string | null,
  orcid: null as string | null,
  // Downloadable resumes, shown as icons on the CV page. Phone number removed from these copies.
  resumes: [
    {
      lang: "en",
      label: "English",
      aria: "Download English resume (PDF)",
      href: "/cv/Minseok_Li_Resume_EN.pdf",
      filename: "Minseok_Li_Resume.pdf",
      icon: "/icons/resume-en.svg",
    },
    {
      lang: "ko",
      label: "한국어",
      aria: "한국어 이력서 다운로드 (PDF)",
      href: "/cv/Minseok_Li_Resume_KO.pdf",
      filename: "이민석_이력서.pdf",
      icon: "/icons/resume-ko.svg",
    },
  ],
  digest: digestUrl,
  digestIsExternal: digestUrl.startsWith("http"),
};
