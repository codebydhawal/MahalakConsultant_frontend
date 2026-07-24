export interface ProductResponse {
    productId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    isProductDeleted: boolean;
    imageName: string;
    imageUrl: string;
    imageFileId: string;
    createdAt: string;
    updatedAt: string;
}