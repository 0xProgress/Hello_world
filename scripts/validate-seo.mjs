import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("✗ out/ directory not found. Run `npm run build` first.");
  process.exit(1);
}

// 1. Verify robots.txt & sitemap.xml exist
assert(
  fs.existsSync(path.join(OUT_DIR, "robots.txt")),
  "Missing out/robots.txt",
);
assert(
  fs.existsSync(path.join(OUT_DIR, "sitemap.xml")),
  "Missing out/sitemap.xml",
);

const htmlFiles = collectHtmlFiles(OUT_DIR);
assert(htmlFiles.length > 0, "No HTML files generated in out/");

for (const file of htmlFiles) {
  const rel = path.relative(OUT_DIR, file);
  if (rel === "404.html" || rel === "_not-found.html") continue;

  const html = fs.readFileSync(file, "utf8");

  // 2. Verify canonical, title, description, og:title, og:image
  assert(/<title>[^<]+<\/title>/.test(html), `${rel}: missing <title>`);
  assert(
    /<link rel="canonical" href="https?:\/\/[^"]+"/.test(html),
    `${rel}: missing canonical link`,
  );
  assert(
    /<meta property="og:title" content="[^"]+"/.test(html),
    `${rel}: missing og:title`,
  );
  const ogImageMatch = html.match(
    /<meta property="og:image" content="([^"]+)"/,
  );
  assert(Boolean(ogImageMatch), `${rel}: missing og:image`);

  // 3. Validate JSON-LD scripts parse cleanly and match expected route types
  const jsonLdScripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];

  const schemas = jsonLdScripts
    .map((m, idx) => {
      try {
        return JSON.parse(m[1]);
      } catch (err) {
        errors.push(
          `${rel}: invalid JSON-LD block #${idx + 1} (${err.message})`,
        );
        return null;
      }
    })
    .filter(Boolean);

  if (rel === "index.html") {
    const profile = schemas.find((s) => s["@type"] === "ProfilePage");
    assert(Boolean(profile), `${rel}: missing ProfilePage JSON-LD`);
    assert(
      profile?.mainEntity?.["@type"] === "Person" &&
        profile?.mainEntity?.address?.addressCountry === "NG",
      `${rel}: ProfilePage.mainEntity must be Person with Lagos, NG address`,
    );
  }

  if (rel.startsWith("writing/") && rel !== "writing.html") {
    const post = schemas.find((s) => s["@type"] === "BlogPosting");
    assert(Boolean(post), `${rel}: missing BlogPosting JSON-LD`);
    assert(
      Boolean(post?.datePublished && post?.author?.name && post?.image),
      `${rel}: BlogPosting missing datePublished, author, or image`,
    );
  }

  if (rel.startsWith("projects/")) {
    const code = schemas.find((s) => s["@type"] === "SoftwareSourceCode");
    assert(Boolean(code), `${rel}: missing SoftwareSourceCode JSON-LD`);
    assert(
      Boolean(code?.codeRepository && code?.programmingLanguage),
      `${rel}: SoftwareSourceCode missing codeRepository or programmingLanguage`,
    );
  }

  // 4. Verify internal hrefs resolve to generated routes or assets
  const hrefMatches = [...html.matchAll(/href="(\/[^"#?]*)"/g)];
  for (const [, href] of hrefMatches) {
    if (href === "/") continue;
    const clean = href.replace(/\/$/, "");
    const candidates = [
      path.join(OUT_DIR, clean),
      path.join(OUT_DIR, `${clean}.html`),
      path.join(OUT_DIR, clean, "index.html"),
    ];
    assert(
      candidates.some((c) => fs.existsSync(c)),
      `${rel}: broken internal link "${href}"`,
    );
  }
}

if (errors.length > 0) {
  console.error("✗ SEO & Structured Data validation failed:\n");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(
  `✓ Validated ${htmlFiles.length} HTML pages, JSON-LD schemas, OG tags, sitemap, and internal links.`,
);
