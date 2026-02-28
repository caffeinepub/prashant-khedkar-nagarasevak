import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ExternalLink, Phone } from "lucide-react";
import { motion } from "motion/react";

/* ─── FAQ Data ───────────────────────────────────────────────── */
const faqs = [
  {
    id: "faq-1",
    question: "मालमत्ता कर कुठे भरायचा?",
    answer:
      "मालमत्ता कर कोल्हापूर महानगरपालिकेच्या ऑनलाइन पोर्टलवर (kolhapurcorporation.gov.in) किंवा महापालिका कार्यालयात भरता येतो.",
  },
  {
    id: "faq-2",
    question: "तक्रार नोंदवल्यानंतर किती दिवसात निराकरण होते?",
    answer:
      "साधारणतः ७ ते १५ कार्यदिवसांत तक्रारीचे निराकरण केले जाते. तातडीच्या बाबतीत ४८ तासांत.",
  },
  {
    id: "faq-3",
    question: "जन्म प्रमाणपत्रासाठी कोणती कागदपत्रे लागतात?",
    answer:
      "रुग्णालयाचा जन्म दाखला, पालकांचे आधार कार्ड, रहिवासी पुरावा आणि विवाह प्रमाणपत्र आवश्यक आहे.",
  },
  {
    id: "faq-4",
    question: "नगरसेवकांशी संपर्क कसा करायचा?",
    answer:
      "थेट भेट द्या किंवा +91 97641 51234 / +91 95298 83084 वर संपर्क करा. तक्रार फॉर्म भरून ऑनलाइनही संपर्क करता येतो.",
  },
  {
    id: "faq-5",
    question: "पाणी पुरवठा बंद असल्यास काय करायचे?",
    answer:
      "महापालिकेच्या पाणी विभागाला १९१६ वर कळवा किंवा नगरसेवकांच्या कार्यालयात तक्रार नोंदवा.",
  },
];

/* ─── Important Contacts Data ───────────────────────────────── */
const importantContacts = [
  {
    id: 1,
    icon: "🏛️",
    name: "महापालिका नियंत्रण कक्ष",
    number: "1916",
    category: "महापालिका",
  },
  {
    id: 2,
    icon: "💧",
    name: "पाणी पुरवठा विभाग",
    number: "0231-2540291",
    category: "पाणी",
  },
  {
    id: 3,
    icon: "⚡",
    name: "वीज तक्रार (MSEDCL)",
    number: "1912",
    category: "वीज",
  },
  {
    id: 4,
    icon: "🚑",
    name: "रुग्णवाहिका",
    number: "108",
    category: "आरोग्य",
  },
  {
    id: 5,
    icon: "👮",
    name: "पोलीस नियंत्रण कक्ष",
    number: "100",
    category: "सुरक्षा",
  },
  {
    id: 6,
    icon: "🚒",
    name: "अग्निशमन दल",
    number: "101",
    category: "आपत्कालीन",
  },
];

/* ─── Download Documents Data ───────────────────────────────── */
const documents = [
  {
    id: 1,
    title: "मालमत्ता कर अर्ज नमुना",
    description: "मालमत्ता कर भरण्यासाठी अर्ज नमुना",
    link: "https://kolhapurcorporation.gov.in",
    category: "करसेवा",
  },
  {
    id: 2,
    title: "जन्म नोंदणी अर्ज",
    description: "जन्म प्रमाणपत्रासाठी अर्ज नमुना",
    link: "https://mahaonline.gov.in",
    category: "दस्तऐवज",
  },
  {
    id: 3,
    title: "बांधकाम परवाना अर्ज",
    description: "नवीन बांधकामासाठी परवाना अर्ज",
    link: "https://kolhapurcorporation.gov.in",
    category: "परवाने",
  },
  {
    id: 4,
    title: "रहिवासी दाखला अर्ज",
    description: "रहिवासी दाखल्यासाठी अर्ज नमुना",
    link: "https://mahaonline.gov.in",
    category: "दस्तऐवज",
  },
];

/* ─── Category color helper ─────────────────────────────────── */
function getCategoryStyle(category: string): { bg: string; color: string } {
  const map: Record<string, { bg: string; color: string }> = {
    महापालिका: {
      bg: "oklch(0.65 0.22 43 / 0.10)",
      color: "oklch(0.52 0.20 43)",
    },
    पाणी: {
      bg: "oklch(0.60 0.18 230 / 0.12)",
      color: "oklch(0.40 0.16 230)",
    },
    वीज: {
      bg: "oklch(0.78 0.18 92 / 0.14)",
      color: "oklch(0.48 0.16 92)",
    },
    आरोग्य: {
      bg: "oklch(0.60 0.18 150 / 0.12)",
      color: "oklch(0.38 0.16 150)",
    },
    सुरक्षा: {
      bg: "oklch(0.55 0.18 260 / 0.12)",
      color: "oklch(0.40 0.16 260)",
    },
    आपत्कालीन: {
      bg: "oklch(0.60 0.20 20 / 0.12)",
      color: "oklch(0.40 0.18 20)",
    },
    करसेवा: {
      bg: "oklch(0.65 0.22 43 / 0.10)",
      color: "oklch(0.52 0.20 43)",
    },
    दस्तऐवज: {
      bg: "oklch(0.55 0.03 243 / 0.10)",
      color: "oklch(0.42 0.03 243)",
    },
    परवाने: {
      bg: "oklch(0.55 0.18 260 / 0.10)",
      color: "oklch(0.40 0.16 260)",
    },
  };
  return (
    map[category] ?? { bg: "oklch(0.95 0.01 43)", color: "oklch(0.52 0.20 43)" }
  );
}

