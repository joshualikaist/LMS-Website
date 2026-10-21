import type { MetadataRoute } from "next";
import { hobbies } from "@/content/hobby";
import { site } from "@/content/site";

const PAGES = ["/", "/research", "/work/motar", "/research/motar", "/cv", "/hobby"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` })),
    ...hobbies.map((item) => ({ url: `${site.url}/hobby/${item.slug}` })),
  ];
}
