import {
  getArticleBySlug,
  getAllArticles,
  getTranslatedArticleSlug,
} from "../../../lib/articles";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Nav from "../../../components/Nav";
import ArticleToc from "../../../components/ArticleToc";
import ShareButtons from "../../../components/ShareButtons";
import LikeButton from "../../../components/LikeButton";
import ViewCounter from "../../../components/ViewCounter";
import Comments from "../../../components/Comments";
import { addHeadingIds } from "../../../lib/toc";
import { getTranslations } from "next-intl/server";

function toIsoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2})[.-](\d{1,2})[.-](\d{4})$/);
  return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : undefined;
}

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
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);

  if (!article) return {};

  const otherLocale = locale === "sk" ? "en" : "sk";
  const translatedSlug = getTranslatedArticleSlug(locale, slug, otherLocale);
  const languageAlternates: Record<string, string> = { [locale]: `/${locale}/clanky/${slug}` };
  if (translatedSlug) languageAlternates[otherLocale] = `/${otherLocale}/clanky/${translatedSlug}`;

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: "ADHD Slovakia", url: `https://www.adhdslovakia.eu/${locale}/o-nas` }],
    alternates: {
      canonical: `/${locale}/clanky/${slug}`,
      languages: { ...languageAlternates, "x-default": `/${locale}/clanky/${slug}` },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: "article",
      url: `https://www.adhdslovakia.eu/${locale}/clanky/${slug}`,
      locale: locale === "sk" ? "sk_SK" : "en_US",
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: article.coverImage ? [article.coverImage] : [] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  const tCategories = await getTranslations("Categories");

  const article = await getArticleBySlug(locale, slug);

  if (!article) {
    const sourceLocale = locale === "sk" ? "en" : "sk";

    const translatedSlug = getTranslatedArticleSlug(
      sourceLocale,
      slug,
      locale,
    );

    if (translatedSlug) {
      redirect(`/${locale}/clanky/${translatedSlug}`);
    }

    notFound();
  }

  const backUrl = `/${locale}/clanky`;
  const { html: contentHtml, toc } = addHeadingIds(article.contentHtml);

  const tocLabel = locale === "sk" ? "Obsah" : "Contents";

  const sharedKey = article.translationKey || slug;
  const articleUrl = `https://www.adhdslovakia.eu/${locale}/clanky/${slug}`;

  const translatedCategory = tCategories(
    article.category as
      | "diagnosis"
      | "myths"
      | "medications"
      | "research"
      | "personal-story"
      | "science"
      | "lifestyle"
      | "interviews"
      | "sources",
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <div className="max-w-7xl mx-auto px-6 xl:px-10 pt-14 pb-20 xl:grid xl:grid-cols-[200px_minmax(0,42rem)_200px] xl:gap-10">
        {/* Ľavý sticky panel: obsah článku */}
        <aside className="hidden xl:block order-1">
          <ArticleToc items={toc} title={tocLabel} />
        </aside>

        <article className="max-w-2xl mx-auto xl:max-w-none xl:mx-0 order-2 min-w-0">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            ...(toIsoDate(article.date) ? { datePublished: toIsoDate(article.date) } : {}),
            inLanguage: locale,
            mainEntityOfPage: `https://www.adhdslovakia.eu/${locale}/clanky/${slug}`,
            author: { "@type": "Organization", name: "ADHD Slovakia", url: `https://www.adhdslovakia.eu/${locale}/o-nas` },
            publisher: { "@type": "Organization", name: "ADHD Slovakia", url: "https://www.adhdslovakia.eu", logo: { "@type": "ImageObject", url: "https://www.adhdslovakia.eu/images/logo.png" } },
            ...(article.coverImage ? { image: article.coverImage.startsWith("http") ? article.coverImage : `https://www.adhdslovakia.eu${article.coverImage}` } : {}),
          }).replace(/</g, "\\u003c") }} />
          {/* Meta blok */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <a
              href={backUrl}
              className="inline-flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-green-400 transition-colors"
            >
              <span aria-hidden="true">←</span>
              {locale === "sk" ? "Späť na články" : "Back to articles"}
            </a>

            <div className="w-fit bg-green-400/10 text-green-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25">
              {translatedCategory}
            </div>
          </div>

          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-5 break-words hyphens-none">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[var(--text-secondary)] pb-8 border-b border-[var(--border-color)] mb-8">
            <span>{article.readTime}</span>
            <span>·</span>
            <time dateTime={toIsoDate(article.date)}>{article.date}</time>
            <span aria-hidden="true">·</span>
            <span>{locale === "sk" ? "Autor: ADHD Slovakia" : "By ADHD Slovakia"}</span>
            <span aria-hidden="true">·</span>
            <ViewCounter slug={sharedKey} locale={locale} />
          </div>

          {/* Zdieľanie + like pre mobil/tablet */}
          <div className="xl:hidden mb-8 flex flex-wrap items-center gap-4">
            <ShareButtons
              title={article.title}
              url={articleUrl}
              orientation="horizontal"
            />

            <div className="w-px h-8 bg-[var(--border-color)]" aria-hidden="true" />

            <LikeButton likeKey={sharedKey} />
          </div>

          {article.coverImage && (
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
              <Image
                src={article.coverImage}
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose-adhd"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <p className="mt-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {locale === "sk"
              ? "Obsah článku má vzdelávací charakter a nenahrádza individuálne posúdenie zdravotníckym odborníkom."
              : "This article is for educational purposes and does not replace an individual assessment by a healthcare professional."}
          </p>

          <Comments
            locale={locale}
            translationKey={article.translationKey}
          />

          <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
            <a
              href={backUrl}
              className="inline-block bg-transparent text-[var(--text-primary)] text-[13px] font-semibold px-5 py-2.5 rounded-md border border-[var(--border-color)] hover:border-green-400/40 transition-colors"
            >
              <span aria-hidden="true">←</span>{" "}
              {locale === "sk" ? "Všetky články" : "All articles"}
            </a>
          </div>
        </article>

        {/* Pravý sticky panel */}
        <aside className="hidden xl:block order-3">
          <div className="sticky top-24 flex flex-col items-center gap-6">
            <ShareButtons
              title={article.title}
              url={articleUrl}
              orientation="vertical"
            />

            <div className="w-8 h-px bg-[var(--border-color)]" />

            <LikeButton likeKey={sharedKey} />
          </div>
        </aside>
      </div>
      </main>
    </div>
  );
}
