export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface Order {
  id: number;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  items: OrderItem[];
}
