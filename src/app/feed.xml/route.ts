import { links, person } from "@/content/profile";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPostsMeta();
  const siteUrl = links.website.replace(/\/$/, "");

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/writing/${post.slug}`;
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(postUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("\n");

  const lastBuildDate =
    posts.length > 0
      ? new Date(`${posts[0].date}T00:00:00Z`).toUTCString()
      : new Date("2026-01-01T00:00:00Z").toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(`${person.handle} — Writing`)}</title>
<link>${escapeXml(`${siteUrl}/writing`)}</link>
<description>${escapeXml(person.metaDescription)}</description>
<language>en-us</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
${itemsXml}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
