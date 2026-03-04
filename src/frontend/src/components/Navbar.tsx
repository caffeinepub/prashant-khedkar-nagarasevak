import { Camera, Menu, Phone, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSitePhoto } from "../hooks/useSitePhoto";
import ShareModal from "./ShareModal";

const navLinks = [
  { label: "मुख्यपृष्ठ", href: "#hero" },
  { label: "परिचय", href: "#about" },
  { label: "कामे", href: "#projects" },
  { label: "योजना", href: "#schemes" },
  { label: "नागरी सेवा", href: "#civic-services" },
  { label: "माहिती", href: "#information" },
  { label: "फोटो", href: "#gallery" },
  { label: "संपर्क", href: "#contact" },
];

// ─── Call Dropdown ─────────────────────────────────────────────────────────────

function CallDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl border z-[200] overflow-hidden"
      style={{
        background: "white",
        borderColor: "oklch(0.28 0.04 243 / 0.12)",
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
      >
        <p
          className="font-display font-bold text-sm"
          style={{ color: "oklch(0.28 0.04 243)" }}
        >
          📞 थेट कॉल करा
        </p>
      </div>
      <div className="p-2 space-y-1">
        <a
          href="tel:+919764151234"
          data-ocid="navbar.call.button.1"
          className="flex items-center justify-between w-full px-3 py-3 rounded-xl transition-colors hover:bg-orange-50 group"
          onClick={onClose}
        >
          <div>
            <p
              className="font-display font-bold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              नगरसेवक
            </p>
            <p
              className="font-body text-xs mt-0.5"
              style={{ color: "oklch(0.52 0.20 43)" }}
            >
              +91 97641 51234
            </p>
          </div>
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ background: "oklch(0.65 0.22 43)" }}
          >
            <Phone size={16} className="text-white" />
          </span>
        </a>
        <a
          href="tel:+919529883084"
          data-ocid="navbar.call.button.2"
          className="flex items-center justify-between w-full px-3 py-3 rounded-xl transition-colors hover:bg-orange-50 group"
          onClick={onClose}
        >
          <div>
            <p
              className="font-display font-bold text-sm"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              कार्यालय
            </p>
            <p
              className="font-body text-xs mt-0.5"
              style={{ color: "oklch(0.52 0.20 43)" }}
            >
              +91 95298 83084
            </p>
          </div>
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ background: "oklch(0.28 0.04 243)" }}
          >
            <Phone size={16} className="text-white" />
          </span>
        </a>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [mobileCallOpen, setMobileCallOpen] = useState(false);
  const { photoSrc, isLoading: photoLoading } = useSitePhoto("navbar");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = () => {
    setIsOpen(false);
    setShareOpen(true);
  };

  return (
    <Fragment>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white/95 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand */}
            <button
              type="button"
              onClick={() => handleNavClick("#hero")}
              className="flex items-center gap-2.5 text-left"
              data-ocid="navbar.link"
            >
              {photoLoading ? (
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-display font-bold text-base text-white"
                  style={{
                    borderColor: "oklch(0.65 0.22 43)",
                    background: "oklch(0.65 0.22 43)",
                  }}
                >
                  भ
                </div>
              ) : photoSrc ? (
                <img
                  src={photoSrc}
                  alt="भैय्या खेडकर"
                  className="h-10 w-10 rounded-full object-cover object-top shrink-0 border-2"
                  style={{ borderColor: "oklch(0.65 0.22 43)" }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2"
                  style={{
                    borderColor: "oklch(0.65 0.22 43 / 0.50)",
                    background: "oklch(0.95 0.01 43)",
                  }}
                  title="Admin पॅनेलमधून फोटो जोडा"
                >
                  <Camera size={18} style={{ color: "oklch(0.65 0.22 43)" }} />
                </div>
              )}
              <div className="flex flex-col leading-tight">
                <span
                  className="font-display font-bold text-base md:text-lg"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                >
                  नगरसेवक प्रशांत उर्फ भैय्या खेडकर
                </span>
                <span className="text-xs md:text-sm text-muted-foreground font-body">
                  प्रभाग क्र. ८ • कोल्हापूर महानगरपालिका
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="navbar.link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-body font-semibold text-base transition-colors duration-200 hover:text-primary"
                  style={{ color: "oklch(0.28 0.04 243)" }}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => handleNavClick("#contact")}
                data-ocid="navbar.primary_button"
                className="ml-2 px-5 py-2 rounded-full font-display font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
                style={{ background: "oklch(0.65 0.22 43)" }}
              >
                तक्रार नोंदवा
              </button>

              {/* Call button (desktop) */}
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setCallOpen((v) => !v)}
                  data-ocid="navbar.call.toggle"
                  className="p-2 rounded-full border transition-all duration-200 hover:bg-muted flex items-center gap-1.5 px-3"
                  style={{
                    borderColor: "oklch(0.65 0.22 43)",
                    color: "oklch(0.65 0.22 43)",
                  }}
                  aria-label="कॉल करा"
                  title="कॉल करा"
                >
                  <Phone size={16} />
                  <span className="font-body font-semibold text-sm">
                    कॉल करा
                  </span>
                </button>
                <CallDropdown
                  open={callOpen}
                  onClose={() => setCallOpen(false)}
                />
              </div>

              <button
                type="button"
                onClick={handleShare}
                data-ocid="navbar.share.button"
                className="ml-1 p-2 rounded-full border transition-all duration-200 hover:bg-muted"
                style={{
                  borderColor: "oklch(0.65 0.22 43)",
                  color: "oklch(0.65 0.22 43)",
                }}
                aria-label="शेअर करा"
                title="शेअर करा"
              >
                <Share2 size={18} />
              </button>
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-muted"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "बंद करा" : "मेनू उघडा"}
              data-ocid="navbar.toggle"
            >
              {isOpen ? (
                <X size={24} style={{ color: "oklch(0.28 0.04 243)" }} />
              ) : (
                <Menu size={24} style={{ color: "oklch(0.28 0.04 243)" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-border overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-ocid="navbar.link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="py-2 font-body font-semibold text-lg border-b border-border/50 transition-colors hover:text-primary"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => handleNavClick("#contact")}
                  data-ocid="navbar.mobile.primary_button"
                  className="mt-2 text-center py-3 rounded-full font-display font-bold text-base text-white"
                  style={{ background: "oklch(0.65 0.22 43)" }}
                >
                  तक्रार नोंदवा
                </button>

                {/* Mobile Call option */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCallOpen((v) => !v)}
                    data-ocid="navbar.mobile.call.toggle"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-display font-bold text-base border transition-colors"
                    style={{
                      borderColor: "oklch(0.65 0.22 43)",
                      color: "oklch(0.65 0.22 43)",
                    }}
                  >
                    <Phone size={18} />📞 कॉल करा
                  </button>
                  <AnimatePresence>
                    {mobileCallOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 rounded-2xl border overflow-hidden"
                        style={{
                          borderColor: "oklch(0.65 0.22 43 / 0.20)",
                          background: "oklch(0.65 0.22 43 / 0.04)",
                        }}
                      >
                        <a
                          href="tel:+919764151234"
                          data-ocid="navbar.mobile.call.button.1"
                          className="flex items-center justify-between px-4 py-3 border-b"
                          style={{ borderColor: "oklch(0.28 0.04 243 / 0.08)" }}
                          onClick={() => {
                            setMobileCallOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <p
                              className="font-display font-bold text-sm"
                              style={{ color: "oklch(0.28 0.04 243)" }}
                            >
                              नगरसेवक
                            </p>
                            <p
                              className="font-body text-xs"
                              style={{ color: "oklch(0.52 0.20 43)" }}
                            >
                              +91 97641 51234
                            </p>
                          </div>
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "oklch(0.65 0.22 43)" }}
                          >
                            <Phone size={14} className="text-white" />
                          </span>
                        </a>
                        <a
                          href="tel:+919529883084"
                          data-ocid="navbar.mobile.call.button.2"
                          className="flex items-center justify-between px-4 py-3"
                          onClick={() => {
                            setMobileCallOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <p
                              className="font-display font-bold text-sm"
                              style={{ color: "oklch(0.28 0.04 243)" }}
                            >
                              कार्यालय
                            </p>
                            <p
                              className="font-body text-xs"
                              style={{ color: "oklch(0.52 0.20 43)" }}
                            >
                              +91 95298 83084
                            </p>
                          </div>
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "oklch(0.28 0.04 243)" }}
                          >
                            <Phone size={14} className="text-white" />
                          </span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  data-ocid="navbar.mobile.share.button"
                  className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-bold text-base border transition-colors"
                  style={{
                    borderColor: "oklch(0.65 0.22 43)",
                    color: "oklch(0.65 0.22 43)",
                  }}
                >
                  <Share2 size={18} />
                  शेअर करा
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </Fragment>
  );
}
