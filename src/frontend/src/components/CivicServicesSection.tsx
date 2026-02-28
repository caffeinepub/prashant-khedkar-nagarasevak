import { type CivicService, useGetAllCivicServices } from "@/hooks/useQueries";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "कर सेवा": {
    bg: "oklch(0.96 0.05 150)",
    text: "oklch(0.35 0.14 150)",
    border: "oklch(0.78 0.10 150)",
  },
  "पाणी सेवा": {
    bg: "oklch(0.95 0.06 230)",
    text: "oklch(0.32 0.14 230)",
    border: "oklch(0.78 0.10 230)",
  },
  परवाने: {
    bg: "oklch(0.96 0.05 60)",
    text: "oklch(0.40 0.14 60)",
    border: "oklch(0.82 0.10 60)",
  },
  "नागरिक सेवा": {
    bg: "oklch(0.95 0.04 210)",
    text: "oklch(0.35 0.12 210)",
    border: "oklch(0.80 0.08 210)",
  },
  "माहिती अधिकार": {
    bg: "oklch(0.96 0.04 280)",
    text: "oklch(0.38 0.14 280)",
    border: "oklch(0.82 0.08 280)",
  },
  "निविदा व भरती": {
    bg: "oklch(0.96 0.04 43)",
    text: "oklch(0.42 0.14 43)",
    border: "oklch(0.82 0.10 43)",
  },
  आपत्कालीन: {
    bg: "oklch(0.96 0.05 20)",
    text: "oklch(0.40 0.18 20)",
    border: "oklch(0.82 0.12 20)",
  },
};

