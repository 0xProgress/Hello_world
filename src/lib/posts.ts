import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { createHighlighter, type Highlighter } from 'shiki';
import { unified } from 'unified';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  image?: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  html: string;
  headings: TocHeading[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateFrontmatter(
  filename: string,
  data: Record<string, unknown>
): Omit<PostMeta, 'slug' | 'readingTime'> {
  const relPath = `content/posts/${filename}`;

  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error(
      `[frontmatter error] ${relPath}: missing or invalid required field "title" (expected non-empty string).`
    );
  }

  let dateStr = '';
  if (data.date instanceof Date && !Number.isNaN(data.date.getTime())) {
    dateStr = data.date.toISOString().slice(0, 10);
  } else if (typeof data.date === 'string') {
    dateStr = data.date.trim();
  }

  if (!DATE_RE.test(dateStr)) {
    throw new Error(
      `[frontmatter error] ${relPath}: missing or invalid required field "date" (expected YYYY-MM-DD).`
    );
  }

  if (
    typeof data.description !== 'string' ||
    data.description.trim().length === 0
  ) {
    throw new Error(
      `[frontmatter error] ${relPath}: missing or invalid required field "description" (expected non-empty string).`
    );
  }

  let tags: string[] = [];
  if (data.tags !== undefined) {
    if (
      !Array.isArray(data.tags) ||
      data.tags.some((t) => typeof t !== 'string' || t.trim().length === 0)
    ) {
      throw new Error(
        `[frontmatter error] ${relPath}: invalid field "tags" (expected array of non-empty strings).`
      );
    }
    tags = data.tags.map((t) => t.trim());
  }

  let draft = false;
  if (data.draft !== undefined) {
    if (typeof data.draft !== 'boolean') {
      throw new Error(
        `[frontmatter error] ${relPath}: invalid field "draft" (expected boolean).`
      );
    }
    draft = data.draft;
  }

  let image: string | undefined;
  if (data.image !== undefined && data.image !== null && data.image !== '') {
    if (typeof data.image !== 'string' || !data.image.startsWith('/posts/')) {
      throw new Error(
        `[frontmatter error] ${relPath}: invalid field "image" (expected path starting with "/posts/").`
      );
    }
    image = data.image.trim();
  }

  return {
    title: data.title.trim(),
    date: dateStr,
    description: data.description.trim(),
    tags,
    draft,
    image,
  };
}

function estimateReadingTime(markdown: string): string {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\-\[\]()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const headingRe = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3;
    const id = match[2];
    const innerText = decodeHtmlEntities(
      match[3].replace(/<[^>]+>/g, '').trim()
    );
    if (innerText) {
      headings.push({ id, text: innerText, level });
    }
  }

  return headings;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark-dimmed'],
      langs: [
        'go',
        'python',
        'typescript',
        'tsx',
        'javascript',
        'bash',
        'sh',
        'json',
        'yaml',
        'markdown',
        'css',
        'html',
        'sql',
        'diff',
        'text',
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightSnippet(
  code: string,
  rawLang = 'bash'
): Promise<string> {
  const highlighter = await getShikiHighlighter();
  const loadedLangs = new Set(highlighter.getLoadedLanguages());
  const normalizedLang = rawLang.toLowerCase();
  const lang = loadedLangs.has(normalizedLang) ? normalizedLang : 'text';

  const highlighted = highlighter.codeToHtml(code.trim(), {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
    defaultColor: false,
  });

  return `<div class="code-block-wrapper" data-lang="${normalizedLang}">${highlighted}</div>`;
}

async function highlightCodeBlocks(html: string): Promise<string> {
  const highlighter = await getShikiHighlighter();
  const loadedLangs = new Set(highlighter.getLoadedLanguages());
  const codeBlockRe =
    /<pre><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;

  const matches = Array.from(html.matchAll(codeBlockRe));
  if (matches.length === 0) return html;

  let result = '';
  let lastIndex = 0;

  for (const match of matches) {
    const fullMatch = match[0];
    const rawLang = (match[1] ?? 'text').toLowerCase();
    const encodedCode = match[2] ?? '';
    const startIndex = match.index ?? 0;

    result += html.slice(lastIndex, startIndex);

    const decodedCode = decodeHtmlEntities(encodedCode).replace(/\n$/, '');
    const lang = loadedLangs.has(rawLang) ? rawLang : 'text';

    const highlighted = highlighter.codeToHtml(decodedCode, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      defaultColor: false,
    });

    result += `<div class="code-block-wrapper" data-lang="${rawLang}">${highlighted}</div>`;
    lastIndex = startIndex + fullMatch.length;
  }

  result += html.slice(lastIndex);
  return result;
}

async function renderMarkdown(markdown: string): Promise<{
  html: string;
  headings: TocHeading[];
}> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['heading-anchor'],
        ariaLabel: 'Link to this section',
      },
      content: {
        type: 'text',
        value: '#',
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  const rawHtml = String(file);
  const headings = extractHeadings(rawHtml);
  const html = await highlightCodeBlocks(rawHtml);

  return { html, headings };
}

function readPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();
}

export function getAllPostsMeta(): PostMeta[] {
  const files = readPostFiles();
  const posts: PostMeta[] = [];

  for (const filename of files) {
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = matter(raw);
    const validated = validateFrontmatter(
      filename,
      parsed.data as Record<string, unknown>
    );

    if (validated.draft) {
      continue;
    }

    const slug = filename.replace(/\.md$/, '');
    posts.push({
      slug,
      ...validated,
      readingTime: estimateReadingTime(parsed.content),
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAllPosts(): Promise<Post[]> {
  const files = readPostFiles();
  const posts: Post[] = [];

  for (const filename of files) {
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = matter(raw);
    const validated = validateFrontmatter(
      filename,
      parsed.data as Record<string, unknown>
    );

    if (validated.draft) {
      continue;
    }

    const slug = filename.replace(/\.md$/, '');
    const { html, headings } = await renderMarkdown(parsed.content);

    posts.push({
      slug,
      ...validated,
      readingTime: estimateReadingTime(parsed.content),
      html,
      headings,
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
