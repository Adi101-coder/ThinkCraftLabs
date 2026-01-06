import { type User, type InsertUser, type Cart, type Wishlist, users, cart, wishlist } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
}

// Use DatabaseStorage for persistent data
export const storage = new DatabaseStorage();
