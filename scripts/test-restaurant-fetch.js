const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function testRestaurantFetch() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    const testId = '68d9620f03d6b7ca83ef0b91';
    console.log(`🔍 Testing fetch for restaurant ID: ${testId}`);

    // Check if ID is valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      console.error('❌ Invalid ObjectId format');
      return;
    }

    const restaurant = await Restaurant.findById(testId);
    
    if (!restaurant) {
      console.log('❌ Restaurant not found in database');
      
      // Let's check what restaurants we do have
      const count = await Restaurant.countDocuments();
      console.log(`📊 Total restaurants in database: ${count}`);
      
      // Get a sample restaurant to see the structure
      const sampleRestaurant = await Restaurant.findOne();
      if (sampleRestaurant) {
        console.log('📝 Sample restaurant structure:');
        console.log('- ID:', sampleRestaurant._id);
        console.log('- Name:', sampleRestaurant.name);
        console.log('- Status:', sampleRestaurant.status);
        console.log('- Has featured field:', 'featured' in sampleRestaurant);
      }
    } else {
      console.log('✅ Restaurant found!');
      console.log('- Name:', restaurant.name);
      console.log('- Status:', restaurant.status);
      console.log('- Featured:', restaurant.featured);
      console.log('- Has all required fields:', {
        name: !!restaurant.name,
        address: !!restaurant.address,
        privateRooms: Array.isArray(restaurant.privateRooms)
      });
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error during test:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.disconnect();
  }
}

testRestaurantFetch();
