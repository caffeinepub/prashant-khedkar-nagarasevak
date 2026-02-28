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
  useAddGalleryPhoto,
  useAddProject,
  useAdminLogin,
  useDeleteGalleryPhoto,
  useDeleteProject,
  useGetAllGalleryPhotos,
  useGetAllGrievances,
  useGetAllProjects,
  useUpdateAdminPassword,
} from "@/hooks/useQueries";
import {
  CheckCircle2,
  Clock,
  FileText,
  Image,
  KeyRound,
  Loader2,
  LogOut,
  MessageSquare,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
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

function GrievancesTab() {
  const { data: grievances = [], isLoading } = useGetAllGrievances();

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          प्राप्त तक्रारी
        </h3>
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

      {grievances.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border"
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
            <div
              key={String(g.id)}
              className="rounded-2xl p-5 border"
              style={{
                borderColor: "oklch(0.28 0.04 243 / 0.10)",
                background: "oklch(0.98 0.003 243)",
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
                <p
                  className="font-body text-xs shrink-0"
                  style={{ color: "oklch(0.50 0.02 243)" }}
                >
                  {formatDate(g.timestamp)}
                </p>
              </div>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "oklch(0.35 0.04 243)" }}
              >
                {g.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !caption.trim()) {
      toast.error("कृपया URL आणि शीर्षक भरा.");
      return;
    }
    try {
      await addPhoto({
        url: url.trim(),
        caption: caption.trim(),
        sub: sub.trim(),
      });
      toast.success("फोटो यशस्वीरित्या जोडला!");
      setUrl("");
      setCaption("");
      setSub("");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="g-url"
                className="font-body text-sm font-semibold"
                style={{ color: "oklch(0.28 0.04 243)" }}
              >
                फोटो URL *
              </Label>
              <Input
                id="g-url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="h-10 rounded-lg font-body text-sm"
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

// ─── Change Password ───────────────────────────────────────────────────────────

function ChangePasswordSection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutateAsync: updatePassword, isPending } = useUpdateAdminPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error("कृपया दोन्ही पासवर्ड भरा.");
      return;
    }
    try {
      const success = await updatePassword({ oldPassword, newPassword });
      if (success) {
        toast.success("पासवर्ड यशस्वीरित्या बदलला!");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error("जुना पासवर्ड चुकीचा आहे.");
      }
    } catch {
      toast.error("काहीतरी चूक झाली.");
    }
  };

  return (
    <div
      className="rounded-2xl p-6 border mt-8"
      style={{
        borderColor: "oklch(0.28 0.04 243 / 0.12)",
        background: "oklch(0.98 0.003 243)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={18} style={{ color: "oklch(0.28 0.04 243)" }} />
        <h3
          className="font-display font-bold text-base"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          पासवर्ड बदला
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="password"
          placeholder="जुना पासवर्ड"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="h-10 rounded-lg font-body text-sm flex-1"
        />
        <Input
          type="password"
          placeholder="नवा पासवर्ड"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="h-10 rounded-lg font-body text-sm flex-1"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 px-5 rounded-xl font-display font-bold text-sm text-white shrink-0"
          style={{ background: "oklch(0.28 0.04 243)" }}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "पासवर्ड बदला"
          )}
        </Button>
      </form>
    </div>
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
        <Tabs defaultValue="grievances">
          <TabsList
            className="w-full mb-6 h-12 rounded-xl p-1"
            style={{ background: "oklch(0.28 0.04 243 / 0.08)" }}
          >
            <TabsTrigger
              value="grievances"
              className="flex-1 h-10 rounded-lg font-body font-semibold text-sm gap-2 data-[state=active]:text-white"
              style={
                {
                  "--tw-data-active-bg": "oklch(0.28 0.04 243)",
                } as React.CSSProperties
              }
            >
              <MessageSquare size={15} />
              <span className="hidden sm:inline">तक्रारी</span>
              <span className="sm:hidden">तक्रारी</span>
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="flex-1 h-10 rounded-lg font-body font-semibold text-sm gap-2 data-[state=active]:text-white"
            >
              <Image size={15} />
              <span>गॅलरी</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="flex-1 h-10 rounded-lg font-body font-semibold text-sm gap-2 data-[state=active]:text-white"
            >
              <FileText size={15} />
              <span>विकास कामे</span>
            </TabsTrigger>
          </TabsList>

          <div
            className="rounded-2xl p-6 shadow-sm border"
            style={{
              background: "white",
              borderColor: "oklch(0.28 0.04 243 / 0.08)",
            }}
          >
            <TabsContent value="grievances" className="mt-0">
              <GrievancesTab />
            </TabsContent>
            <TabsContent value="gallery" className="mt-0">
              <GalleryTab />
            </TabsContent>
            <TabsContent value="projects" className="mt-0">
              <ProjectsTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* Change Password */}
        <ChangePasswordSection />

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
