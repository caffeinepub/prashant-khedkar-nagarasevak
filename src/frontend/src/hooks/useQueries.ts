import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GalleryPhoto,
  GrievanceSubmission,
  Project,
  ProjectRating,
  Scheme,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── CivicService (localStorage-backed) ───────────────────────────────────────

export interface CivicService {
  id: bigint;
  title: string;
  icon: string;
  link: string;
  description: string;
  isActive: boolean;
  category: string;
  buttonLabel: string;
}

const CIVIC_STORAGE_KEY = "kmc_civic_services_v2";

const DEFAULT_CIVIC_SERVICES: CivicService[] = [
  // ── कर सेवा ──────────────────────────────────────────────────
  {
    id: 1n,
    icon: "🏠",
    title: "मिळकत कर (घरफाळा) भरणा",
    description:
      "ऑनलाइन मालमत्ता कर भरा. एप्रिल-जून: ६%, जुलै-सप्टेंबर: ४%, ऑक्टोबर-नोव्हेंबर: २% सवलत मिळेल.",
    category: "कर सेवा",
    link: "https://propertytax.kolhapurcorporation.gov.in/KMCOnlinePG/NEWPropSearchOnly.aspx",
    buttonLabel: "कर भरा",
    isActive: true,
  },
  {
    id: 2n,
    icon: "🔎",
    title: "मिळकत कर थकबाकी तपासा",
    description:
      "तुमच्या मालमत्तेची थकबाकी ऑनलाइन तपासा आणि वेळेवर भरून सवलतीचा फायदा घ्या.",
    category: "कर सेवा",
    link: "https://propertytax.kolhapurcorporation.gov.in/KMCOnlinePG/NEWPropSearchOnly.aspx",
    buttonLabel: "थकबाकी पहा",
    isActive: true,
  },
  // ── पाणी सेवा ────────────────────────────────────────────────
  {
    id: 3n,
    icon: "💧",
    title: "पाणीपट्टी थकबाकी पहा",
    description:
      "पाण्याच्या बिलाची थकबाकी ऑनलाइन तपासा व भरा. थकबाकीदार यादीत येण्यापूर्वीच बिल भरा.",
    category: "पाणी सेवा",
    link: "https://wts.kolhapurcorporation.gov.in/InternalStatement/Index",
    buttonLabel: "थकबाकी पहा",
    isActive: true,
  },
  {
    id: 4n,
    icon: "📋",
    title: "पाणीपट्टी थकबाकीदार यादी",
    description:
      "कोल्हापूर महानगरपालिका क्षेत्रातील पाणीपट्टी थकबाकीदारांची अधिकृत यादी पहा.",
    category: "पाणी सेवा",
    link: "https://wts.kolhapurcorporation.gov.in/InternalStatement/ArrearsList",
    buttonLabel: "यादी पहा",
    isActive: true,
  },
  // ── परवाना सेवा ──────────────────────────────────────────────
  {
    id: 5n,
    icon: "📝",
    title: "परवाना थकबाकी पहा",
    description:
      "व्यवसाय परवान्याची थकबाकी ऑनलाइन तपासा आणि दंड टाळण्यासाठी वेळेवर भरा.",
    category: "परवाने",
    link: "https://services.kolhapurcorporation.gov.in/LicenseknowYourDues",
    buttonLabel: "थकबाकी पहा",
    isActive: true,
  },
  // ── नागरिक ऑनलाइन सेवा ──────────────────────────────────────
  {
    id: 6n,
    icon: "🌐",
    title: "नागरी ऑनलाइन सेवा पोर्टल",
    description:
      "जन्म/मृत्यू नोंदणी, विवाह नोंदणी, बांधकाम परवाना व इतर सर्व सेवांसाठी KMC पोर्टल.",
    category: "नागरिक सेवा",
    link: "https://web.kolhapurcorporation.gov.in/citizen",
    buttonLabel: "पोर्टल उघडा",
    isActive: true,
  },
  {
    id: 7n,
    icon: "📄",
    title: "जन्म / मृत्यू नोंदणी",
    description:
      "जन्म व मृत्यू प्रमाणपत्रासाठी ऑनलाइन अर्ज करा. MahaOnline पोर्टलद्वारे जलद प्रक्रिया.",
    category: "नागरिक सेवा",
    link: "https://aaplesarkar.maharashtra.gov.in/",
    buttonLabel: "अर्ज करा",
    isActive: true,
  },
  // ── माहिती अधिकार ────────────────────────────────────────────
  {
    id: 8n,
    icon: "⚖️",
    title: "माहितीचा अधिकार (RTI)",
    description:
      "RTI अंतर्गत सरकारी माहिती मिळवा. KMC मधील RTI अधिकारी, केसेस व स्वयंप्रकटीकरण पहा.",
    category: "माहिती अधिकार",
    link: "https://web.kolhapurcorporation.gov.in/mahitiAdhikarkayda",
    buttonLabel: "माहिती पहा",
    isActive: true,
  },
  {
    id: 9n,
    icon: "📊",
    title: "RTI अर्ज व प्रकरणे",
    description:
      "RTI अंतर्गत अर्ज दाखल करा, जुने प्रकरणे पहा आणि RTI अधिकाऱ्यांची माहिती मिळवा.",
    category: "माहिती अधिकार",
    link: "https://web.kolhapurcorporation.gov.in/rtiCases",
    buttonLabel: "प्रकरणे पहा",
    isActive: true,
  },
  // ── निविदा / भरती ────────────────────────────────────────────
  {
    id: 10n,
    icon: "📢",
    title: "जाहीर निविदा (E-Tender)",
    description:
      "KMC च्या सर्व चालू निविदा पहा. बांधकाम, पुरवठा व सेवा संबंधित निविदांमध्ये सहभागी व्हा.",
    category: "निविदा व भरती",
    link: "https://web.kolhapurcorporation.gov.in/etender",
    buttonLabel: "निविदा पहा",
    isActive: true,
  },
  {
    id: 11n,
    icon: "👤",
    title: "भरती / नोकरी जाहिराती",
    description:
      "कोल्हापूर महानगरपालिकेतील रिक्त पदांसाठी जाहिराती पहा आणि ऑनलाइन अर्ज करा.",
    category: "निविदा व भरती",
    link: "https://web.kolhapurcorporation.gov.in/recruitmentPage",
    buttonLabel: "जाहिरात पहा",
    isActive: true,
  },
  // ── आपत्ती व्यवस्थापन ────────────────────────────────────────
  {
    id: 12n,
    icon: "🚨",
    title: "आपत्ती व्यवस्थापन",
    description:
      "अग्निशमन (101), आपत्ती कक्ष (0231-2541188), अग्निशमन विभाग: 0231-2537221. तातडीच्या वेळी संपर्क करा.",
    category: "आपत्कालीन",
    link: "https://web.kolhapurcorporation.gov.in/disasterManagement",
    buttonLabel: "माहिती पहा",
    isActive: true,
  },
];