const DEFAULT_CATEGORY_COLORS = {
  bg: "oklch(0.95 0.04 43)",
  text: "oklch(0.45 0.14 43)",
  border: "oklch(0.80 0.10 43)",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? DEFAULT_CATEGORY_COLORS;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatLastUpdated(date: Date): string {
  return date.toLocaleString("mr-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Card Component ────────────────────────────────────────────────────────────

function CivicServiceCard({
  service,
  index,
}: {
  service: CivicService;
  index: number;
}) {
  const catColors = getCategoryColor(service.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-border flex flex-col overflow-hidden"
      style={{
        boxShadow:
          "0 2px 8px oklch(0.28 0.04 243 / 0.08), 0 1px 2px oklch(0.28 0.04 243 / 0.05)",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 16px 40px oklch(0.28 0.04 243 / 0.16), 0 4px 10px oklch(0.65 0.22 43 / 0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px oklch(0.28 0.04 243 / 0.08), 0 1px 2px oklch(0.28 0.04 243 / 0.05)";
      }}
    >
      {/* Card body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Icon block + category badge row */}
        <div className="flex items-start justify-between gap-3">
          {/* Icon in colored square */}
          <div
            className="flex items-center justify-center w-14 h-14 rounded-xl text-3xl shrink-0"
            style={{
              background: catColors.bg,
              border: `1.5px solid ${catColors.border}`,
            }}
          >
            {service.icon}
          </div>

          {/* Category pill */}
          <span
            className="mt-1 px-2.5 py-1 rounded-full text-xs font-semibold font-body leading-none whitespace-nowrap"
            style={{
              background: catColors.bg,
              color: catColors.text,
              border: `1px solid ${catColors.border}`,
            }}
          >
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display text-lg font-bold leading-snug"
          style={{ color: "oklch(0.22 0.04 243)" }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="font-body text-sm leading-relaxed flex-1"
          style={{ color: "oklch(0.48 0.02 240)" }}
        >
          {service.description}
        </p>
      </div>

      {/* Separator + CTA at bottom */}
      <div className="px-6 pb-6">
        <div
          className="h-px w-full mb-4"
          style={{ background: "oklch(0.92 0.01 240)" }}
        />
        <a
          href={service.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm text-white transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.22 43), oklch(0.58 0.22 36))",
            boxShadow: "0 2px 8px oklch(0.65 0.22 43 / 0.30)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 16px oklch(0.65 0.22 43 / 0.50)";
            (e.currentTarget as HTMLAnchorElement).style.background =
              "linear-gradient(135deg, oklch(0.60 0.22 43), oklch(0.52 0.22 36))";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 2px 8px oklch(0.65 0.22 43 / 0.30)";
            (e.currentTarget as HTMLAnchorElement).style.background =
              "linear-gradient(135deg, oklch(0.65 0.22 43), oklch(0.58 0.22 36))";
          }}
        >
          {service.buttonLabel}
          <span className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-150">
            →
          </span>
        </a>
      </div>
    </motion.div>
  );
}

// ─── Filter Tab ────────────────────────────────────────────────────────────────

function FilterTab({
  label,
  isActive,
  count,
  onClick,
}: {
  label: string;
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm font-semibold transition-all duration-200 whitespace-nowrap"
      style={
        isActive
          ? {
              background: "oklch(0.65 0.22 43)",
              color: "#fff",
              boxShadow: "0 2px 10px oklch(0.65 0.22 43 / 0.35)",
            }
          : {
              background: "oklch(0.97 0.005 43)",
              color: "oklch(0.45 0.06 43)",
              border: "1px solid oklch(0.88 0.04 43)",
            }
      }
    >
      {label}
      <span
        className="text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none"
        style={
          isActive
            ? { background: "oklch(1 0 0 / 0.25)", color: "#fff" }
            : {
                background: "oklch(0.65 0.22 43 / 0.12)",
                color: "oklch(0.52 0.20 43)",
              }
        }
      >
        {count}
      </span>
    </button>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export default function CivicServicesSection() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("सर्व");
  const { data: allServices = [], isLoading } = useGetAllCivicServices();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeServices = useMemo(
    () => allServices.filter((s) => s.isActive),
    [allServices],
  );

  // Derive unique categories from services data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(activeServices.map((s) => s.category)));
    return ["सर्व", ...cats];
  }, [activeServices]);

  // Filtered services based on selected category
  const filteredServices = useMemo(() => {
    if (activeCategory === "सर्व") return activeServices;
    return activeServices.filter((s) => s.category === activeCategory);
  }, [activeServices, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { सर्व: activeServices.length };
    for (const s of activeServices) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, [activeServices]);

  // Reset active filter if current category disappears
  useEffect(() => {
    if (activeCategory !== "सर्व" && !categories.includes(activeCategory)) {
      setActiveCategory("सर्व");
    }
  }, [categories, activeCategory]);

  // Auto-refresh timestamp every 30 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        setLastUpdated(new Date());
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  // Cleanup refresh timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  function handleManualRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    refreshTimeoutRef.current = setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  }

  return (
    <section
      id="civic-services"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "oklch(0.97 0.008 43)" }}
    >
      {/* Subtle background texture dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.65 0.22 43 / 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* ── Section Header ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Pill label */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "oklch(0.65 0.22 43 / 0.12)",
              color: "oklch(0.52 0.20 43)",
              border: "1px solid oklch(0.65 0.22 43 / 0.25)",
            }}
          >
            <span>🏛️</span>
            <span>कोल्हापूर महानगरपालिका सेवा</span>
          </div>

          {/* Heading + service count */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: "oklch(0.22 0.04 243)" }}
            >
              नागरी सेवा
            </h2>
            {!isLoading && activeServices.length > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="self-center px-3 py-1.5 rounded-full font-body text-sm font-bold"
                style={{
                  background: "oklch(0.65 0.22 43)",
                  color: "#fff",
                }}
              >
                {activeServices.length} सेवा उपलब्ध
              </motion.span>
            )}
          </div>

          <div className="section-divider" />

          <p
            className="font-body text-lg max-w-xl mx-auto"
            style={{ color: "oklch(0.48 0.03 240)" }}
          >
            महापालिकेच्या सेवा तुमच्या दाराशी
          </p>
        </motion.div>

        {/* ── Category Filter Tabs ─────────────────────── */}
        {!isLoading && activeServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <FilterTab
                key={cat}
                label={cat}
                isActive={activeCategory === cat}
                count={categoryCounts[cat] ?? 0}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </motion.div>
        )}

        {/* ── Loading State ─────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2
              className="animate-spin"
              size={36}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
            <p
              className="font-body text-base"
              style={{ color: "oklch(0.50 0.03 243)" }}
            >
              माहिती लोड होत आहे...
            </p>
          </div>
        )}

        {/* ── Empty State ───────────────────────────────── */}
        {!isLoading && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl p-16 text-center border mx-auto max-w-md"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(1 0 0 / 0.7)",
            }}
          >
            <span className="text-5xl block mb-4">🏛️</span>
            <p
              className="font-body text-base"
              style={{ color: "oklch(0.28 0.04 243 / 0.60)" }}
            >
              {activeCategory === "सर्व"
                ? "सध्या कोणतीही सेवा उपलब्ध नाही"
                : `"${activeCategory}" श्रेणीत सध्या कोणतीही सेवा नाही`}
            </p>
          </motion.div>
        )}

        {/* ── Cards Grid ────────────────────────────────── */}
        {!isLoading && filteredServices.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, i) => (
                <CivicServiceCard
                  key={String(service.id)}
                  service={service}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Footer note + last updated ─────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-body text-muted-foreground text-sm"
          >
            सर्व सेवा थेट{" "}
            <a
              href="https://web.kolhapurcorporation.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              web.kolhapurcorporation.gov.in
            </a>{" "}
            वरून उपलब्ध · KMC हेल्पलाइन:{" "}
            <a
              href="tel:02312540291"
              className="font-semibold hover:underline"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              0231-2540291
            </a>
          </motion.p>

          {/* Last updated + manual refresh button */}
          <div className="flex items-center gap-2 shrink-0">
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.60 0.02 240)" }}
            >
              KMC पोर्टल अपडेट: {formatLastUpdated(lastUpdated)}
            </p>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="KMC पोर्टल अपडेट करा"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-xs font-semibold transition-all duration-200 disabled:opacity-60"
              style={{
                background: "oklch(0.65 0.22 43 / 0.08)",
                color: "oklch(0.52 0.20 43)",
                border: "1px solid oklch(0.65 0.22 43 / 0.25)",
              }}
            >
              <RefreshCw
                size={11}
                className={isRefreshing ? "animate-spin" : ""}
              />
              {isRefreshing ? "अपडेट..." : "अपडेट"}
            </button>
          </div>
        </div>

        {/* ── KMC Portal Direct Link ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <a
            href="https://web.kolhapurcorporation.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              border: "2px solid oklch(0.65 0.22 43)",
              color: "oklch(0.52 0.20 43)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "oklch(0.65 0.22 43 / 0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            <ExternalLink size={15} />
            KMC पोर्टल थेट उघडा
          </a>
        </motion.div>
      </div>
    </section>
  );
}
