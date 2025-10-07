const mongoose = require('mongoose');
const fs = require('fs');

// Simple migration script to import restaurants to production MongoDB

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// You need to set your production MongoDB URI here
// Get this from your MongoDB Atlas dashboard
const PRODUCTION_MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant schema (simplified)
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  full_address: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
  latitude: Number,
  longitude: Number,
  phone: String,
  website: String,
  description: String,
  image: String,
  rating: Number,
  reviews: Number,
  working_hours: mongoose.Schema.Types.Mixed,
  category: String,
  price_range: String,
  privateRooms: [{
    name: String,
    capacity: Number,
    description: String
  }],
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function migrateData() {
  try {
    console.log('🔄 Connecting to production MongoDB...');
    
    if (!PRODUCTION_MONGODB_URI) {
      console.error('❌ MongoDB URI not found!');
      console.log('📝 Please set your MongoDB Atlas connection string in one of these ways:');
      console.log('   1. Create a .env.local file with: MONGODB_URI="your-connection-string"');
      console.log('   2. Or set environment variable: export MONGODB_URI="your-connection-string"');
      console.log('   3. Or set environment variable: export PRODUCTION_MONGODB_URI="your-connection-string"');
      console.log('📝 Get your connection string from MongoDB Atlas dashboard');
      process.exit(1);
    }
    
    if (!PRODUCTION_MONGODB_URI.startsWith('mongodb://') && !PRODUCTION_MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format!');
      console.log('📝 The connection string should start with "mongodb://" or "mongodb+srv://"');
      console.log('📝 Your current URI:', PRODUCTION_MONGODB_URI);
      process.exit(1);
    }
    
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected to production MongoDB successfully');

    // Read the backup file
    console.log('📖 Reading backup file...');
    const backupData = JSON.parse(fs.readFileSync('./privatediningpros.restaurants.json', 'utf8'));
    console.log(`📊 Found ${backupData.length} restaurants in backup`);

    // Clear existing restaurants
    console.log('🗑️  Clearing existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('✅ Existing restaurants cleared');

    // Insert the backup data
    console.log('📥 Importing restaurants...');
    
    const transformedData = backupData.map(restaurant => {
      // Clean up privateRooms array - remove the _id field that's causing issues
      const cleanPrivateRooms = (restaurant.privateRooms || []).map(room => ({
        name: room.name,
        capacity: room.capacity,
        description: room.description
        // Remove the _id field that's causing the ObjectId casting error
      }));

      return {
        name: restaurant.name,
        address: restaurant.address,
        full_address: restaurant.full_address,
        city: restaurant.city,
        state: restaurant.state,
        postal_code: restaurant.postal_code,
        country: restaurant.country,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        website: restaurant.website,
        description: restaurant.description,
        image: restaurant.image,
        rating: restaurant.rating,
        reviews: restaurant.reviews,
        working_hours: restaurant.working_hours,
        category: restaurant.category,
        price_range: restaurant.price_range,
        privateRooms: cleanPrivateRooms,
        status: 'approved',
        createdAt: restaurant.createdAt ? new Date(restaurant.createdAt.$date) : new Date(),
        updatedAt: restaurant.updatedAt ? new Date(restaurant.updatedAt.$date) : new Date(),
      };
    });

    await Restaurant.insertMany(transformedData);
    console.log('✅ Migration completed successfully!');
    console.log(`📊 Total restaurants imported: ${transformedData.length}`);

    // Verify the import
    const totalCount = await Restaurant.countDocuments();
    console.log(`🔍 Verification: ${totalCount} restaurants now in production database`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateData();