function loadCivicServices(): CivicService[] {
  try {
    const raw = localStorage.getItem(CIVIC_STORAGE_KEY);
    if (!raw) return DEFAULT_CIVIC_SERVICES;
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      title: string;
      icon: string;
      link: string;
      description: string;
      isActive: boolean;
      category: string;
      buttonLabel: string;
    }>;
    return parsed.map((s) => ({ ...s, id: BigInt(s.id) }));
  } catch {
    return DEFAULT_CIVIC_SERVICES;
  }
}

function saveCivicServices(services: CivicService[]): void {
  const serializable = services.map((s) => ({ ...s, id: String(s.id) }));
  localStorage.setItem(CIVIC_STORAGE_KEY, JSON.stringify(serializable));
}

function getNextCivicId(services: CivicService[]): bigint {
  if (services.length === 0) return 1n;
  const max = services.reduce((m, s) => (s.id > m ? s.id : m), 0n);
  return max + 1n;
}

export function useGetAllCivicServices() {
  return useQuery<CivicService[]>({
    queryKey: ["civicServices"],
    queryFn: async () => loadCivicServices(),
    staleTime: 0,
  });
}

export function useAddCivicService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      icon,
      title,
      description,
      category,
      link,
      buttonLabel,
    }: {
      icon: string;
      title: string;
      description: string;
      category: string;
      link: string;
      buttonLabel: string;
    }) => {
      const services = loadCivicServices();
      const newService: CivicService = {
        id: getNextCivicId(services),
        icon,
        title,
        description,
        category,
        link,
        buttonLabel,
        isActive: true,
      };
      saveCivicServices([...services, newService]);
      return newService.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["civicServices"] });
    },
  });
}

