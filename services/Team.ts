export interface TeamRequest {

    fullName: string;

    designation: string;

    shortBio: string;

    email: string;

    phoneNumber: string;

    linkedInUrl: string;

    instagramUrl: string;

    facebookUrl: string;

    twitterUrl: string;

    displayOrder: number;

}

export interface TeamResponse {

    teamId: string;

    fullName: string;

    designation: string;

    shortBio: string;

    profileImageName: string;

    profileImageUrl: string;

    profileImageFileId: string;

    email: string;

    phoneNumber: string;

    linkedInUrl: string;

    instagramUrl: string;

    facebookUrl: string;

    twitterUrl: string;

    displayOrder: number;

    isTeamDeleted: boolean;

    createdAt: string;

    updatedAt: string;

}