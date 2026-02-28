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

const CIVIC_STORAGE_KEY = "kmc_civic_services_v1";

const DEFAULT_CIVIC_SERVICES: CivicService[] = [
  {
    id: 1n,
    icon: "📄",
    title: "जन्म प्रमाणपत्र अर्ज",
    description: "मुलाच्या जन्मानंतर ३० दिवसांत ऑनलाइन नोंदणी करा",
    category: "दस्तऐवज",
    link: "https://mahaonline.gov.in",
    buttonLabel: "अर्ज करा",
    isActive: true,
  },
  {
    id: 2n,
    icon: "📋",
    title: "मृत्यू प्रमाणपत्र अर्ज",
    description: "मृत्यूनंतर तातडीने ऑनलाइन नोंदणी करा",
    category: "दस्तऐवज",
    link: "https://mahaonline.gov.in",
    buttonLabel: "अर्ज करा",
    isActive: true,
  },
  {
    id: 3n,
    icon: "🏠",
    title: "मालमत्ता कर भरणा",
    description: "ऑनलाइन मालमत्ता कर भरा आणि थकबाकी तपासा",
    category: "करसेवा",
    link: "https://kolhapurcorporation.gov.in",
    buttonLabel: "माहिती पहा",
    isActive: true,
  },
  {
    id: 4n,
    icon: "💧",
    title: "पाणी कनेक्शन अर्ज",
    description: "नवीन पाणी कनेक्शनसाठी ऑनलाइन अर्ज करा",
    category: "पाणी सेवा",
    link: "https://kolhapurcorporation.gov.in",
    buttonLabel: "अर्ज करा",
    isActive: true,
  },
  {
    id: 5n,
    icon: "🏗️",
    title: "बांधकाम परवाना",
    description: "नवीन बांधकाम किंवा नूतनीकरणासाठी परवाना मिळवा",
    category: "परवाने",
    link: "https://kolhapurcorporation.gov.in",
    buttonLabel: "अर्ज करा",
    isActive: true,
  },
  {
    id: 6n,
    icon: "🔍",
    title: "अर्ज स्थिती तपासा",
    description: "जन्म/मृत्यू नोंदणी अर्जाची सद्यस्थिती ऑनलाइन तपासा",
    category: "दस्तऐवज",
    link: "https://mahaonline.gov.in",
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
