export enum BlogStatus {
    DRAFT = "DRAFT",
    UNPUBLISHED = "UNPUBLISHED",
    PUBLISHED = "PUBLISHED",
}

export const BLOG_STATUS_OPTIONS = [
    {
        label: "Draft",
        value: BlogStatus.DRAFT,
    },
    {
        label: "Unpublished",
        value: BlogStatus.UNPUBLISHED,
    },
    {
        label: "Published",
        value: BlogStatus.PUBLISHED,
    },
];

export const BLOG_CATEGORIES = [
    "Technology",
    "Programming",
    "Java",
    "Spring Boot",
    "React",
    "Database",
    "DevOps",
    "Tutorial",
    "Career",
    "News",
];