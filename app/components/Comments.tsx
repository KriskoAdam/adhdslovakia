"use client";

import Giscus from "@giscus/react";

type Props = {
  locale: "sk" | "en";
};

export default function Comments({ locale }: Props) {
  return (
    <div className="mt-14 pt-10 border-t border-[var(--border-color)]">
      <Giscus
        id="comments"
        repo="KriskoAdam/adhdslovakia"
        repoId="R_kgDOSxLs9g"
        category="Comments"
        categoryId="DIC_kwDOSxLs9s4DGcgO"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang={locale}
      />
    </div>
  );
}