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
export interface AppNotification {
    id: bigint;
    title: string;
    body: string;
    timestamp: bigint;
}
export interface CivilService {
    id: bigint;
    url: string;
    title: string;
    description: string;
    isActive: boolean;
    category: string;
}
export interface TeamMember {
    id: bigint;
    name: string;
    role: string;
    description: string;
    photoUrl: string;
    mobile: string;
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
    addCivilService(title: string, description: string, category: string, url: string): Promise<bigint>;
    addGalleryPhoto(url: string, caption: string, sub: string): Promise<bigint>;
    addNotification(title: string, body: string): Promise<bigint>;
    addProject(title: string, description: string, category: string, status: string): Promise<bigint>;
    addScheme(title: string, description: string, category: string, status: string, benefit: string, eligibility: string): Promise<bigint>;
    addTeamMember(name: string, role: string, photoUrl: string, mobile: string, description: string): Promise<bigint>;
    adminLogin(password: string): Promise<boolean>;
    deleteCivilService(id: bigint): Promise<boolean>;
    deleteGalleryPhoto(id: bigint): Promise<boolean>;
    deleteProject(id: bigint): Promise<boolean>;
    deleteScheme(id: bigint): Promise<boolean>;
    deleteTeamMember(id: bigint): Promise<boolean>;
    getAllCivilServices(): Promise<Array<CivilService>>;
    getAllGalleryPhotos(): Promise<Array<GalleryPhoto>>;
    getAllGrievances(): Promise<Array<GrievanceSubmission>>;
    getAllNotifications(): Promise<Array<AppNotification>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllRatings(): Promise<Array<ProjectRating>>;
    getAllSchemes(): Promise<Array<Scheme>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getAverageRating(projectId: bigint): Promise<{
        totalRatings: bigint;
        averageRating: bigint;
    }>;
    getRatingsForProject(projectId: bigint): Promise<Array<ProjectRating>>;
    getSitePhoto(photoKey: string): Promise<string>;
    getUnreadGrievanceCount(): Promise<bigint>;
    getUnreadNotificationCount(): Promise<bigint>;
    markAllNotificationsRead(): Promise<boolean>;
    markGrievancesRead(): Promise<boolean>;
    setSitePhoto(photoKey: string, data: string): Promise<boolean>;
    submitGrievance(name: string, mobile: string, message: string): Promise<bigint>;
    submitRating(projectId: bigint, rating: bigint, name: string, comment: string): Promise<bigint>;
    toggleCivilService(id: bigint, isActive: boolean): Promise<boolean>;
}
