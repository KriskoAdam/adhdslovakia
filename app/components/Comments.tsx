"use client";

import Giscus from "@giscus/react";

type Props = {
  locale: "sk" | "en";
  translationKey: string;
};

export default function Comments({
  locale,
  translationKey,
}: Props) {
  return (
    <div className="mt-14 pt-10 border-t border-[var(--border-color)]">
      <Giscus
        id={`comments-${translationKey}`}
        repo="KriskoAdam/adhdslovakia"
        repoId="R_kgDOSxLs9g"
        category="Comments"
        categoryId="DIC_kwDOSxLs9s4DGcgO"
        mapping="specific"
        term={translationKey}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="en"
      />
    </div>
  );
}