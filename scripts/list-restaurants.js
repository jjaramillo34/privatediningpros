const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function listRestaurants() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Get first 10 restaurants with their IDs
    const restaurants = await Restaurant.find({}, '_id name status featured').limit(10);
    
    console.log(`📊 Found ${restaurants.length} restaurants (showing first 10):`);
    console.log('');
    
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ID: ${restaurant._id}`);
      console.log(`   Name: ${restaurant.name}`);
      console.log(`   Status: ${restaurant.status}`);
      console.log(`   Featured: ${restaurant.featured || false}`);
      console.log('');
    });

    // Get count by status
    const statusCounts = await Restaurant.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('📈 Status distribution:');
    statusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count} restaurants`);
    });

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error during listing:', error);
  } finally {
    await mongoose.disconnect();
  }
}

listRestaurants();
