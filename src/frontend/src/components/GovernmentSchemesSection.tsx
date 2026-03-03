import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Scheme } from "../backend.d";
import {
  useAddScheme,
  useGetAllSchemes,
  useGetLastSyncTime,
  useSyncGovtSchemes,
} from "../hooks/useQueries";

const KMC_NEW_SCHEMES_SEEDED_KEY = "kmc_new_schemes_seeded_v2";

const NEW_GOVT_SCHEMES = [
  {
    title: "आयुष्मान भारत - पीएम जन आरोग्य",
    description: "गरीब व असुरक्षित कुटुंबांना वार्षिक ५ लाख रुपयांपर्यंत मोफत आरोग्य सेवा.",
    status: "active",
    category: "आरोग्य",
    benefit: "५ लाख रुपये आरोग्य विमा",
    eligibility: "BPL व SECC नोंदणीकृत कुटुंबे",
  },
  {
    title: "PM किसान सन्मान निधी",
    description: "लहान व सीमांत शेतकऱ्यांना वार्षिक ₹६,०००/- रुपयांची थेट आर्थिक मदत.",
    status: "active",
    category: "शेती",
    benefit: "वार्षिक ₹६,०००/-",
    eligibility: "लहान व सीमांत शेतकरी",
  },
  {
    title: "सुकन्या समृद्धी योजना",
    description: "मुलींच्या भविष्यासाठी बचत योजना. उच्च व्याजदर व कर सूट.",
    status: "active",
    category: "महिला व बाल विकास",
    benefit: "उच्च व्याज + कर सूट",
    eligibility: "१० वर्षांखालील मुली",
  },
  {
    title: "पीएम मुद्रा योजना",
    description: "लघु उद्योजकांना तारणमुक्त कर्ज देणारी योजना.",
    status: "active",
    category: "उद्योग",
    benefit: "१० लाखांपर्यंत कर्ज",
    eligibility: "सूक्ष्म व लघु उद्योजक",
  },
  {
    title: "महाराष्ट्र लाडकी बहीण योजना",
    description: "महाराष्ट्रातील पात्र महिलांना दरमहा आर्थिक सहाय्य.",
    status: "active",
    category: "महिला कल्याण",
    benefit: "मासिक आर्थिक अनुदान",
    eligibility: "२१-६५ वयोगटातील महिला",
  },
  {
    title: "राष्ट्रीय शहरी उपजीविका अभियान (NULM)",
    description: "शहरी गरिबांना स्वयंरोजगार व कौशल्य विकासाच्या संधी.",
    status: "active",
    category: "रोजगार",
    benefit: "कौशल्य प्रशिक्षण व कर्ज",
    eligibility: "शहरी गरीब व बेरोजगार",
  },
];

type FilterTab = "all" | "active" | "past" | "upcoming";

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "सर्व" },
  { value: "active", label: "सद्यस्थिती" },
  { value: "past", label: "भूतकाळ" },
  { value: "upcoming", label: "येणाऱ्या" },
];

const KMC_BASE = "https://web.kolhapurcorporation.gov.in";

const quickLinks = [
  {
    label: "लोकसेवा हक्क अधिनियम",
    href: `${KMC_BASE}/mahaPublicService`,
  },
  {
    label: "शासन निर्णय / परिपत्रके",
    href: `${KMC_BASE}/paripatrake`,
  },
  {
    label: "जाहीर सूचना",
    href: `${KMC_BASE}/circular`,
  },
  {
    label: "KMC संपर्क",
    href: `${KMC_BASE}/contact`,
  },
];

function getKmcLinkForCategory(category: string): string {
  if (
    category === "गृहनिर्माण" ||
    category === "स्वच्छता" ||
    category === "पाणी व स्वच्छता"
  ) {
    if (category === "पाणी व स्वच्छता") {
      return "https://wts.kolhapurcorporation.gov.in/InternalStatement/Index";
    }
    return `${KMC_BASE}/citizen`;
  }
  if (category === "कर सेवा" || category === "घरफाळा") {
    return "https://propertytax.kolhapurcorporation.gov.in/KMCOnlinePG/NEWPropSearchOnly.aspx";
  }
  return KMC_BASE;
}

