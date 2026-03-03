import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddCivicService,
  useAddGalleryPhoto,
  useAddNotification,
  useAddProject,
  useAddScheme,
  useAddTeamMember,
  useAdminLogin,
  useDeleteCivicService,
  useDeleteGalleryPhoto,
  useDeleteProject,
  useDeleteScheme,
  useDeleteTeamMember,
  useGetAllCivicServices,
  useGetAllGalleryPhotos,
  useGetAllGrievances,
  useGetAllNotifications,
  useGetAllProjects,
  useGetAllRatings,
  useGetAllSchemes,
  useGetAllTeamMembers,
  useGetGrievanceReplies,
  useGetSitePhoto,
  useGetUnreadGrievanceCount,
  useMarkAllNotificationsRead,
  useMarkGrievancesRead,
  useReplyToGrievance,
  useSetSitePhoto,
  useSyncGovtSchemes,
  useUpdateCivicService,
} from "@/hooks/useQueries";
import {
  Bell,
  BookOpen,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Image,
  Loader2,
  LogOut,
  MessageSquare,
  RefreshCw,
  Shield,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { mutateAsync: adminLogin, isPending } = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    try {
      const success = await adminLogin(password);
      if (success) {
        toast.success("स्वागत आहे! Admin Panel उघडला.");
        onLogin();
      } else {
        toast.error("चुकीचा पासवर्ड");
      }
    } catch {
      toast.error("काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "oklch(0.14 0.03 243)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, oklch(0.65 0.22 43) 0%, transparent 50%), 
                            radial-gradient(circle at 75% 75%, oklch(0.45 0.10 243) 0%, transparent 50%)`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl border"
          style={{
            background: "oklch(0.20 0.04 243)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.65 0.22 43 / 0.15)" }}
            >
              <Shield size={32} style={{ color: "oklch(0.65 0.22 43)" }} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="font-display text-2xl font-bold mb-1"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              नगरसेवक भैय्या खेडकर
            </h1>
            <p
              className="font-body text-sm"
              style={{ color: "oklch(1 0 0 / 0.50)" }}
            >
              प्रभाग क्र. ८ · Admin Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="font-body font-semibold text-sm"
                style={{ color: "oklch(1 0 0 / 0.75)" }}
              >
                Admin पासवर्ड
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="पासवर्ड टाका..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl font-body text-base"
                style={{
                  background: "oklch(0.28 0.04 243)",
                  borderColor: "oklch(1 0 0 / 0.12)",
                  color: "white",
                }}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl font-display font-bold text-base text-white transition-all duration-200"
              style={{ background: "oklch(0.65 0.22 43)" }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  तपासत आहे...
                </>
              ) : (
                "लॉगिन करा"
              )}
            </Button>
          </form>

          {/* Back link */}
          <p className="text-center mt-6">
            <a
              href="/"
              className="font-body text-sm transition-colors"
              style={{ color: "oklch(1 0 0 / 0.35)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.65 0.22 43)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(1 0 0 / 0.35)";
              }}
            >
              ← मुख्य वेबसाइटवर परत जा
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Grievances Tab ────────────────────────────────────────────────────────────

function GrievanceCard({
  g,
  reply,
  onReply,
}: {
  g: {
    id: bigint;
    name: string;
    mobile: string;
    message: string;
    timestamp: bigint;
  };
  reply?: { reply: string; repliedAt: number };
  onReply: (id: string, citizenName: string, text: string) => Promise<void>;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("mr-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatReplyDate = (ms: number) =>
    new Date(ms).toLocaleDateString("mr-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await onReply(String(g.id), g.name, replyText.trim());
      setReplyText("");
      setShowReplyBox(false);
      toast.success("उत्तर पाठवले! नागरिकांना सूचना गेली.");
    } catch {
      toast.error("उत्तर पाठवता आले नाही.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      data-ocid={`admin.grievances.item.${String(g.id)}`}
      className="rounded-2xl p-5 border"
      style={{
        borderColor: reply
          ? "oklch(0.60 0.18 150 / 0.25)"
          : "oklch(0.28 0.04 243 / 0.10)",
        background: reply ? "oklch(0.98 0.008 150)" : "oklch(0.98 0.003 243)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <p
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            {g.name}
          </p>
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.52 0.20 43)" }}
          >
            📞 {g.mobile}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.50 0.02 243)" }}
          >
            {formatDate(g.timestamp)}
          </p>
          {reply ? (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold font-body"
              style={{
                background: "oklch(0.60 0.18 150 / 0.18)",
                color: "oklch(0.38 0.16 150)",
              }}
            >
              ✅ उत्तर दिले
            </span>
          ) : (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold font-body"
              style={{
                background: "oklch(0.65 0.22 43 / 0.12)",
                color: "oklch(0.52 0.20 43)",
              }}
            >
              ⏳ प्रतीक्षेत
            </span>
          )}
        </div>
      </div>

      {/* Grievance message */}
      <p
        className="font-body text-sm leading-relaxed mb-3"
        style={{ color: "oklch(0.35 0.04 243)" }}
      >
        {g.message}
      </p>

      {/* Reply display */}
      {reply && (
        <div
          className="rounded-xl p-4 mt-2 mb-3"
          style={{
            background: "oklch(0.60 0.18 150 / 0.10)",
            border: "1px solid oklch(0.60 0.18 150 / 0.25)",
          }}
        >
          <p
            className="font-display font-bold text-xs mb-1"
            style={{ color: "oklch(0.38 0.16 150)" }}
          >
            ✅ प्रशासनाचे उत्तर:
          </p>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "oklch(0.30 0.06 150)" }}
          >
            {reply.reply}
          </p>
          <p
            className="font-body text-xs mt-1"
            style={{ color: "oklch(0.50 0.08 150)" }}
          >
            {formatReplyDate(reply.repliedAt)}
          </p>
        </div>
      )}

      {/* Reply action */}
      {!reply && (
        <div className="mt-3">
          {!showReplyBox ? (
            <button
              type="button"
              data-ocid="admin.grievances.edit_button"
              onClick={() => setShowReplyBox(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all duration-200 hover:opacity-80"
              style={{
                background: "oklch(0.65 0.22 43 / 0.10)",
                color: "oklch(0.52 0.20 43)",
                border: "1px solid oklch(0.65 0.22 43 / 0.25)",
              }}
            >
              <MessageSquare size={14} />
              उत्तर द्या
            </button>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder="तक्रारदाराला उत्तर लिहा..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="rounded-xl font-body text-sm resize-none"
                data-ocid="admin.grievances.textarea"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.grievances.submit_button"
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-display font-bold text-sm text-white transition-all duration-200 disabled:opacity-60"
                  style={{ background: "oklch(0.65 0.22 43)" }}
                >
                  {isSending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {isSending ? "पाठवत आहे..." : "उत्तर पाठवा"}
                </button>
                <button
                  type="button"
                  data-ocid="admin.grievances.cancel_button"
                  onClick={() => {
                    setShowReplyBox(false);
                    setReplyText("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all duration-200 hover:opacity-70"
                  style={{
                    background: "oklch(0.28 0.04 243 / 0.08)",
                    color: "oklch(0.40 0.04 243)",
                  }}
                >
                  <X size={14} />
                  रद्द करा
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GrievancesTab() {
  const { data: grievances = [], isLoading } = useGetAllGrievances();
  const { data: replies = {} } = useGetGrievanceReplies();
  const { mutate: markGrievancesReadFn } = useMarkGrievancesRead();
  const { mutateAsync: replyToGrievance } = useReplyToGrievance();

  // Mark grievances as read when this tab mounts
  useEffect(() => {
    markGrievancesReadFn();
  }, [markGrievancesReadFn]);

  const handleReply = async (id: string, citizenName: string, text: string) => {
    await replyToGrievance({ id, reply: text, citizenName });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          className="animate-spin"
          size={32}
          style={{ color: "oklch(0.65 0.22 43)" }}
        />
      </div>
    );
  }

  const repliedCount = grievances.filter((g) => replies[String(g.id)]).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          प्राप्त तक्रारी
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.60 0.18 150 / 0.14)",
              color: "oklch(0.38 0.16 150)",
            }}
          >
            ✅ उत्तरित: {repliedCount}
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.10)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {grievances.length}
          </span>
        </div>
      </div>

      {grievances.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border"
          data-ocid="admin.grievances.empty_state"
          style={{
            borderColor: "oklch(0.28 0.04 243 / 0.10)",
            background: "oklch(0.97 0.005 243)",
          }}
        >
          <MessageSquare
            size={40}
            className="mx-auto mb-4 opacity-30"
            style={{ color: "oklch(0.28 0.04 243)" }}
          />
          <p
            className="font-body text-base"
            style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
          >
            अजून कोणतीही तक्रार नाही
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {grievances.map((g) => (
            <GrievanceCard
              key={String(g.id)}
              g={g}
              reply={replies[String(g.id)]}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image resize helper ───────────────────────────────────────────────────────

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Gallery Tab ───────────────────────────────────────────────────────────────

function GalleryTab() {
  const { data: photos = [], isLoading } = useGetAllGalleryPhotos();
  const { mutateAsync: addPhoto, isPending: isAdding } = useAddGalleryPhoto();
  const { mutateAsync: deletePhoto, isPending: isDeleting } =
    useDeleteGalleryPhoto();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [sub, setSub] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImageFile(file);
      setPreviewSrc(resized);
      setUrl("");
    } catch {
      toast.error("फोटो प्रक्रिया करताना चूक झाली.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setPreviewSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewSrc || url.trim();
    if (!finalUrl || !caption.trim()) {
      toast.error("कृपया फोटो निवडा किंवा URL टाका आणि शीर्षक भरा.");
      return;
    }
    try {
      await addPhoto({
        url: finalUrl,
        caption: caption.trim(),
        sub: sub.trim(),
      });
      toast.success("फोटो यशस्वीरित्या जोडला!");
      setUrl("");
      setCaption("");
      setSub("");
      setPreviewSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deletePhoto(id);
      toast.success("फोटो हटवला.");
    } catch {
      toast.error("फोटो हटवता आला नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन फोटो जोडा
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Mobile gallery upload */}
          <div className="space-y-2">
            <Label
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              📷 मोबाईल गॅलरीतून फोटो निवडा
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="admin-page-gallery-upload"
            />

            {previewSrc ? (
              <div
                className="relative rounded-xl overflow-hidden border-2"
                style={{ borderColor: "oklch(0.65 0.22 43)" }}
              >
                <img
                  src={previewSrc}
                  alt="निवडलेला फोटो"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: "oklch(0.45 0.20 25)" }}
                  aria-label="फोटो काढा"
                >
                  <X size={15} />
                </button>
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-body font-semibold text-white"
                  style={{ background: "oklch(0.40 0.16 150 / 0.90)" }}
                >
                  ✓ फोटो निवडला
                </div>
              </div>
            ) : (
              <label
                htmlFor="admin-page-gallery-upload"
                className="block cursor-pointer"
              >
                <div
                  className="w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:opacity-80"
                  style={{
                    borderColor: "oklch(0.65 0.22 43 / 0.40)",
                    background: "oklch(0.65 0.22 43 / 0.04)",
                  }}
                >
                  {isProcessing ? (
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "oklch(0.65 0.22 43)" }}
                    />
                  ) : (
                    <>
                      <Camera
                        size={24}
                        style={{ color: "oklch(0.65 0.22 43)" }}
                      />
                      <p
                        className="font-body text-sm font-semibold"
                        style={{ color: "oklch(0.52 0.20 43)" }}
                      >
                        येथे टॅप करा — गॅलरी / कॅमेरा
                      </p>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* URL fallback + caption row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="g-url"
                className="font-body text-sm font-semibold flex items-center gap-1.5"
                style={{ color: "oklch(0.45 0.02 243)" }}
              >
                <Upload size={12} />
                किंवा URL टाका
              </Label>
              <Input
                id="g-url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value) clearFile();
                }}
                disabled={!!previewSrc}
                className="h-10 rounded-lg font-body text-sm"
                style={{ opacity: previewSrc ? 0.45 : 1 }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="g-caption"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                शीर्षक *
              </Label>
              <Input
                id="g-caption"
                type="text"
                placeholder="उदा. रस्ते डांबरीकरण उद्घाटन"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="g-sub"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              उपशीर्षक
            </Label>
            <Input
              id="g-sub"
              type="text"
              placeholder="उदा. प्रभाग क्र. ८ मधील उद्घाटन"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="h-10 rounded-lg font-body text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={
              isAdding ||
              isProcessing ||
              (!previewSrc && !url.trim()) ||
              !caption.trim()
            }
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              "फोटो जोडा"
            )}
          </Button>
        </form>
      </div>

      {/* Photo list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याचे फोटो
          </h3>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {photos.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : photos.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <Image
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणताही फोटो जोडलेला नाही
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {photos.map((photo) => (
              <div
                key={String(photo.id)}
                className="flex items-center gap-4 rounded-xl p-3 border"
                style={{
                  borderColor: "oklch(0.28 0.04 243 / 0.08)",
                  background: "oklch(0.98 0.003 243)",
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-14 h-10 object-cover rounded-lg shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-bold text-sm truncate"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    {photo.caption}
                  </p>
                  {photo.sub && (
                    <p
                      className="font-body text-xs truncate"
                      style={{ color: "oklch(0.50 0.02 243)" }}
                    >
                      {photo.sub}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting && deletingId === photo.id}
                  onClick={() => handleDelete(photo.id)}
                  className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                  style={{ color: "oklch(0.55 0.20 25)" }}
                >
                  {isDeleting && deletingId === photo.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Projects Tab ──────────────────────────────────────────────────────────────

function ProjectsTab() {
  const { data: projects = [], isLoading } = useGetAllProjects();
  const { mutateAsync: addProject, isPending: isAdding } = useAddProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim() || !status) {
      toast.error("कृपया सर्व माहिती भरा.");
      return;
    }
    try {
      await addProject({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        status,
      });
      toast.success("विकास काम यशस्वीरित्या जोडले!");
      setTitle("");
      setDescription("");
      setCategory("");
      setStatus("");
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteProject(id);
      toast.success("विकास काम हटवले.");
    } catch {
      toast.error("विकास काम हटवता आले नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (s: string) => {
    if (s === "पूर्ण")
      return {
        background: "oklch(0.60 0.18 150 / 0.15)",
        color: "oklch(0.42 0.16 150)",
      };
    if (s === "प्रगतीत")
      return {
        background: "oklch(0.65 0.22 43 / 0.15)",
        color: "oklch(0.52 0.20 43)",
      };
    return {
      background: "oklch(0.28 0.04 243 / 0.10)",
      color: "oklch(0.40 0.04 243)",
    };
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन विकास काम जोडा
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="p-title"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                शीर्षक *
              </Label>
              <Input
                id="p-title"
                type="text"
                placeholder="उदा. रस्त्यांचे डांबरीकरण"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="p-category"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                श्रेणी *
              </Label>
              <Input
                id="p-category"
                type="text"
                placeholder="उदा. रस्ते विकास"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="p-description"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              वर्णन *
            </Label>
            <Textarea
              id="p-description"
              placeholder="विकास कामाचे तपशीलवार वर्णन..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="rounded-lg font-body text-sm resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="p-status"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              स्थिती *
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="p-status"
                className="h-10 rounded-lg font-body text-sm"
              >
                <SelectValue placeholder="स्थिती निवडा..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="पूर्ण" className="font-body">
                  ✅ पूर्ण
                </SelectItem>
                <SelectItem value="प्रगतीत" className="font-body">
                  🔄 प्रगतीत
                </SelectItem>
                <SelectItem value="नियोजित" className="font-body">
                  📋 नियोजित
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isAdding}
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              "विकास काम जोडा"
            )}
          </Button>
        </form>
      </div>

      {/* Projects list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याची विकास कामे
          </h3>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {projects.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : projects.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <FileText
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणतेही विकास काम जोडलेले नाही
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={String(project.id)}
                className="flex items-start gap-4 rounded-xl p-4 border"
                style={{
                  borderColor: "oklch(0.28 0.04 243 / 0.08)",
                  background: "oklch(0.98 0.003 243)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p
                      className="font-display font-bold text-sm"
                      style={{ color: "oklch(0.28 0.04 243)" }}
                    >
                      {project.title}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold font-body inline-flex items-center gap-1"
                      style={statusStyle(project.status)}
                    >
                      {project.status === "पूर्ण" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {project.status}
                    </span>
                  </div>
                  <p
                    className="font-body text-xs mb-1"
                    style={{ color: "oklch(0.52 0.20 43)" }}
                  >
                    {project.category}
                  </p>
                  <p
                    className="font-body text-xs leading-relaxed line-clamp-2"
                    style={{ color: "oklch(0.40 0.03 243)" }}
                  >
                    {project.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting && deletingId === project.id}
                  onClick={() => handleDelete(project.id)}
                  className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                  style={{ color: "oklch(0.55 0.20 25)" }}
                >
                  {isDeleting && deletingId === project.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Schemes Tab ──────────────────────────────────────────────────────────────

function SchemesTab() {
  const { data: schemes = [], isLoading } = useGetAllSchemes();
  const { mutateAsync: addScheme, isPending: isAdding } = useAddScheme();
  const { mutateAsync: deleteScheme, isPending: isDeleting } =
    useDeleteScheme();
  const { mutate: syncSchemes, isPending: isSyncing } = useSyncGovtSchemes();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [benefit, setBenefit] = useState("");
  const [eligibility, setEligibility] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !status ||
      !benefit.trim() ||
      !eligibility.trim()
    ) {
      toast.error("कृपया सर्व माहिती भरा.");
      return;
    }
    try {
      await addScheme({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        status,
        benefit: benefit.trim(),
        eligibility: eligibility.trim(),
      });
      toast.success("योजना यशस्वीरित्या जोडली!");
      setTitle("");
      setDescription("");
      setCategory("");
      setStatus("");
      setBenefit("");
      setEligibility("");
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteScheme(id);
      toast.success("योजना हटवली.");
    } catch {
      toast.error("योजना हटवता आली नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusLabel = (s: string) => {
    if (s === "active") return "सद्यस्थिती";
    if (s === "past") return "भूतकाळ";
    return "येणाऱ्या";
  };

  const statusStyle = (s: string) => {
    if (s === "active")
      return {
        background: "oklch(0.60 0.18 150 / 0.15)",
        color: "oklch(0.38 0.16 150)",
      };
    if (s === "past")
      return {
        background: "oklch(0.55 0.03 243 / 0.12)",
        color: "oklch(0.42 0.03 243)",
      };
    return {
      background: "oklch(0.55 0.18 260 / 0.14)",
      color: "oklch(0.40 0.16 260)",
    };
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन योजना जोडा
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="sc-title"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                शीर्षक *
              </Label>
              <Input
                id="sc-title"
                type="text"
                placeholder="उदा. प्रधानमंत्री आवास योजना"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="sc-category"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                श्रेणी *
              </Label>
              <Input
                id="sc-category"
                type="text"
                placeholder="उदा. गृहनिर्माण"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="sc-description"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              वर्णन *
            </Label>
            <Textarea
              id="sc-description"
              placeholder="योजनेचे तपशीलवार वर्णन..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="rounded-lg font-body text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="sc-benefit"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                लाभ *
              </Label>
              <Input
                id="sc-benefit"
                type="text"
                placeholder="उदा. आर्थिक अनुदान"
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="sc-eligibility"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                पात्रता *
              </Label>
              <Input
                id="sc-eligibility"
                type="text"
                placeholder="उदा. BPL कुटुंबे"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="sc-status"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              स्थिती *
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="sc-status"
                className="h-10 rounded-lg font-body text-sm"
              >
                <SelectValue placeholder="स्थिती निवडा..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active" className="font-body">
                  ✅ सद्यस्थिती (Active)
                </SelectItem>
                <SelectItem value="past" className="font-body">
                  🕐 भूतकाळ (Past)
                </SelectItem>
                <SelectItem value="upcoming" className="font-body">
                  🔮 येणाऱ्या (Upcoming)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isAdding}
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              "योजना जोडा"
            )}
          </Button>
        </form>
      </div>

      {/* Schemes list */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याच्या योजना
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                syncSchemes(undefined, {
                  onSuccess: () => toast.success("सरकारी योजना अपडेट झाल्या!"),
                  onError: () => toast.error("Sync करता आले नाही."),
                });
              }}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-200 disabled:opacity-70"
              style={{
                background: "oklch(0.60 0.18 150 / 0.12)",
                color: "oklch(0.38 0.16 150)",
                border: "1px solid oklch(0.60 0.18 150 / 0.25)",
              }}
            >
              <RefreshCw
                size={12}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "Sync होत आहे..." : "सरकारी योजना Sync"}
            </button>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold font-body"
              style={{
                background: "oklch(0.28 0.04 243 / 0.08)",
                color: "oklch(0.28 0.04 243)",
              }}
            >
              एकूण: {schemes.length}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : schemes.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <BookOpen
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणतीही योजना जोडलेली नाही
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {schemes.map((scheme) => {
              const schemeAny = scheme as unknown as { source?: string };
              const isGovt = (schemeAny.source ?? "manual") === "govt";
              return (
                <div
                  key={String(scheme.id)}
                  className="flex items-start gap-4 rounded-xl p-4 border"
                  style={{
                    borderColor: isGovt
                      ? "oklch(0.65 0.22 43 / 0.18)"
                      : "oklch(0.28 0.04 243 / 0.08)",
                    background: isGovt
                      ? "oklch(0.65 0.22 43 / 0.04)"
                      : "oklch(0.98 0.003 243)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p
                        className="font-display font-bold text-sm"
                        style={{ color: "oklch(0.28 0.04 243)" }}
                      >
                        {scheme.title}
                      </p>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold font-body"
                        style={statusStyle(scheme.status)}
                      >
                        {statusLabel(scheme.status)}
                      </span>
                      {isGovt ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold font-body"
                          style={{
                            background: "oklch(0.65 0.22 43 / 0.15)",
                            color: "oklch(0.45 0.22 43)",
                          }}
                        >
                          🇮🇳 सरकारी
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold font-body"
                          style={{
                            background: "oklch(0.55 0.03 243 / 0.10)",
                            color: "oklch(0.45 0.03 243)",
                          }}
                        >
                          ✋ स्वनिर्मित
                        </span>
                      )}
                    </div>
                    <p
                      className="font-body text-xs mb-1"
                      style={{ color: "oklch(0.52 0.20 43)" }}
                    >
                      {scheme.category}
                    </p>
                    <p
                      className="font-body text-xs leading-relaxed line-clamp-2"
                      style={{ color: "oklch(0.40 0.03 243)" }}
                    >
                      {scheme.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting && deletingId === scheme.id}
                    onClick={() => handleDelete(scheme.id)}
                    className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                    style={{ color: "oklch(0.55 0.20 25)" }}
                  >
                    {isDeleting && deletingId === scheme.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Civic Services Tab ───────────────────────────────────────────────────────

function CivicServicesTab() {
  const { data: services = [], isLoading } = useGetAllCivicServices();
  const { mutateAsync: addService, isPending: isAdding } = useAddCivicService();
  const { mutateAsync: deleteService, isPending: isDeleting } =
    useDeleteCivicService();
  const { mutateAsync: updateService } = useUpdateCivicService();

  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [icon, setIcon] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !icon.trim() ||
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !link.trim() ||
      !buttonLabel.trim()
    ) {
      toast.error("कृपया सर्व माहिती भरा.");
      return;
    }
    try {
      await addService({
        icon: icon.trim(),
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        link: link.trim(),
        buttonLabel: buttonLabel.trim(),
      });
      toast.success("नागरी सेवा यशस्वीरित्या जोडली!");
      setIcon("");
      setTitle("");
      setDescription("");
      setCategory("");
      setLink("");
      setButtonLabel("");
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteService(id);
      toast.success("सेवा हटवली.");
    } catch {
      toast.error("सेवा हटवता आली नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (service: (typeof services)[0]) => {
    try {
      await updateService({
        id: service.id,
        icon: service.icon,
        title: service.title,
        description: service.description,
        category: service.category,
        link: service.link,
        buttonLabel: service.buttonLabel,
        isActive: !service.isActive,
      });
      toast.success(service.isActive ? "सेवा निष्क्रिय केली." : "सेवा सक्रिय केली.");
    } catch {
      toast.error("स्थिती बदलता आली नाही.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन नागरी सेवा जोडा
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="cs-icon"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                आयकन (Emoji) *
              </Label>
              <Input
                id="cs-icon"
                type="text"
                placeholder="उदा. 📄"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="cs-title"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                शीर्षक *
              </Label>
              <Input
                id="cs-title"
                type="text"
                placeholder="उदा. जन्म प्रमाणपत्र अर्ज"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="cs-description"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              वर्णन *
            </Label>
            <Textarea
              id="cs-description"
              placeholder="सेवेचे थोडक्यात वर्णन..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="rounded-lg font-body text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="cs-category"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                श्रेणी *
              </Label>
              <Input
                id="cs-category"
                type="text"
                placeholder="उदा. दस्तऐवज"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="cs-link"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                लिंक (URL) *
              </Label>
              <Input
                id="cs-link"
                type="url"
                placeholder="https://mahaonline.gov.in"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
              <Label
                htmlFor="cs-btn-label"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                बटणाचा मजकूर *
              </Label>
              <Input
                id="cs-btn-label"
                type="text"
                placeholder="उदा. अर्ज करा"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={isAdding}
              className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
              style={{ background: "oklch(0.65 0.22 43)" }}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  जोडत आहे...
                </>
              ) : (
                "सेवा जोडा"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Services list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याच्या नागरी सेवा
          </h3>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {services.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : services.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <Building2
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणतीही नागरी सेवा जोडलेली नाही
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={String(service.id)}
                className="flex items-center gap-3 rounded-xl p-3 border"
                style={{
                  borderColor: service.isActive
                    ? "oklch(0.60 0.18 150 / 0.20)"
                    : "oklch(0.28 0.04 243 / 0.08)",
                  background: service.isActive
                    ? "oklch(0.60 0.18 150 / 0.04)"
                    : "oklch(0.98 0.003 243)",
                }}
              >
                <span className="text-xl shrink-0">{service.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="font-display font-bold text-sm truncate"
                      style={{ color: "oklch(0.28 0.04 243)" }}
                    >
                      {service.title}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold font-body shrink-0"
                      style={{
                        background: "oklch(0.65 0.22 43 / 0.10)",
                        color: "oklch(0.52 0.20 43)",
                      }}
                    >
                      {service.category}
                    </span>
                  </div>
                  <p
                    className="font-body text-xs truncate mt-0.5"
                    style={{ color: "oklch(0.50 0.02 243)" }}
                  >
                    {service.link}
                  </p>
                </div>
                {/* Active toggle */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-xs font-body"
                    style={{
                      color: service.isActive
                        ? "oklch(0.42 0.16 150)"
                        : "oklch(0.55 0.03 243)",
                    }}
                  >
                    {service.isActive ? "सक्रिय" : "बंद"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(service)}
                    className="relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none"
                    style={{
                      background: service.isActive
                        ? "oklch(0.60 0.18 150)"
                        : "oklch(0.75 0.02 243)",
                    }}
                    aria-label={service.isActive ? "निष्क्रिय करा" : "सक्रिय करा"}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200"
                      style={{
                        transform: service.isActive
                          ? "translateX(16px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting && deletingId === service.id}
                  onClick={() => handleDelete(service.id)}
                  className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                  style={{ color: "oklch(0.55 0.20 25)" }}
                >
                  {isDeleting && deletingId === service.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Team Members Tab ─────────────────────────────────────────────────────────

function TeamMembersTab() {
  const { data: members = [], isLoading } = useGetAllTeamMembers();
  const { mutateAsync: addMember, isPending: isAdding } = useAddTeamMember();
  const { mutateAsync: deleteMember, isPending: isDeleting } =
    useDeleteTeamMember();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleTeamPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingPhoto(true);
    try {
      const resized = await resizeImageFile(file);
      setPreviewPhoto(resized);
      setPhotoUrl("");
    } catch {
      toast.error("फोटो प्रक्रिया करताना चूक झाली.");
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const clearTeamPhoto = () => {
    setPreviewPhoto(null);
    if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      toast.error("कृपया नाव आणि पद भरा.");
      return;
    }
    const finalPhoto = previewPhoto || photoUrl.trim();
    try {
      await addMember({
        name: name.trim(),
        designation: designation.trim(),
        photo: finalPhoto,
        mobile: mobile.trim(),
        description: description.trim(),
      });
      toast.success("सदस्य यशस्वीरित्या जोडला!");
      setName("");
      setDesignation("");
      setPhotoUrl("");
      setPreviewPhoto(null);
      if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = "";
      setMobile("");
      setDescription("");
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteMember(id);
      toast.success("सदस्य हटवला.");
    } catch {
      toast.error("सदस्य हटवता आला नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन सदस्य जोडा
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="tm-name"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                पूर्ण नाव *
              </Label>
              <Input
                id="tm-name"
                type="text"
                placeholder="उदा. राजेश पाटील"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
                data-ocid="admin.team.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="tm-designation"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                पद / हुद्दा *
              </Label>
              <Input
                id="tm-designation"
                type="text"
                placeholder="उदा. कार्यालय प्रमुख"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
              />
            </div>
          </div>

          {/* Photo gallery picker */}
          <div className="space-y-2">
            <Label
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              📷 सदस्याचा फोटो (गॅलरीतून)
            </Label>
            <input
              ref={teamPhotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleTeamPhotoChange}
              id="team-member-photo-upload"
            />
            {previewPhoto ? (
              <div
                className="relative rounded-xl overflow-hidden border-2 w-32"
                style={{ borderColor: "oklch(0.65 0.22 43)" }}
              >
                <img
                  src={previewPhoto}
                  alt="निवडलेला फोटो"
                  className="w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={clearTeamPhoto}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow"
                  style={{ background: "oklch(0.45 0.20 25)" }}
                  aria-label="फोटो काढा"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="team-member-photo-upload"
                className="block cursor-pointer w-32"
                data-ocid="admin.team.upload_button"
              >
                <div
                  className="w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:opacity-80"
                  style={{
                    borderColor: "oklch(0.65 0.22 43 / 0.40)",
                    background: "oklch(0.65 0.22 43 / 0.04)",
                  }}
                >
                  {isProcessingPhoto ? (
                    <Loader2
                      size={20}
                      className="animate-spin"
                      style={{ color: "oklch(0.65 0.22 43)" }}
                    />
                  ) : (
                    <>
                      <Camera
                        size={22}
                        style={{ color: "oklch(0.65 0.22 43)" }}
                      />
                      <p
                        className="font-body text-xs font-semibold text-center px-1"
                        style={{ color: "oklch(0.52 0.20 43)" }}
                      >
                        गॅलरीतून निवडा
                      </p>
                    </>
                  )}
                </div>
              </label>
            )}
            {/* URL fallback */}
            <div className="space-y-1.5">
              <Label
                htmlFor="tm-photo"
                className="font-body text-xs font-semibold flex items-center gap-1.5"
                style={{ color: "oklch(0.45 0.02 243)" }}
              >
                <Upload size={11} />
                किंवा URL टाका
              </Label>
              <Input
                id="tm-photo"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  if (e.target.value) clearTeamPhoto();
                }}
                disabled={!!previewPhoto}
                className="h-10 rounded-lg font-body text-sm"
                style={{ opacity: previewPhoto ? 0.45 : 1 }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="tm-mobile"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              मोबाईल नंबर
            </Label>
            <Input
              id="tm-mobile"
              type="text"
              placeholder="उदा. +91 98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="h-10 rounded-lg font-body text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="tm-description"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              थोडक्यात माहिती
            </Label>
            <Textarea
              id="tm-description"
              placeholder="सदस्याच्या कार्याचे थोडक्यात वर्णन..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-lg font-body text-sm resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isAdding || isProcessingPhoto}
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
            data-ocid="admin.team.submit_button"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              "सदस्य जोडा"
            )}
          </Button>
        </form>
      </div>

      {/* Members list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याचे सदस्य
          </h3>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {members.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : members.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <Users
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणताही सदस्य जोडलेला नाही
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={String(member.id)}
                className="flex items-center gap-4 rounded-xl p-3 border"
                style={{
                  borderColor: "oklch(0.28 0.04 243 / 0.08)",
                  background: "oklch(0.98 0.003 243)",
                }}
              >
                {/* Avatar */}
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-12 h-12 object-cover rounded-full shrink-0 border-2"
                    style={{ borderColor: "oklch(0.65 0.22 43 / 0.30)" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-lg font-bold"
                    style={{
                      background: "oklch(0.65 0.22 43 / 0.15)",
                      color: "oklch(0.52 0.20 43)",
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-bold text-sm truncate"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="font-body text-xs truncate"
                    style={{ color: "oklch(0.52 0.20 43)" }}
                  >
                    {member.designation}
                  </p>
                  {member.mobile && (
                    <p
                      className="font-body text-xs truncate"
                      style={{ color: "oklch(0.50 0.02 243)" }}
                    >
                      📞 {member.mobile}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting && deletingId === member.id}
                  onClick={() => handleDelete(member.id)}
                  className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                  style={{ color: "oklch(0.55 0.20 25)" }}
                >
                  {isDeleting && deletingId === member.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ratings Tab ──────────────────────────────────────────────────────────────

const STAR_POSITIONS_ADMIN = [1, 2, 3, 4, 5] as const;

function StarDisplay({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {STAR_POSITIONS_ADMIN.map((pos) => (
        <Star
          key={pos}
          size={size}
          style={{
            color:
              pos <= value ? "oklch(0.65 0.22 43)" : "oklch(0.75 0.02 243)",
            fill: pos <= value ? "oklch(0.65 0.22 43)" : "transparent",
          }}
        />
      ))}
    </span>
  );
}

function RatingsTab() {
  const { data: allRatings = [], isLoading: ratingsLoading } =
    useGetAllRatings();
  const { data: projects = [], isLoading: projectsLoading } =
    useGetAllProjects();

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(),
  );

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("mr-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = ratingsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          className="animate-spin"
          size={32}
          style={{ color: "oklch(0.65 0.22 43)" }}
        />
      </div>
    );
  }

  // Group ratings by projectId
  const ratingsByProject = allRatings.reduce<Record<string, typeof allRatings>>(
    (acc, r) => {
      const key = String(r.projectId);
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    },
    {},
  );

  const projectsWithRatings = Object.entries(ratingsByProject).map(
    ([projectId, ratings]) => {
      const project = projects.find((p) => String(p.id) === projectId);
      const totalRatings = ratings.length;
      const avgRating =
        totalRatings > 0
          ? ratings.reduce((sum, r) => sum + Number(r.rating), 0) / totalRatings
          : 0;
      return { projectId, project, ratings, totalRatings, avgRating };
    },
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          विकास कामांचे रेटिंग
        </h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold font-body"
          style={{
            background: "oklch(0.65 0.22 43 / 0.12)",
            color: "oklch(0.52 0.20 43)",
          }}
        >
          एकूण: {allRatings.length} रेटिंग
        </span>
      </div>

      {projectsWithRatings.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border"
          style={{
            borderColor: "oklch(0.28 0.04 243 / 0.10)",
            background: "oklch(0.97 0.005 243)",
          }}
        >
          <Star
            size={40}
            className="mx-auto mb-4 opacity-30"
            style={{ color: "oklch(0.65 0.22 43)" }}
          />
          <p
            className="font-body text-base"
            style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
          >
            अजून कोणतेही रेटिंग नाही
          </p>
          <p
            className="font-body text-sm mt-1"
            style={{ color: "oklch(0.28 0.04 243 / 0.35)" }}
          >
            नागरिक पूर्ण झालेल्या विकास कामांना रेटिंग देऊ शकतात
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projectsWithRatings.map(
            ({ projectId, project, ratings, totalRatings, avgRating }) => {
              const isExpanded = expandedProjects.has(projectId);
              const projectTitle = project?.title ?? `प्रकल्प #${projectId}`;
              return (
                <div
                  key={projectId}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: "oklch(0.28 0.04 243 / 0.10)",
                    background: "oklch(0.98 0.003 243)",
                  }}
                >
                  {/* Project header row */}
                  <button
                    type="button"
                    onClick={() => toggleProject(projectId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-black/[0.02] transition-colors text-left"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display font-bold text-sm truncate"
                          style={{ color: "oklch(0.28 0.04 243)" }}
                        >
                          {projectTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StarDisplay value={Math.round(avgRating)} />
                          <span
                            className="font-display font-bold text-sm"
                            style={{ color: "oklch(0.52 0.20 43)" }}
                          >
                            {avgRating.toFixed(1)}
                          </span>
                          <span
                            className="font-body text-xs"
                            style={{ color: "oklch(0.50 0.02 243)" }}
                          >
                            ({totalRatings} रेटिंग)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 shrink-0">
                      {isExpanded ? (
                        <ChevronDown
                          size={16}
                          style={{ color: "oklch(0.50 0.02 243)" }}
                        />
                      ) : (
                        <ChevronRight
                          size={16}
                          style={{ color: "oklch(0.50 0.02 243)" }}
                        />
                      )}
                    </div>
                  </button>

                  {/* Individual ratings */}
                  {isExpanded && (
                    <div
                      className="border-t"
                      style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
                    >
                      {ratings.map((r) => (
                        <div
                          key={String(r.id)}
                          className="px-4 py-3 border-b last:border-b-0 flex flex-col sm:flex-row sm:items-start gap-2"
                          style={{
                            borderColor: "oklch(0.28 0.04 243 / 0.06)",
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p
                                className="font-display font-semibold text-sm"
                                style={{ color: "oklch(0.28 0.04 243)" }}
                              >
                                {r.name}
                              </p>
                              <StarDisplay value={Number(r.rating)} size={12} />
                              <span
                                className="font-body text-xs font-semibold"
                                style={{ color: "oklch(0.52 0.20 43)" }}
                              >
                                {Number(r.rating)}/५
                              </span>
                            </div>
                            {r.comment && (
                              <p
                                className="font-body text-xs leading-relaxed"
                                style={{ color: "oklch(0.40 0.03 243)" }}
                              >
                                "{r.comment}"
                              </p>
                            )}
                          </div>
                          <p
                            className="font-body text-xs shrink-0"
                            style={{ color: "oklch(0.55 0.02 243)" }}
                          >
                            {formatDate(r.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

// ─── Site Photos Tab ──────────────────────────────────────────────────────────

interface SitePhotoSectionProps {
  photoKey: string;
  label: string;
  description: string;
}

function SitePhotoSection({
  photoKey,
  label,
  description,
}: SitePhotoSectionProps) {
  const { data: currentPhotoData = "", isLoading } = useGetSitePhoto(photoKey);
  const { mutateAsync: setSitePhoto, isPending: isSaving } = useSetSitePhoto();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSrc =
    currentPhotoData && currentPhotoData.trim().length > 0
      ? currentPhotoData
      : "/assets/uploads/IMG-20260301-WA0009-1.jpg";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImageFile(file);
      setPreviewSrc(resized);
    } catch {
      toast.error("फोटो प्रक्रिया करताना चूक झाली.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!previewSrc) return;
    try {
      await setSitePhoto({ photoKey, data: previewSrc });
      toast.success(`${label} यशस्वीरित्या जतन झाला!`);
      setPreviewSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("फोटो जतन करताना चूक झाली.");
    }
  };

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        borderColor: "oklch(0.65 0.22 43 / 0.18)",
        background: "oklch(0.65 0.22 43 / 0.03)",
      }}
    >
      <h4
        className="font-display font-bold text-base mb-1"
        style={{ color: "oklch(0.28 0.04 243)" }}
      >
        {label}
      </h4>
      <p
        className="font-body text-xs mb-4"
        style={{ color: "oklch(0.52 0.20 43)" }}
      >
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current photo */}
        <div>
          <p
            className="font-body text-xs font-semibold mb-2"
            style={{ color: "oklch(0.45 0.02 243)" }}
          >
            सध्याचा फोटो
          </p>
          {isLoading ? (
            <div
              className="w-full h-32 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.65 0.22 43 / 0.08)" }}
            >
              <Loader2
                size={20}
                className="animate-spin"
                style={{ color: "oklch(0.65 0.22 43)" }}
              />
            </div>
          ) : (
            <img
              src={currentSrc}
              alt={label}
              className="w-full h-32 object-cover object-top rounded-xl border"
              style={{ borderColor: "oklch(0.28 0.04 243 / 0.10)" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* New photo picker */}
        <div>
          <p
            className="font-body text-xs font-semibold mb-2"
            style={{ color: "oklch(0.45 0.02 243)" }}
          >
            नवीन फोटो निवडा
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            id={`site-photo-${photoKey}`}
          />

          {previewSrc ? (
            <div className="space-y-2">
              <div className="relative">
                <img
                  src={previewSrc}
                  alt="नवीन फोटो preview"
                  className="w-full h-40 object-cover object-top rounded-xl border-2"
                  style={{ borderColor: "oklch(0.65 0.22 43)" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSrc(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow"
                  style={{ background: "oklch(0.45 0.20 25)" }}
                >
                  <X size={13} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-9 rounded-xl font-display font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ background: "oklch(0.65 0.22 43)" }}
                data-ocid="admin.site_photo.save_button"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    जतन होत आहे...
                  </>
                ) : (
                  "फोटो जतन करा"
                )}
              </button>
            </div>
          ) : (
            <label
              htmlFor={`site-photo-${photoKey}`}
              className="block cursor-pointer"
            >
              <div
                className="w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: "oklch(0.65 0.22 43 / 0.40)",
                  background: "oklch(0.65 0.22 43 / 0.04)",
                }}
                data-ocid="admin.site_photo.dropzone"
              >
                {isProcessing ? (
                  <Loader2
                    size={28}
                    className="animate-spin"
                    style={{ color: "oklch(0.65 0.22 43)" }}
                  />
                ) : (
                  <>
                    <Camera
                      size={28}
                      style={{ color: "oklch(0.65 0.22 43)" }}
                    />
                    <p
                      className="font-body text-sm font-semibold text-center px-2"
                      style={{ color: "oklch(0.52 0.20 43)" }}
                    >
                      📷 गॅलरीतून फोटो निवडा
                    </p>
                    <p
                      className="font-body text-sm"
                      style={{ color: "oklch(0.60 0.02 243)" }}
                    >
                      हा फोटो वेबसाइटवर कायमस्वरूपी दिसेल
                    </p>
                  </>
                )}
              </div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

function SitePhotosTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          वेबसाइट फोटो व्यवस्थापन
        </h3>
      </div>
      <p
        className="font-body text-sm"
        style={{ color: "oklch(0.45 0.03 243)" }}
      >
        खाली दिलेल्या विभागांमधील फोटो थेट मोबाईल गॅलरीतून अपलोड करा. फोटो जतन केल्यावर
        वेबसाइटवर लगेच दिसतील.
      </p>

      <SitePhotoSection
        photoKey="navbar"
        label="Navbar आयकॉन फोटो"
        description="नेव्हिगेशन बारमध्ये डाव्या बाजूला दिसणारा गोल आयकॉन फोटो."
      />
      <SitePhotoSection
        photoKey="hero"
        label="Hero Portrait फोटो"
        description="मुख्यपृष्ठावर उजव्या बाजूला दिसणारा मोठा portrait फोटो."
      />
      <SitePhotoSection
        photoKey="about"
        label="परिचय विभाग फोटो"
        description="'परिचय' विभागात डाव्या बाजूला दिसणारा फोटो."
      />
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const { data: notifications = [], isLoading } = useGetAllNotifications();
  const { mutateAsync: addNotification, isPending: isAdding } =
    useAddNotification();
  const { mutate: markAllRead, isPending: isMarkingRead } =
    useMarkAllNotificationsRead();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("कृपया शीर्षक आणि संदेश भरा.");
      return;
    }
    try {
      await addNotification({ title: title.trim(), body: body.trim() });
      toast.success("सूचना यशस्वीरित्या पाठवली!");
      setTitle("");
      setBody("");
    } catch {
      toast.error("सूचना पाठवता आली नाही.");
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("mr-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sorted = [...notifications].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div className="space-y-6">
      {/* Send notification form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h3
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन सूचना पाठवा
        </h3>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="notif-title"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              शीर्षक *
            </Label>
            <Input
              id="notif-title"
              type="text"
              placeholder="उदा. नवीन विकास काम सुरू"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 rounded-lg font-body text-sm"
              data-ocid="admin.notification.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="notif-body"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              संदेश *
            </Label>
            <Textarea
              id="notif-body"
              placeholder="सूचनेचा तपशीलवार संदेश..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
              className="rounded-lg font-body text-sm resize-none"
              data-ocid="admin.notification.textarea"
            />
          </div>
          <Button
            type="submit"
            disabled={isAdding}
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
            data-ocid="admin.notification.submit_button"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                पाठवत आहे...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                सूचना पाठवा
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Past notifications list */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            पाठवलेल्या सूचना
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={isMarkingRead || notifications.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-200 disabled:opacity-50"
              style={{
                background: "oklch(0.60 0.18 150 / 0.12)",
                color: "oklch(0.38 0.16 150)",
                border: "1px solid oklch(0.60 0.18 150 / 0.25)",
              }}
              data-ocid="admin.notification.secondary_button"
            >
              {isMarkingRead ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle2 size={12} />
              )}
              सर्व वाचले चिन्हांकित करा
            </button>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold font-body"
              style={{
                background: "oklch(0.28 0.04 243 / 0.08)",
                color: "oklch(0.28 0.04 243)",
              }}
            >
              एकूण: {notifications.length}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
            data-ocid="admin.notification.empty_state"
          >
            <Bell
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणतीही सूचना पाठवलेली नाही
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((n, i) => (
              <div
                key={String(n.id)}
                data-ocid={`admin.notification.item.${i + 1}`}
                className="rounded-2xl p-4 border"
                style={{
                  borderColor: "oklch(0.28 0.04 243 / 0.10)",
                  background: "oklch(0.98 0.003 243)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className="font-display font-bold text-sm"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    {n.title}
                  </p>
                  <p
                    className="font-body text-xs shrink-0"
                    style={{ color: "oklch(0.55 0.02 243)" }}
                  >
                    {formatDate(n.timestamp)}
                  </p>
                </div>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "oklch(0.40 0.03 243)" }}
                >
                  {n.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HD Gallery Tab ───────────────────────────────────────────────────────────

function HDGalleryTab() {
  const { data: allPhotos = [], isLoading } = useGetAllGalleryPhotos();
  const { mutateAsync: addPhoto, isPending: isAdding } = useAddGalleryPhoto();
  const { mutateAsync: deletePhoto, isPending: isDeleting } =
    useDeleteGalleryPhoto();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const hdPhotos = allPhotos.filter((p) => p.sub === "hd");

  const [caption, setCaption] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlFallback, setUrlFallback] = useState("");
  const hdFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImageFile(file);
      setPreviewSrc(resized);
      setUrlFallback("");
    } catch {
      toast.error("फोटो प्रक्रिया करताना चूक झाली.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setPreviewSrc(null);
    if (hdFileInputRef.current) hdFileInputRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewSrc || urlFallback.trim();
    if (!finalUrl || !caption.trim()) {
      toast.error("कृपया फोटो निवडा आणि शीर्षक भरा.");
      return;
    }
    try {
      await addPhoto({ url: finalUrl, caption: caption.trim(), sub: "hd" });
      toast.success("HD फोटो यशस्वीरित्या जोडला!");
      setCaption("");
      setPreviewSrc(null);
      setUrlFallback("");
      if (hdFileInputRef.current) hdFileInputRef.current.value = "";
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deletePhoto(id);
      toast.success("HD फोटो हटवला.");
    } catch {
      toast.error("फोटो हटवता आला नाही.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="font-display font-bold text-lg mb-1"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          HD फोटो विभाग
        </h3>
        <p
          className="font-body text-sm"
          style={{ color: "oklch(0.50 0.03 243)" }}
        >
          येथे जोडलेले फोटो वेबसाइटवर "भैय्या खेडकर - विशेष फोटो" विभागात दिसतील.
        </p>
      </div>

      {/* Add form */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "oklch(0.65 0.22 43 / 0.20)",
          background: "oklch(0.65 0.22 43 / 0.04)",
        }}
      >
        <h4
          className="font-display font-bold text-base mb-4"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          नवीन HD फोटो जोडा
        </h4>
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Gallery upload */}
          <div className="space-y-2">
            <Label
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              📷 गॅलरीतून HD फोटो निवडा
            </Label>
            <input
              ref={hdFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="hd-gallery-photo-upload"
            />
            {previewSrc ? (
              <div
                className="relative rounded-xl overflow-hidden border-2"
                style={{ borderColor: "oklch(0.65 0.22 43)" }}
              >
                <img
                  src={previewSrc}
                  alt="निवडलेला फोटो"
                  className="w-full h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: "oklch(0.45 0.20 25)" }}
                >
                  <X size={15} />
                </button>
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-body font-semibold text-white"
                  style={{ background: "oklch(0.40 0.16 150 / 0.90)" }}
                >
                  ✓ HD फोटो निवडला
                </div>
              </div>
            ) : (
              <label
                htmlFor="hd-gallery-photo-upload"
                className="block cursor-pointer"
                data-ocid="admin.hd-gallery.upload_button"
              >
                <div
                  className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:opacity-80"
                  style={{
                    borderColor: "oklch(0.65 0.22 43 / 0.40)",
                    background: "oklch(0.65 0.22 43 / 0.04)",
                  }}
                >
                  {isProcessing ? (
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "oklch(0.65 0.22 43)" }}
                    />
                  ) : (
                    <>
                      <Camera
                        size={28}
                        style={{ color: "oklch(0.65 0.22 43)" }}
                      />
                      <p
                        className="font-body text-sm font-semibold"
                        style={{ color: "oklch(0.52 0.20 43)" }}
                      >
                        येथे टॅप करा — गॅलरी / कॅमेरा
                      </p>
                      <p
                        className="font-body text-xs"
                        style={{ color: "oklch(0.60 0.02 243)" }}
                      >
                        हा फोटो HD विभागात दिसेल
                      </p>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* URL fallback */}
          <div className="space-y-1.5">
            <Label
              htmlFor="hd-url-fallback"
              className="font-body text-xs font-semibold flex items-center gap-1.5"
              style={{ color: "oklch(0.45 0.02 243)" }}
            >
              <Upload size={11} />
              किंवा URL टाका
            </Label>
            <Input
              id="hd-url-fallback"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={urlFallback}
              onChange={(e) => {
                setUrlFallback(e.target.value);
                if (e.target.value) clearFile();
              }}
              disabled={!!previewSrc}
              className="h-10 rounded-lg font-body text-sm"
              style={{ opacity: previewSrc ? 0.45 : 1 }}
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <Label
              htmlFor="hd-caption"
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              शीर्षक *
            </Label>
            <Input
              id="hd-caption"
              type="text"
              placeholder="उदा. प्रभाग क्र. ८ दौरा"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              className="h-10 rounded-lg font-body text-sm"
              data-ocid="admin.hd-gallery.input"
            />
          </div>

          <Button
            type="submit"
            disabled={
              isAdding ||
              isProcessing ||
              (!previewSrc && !urlFallback.trim()) ||
              !caption.trim()
            }
            className="h-10 px-6 rounded-xl font-display font-bold text-sm text-white"
            style={{ background: "oklch(0.65 0.22 43)" }}
            data-ocid="admin.hd-gallery.submit_button"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              "HD फोटो जोडा"
            )}
          </Button>
        </form>
      </div>

      {/* HD Photos list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            सध्याचे HD फोटो
          </h4>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-body"
            style={{
              background: "oklch(0.28 0.04 243 / 0.08)",
              color: "oklch(0.28 0.04 243)",
            }}
          >
            एकूण: {hdPhotos.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.65 0.22 43)" }}
            />
          </div>
        ) : hdPhotos.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            data-ocid="admin.hd-gallery.empty_state"
            style={{
              borderColor: "oklch(0.28 0.04 243 / 0.10)",
              background: "oklch(0.97 0.005 243)",
            }}
          >
            <Image
              size={36}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "oklch(0.28 0.04 243)" }}
            />
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.28 0.04 243 / 0.50)" }}
            >
              अजून कोणताही HD फोटो जोडलेला नाही
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hdPhotos.map((photo) => (
              <div
                key={String(photo.id)}
                className="relative rounded-xl overflow-hidden border group"
                style={{ borderColor: "oklch(0.28 0.04 243 / 0.10)" }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-28 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="p-2 flex items-center justify-between gap-1">
                  <p
                    className="font-body text-xs font-semibold truncate flex-1"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    {photo.caption}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting && deletingId === photo.id}
                    onClick={() => handleDelete(photo.id)}
                    className="shrink-0 h-7 w-7 p-0 rounded-lg hover:bg-red-50"
                    style={{ color: "oklch(0.55 0.20 25)" }}
                    data-ocid="admin.hd-gallery.delete_button"
                  >
                    {isDeleting && deletingId === photo.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Tabs (grouped, simplified layout) ──────────────────────────────

function DashboardTabs() {
  const { data: unreadGrievanceCount = 0n } = useGetUnreadGrievanceCount();
  const grievanceBadge = Number(unreadGrievanceCount) > 0;
  const [activeTab, setActiveTab] = useState("grievances");

  const primaryTabs = [
    {
      value: "grievances",
      icon: MessageSquare,
      label: "तक्रारी",
      badge: grievanceBadge,
      ocid: "admin.grievances.tab",
    },
    {
      value: "photos",
      icon: Camera,
      label: "फोटो",
      badge: false,
      ocid: "admin.photos.tab",
    },
    {
      value: "gallery",
      icon: Image,
      label: "गॅलरी",
      badge: false,
      ocid: "admin.gallery.tab",
    },
    {
      value: "hd-gallery",
      icon: Image,
      label: "HD फोटो",
      badge: false,
      ocid: "admin.hd-gallery.tab",
    },
    {
      value: "notifications",
      icon: Bell,
      label: "सूचना",
      badge: false,
      ocid: "admin.notifications.tab",
    },
  ];

  const mgmtTabs = [
    {
      value: "projects",
      icon: FileText,
      label: "विकास कामे",
      badge: false,
      ocid: "admin.projects.tab",
    },
    {
      value: "schemes",
      icon: BookOpen,
      label: "योजना",
      badge: false,
      ocid: "admin.schemes.tab",
    },
    {
      value: "civic",
      icon: Building2,
      label: "नागरी सेवा",
      badge: false,
      ocid: "admin.civic.tab",
    },
    {
      value: "team",
      icon: Users,
      label: "टीम",
      badge: false,
      ocid: "admin.team.tab",
    },
    {
      value: "ratings",
      icon: Star,
      label: "रेटिंग",
      badge: false,
      ocid: "admin.ratings.tab",
    },
  ];

  const isPrimary = primaryTabs.some((t) => t.value === activeTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* ── Tab Navigation ──────────────────────────────────────── */}
      <div className="mb-6 space-y-3">
        {/* Primary group */}
        <div>
          <p
            className="font-body text-xs font-bold mb-2 px-1"
            style={{ color: "oklch(0.52 0.20 43)" }}
          >
            📋 दैनंदिन
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  data-ocid={tab.ocid}
                  onClick={() => setActiveTab(tab.value)}
                  className="relative flex items-center gap-2 px-4 py-3 rounded-xl font-body font-semibold text-sm whitespace-nowrap transition-all duration-200 shrink-0"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.65 0.22 43)",
                          color: "white",
                          boxShadow: "0 2px 12px oklch(0.65 0.22 43 / 0.40)",
                        }
                      : {
                          background: "oklch(0.97 0.005 43)",
                          color: "oklch(0.40 0.06 43)",
                          border: "1.5px solid oklch(0.88 0.04 43)",
                        }
                  }
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ background: "oklch(0.55 0.25 25)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Management group */}
        <div>
          <p
            className="font-body text-xs font-bold mb-2 px-1"
            style={{ color: "oklch(0.40 0.04 243)" }}
          >
            ⚙️ व्यवस्थापन
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {mgmtTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  data-ocid={tab.ocid}
                  onClick={() => setActiveTab(tab.value)}
                  className="relative flex items-center gap-2 px-4 py-3 rounded-xl font-body font-semibold text-sm whitespace-nowrap transition-all duration-200 shrink-0"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.28 0.04 243)",
                          color: "white",
                          boxShadow: "0 2px 12px oklch(0.28 0.04 243 / 0.35)",
                        }
                      : {
                          background: "oklch(0.96 0.008 243)",
                          color: "oklch(0.38 0.04 243)",
                          border: "1.5px solid oklch(0.88 0.02 243)",
                        }
                  }
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content Panel ────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 shadow-sm border"
        style={{
          background: "white",
          borderColor: isPrimary
            ? "oklch(0.65 0.22 43 / 0.12)"
            : "oklch(0.28 0.04 243 / 0.08)",
        }}
      >
        <TabsContent value="grievances" className="mt-0">
          <GrievancesTab />
        </TabsContent>
        <TabsContent value="photos" className="mt-0">
          <SitePhotosTab />
        </TabsContent>
        <TabsContent value="gallery" className="mt-0">
          <GalleryTab />
        </TabsContent>
        <TabsContent value="hd-gallery" className="mt-0">
          <HDGalleryTab />
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="projects" className="mt-0">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="schemes" className="mt-0">
          <SchemesTab />
        </TabsContent>
        <TabsContent value="civic" className="mt-0">
          <CivicServicesTab />
        </TabsContent>
        <TabsContent value="team" className="mt-0">
          <TeamMembersTab />
        </TabsContent>
        <TabsContent value="ratings" className="mt-0">
          <RatingsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.96 0.008 240)" }}
    >
      {/* Top Bar */}
      <div
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm border-b"
        style={{
          background: "oklch(0.20 0.04 243)",
          borderColor: "oklch(1 0 0 / 0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.65 0.22 43 / 0.20)" }}
          >
            <Shield size={16} style={{ color: "oklch(0.65 0.22 43)" }} />
          </div>
          <div>
            <p
              className="font-display font-bold text-sm leading-tight"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              Admin Panel
            </p>
            <p
              className="font-body text-xs leading-tight"
              style={{ color: "oklch(1 0 0 / 0.45)" }}
            >
              प्रभाग क्र. ८ · कोल्हापूर
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="font-body text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "oklch(1 0 0 / 0.50)" }}
          >
            वेबसाइट
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="h-8 gap-1.5 rounded-lg font-body text-xs"
            style={{ color: "oklch(0.65 0.22 43)" }}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">लॉगआउट</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1
            className="font-display text-2xl md:text-3xl font-bold"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            नमस्कार! 🙏
          </h1>
          <p
            className="font-body text-base mt-1"
            style={{ color: "oklch(0.45 0.03 243)" }}
          >
            नगरसेवक प्रशांत भैय्या खेडकर — प्रभाग क्र. ८ Admin Dashboard
          </p>
        </div>

        {/* Tabs */}
        <DashboardTabs />

        {/* Footer note */}
        <p
          className="text-center font-body text-xs mt-8"
          style={{ color: "oklch(0.60 0.02 243)" }}
        >
          © {new Date().getFullYear()} नगरसेवक प्रशांत उर्फ भैय्या खेडकर · प्रभाग क्र. ८,
          कोल्हापूर महानगरपालिका
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  if (!isAdmin) {
    return <LoginScreen onLogin={() => setIsAdmin(true)} />;
  }

  return <Dashboard onLogout={() => setIsAdmin(false)} />;
}
