export interface ProjectRequest {
    title: string;
    category: ProjectCategory;
    shortDescription: string;
    clientName: string;
    location: string;
    completionDate: string;
    projectArea: string;
}

export interface ProjectResponse {
    projectId: string;

    title: string;
    category: ProjectCategory;

    shortDescription: string;

    thumbnailName: string;
    thumbnailUrl: string;
    thumbnailFileId: string;

    documentName: string;
    documentUrl: string;
    documentFileId: string;

    clientName: string;
    location: string;
    completionDate: string;
    projectArea: string;

    views: number;

    isProjectDeleted: boolean;

    createdAt: string;
    updatedAt: string;
}

export const PROJECT_CATEGORIES = [
    "ARCHITECTURE",
    "INTERIOR_DESIGN",
    "VASTU_CONSULTANCY",
    "CIVIL_ENGINEERING",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];