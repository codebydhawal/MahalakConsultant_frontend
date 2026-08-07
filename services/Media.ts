export interface MediaRequest {

    title: string;

    videoUrl: string;

    displayOrder: number;

}

export interface MediaResponse {

    mediaId: string;

    title: string;

    videoUrl: string;

    thumbnailImageName: string;

    thumbnailImageUrl: string;

    thumbnailImageFileId: string;

    displayOrder: number;

    isMediaDeleted: boolean;

    createdAt: string;

    updatedAt: string;

}