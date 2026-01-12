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

export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // percentage or fixed
  discountValue: real("discount_value").notNull(),
  minPurchase: real("min_purchase").notNull().default(0),
  maxDiscount: real("max_discount"), // for percentage discounts
  usageLimit: integer("usage_limit"), // null = unlimited
  usedCount: integer("used_count").notNull().default(0),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  validFrom: integer("valid_from", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  validUntil: integer("valid_until", { mode: 'timestamp' }),
  firstTimeOnly: integer("first_time_only", { mode: 'boolean' }).notNull().default(false),
  description: text("description"),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  subtotal: real("subtotal").notNull(),
  discount: real("discount").notNull().default(0),
  couponCode: text("coupon_code"),
  totalAmount: real("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  shippingCountry: text("shipping_country").notNull().default("USA"),
  paymentMethod: text("payment_method").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productPrice: real("product_price").notNull(),
  productImage: text("product_image").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
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
