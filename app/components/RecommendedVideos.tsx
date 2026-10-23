"use client";

import { useRef, useState } from "react";
import SiteIcon from "./SiteIcon";
import type { RecommendedVideo } from "../lib/recommended-videos";
import { useVideoLanguageFilter, type VideoLanguageGroup } from "./VideoLanguageFilter";
import styles from "./RecommendedVideos.module.css";

type Locale = "sk" | "en";

function VideoCard({ video, locale, compact = false }: { video: RecommendedVideo; locale: Locale; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const english = locale === "en";

  return (
    <article className={`${styles.card} ${compact ? styles.compactCard : ""}`}>
      <div className={styles.player}>
        {playing ? (
          <iframe
            className={styles.iframe}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0${video.startAt ? `&start=${video.startAt}` : ""}`}
            title={`${video.title[locale]} — ${video.channel}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            className={styles.preview}
            type="button"
            style={{ backgroundImage: `linear-gradient(180deg, transparent 42%, rgba(10, 18, 12, .72)), url(https://i.ytimg.com/vi/${video.id}/hqdefault.jpg)` }}
            onClick={() => setPlaying(true)}
            aria-label={`${english ? "Play" : "Prehrať"}: ${video.title[locale]}`}
          >
            <span className={styles.playButton}><SiteIcon name="play" className={styles.playIcon} /></span>
            <span className={styles.previewLabel}>{english ? "Play on this page" : "Prehrať priamo tu"}</span>
          </button>
        )}
      </div>
      <div className={styles.cardCopy}>
        <span className={styles.topic}>{video.topic[locale]}</span>
        <h3>{video.title[locale]}</h3>
        <p>{video.channel} <span aria-hidden="true">·</span> YouTube</p>
      </div>
    </article>
  );
}

function matchesSelectedLanguages(video: RecommendedVideo, selectedGroups: VideoLanguageGroup[]) {
  return video.language === "en"
    ? selectedGroups.includes("en")
    : selectedGroups.includes("local");
}

function LanguageFilters({ locale }: { locale: Locale }) {
  const english = locale === "en";
  const { selectedGroups, toggleGroup } = useVideoLanguageFilter();
  const groups: { id: VideoLanguageGroup; label: string }[] = [
    { id: "local", label: english ? "Slovak / Czech (incl. dubbing)" : "SK / CZ (vrátane dabingu)" },
    { id: "en", label: "English" },
  ];

  return (
    <div className={styles.filters} role="group" aria-label={english ? "Filter videos by language" : "Filtrovať videá podľa jazyka"}>
      <span className={styles.filterLegend}>{english ? "Language" : "Jazyk"}</span>
      {groups.map((group) => (
        <label key={group.id} className={styles.filterOption}>
          <input
            type="checkbox"
            checked={selectedGroups.includes(group.id)}
            onChange={() => toggleGroup(group.id)}
          />
          <span>{group.label}</span>
        </label>
      ))}
    </div>
  );
}

export function FeaturedVideos({ videos, locale }: { videos: RecommendedVideo[]; locale: Locale }) {
  const english = locale === "en";
  const { selectedGroups } = useVideoLanguageFilter();
  const filteredVideos = videos.filter((video) => matchesSelectedLanguages(video, selectedGroups));

  return (
    <section className={styles.featured} aria-labelledby="featured-videos-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{english ? "WATCH & UNDERSTAND" : "POZRIEŤ A POROZUMIEŤ"}</p>
          <h2 id="featured-videos-title">{english ? "Recommended videos" : "Odporúčané videá"}</h2>
        </div>
        <SiteIcon name="play" className={styles.headingIcon} />
      </div>
      <div className={styles.featuredGrid}>
        {filteredVideos.slice(0, 4).map((video) => <VideoCard key={video.id} video={video} locale={locale} compact />)}
      </div>
      <a className={styles.allVideos} href="#recommended-videos">
        {english ? "See all recommended videos" : "Pozrieť všetky odporúčané videá"}
        <SiteIcon name="arrowRight" className={styles.arrowIcon} />
      </a>
    </section>
  );
}

export function VideoCarousel({ videos, locale }: { videos: RecommendedVideo[]; locale: Locale }) {
  const railRef = useRef<HTMLDivElement>(null);
  const english = locale === "en";
  const { selectedGroups } = useVideoLanguageFilter();
  const filteredVideos = videos.filter((video) => matchesSelectedLanguages(video, selectedGroups));

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.82, 260), behavior: "smooth" });
  };

  return (
    <section id="recommended-videos" className={styles.carouselSection} aria-labelledby="recommended-videos-title">
      <div className={styles.carouselHeading}>
        <div>
          <p className={styles.eyebrow}>{english ? "LEARN AT YOUR OWN PACE" : "OBJAVUJ VLASTNÝM TEMPOM"}</p>
          <h2 id="recommended-videos-title">{english ? "Videos worth your time" : "Videá, ktoré stoja za pozretie"}</h2>
          <p className={styles.sectionIntro}>{english ? "A small collection of thoughtful ADHD explainers and personal perspectives." : "Výber zrozumiteľných vysvetlení ADHD a osobných skúseností."}</p>
        </div>
        <LanguageFilters locale={locale} />
        <div className={styles.controls}>
          <button type="button" onClick={() => scroll(-1)} aria-label={english ? "Scroll videos left" : "Posunúť videá doľava"}>
            <SiteIcon name="arrowLeft" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={english ? "Scroll videos right" : "Posunúť videá doprava"}>
            <SiteIcon name="arrowRight" />
          </button>
        </div>
      </div>
      <div ref={railRef} className={styles.rail} tabIndex={0} aria-label={english ? "Recommended ADHD videos" : "Odporúčané videá o ADHD"}>
        {filteredVideos.map((video) => <VideoCard key={video.id} video={video} locale={locale} />)}
      </div>
      {filteredVideos.length === 0 && <p className={styles.emptyFilter}>{english ? "Choose at least one language to see videos." : "Vyber aspoň jeden jazyk a zobrazia sa videá."}</p>}
      <p className={styles.disclaimer}>
        {english ? "Videos are provided by their original YouTube creators and play here when selected." : "Videá pochádzajú od ich autorov na YouTube a po kliknutí sa prehrajú priamo tu."}
      </p>
    </section>
  );
}
