const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privatediningpros';

async function updateSuperAdmin() {
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

    // Find and update the admin user
    const result = await User.findOneAndUpdate(
      { email: 'admin@privatediningpros.com' },
      { role: 'super_admin' },
      { new: true }
    );

    if (result) {
      console.log('✅ Successfully updated admin user to super_admin role:');
      console.log(`   Email: ${result.email}`);
      console.log(`   Role: ${result.role}`);
      console.log(`   Name: ${result.name}`);
    } else {
      console.log('❌ User admin@privatediningpros.com not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateSuperAdmin(); 