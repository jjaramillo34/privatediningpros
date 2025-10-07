const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Simple migration script to create users in production MongoDB

const PRODUCTION_MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// User schema (matching your existing schema)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin'], 
    default: 'user' 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function migrateUsers() {
  try {
    console.log('🔄 Connecting to production MongoDB...');
    
    if (!PRODUCTION_MONGODB_URI) {
      console.error('❌ MongoDB URI not found!');
      console.log('📝 Please set your MongoDB Atlas connection string in .env.local');
      process.exit(1);
    }
    
    if (!PRODUCTION_MONGODB_URI.startsWith('mongodb://') && !PRODUCTION_MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format!');
      console.log('📝 The connection string should start with "mongodb://" or "mongodb+srv://"');
      process.exit(1);
    }
    
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to production MongoDB successfully');

    // Define users to create
    const usersToCreate = [
      {
        name: 'Super Administrator',
        email: 'admin@privatediningpros.com',
        password: 'admin123',
        role: 'super_admin'
      },
      {
        name: 'Manager User',
        email: 'manager@privatediningpros.com',
        password: 'manager123',
        role: 'admin'
      },
      {
        name: 'Community User',
        email: 'user@privatediningpros.com',
        password: 'user123',
        role: 'user'
      }
    ];

    console.log('📥 Creating users in production database...');
    
    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of usersToCreate) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists (role: ${existingUser.role})`);
        skippedCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true
      });

      console.log(`✅ Created user: ${user.email} (role: ${user.role})`);
      createdCount++;
    }

    console.log('✅ User migration completed successfully!');
    console.log(`📊 Users created: ${createdCount}`);
    console.log(`📊 Users skipped (already exist): ${skippedCount}`);

    // List all users for verification
    console.log('\n📋 All users in production database:');
    const allUsers = await User.find({}, '-password');
    allUsers.forEach(user => {
      console.log(`   • ${user.email} (${user.role}) - ${user.name}`);
    });

    console.log('\n🔑 Login credentials:');
    usersToCreate.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password} | Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ User migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateUsers();
