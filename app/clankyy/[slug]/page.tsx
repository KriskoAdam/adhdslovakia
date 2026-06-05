import { getArticleBySlug, getAllArticles } from "../../lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} – ADHD Slovakia`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede6]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
        <a href="/" className="font-display text-xl font-extrabold tracking-tight">
          ADHD<span className="text-green-400">.</span>Slovakia
        </a>
        <div className="hidden md:flex gap-7 text-[13px] font-medium text-[#888]">
          {[
            { label: "Domov", href: "/" },
            { label: "Články", href: "/clanky" },
            { label: "O nás", href: "/o-nas" },
            { label: "Kontakt", href: "/kontakt" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="hover:text-[#f0ede6] transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <article className="max-w-2xl mx-auto px-8 pt-14 pb-20">
        <a
          href="/clanky"
          className="inline-flex items-center gap-2 text-[12px] text-[#555] hover:text-green-400 transition-colors mb-8"
        >
          ← Späť na články
        </a>

        <div className="inline-block bg-green-400/10 text-green-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded border border-green-400/25 mb-5">
          {article.category}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-5">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-[12px] text-[#444] pb-8 border-b border-[#1e1e1e] mb-8">
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
    />
  </div>
)}

        {/* AD SLOT */}
        <div className="bg-[#0f0f0f] border border-dashed border-[#2a2a2a] rounded-lg h-16 flex items-center justify-center text-[11px] text-[#333] tracking-widest uppercase mb-8">
          {/* Tu vložíš Google AdSense kód */}
          Reklamný priestor
        </div>

        {/* ARTICLE CONTENT */}
        <div
          className="prose-adhd"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* AD SLOT bottom */}
        <div className="bg-[#0f0f0f] border border-dashed border-[#2a2a2a] rounded-lg h-16 flex items-center justify-center text-[11px] text-[#333] tracking-widest uppercase mt-12">
          Reklamný priestor
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e1e1e]">
          <a
            href="/clanky"
            className="inline-block bg-transparent text-[#f0ede6] text-[13px] font-semibold px-5 py-2.5 rounded-md border border-[#2a2a2a] hover:border-[#444] transition-colors"
          >
            ← Všetky články
          </a>
        </div>
      </article>
    </div>
  );
}