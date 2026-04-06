export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subTotal: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  totalPrice?: number;
}
