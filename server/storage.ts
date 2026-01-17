import bcrypt from 'bcryptjs';
import { User, Order, Event } from './models';
import type { IUser, IOrder, IOrderItem, IEvent } from './models';

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

  // Event methods
  async createEvent(userId: string, username: string, eventData: {
    title: string;
    description: string;
    category: 'workshop' | 'competition' | 'course' | 'other';
    images: string[];
    date: Date;
    location: string;
    isLive: boolean;
  }): Promise<IEvent> {
    const event = new Event({
      ...eventData,
      createdBy: userId,
      createdByUsername: username,
    });
    return await event.save();
  }

  async getAllEvents(): Promise<IEvent[]> {
    return await Event.find().sort({ date: 1 });
  }

  async getEventsByCategory(category: string): Promise<IEvent[]> {
    return await Event.find({ category }).sort({ date: 1 });
  }

  async getLiveEvents(): Promise<IEvent[]> {
    return await Event.find({ isLive: true }).sort({ date: 1 });
  }

  async getEventById(eventId: string): Promise<IEvent | null> {
    return await Event.findById(eventId);
  }

  async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    const result = await Event.deleteOne({ _id: eventId, createdBy: userId });
    return result.deletedCount > 0;
  }

  async updateEvent(eventId: string, userId: string, eventData: Partial<{
    title: string;
    description: string;
    category: 'workshop' | 'competition' | 'course' | 'other';
    images: string[];
    date: Date;
    location: string;
    isLive: boolean;
  }>): Promise<IEvent | null> {
    return await Event.findOneAndUpdate(
      { _id: eventId, createdBy: userId },
      eventData,
      { new: true }
    );
  }

  // Event registration methods
  async registerForEvent(eventId: string, userId: string, username: string): Promise<IEvent | null> {
    // Check if already registered
    const event = await Event.findById(eventId);
    if (!event) return null;
    
    const alreadyRegistered = event.registrations.some(
      (reg) => reg.userId.toString() === userId
    );
    
    if (alreadyRegistered) {
      throw new Error('Already registered for this event');
    }

    return await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          registrations: {
            userId,
            username,
            registeredAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async unregisterFromEvent(eventId: string, userId: string): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: {
          registrations: { userId },
        },
      },
      { new: true }
    );
  }

  async getEventRegistrations(eventId: string): Promise<IEvent | null> {
    return await Event.findById(eventId).select('registrations');
  }

  async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    const event = await Event.findById(eventId);
    if (!event) return false;
    return event.registrations.some((reg) => reg.userId.toString() === userId);
  }

  // Admin methods
  async getAllUsersCount(): Promise<number> {
    return await User.countDocuments();
  }
}


export const storage = new MongoStorage();
