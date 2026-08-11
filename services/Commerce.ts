export interface CheckoutPreviewRequest {
  addressId: string;
  couponCode?: string;
}

export interface CheckoutPreviewResponse {
  productTotal: number;
  taxAmount: number;
  ruleDiscountAmount: number;
  couponDiscountAmount: number;
  shippingAmount: number;
  finalAmount: number;
}

export type PaymentMethod = "COD" | "ONLINE";

export interface OrderRequest {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface OrderResponse {
  orderId: string;
  paymentId?: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  productTotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  orderStatus: string;
  createdAt: string;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  amount: number;
  transactionId?: string;
  screenshotUrl?: string;
  rejectionReason?: string;
}
