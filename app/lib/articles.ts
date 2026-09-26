import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export type Locale = "sk" | "en";

const articlesBaseDir = path.join(process.cwd(), "content/clanky");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  coverImage?: string;
  translationKey: string;
};

export type Article = ArticleMeta & {
  contentHtml: string;
};

function parseArticleDate(dateStr: string): number {
  if (!dateStr) return 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).getTime();
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split(".").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  const fallback = new Date(dateStr).getTime();
  return isNaN(fallback) ? 0 : fallback;
}

function getArticlesDir(locale: Locale) {
  return path.join(articlesBaseDir, locale);
}

export function getAllArticles(locale: Locale): ArticleMeta[] {
  const articlesDir = getArticlesDir(locale);

  if (!fs.existsSync(articlesDir)) return [];

  const files = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      category: data.category ?? "",
      excerpt: data.excerpt ?? "",
      readTime: data.readTime ?? "",
      coverImage: data.coverImage ?? "",
      translationKey: data.translationKey ?? "",
    };
  });

  return articles.sort(
    (a, b) => parseArticleDate(b.date) - parseArticleDate(a.date)
  );
}

export async function getArticleBySlug(
  locale: Locale,
  slug: string
): Promise<Article | null> {
  const articlesDir = getArticlesDir(locale);
  const fullPath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);

  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    excerpt: data.excerpt ?? "",
    readTime: data.readTime ?? "",
    coverImage: data.coverImage ?? "",
    translationKey: data.translationKey ?? "",
    contentHtml,
  };
}

export function getTranslatedArticleSlug(
  locale: Locale,
  slug: string,
  targetLocale: Locale
): string | null {
  const sourceDir = getArticlesDir(locale);
  const sourcePath = path.join(sourceDir, `${slug}.md`);

  if (!fs.existsSync(sourcePath)) return null;

  const sourceContents = fs.readFileSync(sourcePath, "utf8");
  const { data: sourceData } = matter(sourceContents);

  const translationKey = sourceData.translationKey;

  // Ak článok nemá translationKey, skúsime pôvodný slug.
  if (!translationKey) {
    const fallbackPath = path.join(
      getArticlesDir(targetLocale),
      `${slug}.md`
    );

    return fs.existsSync(fallbackPath) ? slug : null;
  }

  const targetDir = getArticlesDir(targetLocale);

  if (!fs.existsSync(targetDir)) return null;

  const targetFiles = fs
    .readdirSync(targetDir)
    .filter((filename) => filename.endsWith(".md"));

  for (const filename of targetFiles) {
    const targetPath = path.join(targetDir, filename);
    const targetContents = fs.readFileSync(targetPath, "utf8");
    const { data: targetData } = matter(targetContents);

    if (targetData.translationKey === translationKey) {
      return filename.replace(/\.md$/, "");
    }
  }

  return null;
}