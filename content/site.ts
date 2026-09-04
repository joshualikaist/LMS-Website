const digestUrl = (process.env.NEXT_PUBLIC_DIGEST_URL ?? "/trend").replace(/\/$/, "");

// Single place for identity, links, and values that must be filled in by hand.
// null means "not configured yet" — pages render an explicit placeholder instead.
export const site = {
  name: "MINSEOK LI",
  tagline: "ENGINEERING FIELD NOTES",
  location: "KAIST — DAEJEON, KR",
  description:
    "Personal research archive and engineering portfolio — robotics, autonomous systems, and learning-based UAV navigation at KAIST.",
  email: null as string | null, // e.g. "you@example.com"
  github: "https://github.com/joshualikaist",
  githubHandle: "joshualikaist",
  motarRepo: "https://github.com/joshualikaist/MOTAR",
  linkedin: null as string | null,
  googleScholar: null as string | null,
  orcid: null as string | null,
  cvPdf: null as string | null, // e.g. "/cv/minseok-li-cv.pdf" after adding the file under public/cv/
  digest: digestUrl,
  digestIsExternal: digestUrl.startsWith("http"),
};
