import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { getResources } from "@/lib/content";
import { withBase } from "@/lib/withBase";

export const dynamic = "force-static";

/** Public pages only; /admin/ is deliberately left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/bridge/", "/resources/", "/quick-links/"];
  const resources = getResources().map((r) => `/resources/${r.slug}/`);
  return [...pages, ...resources].map((path) => ({
    url: `${siteUrl}${withBase(path)}`,
    changeFrequency: "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/resources/") && path !== "/resources/"
          ? 0.6
          : 0.8,
  }));
}
