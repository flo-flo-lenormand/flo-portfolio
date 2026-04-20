import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content/articles");

// Slugs must be plain kebab/snake case. Anything with "..", slashes,
// nulls, or other path separators is rejected before we touch the
// filesystem — prevents directory traversal attacks like
// /writing/..%2F..%2Fetc%2Fpasswd.
const SLUG_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/;

function assertSafeSlug(slug: string): void {
  if (typeof slug !== "string" || !SLUG_REGEX.test(slug)) {
    throw new Error(`Invalid slug: ${String(slug).slice(0, 64)}`);
  }
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  external?: string;
  published?: boolean;
  content?: string;
}

export function getAllArticles(): Article[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description || "",
        external: data.external || undefined,
        published: data.published !== false,
      };
    })
    .filter((article) => article.published !== false);

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(
  slug: string
): Promise<Article & { content: string }> {
  // 1) Reject anything that isn't a plain kebab/snake-case identifier.
  assertSafeSlug(slug);

  const fullPath = path.join(articlesDirectory, `${slug}.md`);

  // 2) Defense-in-depth: confirm the resolved path is still inside the
  //    articles directory. Guards against any character sequence that
  //    slips past the regex on unusual filesystems.
  const resolvedFull = path.resolve(fullPath);
  const resolvedBase = path.resolve(articlesDirectory);
  if (
    resolvedFull !== resolvedBase &&
    !resolvedFull.startsWith(resolvedBase + path.sep)
  ) {
    throw new Error(`Refused path outside articles directory: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description || "",
    external: data.external || undefined,
    published: data.published !== false,
    content: contentHtml,
  };
}
