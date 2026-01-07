import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
});

export const cart = sqliteTable("cart", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: real("product_price").notNull(),
  productImage: text("product_image").notNull(),
  productDescription: text("product_description").notNull(),
  size: text("size").notNull().default("Medium"),
  quantity: integer("quantity").notNull().default(1),
  addedAt: integer("added_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const wishlist = sqliteTable("wishlist", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: real("product_price").notNull(),
  productImage: text("product_image").notNull(),
  productDescription: text("product_description").notNull(),
  addedAt: integer("added_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
  userId: true,
  addedAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  userId: true,
  addedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Cart = typeof cart.$inferSelect;
export type Wishlist = typeof wishlist.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
