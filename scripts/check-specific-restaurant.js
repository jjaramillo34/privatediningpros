const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function checkSpecificRestaurant() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check the specific restaurant ID from your example
    const specificId = '68d9620f03d6b7ca83ef0001';
    console.log(`🔍 Checking specific restaurant ID: ${specificId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(specificId)) {
      console.log('❌ Invalid ObjectId format');
    } else {
      const restaurant = await Restaurant.findById(specificId);
      
      if (!restaurant) {
        console.log('❌ Restaurant not found with that ID');
        
        // Let's see what restaurants we do have
        const restaurants = await Restaurant.find({}, '_id name').limit(5);
        console.log('📝 Available restaurant IDs:');
        restaurants.forEach((r, index) => {
          console.log(`   ${index + 1}. ${r._id} - ${r.name}`);
        });
      } else {
        console.log('✅ Restaurant found!');
        console.log('📄 Full document:');
        console.log(JSON.stringify(restaurant, null, 2));
      }
    }

    // Also check if there are multiple collections
    console.log('\n🔍 Checking for multiple restaurant collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const restaurantCollections = collections.filter(col => 
      col.name.toLowerCase().includes('restaurant')
    );
    
    console.log('📊 Restaurant-related collections:');
    restaurantCollections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error checking restaurant:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkSpecificRestaurant();
