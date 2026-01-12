import { pgTable, text, integer, real, timestamp, boolean, serial, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
});

export const cart = pgTable("cart", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: doublePrecision("product_price").notNull(),
  productImage: text("product_image").notNull(),
  productDescription: text("product_description").notNull(),
  size: text("size").notNull().default("Medium"),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: doublePrecision("product_price").notNull(),
  productImage: text("product_image").notNull(),
  productDescription: text("product_description").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(),
  discountValue: doublePrecision("discount_value").notNull(),
  minPurchase: doublePrecision("min_purchase").notNull().default(0),
  maxDiscount: doublePrecision("max_discount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  validFrom: timestamp("valid_from").defaultNow().notNull(),
  validUntil: timestamp("valid_until"),
  firstTimeOnly: boolean("first_time_only").notNull().default(false),
  description: text("description"),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  subtotal: doublePrecision("subtotal").notNull(),
  discount: doublePrecision("discount").notNull().default(0),
  couponCode: text("coupon_code"),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  shippingCountry: text("shipping_country").notNull().default("USA"),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: doublePrecision("product_price").notNull(),
  productImage: text("product_image").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
});

// Zod schemas
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

export const insertOrderSchema = z.object({
  shippingAddress: z.string().min(5, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingZip: z.string().min(5, "ZIP code is required"),
  shippingCountry: z.string().default("USA"),
  paymentMethod: z.enum(["credit_card", "paypal", "cash_on_delivery"]),
  couponCode: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Cart = typeof cart.$inferSelect;
export type Wishlist = typeof wishlist.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Coupon = typeof coupons.$inferSelect;
