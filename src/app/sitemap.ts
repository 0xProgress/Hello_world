import { links, projects } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = links.website.replace(/\/$/, "");
  const posts = getAllPostsMeta();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: posts[0]?.date ?? "2026-11-24",
    },
    {
      url: `${siteUrl}/writing`,
      lastModified: posts[0]?.date ?? "2026-11-24",
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: posts[0]?.date ?? "2026-11-24",
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: post.date,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
