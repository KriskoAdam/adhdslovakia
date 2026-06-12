"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6150590591009223"
      data-ad-slot="1842385658"   data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}