export function useDeleteCivicService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const services = loadCivicServices();
      saveCivicServices(services.filter((s) => s.id !== id));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["civicServices"] });
    },
  });
}

export function useUpdateCivicService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      icon,
      title,
      description,
      category,
      link,
      buttonLabel,
      isActive,
    }: {
      id: bigint;
      icon: string;
      title: string;
      description: string;
      category: string;
      link: string;
      buttonLabel: string;
      isActive: boolean;
    }) => {
      const services = loadCivicServices();
      const updated = services.map((s) =>
        s.id === id
          ? {
              id,
              icon,
              title,
              description,
              category,
              link,
              buttonLabel,
              isActive,
            }
          : s,
      );
      saveCivicServices(updated);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["civicServices"] });
    },
  });
}

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGalleryPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryPhoto[]>({
    queryKey: ["galleryPhotos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGrievances() {
  const { actor, isFetching } = useActor();
  return useQuery<GrievanceSubmission[]>({
    queryKey: ["grievances"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGrievances();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      url,
      caption,
      sub,
    }: {
      url: string;
      caption: string;
      sub: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addGalleryPhoto(url, caption, sub);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPhotos"] });
    },
  });
}

export function useDeleteGalleryPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteGalleryPhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryPhotos"] });
    },
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      status,
    }: {
      title: string;
      description: string;
      category: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProject(title, description, category, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useGetAllSchemes() {
  const { actor, isFetching } = useActor();
  return useQuery<Scheme[]>({
    queryKey: ["schemes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSchemes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      status,
      benefit,
      eligibility,
    }: {
      title: string;
      description: string;
      category: string;
      status: string;
      benefit: string;
      eligibility: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addScheme(
        title,
        description,
        category,
        status,
        benefit,
        eligibility,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
    },
  });
}

export function useDeleteScheme() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteScheme(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
    },
  });
}

export function useSyncGovtSchemes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return (
        actor as unknown as { syncGovtSchemes(): Promise<string> }
      ).syncGovtSchemes();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      queryClient.invalidateQueries({ queryKey: ["lastSyncTime"] });
    },
  });
}

export function useGetLastSyncTime() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["lastSyncTime"],
    queryFn: async () => {
      if (!actor) return 0n;
      return (
        actor as unknown as { getLastSyncTime(): Promise<bigint> }
      ).getLastSyncTime();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminLogin(password);
    },
  });
}

export function useUpdateAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAdminPassword(oldPassword, newPassword);
    },
  });
}

export function useSubmitGrievance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      mobile,
      message,
    }: {
      name: string;
      mobile: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitGrievance(name, mobile, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
    },
  });
}

export function useGetAverageRating(projectId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalRatings: bigint; averageRating: bigint }>({
    queryKey: ["averageRating", String(projectId)],
    queryFn: async () => {
      if (!actor) return { totalRatings: 0n, averageRating: 0n };
      return actor.getAverageRating(projectId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRatingsForProject(projectId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProjectRating[]>({
    queryKey: ["ratingsForProject", String(projectId)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRatingsForProject(projectId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRatings() {
  const { actor, isFetching } = useActor();
  return useQuery<ProjectRating[]>({
    queryKey: ["allRatings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRatings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      rating,
      name,
      comment,
    }: {
      projectId: bigint;
      rating: bigint;
      name: string;
      comment: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitRating(projectId, rating, name, comment);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["averageRating", String(variables.projectId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["ratingsForProject", String(variables.projectId)],
      });
      queryClient.invalidateQueries({ queryKey: ["allRatings"] });
    },
  });
}
