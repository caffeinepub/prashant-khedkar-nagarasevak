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
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminGalleryPanel() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [sub, setSub] = useState("");

  const { mutateAsync: addPhoto, isPending } = useAddGalleryPhoto();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !caption.trim()) {
      toast.error("कृपया फोटो URL आणि शीर्षक भरा.");
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
          {/* Photo URL */}
          <div className="space-y-2">
            <Label
              htmlFor="photo-url"
              className="font-body font-semibold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              फोटो URL <span style={{ color: "oklch(0.65 0.22 43)" }}>*</span>
            </Label>
            <Input
              id="photo-url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="font-body text-sm rounded-xl border-border focus-visible:ring-primary h-11"
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
            disabled={isPending}
            className="w-full h-11 rounded-full font-display font-bold text-base text-white transition-all duration-200 hover:opacity-90"
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
