import { getArticleBySlug, getAllArticles, getTranslatedArticleSlug} from "../../../lib/articles";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Nav from "../../../components/Nav";
import ArticleToc from "../../../components/ArticleToc";
import ShareButtons from "../../../components/ShareButtons";
import LikeButton from "../../../components/LikeButton";
import Comments from "../../../components/Comments";
import { addHeadingIds } from "../../../lib/toc";

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
  let article = await getArticleBySlug(locale, slug);

if (!article) {
  const sourceLocale = locale === "sk" ? "en" : "sk";

  const translatedSlug = getTranslatedArticleSlug(
    sourceLocale,
    slug,
    locale
  );

  if (translatedSlug) {
    redirect(`/${locale}/clanky/${translatedSlug}`);
  }

  notFound();
}

  const backUrl = `/${locale}/clanky`;
  const { html: contentHtml, toc } = addHeadingIds(article.contentHtml);
  const tocLabel = locale === "sk" ? "Obsah" : "Contents";
  const sharedKey = article.translationKey ?? slug;


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 xl:px-10 pt-14 pb-20 xl:grid xl:grid-cols-[200px_minmax(0,42rem)_200px] xl:gap-10">
        {/* Ľavý sticky panel: obsah článku (viditeľný len na širších obrazovkách) */}
        <aside className="hidden xl:block order-1">
          <ArticleToc items={toc} title={tocLabel} />
        </aside>

        <article className="max-w-2xl mx-auto xl:max-w-none xl:mx-0 order-2 min-w-0">
          {/* Meta blok: odkaz späť + kategória, v stĺpci aby sa nezlepili na jeden riadok */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <a
              href={backUrl}
              className="inline-flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-green-400 transition-colors"
            >
              <span aria-hidden="true">←</span>
              {locale === "sk" ? "Späť na články" : "Back to articles"}
            </a>

            <div className="w-fit bg-green-400/10 text-green-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25">
              {article.category}
            </div>
          </div>

          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-5 break-words hyphens-none">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)] pb-8 border-b border-[var(--border-color)] mb-8">
            <span>{article.readTime}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>

          {/* Zdieľacie tlačidlá a lajk pre mobil/tablet, kým sa neobjaví bočný panel na xl */}
          <div className="xl:hidden mb-8 flex items-center gap-4">
            <ShareButtons title={article.title} orientation="horizontal" />
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <LikeButton likeKey={article.translationKey} />
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
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <Comments locale={locale} translationKey={article.translationKey} />

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

        {/* Pravý sticky panel: zdieľanie + lajk (viditeľný len na širších obrazovkách) */}
        <aside className="hidden xl:block order-3">
          <div className="sticky top-24 flex flex-col items-center gap-6">
            <ShareButtons title={article.title} orientation="vertical" />
            <div className="w-8 h-px bg-[var(--border-color)]" />
            <LikeButton likeKey={article.translationKey} />
          </div>
        </aside>
      </div>
    </div>
  );
}
