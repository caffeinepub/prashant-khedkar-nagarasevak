import { ChevronDown, Phone, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useSitePhoto } from "../hooks/useSitePhoto";
import ShareModal from "./ShareModal";

// ─── Call Modal ────────────────────────────────────────────────────────────────

function CallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/40"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[130] w-80 rounded-3xl shadow-2xl overflow-hidden"
            style={{ background: "white" }}
            data-ocid="hero.call.modal"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
            >
              <p
                className="font-display font-bold text-base"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                📞 थेट कॉल करा
              </p>
              <button
                type="button"
                onClick={onClose}
                data-ocid="hero.call.close_button"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-muted"
                style={{ color: "oklch(0.50 0.02 243)" }}
                aria-label="बंद करा"
              >
                <X size={16} />
              </button>
            </div>

            {/* Buttons */}
            <div className="p-3 space-y-2">
              <a
                href="tel:+919764151234"
                data-ocid="hero.call.button.1"
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl transition-colors group"
                style={{ background: "oklch(0.65 0.22 43 / 0.08)" }}
                onClick={onClose}
              >
                <div>
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    नगरसेवक
                  </p>
                  <p
                    className="font-body text-sm mt-0.5"
                    style={{ color: "oklch(0.52 0.20 43)" }}
                  >
                    +91 97641 51234
                  </p>
                </div>
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "oklch(0.65 0.22 43)" }}
                >
                  <Phone size={20} className="text-white" />
                </span>
              </a>

              <a
                href="tel:+919529883084"
                data-ocid="hero.call.button.2"
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl transition-colors group"
                style={{ background: "oklch(0.28 0.04 243 / 0.07)" }}
                onClick={onClose}
              >
                <div>
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    कार्यालय
                  </p>
                  <p
                    className="font-body text-sm mt-0.5"
                    style={{ color: "oklch(0.52 0.20 43)" }}
                  >
                    +91 95298 83084
                  </p>
                </div>
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "oklch(0.28 0.04 243)" }}
                >
                  <Phone size={20} className="text-white" />
                </span>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function HeroSection() {
  const [shareOpen, setShareOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const { photoSrc } = useSitePhoto("hero");

  const handleContactClick = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollDown = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-pune-cityscape.dim_1500x700.jpg')`,
        }}
      />

      {/* Dark overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Decorative diagonal stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 opacity-40"
        style={{
          background:
            "linear-gradient(to top right, oklch(0.28 0.04 243) 50%, transparent 50%)",
        }}
      />

      {/* Bhaiya Khedkar Portrait - right side (desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute right-0 bottom-0 z-10 hidden md:block"
        style={{ height: "90%", maxHeight: "700px" }}
      >
        <img
          src={photoSrc}
          alt="नगरसेवक भैय्या खेडकर"
          className="h-full w-auto object-cover object-top"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, black 55%, transparent 100%)",
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-24 mt-16 md:text-left md:pl-16 md:max-w-2xl">
        {/* Mobile portrait - shown only on small screens, above the text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center mb-6 md:hidden"
        >
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-2xl"
              style={{ borderColor: "oklch(0.65 0.22 43)" }}
            >
              <img
                src={photoSrc}
                alt="नगरसेवक भैय्या खेडकर"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = "none";
                  const parent = el.parentElement;
                  if (parent) {
                    parent.style.background = "oklch(0.65 0.22 43 / 0.15)";
                    parent.innerHTML =
                      '<div style="width:100%;height:100%;background:oklch(0.65 0.22 43/0.15);display:flex;align-items:center;justify-content:center;border-radius:9999px;"></div>';
                  }
                }}
              />
            </div>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold text-xs shadow-lg whitespace-nowrap"
              style={{ background: "oklch(0.65 0.22 43)", fontSize: "0.65rem" }}
            >
              नगरसेवक
            </div>
          </div>
        </motion.div>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-body font-semibold mb-6"
          style={{ background: "oklch(0.65 0.22 43 / 0.9)" }}
        >
          <span>🏛️</span>
          <span>प्रभाग क्र. ८, कोल्हापूर महानगरपालिका</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          नगरसेवक प्रशांत
          <br />
          <span style={{ color: "oklch(0.72 0.22 43)" }}>उर्फ भैय्या खेडकर</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-24 h-1 mx-auto mb-6 rounded-full"
          style={{ background: "oklch(0.65 0.22 43)" }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold italic mb-4"
          style={{ color: "oklch(0.90 0.12 43)" }}
        >
          "नाव एक, कामे अनेक..!"
        </motion.p>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="font-body text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto"
        >
          प्रभाग क्र. ८ च्या विकासासाठी अहोरात्र झटणारे समर्पित नगरसेवक
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
        >
          <button
            type="button"
            onClick={handleContactClick}
            data-ocid="hero.primary_button"
            className="group px-8 py-4 rounded-full font-display font-bold text-lg text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            तक्रार नोंदवा
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            data-ocid="hero.secondary_button"
            className="px-8 py-4 rounded-full font-display font-bold text-lg text-white border-2 border-white/60 transition-all duration-200 hover:bg-white/10 hover:border-white"
          >
            अधिक जाणून घ्या
          </button>

          {/* Call button */}
          <button
            type="button"
            onClick={() => setCallOpen(true)}
            data-ocid="hero.call.open_modal_button"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-lg text-white border-2 transition-all duration-200 hover:scale-105"
            style={{
              borderColor: "oklch(0.72 0.22 43)",
              background: "oklch(0.65 0.22 43 / 0.30)",
            }}
          >
            <Phone size={20} />
            कॉल करा
          </button>

          <button
            type="button"
            onClick={handleShare}
            data-ocid="hero.share.button"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-lg text-white border-2 border-white/60 transition-all duration-200 hover:bg-white/10 hover:border-white"
          >
            <Share2 size={20} />
            शेअर करा
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: {
            delay: 1.5,
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors"
        aria-label="खाली स्क्रोल करा"
      >
        <ChevronDown size={36} />
      </motion.button>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </section>
  );
}
