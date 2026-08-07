// User.ts

import { AddressResponse } from "./Address";

export interface UserResponse {
    id: number;

    firstName: string;

    lastName: string;

    fullName: string;

    email: string;

    phoneNumber: string;

    role: string;

    status: UserStatus;

    // Profile Image
    profileImageName?: string;

    profileImageUrl?: string;

    addresses: AddressResponse[];

    createdAt: string;

    updatedAt: string;
}

export interface RegisterUserRequest {

    firstName: string;

    lastName: string;

    email: string;

    phoneNumber: string;

    password: string;

    role: string;
}

export interface UpdateUserRequest {

    firstName: string;

    lastName: string;

    email: string;

    phoneNumber: string;
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}