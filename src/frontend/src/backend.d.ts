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
    adminLogin(password: string): Promise<boolean>;
    deleteGalleryPhoto(id: bigint): Promise<boolean>;
    deleteProject(id: bigint): Promise<boolean>;
    getAllGalleryPhotos(): Promise<Array<GalleryPhoto>>;
    getAllGrievances(): Promise<Array<GrievanceSubmission>>;
    getAllProjects(): Promise<Array<Project>>;
    submitGrievance(name: string, mobile: string, message: string): Promise<bigint>;
    updateAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
}
