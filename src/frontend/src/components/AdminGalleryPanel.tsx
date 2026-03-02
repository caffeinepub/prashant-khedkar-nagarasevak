import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddGalleryPhoto } from "@/hooks/useQueries";
import { Camera, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// Resize image to max 800px width using canvas, returns base64 data URL
function resizeImage(file: File): Promise<string> {
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

export default function AdminGalleryPanel() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [sub, setSub] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: addPhoto, isPending } = useAddGalleryPhoto();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImage(file);
      setPreviewSrc(resized);
      setUrl(""); // file takes priority, clear url field
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      setOpen(false);
    } catch {
      toast.error("काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-80"
          style={{
            background: "oklch(0.65 0.22 43 / 0.10)",
            color: "oklch(0.52 0.20 43)",
          }}
          aria-label="Admin: फोटो जोडा"
        >
          <ImagePlus size={13} />
          <span>Admin</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            गॅलरीत फोटो जोडा
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Mobile-friendly file upload area */}
          <div className="space-y-2">
            <Label
              className="font-body font-semibold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              मोबाईल गॅलरीतून फोटो निवडा
            </Label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="gallery-file-upload"
            />

            {previewSrc ? (
              /* Preview */
              <div
                className="relative rounded-xl overflow-hidden border-2"
                style={{ borderColor: "oklch(0.65 0.22 43)" }}
              >
                <img
                  src={previewSrc}
                  alt="निवडलेला फोटो"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: "oklch(0.45 0.20 25)" }}
                  aria-label="फोटो काढा"
                >
                  <X size={16} />
                </button>
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-body font-semibold text-white"
                  style={{ background: "oklch(0.40 0.16 150 / 0.90)" }}
                >
                  ✓ फोटो निवडला
                </div>
              </div>
            ) : (
              /* Upload tap area */
              <label
                htmlFor="gallery-file-upload"
                className="block cursor-pointer"
              >
                <div
                  className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:opacity-80 active:scale-98"
                  style={{
                    borderColor: "oklch(0.65 0.22 43 / 0.45)",
                    background: "oklch(0.65 0.22 43 / 0.05)",
                  }}
                >
                  {isProcessing ? (
                    <Loader2
                      size={32}
                      className="animate-spin"
                      style={{ color: "oklch(0.65 0.22 43)" }}
                    />
                  ) : (
                    <>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                      >
                        <Camera
                          size={28}
                          style={{ color: "oklch(0.65 0.22 43)" }}
                        />
                      </div>
                      <div className="text-center">
                        <p
                          className="font-display font-bold text-sm"
                          style={{ color: "oklch(0.52 0.20 43)" }}
                        >
                          📷 येथे टॅप करा
                        </p>
                        <p
                          className="font-body text-xs mt-0.5"
                          style={{ color: "oklch(0.50 0.02 243)" }}
                        >
                          गॅलरी किंवा कॅमेरातून फोटो निवडा
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* URL fallback */}
          <div className="space-y-2">
            <Label
              htmlFor="photo-url"
              className="font-body font-semibold text-sm flex items-center gap-2"
              style={{ color: "oklch(0.45 0.02 243)" }}
            >
              <Upload size={13} />
              किंवा URL टाका
            </Label>
            <Input
              id="photo-url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) clearFile(); // url takes over if typed
              }}
              disabled={!!previewSrc}
              className="font-body text-sm rounded-xl border-border focus-visible:ring-primary h-11"
              style={{ opacity: previewSrc ? 0.45 : 1 }}
              autoComplete="off"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label
              htmlFor="photo-caption"
              className="font-body font-semibold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              फोटोचे शीर्षक{" "}
              <span style={{ color: "oklch(0.65 0.22 43)" }}>*</span>
            </Label>
            <Input
              id="photo-caption"
              type="text"
              placeholder="उदा. रस्ते डांबरीकरण उद्घाटन"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              className="font-body text-sm rounded-xl border-border focus-visible:ring-primary h-11"
            />
          </div>

          {/* Sub-caption */}
          <div className="space-y-2">
            <Label
              htmlFor="photo-sub"
              className="font-body font-semibold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              उपशीर्षक
            </Label>
            <Input
              id="photo-sub"
              type="text"
              placeholder="उदा. प्रभाग क्र. ८ मधील उद्घाटन"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="font-body text-sm rounded-xl border-border focus-visible:ring-primary h-11"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || isProcessing || (!previewSrc && !url.trim())}
            className="w-full h-12 rounded-full font-display font-bold text-base text-white transition-all duration-200 hover:opacity-90"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                जोडत आहे...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                फोटो जोडा
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
