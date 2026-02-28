import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  const handleContactClick = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollDown = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-24 mt-16">
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

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            type="button"
            onClick={handleContactClick}
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
            className="px-8 py-4 rounded-full font-display font-bold text-lg text-white border-2 border-white/60 transition-all duration-200 hover:bg-white/10 hover:border-white"
          >
            अधिक जाणून घ्या
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
    </section>
  );
}
