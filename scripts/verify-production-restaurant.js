const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function verifyProductionRestaurant() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check the specific restaurant ID from your production example
    const specificId = '68d9620f03d6b7ca83ef0001';
    console.log(`🔍 Verifying production restaurant ID: ${specificId}`);

    const restaurant = await Restaurant.findById(specificId);
    
    if (!restaurant) {
      console.log('❌ Restaurant not found in production database');
    } else {
      console.log('✅ Restaurant found in production!');
      console.log('📄 Updated document:');
      console.log(JSON.stringify(restaurant, null, 2));
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error verifying restaurant:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyProductionRestaurant();
