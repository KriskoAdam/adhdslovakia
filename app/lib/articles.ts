import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const articlesDir = path.join(process.cwd(), "content/clanky");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
  coverImage?: string;
};

export type Article = ArticleMeta & {
  contentHtml: string;
};

function parseArticleDate(dateStr: string): number {
  if (!dateStr) return 0;

  // Formát YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).getTime();
  }

  // Formát DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  // Formát DD.MM.YYYY
  if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split(".").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  // Fallback - skús natívny parser
  const fallback = new Date(dateStr).getTime();
  return isNaN(fallback) ? 0 : fallback;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
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
    };
  });

  return articles.sort(
    (a, b) => parseArticleDate(b.date) - parseArticleDate(a.date)
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    excerpt: data.excerpt ?? "",
    readTime: data.readTime ?? "",
    coverImage: data.coverImage ?? "",
    contentHtml,
  };
}