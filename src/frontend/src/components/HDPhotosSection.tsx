import { AnimatePresence, motion } from "motion/react";
import { useGetAllGalleryPhotos } from "../hooks/useQueries";

export default function HDPhotosSection() {
  const { data: allPhotos = [], isLoading } = useGetAllGalleryPhotos();
  const hdPhotos = allPhotos.filter((p) => p.sub === "hd");

  // Hide entire section if no HD photos and not loading
  if (!isLoading && hdPhotos.length === 0) return null;

  return (
    <section
      id="hd-photos"
      className="py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.03 243) 0%, oklch(0.18 0.04 243) 100%)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          {/* Decorative pill */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "oklch(0.65 0.22 43 / 0.18)",
              color: "oklch(0.75 0.18 43)",
              border: "1px solid oklch(0.65 0.22 43 / 0.30)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.65 0.22 43)" }}
            />
            <span>विशेष छायाचित्रे</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ color: "oklch(0.95 0.01 43)" }}
          >
            भैय्या खेडकर
            <br />
            <span style={{ color: "oklch(0.65 0.22 43)" }}>विशेष फोटो</span>
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div
              className="h-px w-16"
              style={{ background: "oklch(0.65 0.22 43 / 0.40)" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "oklch(0.65 0.22 43)" }}
            />
            <div
              className="h-px w-16"
              style={{ background: "oklch(0.65 0.22 43 / 0.40)" }}
            />
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "oklch(0.22 0.04 243)" }}
              >
                <div
                  className="h-64 w-full"
                  style={{ background: "oklch(0.25 0.04 243)" }}
                />
                <div className="p-4">
                  <div
                    className="h-3 rounded-full w-3/4"
                    style={{ background: "oklch(0.28 0.04 243)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hdPhotos.map((photo, i) => (
                <motion.div
                  key={String(photo.id)}
                  initial={{ opacity: 0, y: 32, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="rounded-2xl overflow-hidden group cursor-pointer"
                  style={{
                    background: "oklch(0.20 0.04 243)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                    boxShadow: "0 8px 32px oklch(0 0 0 / 0.35)",
                  }}
                >
                  {/* Photo */}
                  <div className="relative overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.parentElement!.style.display = "none";
                      }}
                    />
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, oklch(0.14 0.03 243 / 0.75) 0%, transparent 60%)",
                      }}
                    />
                    {/* HD badge */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold font-body"
                      style={{
                        background: "oklch(0.65 0.22 43)",
                        color: "white",
                        boxShadow: "0 2px 8px oklch(0.65 0.22 43 / 0.50)",
                      }}
                    >
                      HD
                    </div>
                  </div>

                  {/* Caption */}
                  {photo.caption && (
                    <div className="px-4 py-3">
                      <p
                        className="font-body text-sm font-semibold leading-snug"
                        style={{ color: "oklch(0.85 0.02 43)" }}
                      >
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Count indicator */}
        {!isLoading && hdPhotos.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center font-body mt-10 text-sm"
            style={{ color: "oklch(1 0 0 / 0.35)" }}
          >
            एकूण{" "}
            <strong style={{ color: "oklch(0.75 0.18 43)" }}>
              {hdPhotos.length}
            </strong>{" "}
            विशेष फोटो
          </motion.p>
        )}
      </div>
    </section>
  );
}
