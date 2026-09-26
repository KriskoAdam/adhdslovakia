export type TocItem = {
  id: string;
  text: string;
  level: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // odstráni diakritiku
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Nájde všetky <h2> a <h3> v HTML obsahu článku, doplní im id atribúty
 * (potrebné pre kotvové odkazy #slug) a vráti zoznam položiek pre TOC.
 */
export function addHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedSlugs = new Map<string, number>();

  const newHtml = html.replace(
    /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr);
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let slug = slugify(text) || `section-${toc.length + 1}`;

      const count = usedSlugs.get(slug) ?? 0;
      usedSlugs.set(slug, count + 1);
      const id = count === 0 ? slug : `${slug}-${count}`;

      toc.push({ id, text, level });

      const cleanAttrs = attrs.replace(/\sid="[^"]*"/, "");
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: newHtml, toc };
}
