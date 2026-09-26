import { getArticleBySlug, getAllArticles } from "../../../lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Nav from "../../../components/Nav";

type Props = {
  params: Promise<{
    locale: "sk" | "en";
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const locales = ["sk", "en"] as const;

  return locales.flatMap((locale) =>
    getAllArticles(locale).map((article) => ({
      locale,
      slug: article.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);

  if (!article) return {};

  return {
    title: `${article.title} – ADHD Slovakia`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: "article",
      locale: locale === "sk" ? "sk_SK" : "en_US",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);

  if (!article) notFound();

  const backUrl = `/${locale}/clanky`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <article className="max-w-2xl mx-auto px-8 pt-14 pb-20">
        <a
          href={backUrl}
          className="inline-flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-green-400 transition-colors mb-8"
        >
          ← {locale === "sk" ? "Späť na články" : "Back to articles"}
        </a>

        <div className="inline-block bg-green-400/10 text-green-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5">
          {article.category}
        </div>

        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-5 break-words hyphens-none">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)] pb-8 border-b border-[var(--border-color)] mb-8">
          <span>{article.readTime}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>

        {article.coverImage && (
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose-adhd"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <a
            href={backUrl}
            className="inline-block bg-transparent text-[var(--text-primary)] text-[13px] font-semibold px-5 py-2.5 rounded-md border border-[var(--border-color)] hover:border-green-400/40 transition-colors"
          >
            ← {locale === "sk" ? "Všetky články" : "All articles"}
          </a>
        </div>
      </article>
    </div>
  );
}