/* ─── FAQ Sub-Section ────────────────────────────────────────── */
function FAQSubSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <AccordionItem
              value={faq.id}
              className="bg-white rounded-xl border border-border shadow-sm px-5 overflow-hidden data-[state=open]:shadow-md transition-shadow duration-200"
            >
              <AccordionTrigger
                className="font-display font-bold text-sm md:text-base py-4 text-left hover:no-underline"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="font-body text-sm leading-relaxed pb-4"
                style={{ color: "oklch(0.40 0.04 243)" }}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}

/* ─── Contacts Sub-Section ───────────────────────────────────── */
function ContactsSubSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {importantContacts.map((contact, i) => {
        const style = getCategoryStyle(contact.category);
        return (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
          >
            {/* Icon + category */}
            <div className="flex items-center justify-between">
              <span className="text-3xl">{contact.icon}</span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold font-body"
                style={{ background: style.bg, color: style.color }}
              >
                {contact.category}
              </span>
            </div>

            {/* Name */}
            <div>
              <p
                className="font-display font-bold text-sm md:text-base leading-snug"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                {contact.name}
              </p>
              <p
                className="font-body font-semibold text-lg mt-1"
                style={{ color: "oklch(0.65 0.22 43)" }}
              >
                {contact.number}
              </p>
            </div>

            {/* Call button */}
            <a
              href={`tel:${contact.number.replace(/[-\s]/g, "")}`}
              className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-display font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ background: "oklch(0.65 0.22 43)" }}
            >
              <Phone size={14} />
              कॉल करा
            </a>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Downloads Sub-Section ─────────────────────────────────── */
function DownloadsSubSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {documents.map((doc, i) => {
        const style = getCategoryStyle(doc.category);
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-white rounded-xl border border-border shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Doc icon */}
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: style.bg }}
            >
              📄
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-bold text-sm md:text-base leading-snug truncate"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                {doc.title}
              </p>
              <p className="font-body text-sm text-muted-foreground mt-0.5 truncate">
                {doc.description}
              </p>
            </div>

            {/* Category badge */}
            <span
              className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold font-body shrink-0"
              style={{ background: style.bg, color: style.color }}
            >
              {doc.category}
            </span>

            {/* Download button */}
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-display font-bold text-xs text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ background: "oklch(0.65 0.22 43)" }}
              aria-label={`${doc.title} डाउनलोड करा`}
            >
              <Download size={13} />
              <span className="hidden sm:inline">डाउनलोड</span>
              <ExternalLink size={12} className="sm:hidden" />
            </a>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────── */
export default function InformationSection() {
  return (
    <section
      id="information"
      className="py-20 md:py-28"
      style={{ background: "oklch(0.97 0.006 43 / 0.35)" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "oklch(0.65 0.22 43 / 0.12)",
              color: "oklch(0.52 0.20 43)",
            }}
          >
            <span>ℹ️</span>
            <span>उपयुक्त माहिती</span>
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            उपयुक्त माहिती
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            प्रभाग क्र. ८ साठी महत्त्वाची माहिती एकाच ठिकाणी
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="faq" className="w-full">
          {/* Tab triggers */}
          <div className="flex justify-center mb-8">
            <TabsList
              className="inline-flex rounded-2xl p-1.5 gap-1 h-auto"
              style={{ background: "oklch(0.28 0.04 243 / 0.08)" }}
            >
              <TabsTrigger
                value="faq"
                className="px-4 py-2 rounded-xl font-body font-semibold text-sm data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                style={
                  {
                    "--tw-text-opacity": "1",
                  } as React.CSSProperties
                }
              >
                ❓ वारंवार प्रश्न
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="px-4 py-2 rounded-xl font-body font-semibold text-sm data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                📞 महत्त्वाचे संपर्क
              </TabsTrigger>
              <TabsTrigger
                value="downloads"
                className="px-4 py-2 rounded-xl font-body font-semibold text-sm data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                📥 दस्तऐवज
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab contents */}
          <TabsContent value="faq">
            <FAQSubSection />
          </TabsContent>
          <TabsContent value="contacts">
            <ContactsSubSection />
          </TabsContent>
          <TabsContent value="downloads">
            <DownloadsSubSection />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
