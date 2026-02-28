import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, FolderOpen, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend.d";
import {
  useGetAllProjects,
  useGetAverageRating,
  useSubmitRating,
} from "../hooks/useQueries";

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

// ─── Marathi numeral converter ─────────────────────────────────────────────────

const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMarathiNumeral(n: number): string {
  return String(n)
    .split("")
    .map((c) => (c >= "0" && c <= "9" ? marathiDigits[Number(c)] : c))
    .join("");
}

// ─── Star display component ────────────────────────────────────────────────────

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

function StarDisplay({
  value,
  size = 14,
}: {
  value: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {STAR_POSITIONS.map((pos) => {
        const filled = pos <= Math.floor(value);
        return (
          <Star
            key={pos}
            size={size}
            style={{
              color: filled ? "oklch(0.65 0.22 43)" : "oklch(0.75 0.02 243)",
              fill: filled ? "oklch(0.65 0.22 43)" : "transparent",
            }}
          />
        );
      })}
    </span>
  );
}

// ─── Average Rating Badge ──────────────────────────────────────────────────────

function AverageRatingBadge({ projectId }: { projectId: bigint }) {
  const { data } = useGetAverageRating(projectId);

  if (!data || data.totalRatings === 0n) return null;

  const avg = Number(data.averageRating) / 10;
  const total = Number(data.totalRatings);

  return (
    <div className="flex items-center gap-2 mt-3">
      <StarDisplay value={avg} size={15} />
      <span
        className="font-display font-bold text-sm"
        style={{ color: "oklch(0.52 0.20 43)" }}
      >
        {avg.toFixed(1)} ★
      </span>
      <span
        className="font-body text-xs"
        style={{ color: "oklch(0.55 0.02 243)" }}
      >
        ({toMarathiNumeral(total)} रेटिंग)
      </span>
    </div>
  );
}

// ─── Rating Dialog ─────────────────────────────────────────────────────────────

function RatingDialog({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const { mutateAsync: submitRating, isPending } = useSubmitRating();

  const handleClose = () => {
    setSelectedRating(0);
    setHoverRating(0);
    setName("");
    setComment("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("कृपया तुमचे नाव टाका.");
      return;
    }
    if (selectedRating === 0) {
      toast.error("कृपया स्टार रेटिंग द्या.");
      return;
    }
    try {
      await submitRating({
        projectId: project.id,
        rating: BigInt(selectedRating),
        name: name.trim(),
        comment: comment.trim(),
      });
      toast.success("रेटिंग यशस्वीरित्या नोंदवले! धन्यवाद.");
      handleClose();
    } catch {
      toast.error("काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
    }
  };

  const displayRating = hoverRating || selectedRating;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        style={{ borderColor: "oklch(0.28 0.04 243 / 0.12)" }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            विकास कामाचे रेटिंग द्या
          </DialogTitle>
          <p
            className="font-body text-sm mt-0.5"
            style={{ color: "oklch(0.52 0.20 43)" }}
          >
            {project.title}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Star selector */}
          <div className="space-y-2">
            <Label
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              तुमचे रेटिंग *
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 rounded"
                  style={{
                    color:
                      star <= displayRating
                        ? "oklch(0.65 0.22 43)"
                        : "oklch(0.75 0.02 243)",
                  }}
                  aria-label={`${star} स्टार`}
                >
                  <Star
                    size={32}
                    fill={
                      star <= displayRating
                        ? "oklch(0.65 0.22 43)"
                        : "transparent"
                    }
                    style={{
                      color:
                        star <= displayRating
                          ? "oklch(0.65 0.22 43)"
                          : "oklch(0.75 0.02 243)",
                    }}
                  />
                </button>
              ))}
              {displayRating > 0 && (
                <span
                  className="font-body text-sm ml-1"
                  style={{ color: "oklch(0.52 0.20 43)" }}
                >
                  {
                    ["", "खूप वाईट", "वाईट", "ठीक आहे", "चांगले", "उत्कृष्ट"][
                      displayRating
                    ]
                  }
                </span>
              )}
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="rating-name"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              तुमचे नाव *
            </Label>
            <Input
              id="rating-name"
              type="text"
              placeholder="तुमचे नाव *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 rounded-lg font-body text-sm"
            />
          </div>

          {/* Comment textarea */}
          <div className="space-y-1.5">
            <Label
              htmlFor="rating-comment"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              प्रतिक्रिया
            </Label>
            <Textarea
              id="rating-comment"
              placeholder="तुमची प्रतिक्रिया (ऐच्छिक)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="rounded-lg font-body text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 h-10 rounded-xl font-body text-sm"
            >
              रद्द करा
            </Button>
            <Button
              type="submit"
              disabled={isPending || selectedRating === 0}
              className="flex-1 h-10 rounded-xl font-display font-bold text-sm text-white"
              style={{ background: "oklch(0.65 0.22 43)" }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  सबमिट होत आहे...
                </>
              ) : (
                "रेटिंग सबमिट करा"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isComplete =
    project.status === "पूर्ण" ||
    project.status.toLowerCase().includes("complet");

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  return (
    <>
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

          {/* Rating section — only for completed projects */}
          {isComplete && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
            >
              <AverageRatingBadge projectId={project.id} />
              <button
                type="button"
                onClick={() => setRatingDialogOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold font-body transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{
                  border: "1.5px solid oklch(0.65 0.22 43)",
                  color: "oklch(0.52 0.20 43)",
                  background: "oklch(0.65 0.22 43 / 0.06)",
                }}
              >
                <Star
                  size={12}
                  fill="transparent"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                />
                रेटिंग द्या
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {isComplete && (
        <RatingDialog
          project={project}
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
        />
      )}
    </>
  );
}

// ─── Projects Section ──────────────────────────────────────────────────────────

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
