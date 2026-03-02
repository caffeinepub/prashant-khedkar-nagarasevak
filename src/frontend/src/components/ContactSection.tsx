import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitGrievance } from "../hooks/useQueries";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: submitGrievance, isPending } = useSubmitGrievance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      toast.error("कृपया सर्व माहिती भरा.");
      return;
    }
    try {
      await submitGrievance({
        name: name.trim(),
        mobile: mobile.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      toast.success("तुमची तक्रार यशस्वीरित्या नोंदवली गेली!");
      setName("");
      setMobile("");
      setMessage("");
    } catch {
      toast.error("काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
    }
  };

  return (
    <section
      id="contact"
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
            <MessageSquare size={16} />
            <span>संपर्क</span>
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            तक्रार / संपर्क
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            तुमच्या समस्या आमच्यापर्यंत पोहोचवा. आम्ही लवकरात लवकर उत्तर देऊ.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="font-display text-2xl font-bold mb-6"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              कार्यालयीन माहिती
            </h3>

            <div className="space-y-5">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                >
                  <MapPin size={20} style={{ color: "oklch(0.65 0.22 43)" }} />
                </div>
                <div>
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    कार्यालय पत्ता
                  </p>
                  <p className="font-body text-muted-foreground text-base">
                    611 ए वॉर्ड खेडकर गल्ली,
                    <br />
                    बोर तालीम चौक,
                    <br />
                    लक्षतीर्थ वसाहत, कोल्हापूर
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                >
                  <Phone size={20} style={{ color: "oklch(0.65 0.22 43)" }} />
                </div>
                <div>
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    दूरध्वनी
                  </p>
                  <p className="font-body text-muted-foreground text-base">
                    +91 97641 51234
                  </p>
                  <p className="font-body text-muted-foreground text-base">
                    +91 95298 83084
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                >
                  <Clock size={20} style={{ color: "oklch(0.65 0.22 43)" }} />
                </div>
                <div>
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.28 0.04 243)" }}
                  >
                    कार्यालय वेळ
                  </p>
                  <p className="font-body text-muted-foreground text-base">
                    सोमवार - शनिवार: सकाळी ९:०० ते सायंकाळी ७:००
                  </p>
                  <p className="font-body text-muted-foreground text-base">
                    रविवार: सकाळी १०:०० ते दुपारी २:०० (आणीबाणी)
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative card */}
            <div
              className="mt-8 p-6 rounded-2xl"
              style={{ background: "oklch(0.28 0.04 243)" }}
            >
              <p className="font-display text-xl font-bold text-white mb-2">
                "नाव एक, कामे अनेक..!"
              </p>
              <p className="font-body text-white/70 text-base">
                तुमची समस्या, आमची प्राथमिकता. कोणत्याही अडचणीसाठी आम्हाला संपर्क करा.
              </p>
            </div>
          </motion.div>

          {/* Grievance Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl shadow-md border border-border p-10 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "oklch(0.60 0.18 150 / 0.12)" }}
                >
                  <CheckCircle2
                    size={40}
                    style={{ color: "oklch(0.55 0.18 150)" }}
                  />
                </div>
                <h3
                  className="font-display text-2xl font-bold mb-3"
                  style={{ color: "oklch(0.28 0.04 243)" }}
                >
                  तक्रार नोंदवली गेली!
                </h3>
                <p className="font-body text-muted-foreground text-lg mb-6">
                  तुमची तक्रार यशस्वीरित्या नोंदवली गेली आहे. आम्ही लवकरात लवकर तुमच्याशी
                  संपर्क साधू.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="rounded-full px-8 py-3 font-display font-bold text-base"
                  style={{ background: "oklch(0.65 0.22 43)" }}
                >
                  आणखी तक्रार नोंदवा
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl shadow-md border border-border p-8"
              >
                <h3
                  className="font-display text-2xl font-bold mb-6"
                  style={{ color: "oklch(0.28 0.04 243)" }}
                >
                  तक्रार नोंदवा
                </h3>

                <div className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-body font-semibold text-base"
                      style={{ color: "oklch(0.28 0.04 243)" }}
                    >
                      नाव{" "}
                      <span style={{ color: "oklch(0.65 0.22 43)" }}>*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="तुमचे संपूर्ण नाव लिहा"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="font-body text-base rounded-xl border-border focus-visible:ring-primary h-12"
                      autoComplete="name"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="font-body font-semibold text-base"
                      style={{ color: "oklch(0.28 0.04 243)" }}
                    >
                      मोबाईल नंबर{" "}
                      <span style={{ color: "oklch(0.65 0.22 43)" }}>*</span>
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="तुमचा मोबाईल नंबर लिहा"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      className="font-body text-base rounded-xl border-border focus-visible:ring-primary h-12"
                      autoComplete="tel"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="font-body font-semibold text-base"
                      style={{ color: "oklch(0.28 0.04 243)" }}
                    >
                      तक्रार / संदेश{" "}
                      <span style={{ color: "oklch(0.65 0.22 43)" }}>*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="तुमची तक्रार किंवा संदेश येथे लिहा..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="font-body text-base rounded-xl border-border focus-visible:ring-primary resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-full font-display font-bold text-base text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                    style={{ background: "oklch(0.65 0.22 43)" }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        नोंदवत आहे...
                      </>
                    ) : (
                      "तक्रार नोंदवा"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
