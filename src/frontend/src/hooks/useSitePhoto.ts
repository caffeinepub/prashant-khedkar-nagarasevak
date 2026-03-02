import { useGetSitePhoto } from "./useQueries";

const FALLBACK_PHOTO = "/assets/uploads/IMG-20260301-WA0009-1.jpg";

/**
 * Returns the site photo from backend (base64 data URL) or falls back to the
 * local upload path.
 */
export function useSitePhoto(photoKey: "navbar" | "hero" | "about"): {
  photoSrc: string;
  isLoading: boolean;
} {
  const { data, isLoading } = useGetSitePhoto(photoKey);

  const photoSrc = data && data.trim().length > 0 ? data : FALLBACK_PHOTO;

  return { photoSrc, isLoading };
}
