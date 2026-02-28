import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, FolderOpen } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "../backend.d";
import { useGetAllProjects } from "../hooks/useQueries";

const fallbackProjects: Project[] = [
  {
    id: 1n,
    title: "रस्त्यांचे डांबरीकरण",
    description:
      "प्रभाग क्र. ८ मधील मुख्य रस्त्यांचे डांबरीकरण व खड्डे भरणे. नागरिकांच्या दैनंदिन प्रवासात सुलभता आली.",
    category: "रस्ते विकास",
    status: "पूर्ण",
  },
  {
    id: 2n,
    title: "नवीन पाणीपुरवठा योजना",
    description:
      "प्रभागातील सर्व घरांना नियमित पाणीपुरवठा सुनिश्चित करण्यासाठी नवीन पाइपलाईन व टाकी बांधणी.",
    category: "पाणी पुरवठा",
    status: "प्रगतीत",
  },
  {
    id: 3n,
    title: "उद्यान सुशोभीकरण",
    description:
      "प्रभागातील प्रमुख उद्यानांचे सुशोभीकरण, बाकांची दुरुस्ती, नवीन खेळाची साधने व झाडे लावणे.",
    category: "उद्यान विकास",
    status: "पूर्ण",
  },
  {
    id: 4n,
    title: "शाळा दुरुस्ती व नूतनीकरण",
    description:
      "प्रभागातील ३ महापालिका शाळांची दुरुस्ती, रंगरंगोटी, डिजिटल बोर्ड व शौचालय बांधणी.",
    category: "शिक्षण",
    status: "पूर्ण",
  },
  {
    id: 5n,
    title: "सांडपाणी व्यवस्था सुधारणा",
    description:
      "प्रभागातील जुन्या गटारांची साफसफाई व नव्या ड्रेनेज लाइनचे बांधकाम. पूर येण्याची समस्या कमी झाली.",
    category: "स्वच्छता",
    status: "प्रगतीत",
  },
  {
    id: 6n,
    title: "दिव्यांग अनुकूल फुटपाथ",
    description:
      "प्रभागातील मुख्य रस्त्यांवर दिव्यांग व्यक्तींसाठी रॅम्प, टॅक्टाइल मार्ग व विशेष सुविधा निर्मिती.",
    category: "नागरी सुविधा",
    status: "प्रगतीत",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isComplete =
    project.status === "पूर्ण" ||
    project.status.toLowerCase().includes("complet");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-hover bg-card rounded-2xl shadow-md border border-border overflow-hidden flex flex-col"
    >
      {/* Card top color strip based on status */}
      <div
        className="h-1.5 w-full"
        style={{
          background: isComplete
            ? "oklch(0.60 0.18 150)"
            : "oklch(0.65 0.22 43)",
        }}
      />

      <div className="p-6 flex-1 flex flex-col">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            {project.category}
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
            style={
              isComplete
                ? {
                    background: "oklch(0.60 0.18 150 / 0.15)",
                    color: "oklch(0.42 0.16 150)",
                  }
                : {
                    background: "oklch(0.65 0.22 43 / 0.15)",
                    color: "oklch(0.52 0.20 43)",
                  }
            }
          >
            {isComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {project.status}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display text-xl font-bold mb-2"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-body text-base text-muted-foreground leading-relaxed flex-1">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { data: backendProjects, isLoading } = useGetAllProjects();
  const projects =
    backendProjects && backendProjects.length > 0
      ? backendProjects
      : fallbackProjects;

  return (
    <section
      id="projects"
      className="py-20 md:py-28"
      style={{ background: "oklch(0.96 0.008 240)" }}
    >
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
            <FolderOpen size={16} />
            <span>विकास कार्य</span>
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            विकास कामे
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            प्रभाग क्र. ८ च्या विकासासाठी केलेली महत्त्वपूर्ण कामे
          </p>
        </motion.div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={String(project.id)}
                project={project}
                index={i}
              />
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
            {projects.length}+
          </strong>{" "}
          प्रकल्प पूर्ण किंवा प्रगतीत
        </motion.p>
      </div>
    </section>
  );
}
