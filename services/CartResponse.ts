import { ProductResponse } from "./ProductResponse";

export interface CartResponse {

    cartId: string;

    product: ProductResponse;

    quantity: number;

    subTotal: number;

}