import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GalleryPhoto, GrievanceSubmission, Project } from "../backend.d";
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
