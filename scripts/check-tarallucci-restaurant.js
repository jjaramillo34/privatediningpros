const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function checkTarallucciRestaurant() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Find the Tarallucci e Vino Events restaurant
    const restaurant = await Restaurant.findOne({ name: 'Tarallucci e Vino Events' });
    
    if (!restaurant) {
      console.log('❌ Tarallucci e Vino Events restaurant not found');
      
      // Let's see what restaurants we have with similar names
      const similarRestaurants = await Restaurant.find({ 
        name: { $regex: /tarallucci/i } 
      }, '_id name');
      
      if (similarRestaurants.length > 0) {
        console.log('📝 Found similar restaurants:');
        similarRestaurants.forEach(r => {
          console.log(`   - ${r._id}: ${r.name}`);
        });
      }
    } else {
      console.log('✅ Tarallucci e Vino Events restaurant found!');
      console.log('📄 Full document with all fields:');
      console.log(JSON.stringify(restaurant, null, 2));
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error checking restaurant:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkTarallucciRestaurant();
