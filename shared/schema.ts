// Shared types for frontend and backend

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: Date;
}

export interface InsertUser {
  username: string;
  email: string;
  password: string;
}

export interface InsertOrder {
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod: string;
  couponCode?: string;
}
