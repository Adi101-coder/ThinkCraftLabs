import bcrypt from 'bcryptjs';
import { User, Order } from './models';
import type { IUser, IOrder, IOrderItem } from './models';

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

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
}

class MongoStorage {
  // User methods
  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async createUser(userData: InsertUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });
    return await user.save();
  }

  // Order methods
  async createOrder(userId: string, orderData: InsertOrder, cartItems: CartItem[]): Promise<IOrder> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    const discount = 0; // Coupon logic handled on frontend
    const totalAmount = subtotal - discount;

    const order = new Order({
      userId,
      orderNumber,
      subtotal,
      discount,
      couponCode: orderData.couponCode,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      shippingCity: orderData.shippingCity,
      shippingState: orderData.shippingState,
      shippingZip: orderData.shippingZip,
      shippingCountry: orderData.shippingCountry,
      paymentMethod: orderData.paymentMethod,
      items: cartItems,
    });

    return await order.save();
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    return await Order.findOne({ _id: orderId, userId });
  }
}

export const storage = new MongoStorage();
