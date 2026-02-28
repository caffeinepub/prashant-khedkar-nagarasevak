import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GalleryPhoto {
    id: bigint;
    sub: string;
    url: string;
    timestamp: bigint;
    caption: string;
}
export interface ProjectRating {
    id: bigint;
    name: string;
    comment: string;
    projectId: bigint;
    timestamp: bigint;
    rating: bigint;
}
export interface Scheme {
    id: bigint;
    status: string;
    title: string;
    description: string;
    eligibility: string;
    category: string;
    benefit: string;
}
export interface Project {
    id: bigint;
    status: string;
    title: string;
    description: string;
    category: string;
}
export interface GrievanceSubmission {
    id: bigint;
    name: string;
    message: string;
    timestamp: bigint;
    mobile: string;
}
export interface backendInterface {
    addGalleryPhoto(url: string, caption: string, sub: string): Promise<bigint>;
    addProject(title: string, description: string, category: string, status: string): Promise<bigint>;
    addScheme(title: string, description: string, category: string, status: string, benefit: string, eligibility: string): Promise<bigint>;
    adminLogin(password: string): Promise<boolean>;
    deleteGalleryPhoto(id: bigint): Promise<boolean>;
    deleteProject(id: bigint): Promise<boolean>;
    deleteScheme(id: bigint): Promise<boolean>;
    getAllGalleryPhotos(): Promise<Array<GalleryPhoto>>;
    getAllGrievances(): Promise<Array<GrievanceSubmission>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllRatings(): Promise<Array<ProjectRating>>;
    getAllSchemes(): Promise<Array<Scheme>>;
    getAverageRating(projectId: bigint): Promise<{
        totalRatings: bigint;
        averageRating: bigint;
    }>;
    getRatingsForProject(projectId: bigint): Promise<Array<ProjectRating>>;
    submitGrievance(name: string, mobile: string, message: string): Promise<bigint>;
    submitRating(projectId: bigint, rating: bigint, name: string, comment: string): Promise<bigint>;
    updateAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
}
