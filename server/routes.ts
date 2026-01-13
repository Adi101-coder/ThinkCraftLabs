import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcryptjs";
import './db'; // Initialize MongoDB connection

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
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = await storage.createUser({ username, email, password });
      req.session.userId = user._id.toString();

      res.json({ 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email 
        } 
      });
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

      req.session.userId = user._id.toString();

      res.json({ 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email 
        } 
      });
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

    res.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
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
        size: item.size,
        quantity: item.quantity,
      }));

      const order = await storage.createOrder(
        req.session.userId,
        { shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, paymentMethod, couponCode },
        mappedCartItems
      );

      // Convert MongoDB document to plain object with id field
      const orderResponse = {
        ...order.toObject(),
        id: order._id.toString(),
      };

      res.json({ order: orderResponse });
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

      res.json({ order, items: order.items });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch order' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
