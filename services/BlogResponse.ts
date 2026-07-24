import { BlogStatus } from "./BlogConstants";

export interface BlogResponse {
    id: string;

    title: string;

    authorName: string;

    shortDescription: string;

    category: string;

    tags: string[];

    publishDate: string;

    status: BlogStatus;

    views: number;

    featuredImageUrl: string;

    contentFileUrl: string;

    contentFileId: string;

    authorImageUrl: string;

    createdAt: string;

    updatedAt: string;
}