function getStatusStyle(status: string): {
  bg: string;
  color: string;
  label: string;
  icon: React.ReactNode;
} {
  if (status === "active") {
    return {
      bg: "oklch(0.60 0.18 150 / 0.14)",
      color: "oklch(0.38 0.16 150)",
      label: "सद्यस्थिती",
      icon: <CheckCircle2 size={12} />,
    };
  }
  if (status === "past") {
    return {
      bg: "oklch(0.55 0.03 243 / 0.12)",
      color: "oklch(0.42 0.03 243)",
      label: "भूतकाळ",
      icon: <Clock size={12} />,
    };
  }
  return {
    bg: "oklch(0.55 0.18 260 / 0.14)",
    color: "oklch(0.40 0.16 260)",
    label: "येणाऱ्या",
    icon: <Sparkles size={12} />,
  };
}

function formatSyncTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("mr-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 30 minutes in nanoseconds
const THIRTY_MINUTES_NS = BigInt(30 * 60 * 1_000_000_000);

function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  const statusStyle = getStatusStyle(scheme.status);
  const schemeAny = scheme as unknown as { source?: string };
  const isGovt = (schemeAny.source ?? "manual") === "govt";
  const kmcLink = getKmcLinkForCategory(scheme.category);
  // Show "नवीन" badge for schemes added after the first 3 (auto-seeded have id > 3)
  const isNew = scheme.id > 3n;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative"
    >
      {/* "नवीन" badge overlay for recently auto-added schemes */}
      {isNew && (
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold font-body"
          style={{
            background: "oklch(0.60 0.18 150)",
            color: "white",
            boxShadow: "0 2px 8px oklch(0.60 0.18 150 / 0.40)",
          }}
        >
          ✨ नवीन
        </div>
      )}

      {/* Status accent line */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            scheme.status === "active"
              ? "oklch(0.60 0.18 150)"
              : scheme.status === "past"
                ? "oklch(0.55 0.03 243)"
                : "oklch(0.55 0.18 260)",
        }}
      />

      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold font-body"
            style={{
              background: "oklch(0.65 0.22 43 / 0.10)",
              color: "oklch(0.52 0.20 43)",
            }}
          >
            {scheme.category}
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body inline-flex items-center gap-1"
            style={{
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {statusStyle.icon}
            {statusStyle.label}
          </span>
          {/* Source badge */}
          {isGovt ? (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold font-body inline-flex items-center gap-1"
              style={{
                background: "oklch(0.65 0.22 43 / 0.15)",
                color: "oklch(0.45 0.22 43)",
                border: "1px solid oklch(0.65 0.22 43 / 0.30)",
              }}
            >
              🇮🇳 शासकीय
            </span>
          ) : (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold font-body inline-flex items-center gap-1"
              style={{
                background: "oklch(0.55 0.03 243 / 0.08)",
                color: "oklch(0.45 0.03 243)",
                border: "1px solid oklch(0.55 0.03 243 / 0.18)",
              }}
            >
              ✋ स्वनिर्मित
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-display text-lg font-bold leading-snug"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          {scheme.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">
          {scheme.description}
        </p>

        {/* Benefit & Eligibility */}
        <div
          className="rounded-xl p-3 space-y-2 mt-auto"
          style={{ background: "oklch(0.97 0.005 43)" }}
        >
          <div className="flex gap-2 items-start">
            <span
              className="font-display text-xs font-bold shrink-0 mt-0.5"
              style={{ color: "oklch(0.52 0.20 43)" }}
            >
              लाभ:
            </span>
            <span
              className="font-body text-xs leading-relaxed"
              style={{ color: "oklch(0.35 0.04 243)" }}
            >
              {scheme.benefit}
            </span>
          </div>
          <div className="flex gap-2 items-start">
            <span
              className="font-display text-xs font-bold shrink-0 mt-0.5"
              style={{ color: "oklch(0.52 0.20 43)" }}
            >
              पात्रता:
            </span>
            <span
              className="font-body text-xs leading-relaxed"
              style={{ color: "oklch(0.35 0.04 243)" }}
            >
              {scheme.eligibility}
            </span>
          </div>
        </div>

        {/* KMC "अधिक माहिती" link */}
        <a
          href={kmcLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-body mt-1 self-start transition-opacity duration-200 hover:opacity-70"
          style={{ color: "oklch(0.52 0.20 43)" }}
        >
          <ExternalLink size={11} />
          KMC वर पहा
        </a>
      </div>
    </motion.div>
  );
}

export default function GovernmentSchemesSection() {
  const { data: schemes = [], isLoading } = useGetAllSchemes();
  const { data: lastSyncTime = 0n } = useGetLastSyncTime();
  const { mutate: syncSchemes, isPending: isSyncing } = useSyncGovtSchemes();
  const { mutateAsync: addScheme } = useAddScheme();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Keep a stable ref to syncSchemes so the interval closure doesn't stale
  const syncRef = useRef(syncSchemes);
  syncRef.current = syncSchemes;

  // Auto-seed new government schemes once (uses actor via useAddScheme)
  const didSeedRef = useRef(false);
  useEffect(() => {
    if (didSeedRef.current) return;
    const alreadySeeded = localStorage.getItem(KMC_NEW_SCHEMES_SEEDED_KEY);
    if (alreadySeeded) return;
    didSeedRef.current = true;

    // Seed sequentially to avoid race conditions
    const seedAll = async () => {
      try {
        for (const scheme of NEW_GOVT_SCHEMES) {
          await addScheme(scheme);
        }
        localStorage.setItem(KMC_NEW_SCHEMES_SEEDED_KEY, "1");
      } catch {
        // silently fail — will retry next mount if key not set
        didSeedRef.current = false;
      }
    };
    seedAll();
  }, [addScheme]);

  const triggerSync = useCallback(() => {
    syncRef.current();
  }, []);

  // Auto-sync on mount if never synced or older than 30 minutes, then every 30 min
  const didMountSync = useRef(false);
  useEffect(() => {
    if (!didMountSync.current) {
      didMountSync.current = true;
      const now = BigInt(Date.now()) * 1_000_000n;
      const shouldSync =
        lastSyncTime === 0n || now - lastSyncTime > THIRTY_MINUTES_NS;
      if (shouldSync) {
        triggerSync();
      }
    }
  }, [lastSyncTime, triggerSync]);

  useEffect(() => {
    const interval = setInterval(triggerSync, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [triggerSync]);

  const filtered =
    activeTab === "all"
      ? schemes
      : schemes.filter((s) => s.status === activeTab);

  return (
    <section
      id="schemes"
      className="py-20 md:py-28"
      style={{ background: "oklch(0.98 0.008 43 / 0.30)" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "oklch(0.65 0.22 43 / 0.12)",
              color: "oklch(0.52 0.20 43)",
            }}
          >
            <BookOpen size={16} />
            <span>शासन योजना</span>
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            शासकीय योजना
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto mb-4">
            प्रभाग क्र. ८ मधील नागरिकांसाठी उपलब्ध शासकीय योजना
          </p>

          {/* Sync controls row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            {lastSyncTime > 0n && (
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.55 0.03 243)" }}
              >
                शेवटचे अपडेट: {formatSyncTime(lastSyncTime)}
              </p>
            )}
            <button
              type="button"
              onClick={() => syncSchemes()}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 disabled:opacity-70"
              style={{
                background: "oklch(0.60 0.18 150 / 0.12)",
                color: "oklch(0.38 0.16 150)",
                border: "1px solid oklch(0.60 0.18 150 / 0.25)",
              }}
            >
              <RefreshCw
                size={14}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "अपडेट होत आहे..." : "सरकारी अपडेट"}
            </button>
          </div>
        </motion.div>

        {/* ── KMC Portal Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-8 rounded-2xl overflow-hidden border"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.025 50), oklch(0.94 0.040 45))",
            borderColor: "oklch(0.65 0.22 43 / 0.28)",
            boxShadow: "0 4px 24px oklch(0.65 0.22 43 / 0.12)",
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 md:p-6">
            {/* Icon + text */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.65 0.22 43 / 0.18)" }}
              >
                <Globe size={22} style={{ color: "oklch(0.45 0.22 43)" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="font-display text-base font-bold leading-snug"
                  style={{ color: "oklch(0.30 0.06 43)" }}
                >
                  कोल्हापूर महानगरपालिका अधिकृत पोर्टल
                </p>
                <p
                  className="font-body text-xs mt-0.5 leading-relaxed"
                  style={{ color: "oklch(0.48 0.08 43)" }}
                >
                  शासकीय योजनांची अधिकृत व अद्ययावत माहितीसाठी KMC पोर्टल पहा
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <a
                href={KMC_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "oklch(0.65 0.22 43)",
                  color: "white",
                  boxShadow: "0 2px 10px oklch(0.65 0.22 43 / 0.35)",
                }}
              >
                <Globe size={13} />
                KMC पोर्टल
              </a>
              <a
                href={`${KMC_BASE}/citizen`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "white",
                  color: "oklch(0.45 0.22 43)",
                  border: "1.5px solid oklch(0.65 0.22 43 / 0.40)",
                }}
              >
                <ExternalLink size={13} />
                नागरिक सेवा
              </a>
              <a
                href={`${KMC_BASE}/paripatrake`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "white",
                  color: "oklch(0.45 0.22 43)",
                  border: "1.5px solid oklch(0.65 0.22 43 / 0.40)",
                }}
              >
                <ExternalLink size={13} />
                शासन निर्णय
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── KMC Notice ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="text-center font-body text-xs mb-6"
          style={{ color: "oklch(0.50 0.06 43)" }}
        >
          📢 या योजना KMC पोर्टलशी जोडल्या आहेत. अधिकृत माहितीसाठी KMC पोर्टल पहा.
        </motion.p>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-4"
        >
          <div
            className="inline-flex rounded-2xl p-1.5 gap-1"
            style={{ background: "oklch(0.28 0.04 243 / 0.08)" }}
          >
            {tabs.map((tab) => {
              const count =
                tab.value === "all"
                  ? schemes.length
                  : schemes.filter((s) => s.status === tab.value).length;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className="px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all duration-200 flex items-center gap-1.5"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.65 0.22 43)",
                          color: "white",
                          boxShadow: "0 2px 8px oklch(0.65 0.22 43 / 0.35)",
                        }
                      : {
                          background: "transparent",
                          color: "oklch(0.40 0.04 243)",
                        }
                  }
                >
                  {tab.label}
                  <span
                    className="text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.4rem] text-center"
                    style={
                      isActive
                        ? {
                            background: "oklch(1 0 0 / 0.25)",
                            color: "white",
                          }
                        : {
                            background: "oklch(0.28 0.04 243 / 0.10)",
                            color: "oklch(0.40 0.04 243)",
                          }
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Sync in progress banner */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 mb-6 mx-auto max-w-sm px-5 py-2.5 rounded-full font-body text-sm font-semibold"
              style={{
                background: "oklch(0.65 0.22 43 / 0.10)",
                color: "oklch(0.45 0.20 43)",
                border: "1px solid oklch(0.65 0.22 43 / 0.22)",
              }}
            >
              <RefreshCw size={14} className="animate-spin shrink-0" />
              शासकीय योजना अपडेट होत आहेत...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1", "s2", "s3", "s4"].map((k) => (
              <Skeleton key={k} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20"
          >
            <BookOpen
              size={48}
              className="mx-auto mb-4 opacity-20"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-lg"
              style={{ color: "oklch(0.50 0.03 243)" }}
            >
              या श्रेणीत सध्या कोणत्याही योजना उपलब्ध नाहीत.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((scheme, i) => (
              <SchemeCard key={String(scheme.id)} scheme={scheme} index={i} />
            ))}
          </div>
        )}

        {/* Summary line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center font-body text-muted-foreground mt-10 text-lg"
        >
          एकूण{" "}
          <strong style={{ color: "oklch(0.65 0.22 43)" }}>
            {schemes.length}+
          </strong>{" "}
          शासकीय योजना उपलब्ध
        </motion.p>

        {/* ── शासन निर्णय Quick Links Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "oklch(0.96 0.015 43 / 0.60)",
              border: "1px solid oklch(0.65 0.22 43 / 0.18)",
            }}
          >
            <p
              className="font-display text-sm font-bold mb-3 text-center"
              style={{ color: "oklch(0.45 0.12 43)" }}
            >
              📋 शासन निर्णय व महत्त्वाचे दुवे
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                  style={{
                    background: "white",
                    color: "oklch(0.40 0.16 43)",
                    border: "1.5px solid oklch(0.65 0.22 43 / 0.30)",
                    boxShadow: "0 1px 4px oklch(0.65 0.22 43 / 0.08)",
                  }}
                >
                  <ExternalLink size={12} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
