import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcryptjs";
import { insertUserSchema } from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Create user
      const user = await storage.createUser({ username, email, password });

      // Set session
      req.session.userId = user.id;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set session
      req.session.userId = user.id;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Order routes
  app.post('/api/orders', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, paymentMethod, couponCode, cartItems } = req.body;

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Map frontend cart items to backend format
      const mappedCartItems = cartItems.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        productPrice: parseFloat(item.price),
        productImage: item.image,
        productDescription: item.desc || '',
        size: item.size,
        quantity: item.quantity,
      }));

      const order = await storage.createOrder(
        req.session.userId,
        { shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, paymentMethod, couponCode },
        mappedCartItems
      );

      res.json({ order });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Order creation failed' });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const orders = await storage.getOrdersByUserId(req.session.userId);
      res.json({ orders });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:orderId', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const order = await storage.getOrderById(req.params.orderId, req.session.userId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const items = await storage.getOrderItems(order.id);
      res.json({ order, items });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch order' });
    }
  });

  // Coupon routes
  app.post('/api/coupons/validate', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { code, subtotal } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: 'Coupon code is required' });
      }

      const subtotalNum = parseFloat(subtotal) || 0;
      const validation = await storage.validateCoupon(code, req.session.userId, subtotalNum);
      
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }

      const coupon = validation.coupon!;
      let discount = 0;
      
      if (coupon.discountType === 'percentage') {
        discount = (subtotalNum * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      // Make sure discount doesn't exceed subtotal
      if (discount > subtotalNum) {
        discount = subtotalNum;
      }

      res.json({ 
        valid: true, 
        discount,
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      });
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      res.status(400).json({ message: error.message || 'Coupon validation failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
