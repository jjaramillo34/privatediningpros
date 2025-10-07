const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function checkProductionFeatured() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check the specific restaurant
    const specificId = '68d9620f03d6b7ca83ef0001';
    console.log(`🔍 Checking restaurant ID: ${specificId}`);

    const restaurant = await Restaurant.findById(specificId);
    
    if (!restaurant) {
      console.log('❌ Restaurant not found');
      return;
    }

    console.log('📄 Current restaurant document:');
    console.log(JSON.stringify(restaurant, null, 2));

    // Check if featured field exists
    console.log('\n🔍 Field analysis:');
    console.log(`   Has featured field: ${'featured' in restaurant}`);
    console.log(`   Featured value: ${restaurant.featured}`);
    console.log(`   Featured type: ${typeof restaurant.featured}`);

    // Force update the featured field
    console.log('\n🔧 Force updating featured field...');
    const updateResult = await Restaurant.updateOne(
      { _id: specificId },
      {
        $set: {
          featured: false,
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Update result: ${updateResult.modifiedCount} documents modified`);

    // Verify the update
    const updatedRestaurant = await Restaurant.findById(specificId);
    console.log('\n📄 Updated restaurant document:');
    console.log(JSON.stringify(updatedRestaurant, null, 2));

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProductionFeatured();
