import { type User, type InsertUser, type Cart, type Wishlist, type Order, type OrderItem, type InsertOrder, type Coupon, users, cart, wishlist, orders, orderItems, coupons } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, and, desc, lte, gte, or, isNull } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cart methods
  getCartByUserId(userId: string): Promise<Cart[]>;
  addToCart(userId: string, item: Omit<Cart, 'id' | 'userId' | 'addedAt'>): Promise<Cart>;
  removeFromCart(userId: string, cartId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Wishlist methods
  getWishlistByUserId(userId: string): Promise<Wishlist[]>;
  addToWishlist(userId: string, item: Omit<Wishlist, 'id' | 'userId' | 'addedAt'>): Promise<Wishlist>;
  removeFromWishlist(userId: string, wishlistId: string): Promise<void>;
  
  // Order methods
  createOrder(userId: string, orderData: InsertOrder, cartItems: Cart[]): Promise<Order>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrderById(orderId: string, userId: string): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  
  // Coupon methods
  validateCoupon(code: string, userId: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }>;
  incrementCouponUsage(couponId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  // Cart methods
  async getCartByUserId(userId: string): Promise<Cart[]> {
    return await db.select().from(cart).where(eq(cart.userId, userId));
  }

  async addToCart(userId: string, item: Omit<Cart, 'id' | 'userId' | 'addedAt'>): Promise<Cart> {
    const result = await db.insert(cart).values({
      userId,
      ...item,
    }).returning();
    return result[0];
  }

  async removeFromCart(userId: string, cartId: string): Promise<void> {
    await db.delete(cart).where(and(eq(cart.id, cartId), eq(cart.userId, userId)));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cart).where(eq(cart.userId, userId));
  }

  // Wishlist methods
  async getWishlistByUserId(userId: string): Promise<Wishlist[]> {
    return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
  }

  async addToWishlist(userId: string, item: Omit<Wishlist, 'id' | 'userId' | 'addedAt'>): Promise<Wishlist> {
    const result = await db.insert(wishlist).values({
      userId,
      ...item,
    }).returning();
    return result[0];
  }

  async removeFromWishlist(userId: string, wishlistId: string): Promise<void> {
    await db.delete(wishlist).where(and(eq(wishlist.id, wishlistId), eq(wishlist.userId, userId)));
  }

  // Order methods
  async createOrder(userId: string, orderData: InsertOrder, cartItems: Cart[]): Promise<Order> {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    
    let discount = 0;
    let couponCode = null;
    
    // Apply coupon if provided
    if (orderData.couponCode) {
      const validation = await this.validateCoupon(orderData.couponCode, userId, subtotal);
      if (validation.valid && validation.coupon) {
        const coupon = validation.coupon;
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        couponCode = coupon.code;
        await this.incrementCouponUsage(coupon.id);
      }
    }
    
    const totalAmount = subtotal - discount;
    
    // Create order
    const [order] = await db.insert(orders).values({
      userId,
      orderNumber,
      subtotal,
      discount,
      couponCode,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      shippingCity: orderData.shippingCity,
      shippingState: orderData.shippingState,
      shippingZip: orderData.shippingZip,
      shippingCountry: orderData.shippingCountry,
      paymentMethod: orderData.paymentMethod,
    }).returning();
    
    // Create order items
    for (const item of cartItems) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        productImage: item.productImage,
        size: item.size,
        quantity: item.quantity,
      });
    }
    
    // Clear cart after order
    await this.clearCart(userId);
    
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrderById(orderId: string, userId: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, userId))).limit(1);
    return result[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Coupon methods
  async validateCoupon(code: string, userId: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
    
    if (!coupon) {
      return { valid: false, error: "Invalid coupon code" };
    }
    
    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is no longer active" };
    }
    
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return { valid: false, error: "This coupon is not yet valid" };
    }
    
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return { valid: false, error: "This coupon has expired" };
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "This coupon has reached its usage limit" };
    }
    
    if (subtotal < coupon.minPurchase) {
      return { valid: false, error: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required` };
    }
    
    if (coupon.firstTimeOnly) {
      const userOrders = await this.getOrdersByUserId(userId);
      if (userOrders.length > 0) {
        return { valid: false, error: "This coupon is only valid for first-time customers" };
      }
    }
    
    return { valid: true, coupon };
  }

  async incrementCouponUsage(couponId: string): Promise<void> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
    if (coupon) {
      await db.update(coupons)
        .set({ usedCount: coupon.usedCount + 1 })
        .where(eq(coupons.id, couponId));
    }
  }
}

// Use DatabaseStorage for persistent data
export const storage = new DatabaseStorage();
