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
  // Trust proxy for Render deployment (required for secure cookies behind proxy)
  app.set('trust proxy', 1);

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
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
          email: user.email,
          isAdmin: user.isAdmin || false,
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
          email: user.email,
          isAdmin: user.isAdmin || false,
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
        email: user.email,
        isAdmin: user.isAdmin || false,
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

  // Event routes
  app.get('/api/events', async (req, res) => {
    try {
      const { category, live } = req.query;
      let events;
      
      if (live === 'true') {
        events = await storage.getLiveEvents();
      } else if (category && typeof category === 'string') {
        events = await storage.getEventsByCategory(category);
      } else {
        events = await storage.getAllEvents();
      }
      
      res.json({ events });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch events' });
    }
  });

  app.get('/api/events/:eventId', async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ event });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch event' });
    }
  });

  app.post('/api/events', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const { title, description, category, images, date, location, isLive } = req.body;

      if (!title || !description || !category || !date || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const event = await storage.createEvent(req.session.userId, user.username, {
        title,
        description,
        category,
        images: images || [],
        date: new Date(date),
        location,
        isLive: isLive || false,
      });

      res.json({ event });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create event' });
    }
  });

  app.put('/api/events/:eventId', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { title, description, category, images, date, location, isLive } = req.body;

      const event = await storage.updateEvent(req.params.eventId, req.session.userId, {
        title,
        description,
        category,
        images,
        date: date ? new Date(date) : undefined,
        location,
        isLive,
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found or you do not have permission to edit it' });
      }

      res.json({ event });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update event' });
    }
  });

  app.delete('/api/events/:eventId', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const deleted = await storage.deleteEvent(req.params.eventId, req.session.userId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Event not found or you do not have permission to delete it' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to delete event' });
    }
  });

  // Event registration routes
  app.post('/api/events/:eventId/register', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const event = await storage.registerForEvent(
        req.params.eventId,
        req.session.userId,
        user.username
      );

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ event, message: 'Successfully registered for event' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to register for event' });
    }
  });

  app.delete('/api/events/:eventId/register', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const event = await storage.unregisterFromEvent(
        req.params.eventId,
        req.session.userId
      );

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ event, message: 'Successfully unregistered from event' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to unregister from event' });
    }
  });

  app.get('/api/events/:eventId/registrations', async (req, res) => {
    try {
      const event = await storage.getEventRegistrations(req.params.eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ registrations: event.registrations });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch registrations' });
    }
  });

  // Admin stats endpoint
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const [users, events] = await Promise.all([
        storage.getAllUsersCount(),
        storage.getAllEvents(),
      ]);

      const totalRegistrations = events.reduce((sum, event) => sum + (event.registrations?.length || 0), 0);
      const liveEvents = events.filter(event => event.isLive).length;

      res.json({
        totalUsers: users,
        totalEvents: events.length,
        totalRegistrations,
        liveEvents,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
