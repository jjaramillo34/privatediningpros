const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privatediningpros';

async function createDemoUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
      isActive: { type: Boolean, default: true },
      createdAt: Date,
      updatedAt: Date
    }, { timestamps: true }));

    // Demo users to create
    const demoUsers = [
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

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists (role: ${existingUser.role})`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      console.log(`✅ Created user: ${user.email} (role: ${user.role})`);
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}, '-password');
    allUsers.forEach(user => {
      console.log(`   • ${user.email} (${user.role})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

createDemoUsers(); 