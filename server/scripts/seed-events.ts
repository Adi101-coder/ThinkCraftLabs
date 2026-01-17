import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event, User } from '../models';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkcraft';

const sampleEvents = [
  {
    title: "3D Printing Masterclass",
    description: "Learn advanced 3D printing techniques including multi-material printing, support optimization, and post-processing methods. Perfect for beginners and intermediate users.",
    category: "workshop",
    images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop"],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    location: "Maker Lab, Room 101",
    isLive: false,
  },
  {
    title: "Annual Design Competition 2026",
    description: "Showcase your innovative designs and compete for prizes! Categories include product design, architectural models, and artistic creations. Open to all skill levels.",
    category: "competition",
    images: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop"],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    location: "Main Auditorium",
    isLive: true,
  },
  {
    title: "CAD Fundamentals Course",
    description: "A comprehensive 6-week course covering CAD basics, parametric modeling, assemblies, and technical drawings. Includes hands-on projects and certification.",
    category: "course",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"],
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: "Computer Lab B",
    isLive: false,
  },
  {
    title: "Rapid Prototyping Workshop",
    description: "Transform your ideas into physical prototypes in just one day! Learn rapid iteration techniques, material selection, and testing methods used by industry professionals.",
    category: "workshop",
    images: ["https://images.unsplash.com/photo-1563520240344-52b067aa5f84?w=800&h=600&fit=crop"],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Innovation Hub",
    isLive: true,
  },
  {
    title: "Robotics & 3D Printing Meetup",
    description: "Join fellow makers and robotics enthusiasts for an evening of networking, project showcases, and collaborative brainstorming. Bring your projects or just come to learn!",
    category: "other",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"],
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    location: "Student Lounge",
    isLive: false,
  },
];

async function seedEvents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a demo user
    let demoUser = await User.findOne({ username: 'demo' });
    if (!demoUser) {
      console.log('Creating demo user...');
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      demoUser = new User({
        username: 'demo',
        email: 'demo@thinkcraftlabs.com',
        password: hashedPassword,
        isAdmin: false,
      });
      await demoUser.save();
      console.log('✅ Demo user created');
    }

    // Clear existing events (optional)
    const existingCount = await Event.countDocuments();
    console.log(`Found ${existingCount} existing events`);

    // Create sample events
    console.log('\nCreating sample events...');
    for (const eventData of sampleEvents) {
      const event = new Event({
        ...eventData,
        createdBy: demoUser._id,
        createdByUsername: demoUser.username,
        registrations: [],
      });
      await event.save();
      console.log(`✅ Created: ${event.title}`);
    }

    console.log('\n🎉 Successfully created 5 sample events!');
    console.log('\n📋 Event Summary:');
    console.log('- 2 Workshops');
    console.log('- 1 Competition (Live)');
    console.log('- 1 Course');
    console.log('- 1 Meetup');
    console.log('\n🔗 Visit http://localhost:5000/students to see them!');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
