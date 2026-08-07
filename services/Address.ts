export enum AddressType {
    HOME = "HOME",
    OFFICE = "OFFICE",
    WORK = "WORK",
    OTHER = "OTHER"
}

export interface AddressRequest {

    alternatePhoneNumber: string;

    addressLine1: string;

    addressLine2: string;

    landmark: string;

    city: string;

    state: string;

    country: string;

    postalCode: string;

    addressType: AddressType;

    defaultAddress: boolean;
}

export interface AddressResponse {

    addressId: string;

    userId: string;

    alternatePhoneNumber: string;

    addressLine1: string;

    addressLine2: string;

    landmark: string;

    city: string;

    state: string;

    country: string;

    postalCode: string;

    addressType: AddressType;

    defaultAddress: boolean;

    createdAt: string;

    updatedAt: string;
}