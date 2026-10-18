import type { MetadataRoute } from "next";
import { hobbies } from "@/content/hobby";
import { publishedNotes } from "@/content/notes";
import { site } from "@/content/site";

const PAGES = ["/", "/research", "/work/motar", "/research/motar", "/work/mesc", "/notes", "/cv", "/hobby"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` })),
    ...publishedNotes().map((note) => ({ url: `${site.url}/notes/${note.slug}` })),
    ...hobbies.map((item) => ({ url: `${site.url}/hobby/${item.slug}` })),
  ];
}
