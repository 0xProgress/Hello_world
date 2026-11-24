import { links } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = links.website.replace(/\/$/, "");
  const posts = getAllPostsMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: posts[0]?.date ?? "2026-01-01",
    },
    {
      url: `${siteUrl}/writing`,
      lastModified: posts[0]?.date ?? "2026-01-01",
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...postRoutes];
}
