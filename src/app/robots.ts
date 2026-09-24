import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { withBase } from "@/lib/withBase";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: withBase("/admin/") },
    sitemap: `${siteUrl}${withBase("/sitemap.xml")}`,
  };
}
