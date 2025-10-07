const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function testValidRestaurant() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Test with a valid restaurant ID
    const validId = '68585bd8bbed41903655135f';
    console.log(`🔍 Testing fetch for valid restaurant ID: ${validId}`);

    const restaurant = await Restaurant.findById(validId);
    
    if (!restaurant) {
      console.log('❌ Restaurant not found in database');
    } else {
      console.log('✅ Restaurant found!');
      console.log('- Name:', restaurant.name);
      console.log('- Status:', restaurant.status);
      console.log('- Featured:', restaurant.featured);
      console.log('- Featured field exists:', 'featured' in restaurant);
      console.log('- FeaturedBy field exists:', 'featuredBy' in restaurant);
      console.log('- FeaturedAt field exists:', 'featuredAt' in restaurant);
      console.log('- PrivateRooms:', Array.isArray(restaurant.privateRooms) ? `${restaurant.privateRooms.length} rooms` : 'Not an array');
      console.log('- CreatedAt:', restaurant.createdAt);
      console.log('- UpdatedAt:', restaurant.updatedAt);
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testValidRestaurant();
