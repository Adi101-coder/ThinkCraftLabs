import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
}

export interface IOrder extends Document {
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
  items: IOrderItem[];
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true, index: true },
  orderNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  shippingCity: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingZip: { type: String, required: true },
  shippingCountry: { type: String, default: 'USA' },
  paymentMethod: { type: String, required: true },
  items: [OrderItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);
