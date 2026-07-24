import { BlogStatus } from "./BlogConstants";

export interface BlogRequest {
    title: string;

    authorName: string;

    shortDescription: string;

    category: string;

    tags: string[];

    publishDate: string;

    status: BlogStatus;
}