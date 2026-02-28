import { Toaster } from "@/components/ui/sonner";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ProjectsSection from "./components/ProjectsSection";

export default function App() {
  return (
    <div className="min-h-screen font-body">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
