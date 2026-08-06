import { CartResponse } from "./CartResponse";

export interface CartSummaryResponse {
    map(arg0: (item: any) => { id: any; cartId: any; quantity: any; name: any; price: any; imageUrl: any; }): import("react").SetStateAction<import("../types").CartItem[]>;

    items: CartResponse[];

    totalProducts: number;

    totalItems: number;

    cartTotal: number;

}