import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetAllGalleryPhotos } from "@/hooks/useQueries";
import { Camera, ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type GalleryItem = {
  src: string;
  caption: string;
  sub: string;
};

const staticGalleryItems: GalleryItem[] = [
  {
    src: "/assets/generated/gallery-road-work.dim_600x400.jpg",
    caption: "रस्ते डांबरीकरण उद्घाटन",
    sub: "प्रभाग क्र. ८ मधील मुख्य रस्त्यांचे उद्घाटन",
  },
  {
    src: "/assets/generated/gallery-tree-planting.dim_600x400.jpg",
    caption: "वृक्षारोपण कार्यक्रम",
    sub: "हरित प्रभाग अभियान अंतर्गत वृक्षारोपण",
  },
  {
    src: "/assets/generated/gallery-citizen-meet.dim_600x400.jpg",
    caption: "नागरिक भेट",
    sub: "नागरिकांच्या समस्या ऐकणे व सोडवणे",
  },
  {
    src: "/assets/generated/gallery-park.dim_600x400.jpg",
    caption: "उद्यान सुशोभीकरण",
    sub: "नवीन उद्यान उद्घाटन सोहळा",
  },
  {
    src: "/assets/generated/gallery-school.dim_600x400.jpg",
    caption: "शाळा दुरुस्ती",
    sub: "महापालिका शाळेचे नूतनीकरण",
  },
  {
    src: "/assets/generated/gallery-footpath.dim_600x400.jpg",
    caption: "दिव्यांग अनुकूल फुटपाथ",
    sub: "दिव्यांगांसाठी विशेष पदपथ निर्मिती",
  },
];

export default function GallerySection() {
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  const { data: backendPhotos = [] } = useGetAllGalleryPhotos();

  const backendItems: GalleryItem[] = backendPhotos.map((photo) => ({
    src: photo.url,
    caption: photo.caption,
    sub: photo.sub,
  }));

  const allItems: GalleryItem[] = [...staticGalleryItems, ...backendItems];

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "oklch(0.65 0.22 43 / 0.12)",
              color: "oklch(0.52 0.20 43)",
            }}
          >
            <Camera size={16} />
            <span>फोटो गॅलरी</span>
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            फोटो गॅलरी
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            विकास कामांचे चित्रमय दस्तऐवज
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item, i) => (
            <motion.div
              key={`${item.caption}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden shadow-md cursor-pointer"
              style={{ aspectRatio: "3/2" }}
              onClick={() => setSelectedImg(item)}
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(44,62,80,0.92) 0%, rgba(44,62,80,0.5) 50%, transparent 100%)",
                }}
              >
                <div className="p-4 text-white">
                  <p className="font-display font-bold text-lg leading-tight">
                    {item.caption}
                  </p>
                  <p className="font-body text-sm text-white/80 mt-1">
                    {item.sub}
                  </p>
                </div>
              </div>
              {/* Always-visible caption strip */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 group-hover:hidden"
                style={{ background: "oklch(0.28 0.04 243 / 0.85)" }}
              >
                <p className="font-display font-bold text-white text-base truncate">
                  {item.caption}
                </p>
              </div>
              {/* Zoom icon */}
              <div
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "oklch(0.65 0.22 43)" }}
              >
                <ZoomIn size={18} color="white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog
        open={!!selectedImg}
        onOpenChange={(open) => !open && setSelectedImg(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-0">
          {selectedImg && (
            <div>
              <img
                src={selectedImg.src}
                alt={selectedImg.caption}
                className="w-full object-cover max-h-[70vh]"
              />
              <div
                className="px-6 py-4"
                style={{ background: "oklch(0.28 0.04 243)" }}
              >
                <p className="font-display font-bold text-xl text-white">
                  {selectedImg.caption}
                </p>
                <p className="font-body text-white/75 text-sm mt-1">
                  {selectedImg.sub}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
