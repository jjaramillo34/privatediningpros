const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function updateRestaurantStatus() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please set MONGODB_URI in your .env.local file');
      return;
    }

    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Update all restaurants to pending status
    console.log('📝 Updating all restaurants to "pending" status...');
    const result = await Restaurant.updateMany(
      {}, // Match all documents
      { 
        $set: { 
          status: 'pending',
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} restaurants to pending status`);

    // Verify the update
    const totalRestaurants = await Restaurant.countDocuments();
    const pendingRestaurants = await Restaurant.countDocuments({ status: 'pending' });
    
    console.log(`📊 Database Summary:`);
    console.log(`   Total restaurants: ${totalRestaurants}`);
    console.log(`   Pending restaurants: ${pendingRestaurants}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('🎉 Restaurant status update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating restaurant status:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateRestaurantStatus();