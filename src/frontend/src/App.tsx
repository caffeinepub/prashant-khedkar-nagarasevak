import { Toaster } from "@/components/ui/sonner";
import AboutSection from "./components/AboutSection";
import AdminPage from "./components/AdminPage";
import CivicServicesSection from "./components/CivicServicesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import GovernmentSchemesSection from "./components/GovernmentSchemesSection";
import HeroSection from "./components/HeroSection";
import InformationSection from "./components/InformationSection";
import Navbar from "./components/Navbar";
import ProjectsSection from "./components/ProjectsSection";

const isAdminRoute = window.location.pathname === "/admin";

export default function App() {
  if (isAdminRoute) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <AdminPage />
      </>
    );
  }

  return (
    <div className="min-h-screen font-body">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <GovernmentSchemesSection />
        <CivicServicesSection />
        <InformationSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
