import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GalleryPhoto,
  GrievanceSubmission,
  Project,
  ProjectRating,
  Scheme,
} from "../backend.d";
import { useActor } from "./useActor";

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
