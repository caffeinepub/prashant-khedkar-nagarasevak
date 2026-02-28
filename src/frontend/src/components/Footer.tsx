import { Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const navLinks = [
  { label: "मुख्यपृष्ठ", href: "#hero" },
  { label: "परिचय", href: "#about" },
  { label: "विकास कामे", href: "#projects" },
  { label: "फोटो गॅलरी", href: "#gallery" },
  { label: "तक्रार / संपर्क", href: "#contact" },
];

const socialLinks = [
  { icon: SiFacebook, label: "Facebook", href: "#" },
  { icon: SiInstagram, label: "Instagram", href: "#" },
  { icon: SiYoutube, label: "YouTube", href: "#" },
  { icon: SiX, label: "X (Twitter)", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="py-16" style={{ background: "oklch(0.20 0.04 243)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div
              className="font-display text-xl font-bold mb-2"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              नगरसेवक प्रशांत उर्फ भैय्या खेडकर
            </div>
            <p className="font-body text-white/60 text-base mb-4">
              प्रभाग क्र. ८, कोल्हापूर महानगरपालिका
            </p>
            <p
              className="font-display italic text-lg font-bold"
              style={{ color: "oklch(0.80 0.12 43)" }}
            >
              "नाव एक, कामे अनेक..!"
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(0.65 0.22 43 / 0.15)" }}
                >
                  <Icon size={18} style={{ color: "oklch(0.65 0.22 43)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4
              className="font-display font-bold text-base mb-4"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              द्रुत दुवे
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="font-body text-white/70 hover:text-white transition-colors text-base"
                  >
                    → {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4
              className="font-display font-bold text-base mb-4"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              संपर्क
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <MapPin
                  size={18}
                  className="shrink-0 mt-0.5"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                />
                <span className="font-body text-white/70 text-sm">
                  प्रभाग क्र. ८,
                  <br />
                  कोल्हापूर - ४१६०१२
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone
                  size={18}
                  className="shrink-0"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                />
                <span className="font-body text-white/70 text-sm">
                  +91 97641 51234
                  <br />
                  +91 95298 83084
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail
                  size={18}
                  className="shrink-0"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                />
                <span className="font-body text-white/70 text-sm">
                  prashant.khedkar8@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: "oklch(1 0 0 / 0.1)" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="font-body text-white/50">
            © {currentYear} सर्व हक्क राखीव | नगरसेवक प्रशांत उर्फ भैय्या खेडकर
          </p>
          <p className="font-body text-white/40">
            Built with ❤️ using{" "}
            <a
              href={caffeineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
