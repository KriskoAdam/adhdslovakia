import type { Metadata } from "next";
import TestPageClient from "./TestPageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: "sk" | "en" }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  const title = en ? "ADHD screening test for adults" : "Orientačný ADHD test pre dospelých";
  const description = en
    ? "A free self-reflection screening tool for adult ADHD symptoms. It is not a diagnosis; discuss concerns with a qualified professional."
    : "Bezplatný orientačný sebahodnotiaci test prejavov ADHD u dospelých. Nenahrádza diagnózu; pochybnosti konzultujte s odborníkom.";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/test`, languages: { sk: "/sk/test", en: "/en/test" } },
    openGraph: { title, description, url: `https://www.adhdslovakia.eu/${locale}/test`, locale: locale === "sk" ? "sk_SK" : "en_US", type: "website" },
  };
}

export default function TestPage() {
  return <TestPageClient />;
}
