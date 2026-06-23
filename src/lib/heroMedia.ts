import { PLACEHOLDER } from "@/lib/placeholders";

function envTrim(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v : null;
}

export type HeroMedia =
  | { kind: "video"; src: string; poster: string }
  | { kind: "image"; src: string };

/** Homepage hero: video when `NEXT_PUBLIC_HERO_VIDEO_SRC` is set, else photo. */
export function getHeroMedia(): HeroMedia {
  const video = envTrim("NEXT_PUBLIC_HERO_VIDEO_SRC");
  if (video) {
    return {
      kind: "video",
      src: video,
      poster: envTrim("NEXT_PUBLIC_HERO_VIDEO_POSTER") ?? PLACEHOLDER.hero,
    };
  }
  return { kind: "image", src: PLACEHOLDER.hero };
}
