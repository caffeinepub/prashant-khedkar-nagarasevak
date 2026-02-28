import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GalleryPhoto, Project } from "../backend.d";
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
