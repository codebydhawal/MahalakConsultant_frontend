// User.ts

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  status: UserStatus;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}