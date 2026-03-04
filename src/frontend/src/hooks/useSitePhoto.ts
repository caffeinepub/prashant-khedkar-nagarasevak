import { useGetSitePhoto } from "./useQueries";

/**
 * Returns the site photo from backend (base64 data URL).
 * Returns empty string when no photo has been set — components must handle
 * this gracefully with a placeholder instead of a broken image.
 */
export function useSitePhoto(photoKey: "navbar" | "hero" | "about"): {
  photoSrc: string;
  isLoading: boolean;
} {
  const { data, isLoading } = useGetSitePhoto(photoKey);

  // Return empty string when no photo set — never fall back to local file paths
  // that may not exist; components render their own placeholders
  const photoSrc = data && data.trim().length > 0 ? data : "";

  return { photoSrc, isLoading };
}
