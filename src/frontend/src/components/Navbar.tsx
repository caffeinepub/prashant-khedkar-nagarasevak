import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "मुख्यपृष्ठ", href: "#hero" },
  { label: "परिचय", href: "#about" },
  { label: "कामे", href: "#projects" },
  { label: "फोटो", href: "#gallery" },
  { label: "संपर्क", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
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
            className="flex flex-col leading-tight text-left"
          >
            <span
              className="font-display font-bold text-base md:text-lg"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              नगरसेवक प्रशांत उर्फ भैय्या खेडकर
            </span>
            <span className="text-xs md:text-sm text-muted-foreground font-body">
              प्रभाग क्र. ८ • कोल्हापूर महानगरपालिका
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
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
              className="ml-2 px-5 py-2 rounded-full font-display font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              style={{ background: "oklch(0.65 0.22 43)" }}
            >
              तक्रार नोंदवा
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "बंद करा" : "मेनू उघडा"}
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
                className="mt-2 text-center py-3 rounded-full font-display font-bold text-base text-white"
                style={{ background: "oklch(0.65 0.22 43)" }}
              >
                तक्रार नोंदवा
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
