"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type VideoLanguageGroup = "local" | "en";

type VideoLanguageFilterValue = {
  selectedGroups: VideoLanguageGroup[];
  toggleGroup: (group: VideoLanguageGroup) => void;
};

const VideoLanguageFilterContext = createContext<VideoLanguageFilterValue | null>(null);

export function VideoLanguageFilterProvider({ children }: { children: ReactNode }) {
  const [selectedGroups, setSelectedGroups] = useState<VideoLanguageGroup[]>(["local", "en"]);
  const value = useMemo<VideoLanguageFilterValue>(() => ({
    selectedGroups,
    toggleGroup: (group) => setSelectedGroups((current) => current.includes(group)
      ? current.filter((item) => item !== group)
      : [...current, group]),
  }), [selectedGroups]);

  return <VideoLanguageFilterContext.Provider value={value}>{children}</VideoLanguageFilterContext.Provider>;
}

export function useVideoLanguageFilter() {
  const value = useContext(VideoLanguageFilterContext);
  if (!value) throw new Error("VideoLanguageFilterProvider is missing.");
  return value;
}
