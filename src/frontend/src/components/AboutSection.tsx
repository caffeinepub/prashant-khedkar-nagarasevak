import { Award, Camera, MapPin, Users } from "lucide-react";
import { motion } from "motion/react";
import { useSitePhoto } from "../hooks/useSitePhoto";

const stats = [
  {
    icon: Award,
    value: "१५ वर्षे",
    label: "सेवा",
    desc: "अविरत जनसेवा",
  },
  {
    icon: Users,
    value: "५०+",
    label: "प्रकल्प पूर्ण",
    desc: "विकास कामे",
  },
  {
    icon: MapPin,
    value: "प्रभाग",
    label: "क्र. ८",
    desc: "कोल्हापूर महानगरपालिका",
  },
];

export default function AboutSection() {
  const { photoSrc } = useSitePhoto("about");

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.28 0.04 243)" }}
          >
            परिचय
          </h2>
          <div className="section-divider" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            जनतेचा आवाज, विकासाचा मार्ग
          </p>
        </motion.div>

        {/* Main content row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image / portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Decorative border */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-20"
                style={{ background: "oklch(0.65 0.22 43)" }}
              />
              <div
                className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl"
                style={{ background: "oklch(0.28 0.04 243)", opacity: 0.15 }}
              />
              <div className="relative w-72 md:w-80 h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt="नगरसेवक प्रशांत उर्फ भैय्या खेडकर"
                    className="w-full h-full object-cover object-top"
                    style={{ display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                    style={{ background: "oklch(0.65 0.22 43 / 0.08)" }}
                  >
                    <Camera
                      size={40}
                      style={{ color: "oklch(0.65 0.22 43 / 0.45)" }}
                    />
                    <p
                      className="font-body text-sm font-semibold text-center px-4"
                      style={{ color: "oklch(0.55 0.20 43 / 0.70)" }}
                    >
                      Admin पॅनेलमधून फोटो जोडा
                    </p>
                  </div>
                )}
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-white font-display font-bold text-sm shadow-lg whitespace-nowrap"
                style={{ background: "oklch(0.65 0.22 43)" }}
              >
                नगरसेवक, प्रभाग क्र. ८
              </div>
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-body"
          >
            <h3
              className="font-display text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "oklch(0.65 0.22 43)" }}
            >
              नगरसेवक प्रशांत उर्फ भैय्या खेडकर
            </h3>
            <div
              className="h-1 w-16 rounded-full mb-6"
              style={{ background: "oklch(0.65 0.22 43)" }}
            />
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              गेल्या पंधरा वर्षांपासून प्रभाग क्र. ८ च्या विकासासाठी अहोरात्र झटत असलेले
              नगरसेवक प्रशांत उर्फ भैय्या खेडकर हे जनतेचे खऱ्या अर्थाने प्रतिनिधी आहेत.
            </p>
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              रस्त्यांचा विकास, पाणीपुरवठा, शिक्षण, आरोग्य आणि स्वच्छता या क्षेत्रांत त्यांनी
              उल्लेखनीय कार्य केले आहे. नागरिकांच्या समस्या सोडवण्यासाठी ते सदैव तत्पर असतात.
            </p>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: "oklch(0.28 0.04 243)" }}
            >
              "नाव एक, कामे अनेक" या त्यांच्या ब्रीदवाक्यानुसार ते प्रत्येक नागरिकाच्या
              जीवनमानात सुधारणा घडवण्यासाठी निरंतर प्रयत्नशील आहेत.
            </p>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3">
              {["कोल्हापूर महानगरपालिका सदस्य", "प्रभाग क्र. ८", "१५ वर्षे सेवा"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      background: "oklch(0.65 0.22 43 / 0.12)",
                      color: "oklch(0.55 0.20 43)",
                    }}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-hover text-center rounded-2xl p-8 shadow-md border border-border bg-card"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "oklch(0.65 0.22 43 / 0.12)" }}
                >
                  <Icon size={28} style={{ color: "oklch(0.65 0.22 43)" }} />
                </div>
                <div
                  className="font-display text-4xl font-bold mb-1"
                  style={{ color: "oklch(0.28 0.04 243)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-display text-lg font-bold"
                  style={{ color: "oklch(0.65 0.22 43)" }}
                >
                  {stat.label}
                </div>
                <div className="font-body text-sm text-muted-foreground mt-1">
                  {stat.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
