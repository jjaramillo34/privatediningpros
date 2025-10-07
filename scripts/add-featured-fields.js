const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function addFeaturedFields() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check current state
    const totalCount = await Restaurant.countDocuments();
    console.log(`📊 Total restaurants: ${totalCount}`);

    // Check how many are missing the featured field
    const missingFeatured = await Restaurant.countDocuments({
      $or: [
        { featured: { $exists: false } },
        { featured: null }
      ]
    });
    console.log(`🔍 Restaurants missing featured field: ${missingFeatured}`);

    if (missingFeatured > 0) {
      console.log('🔧 Adding featured fields to restaurants...');
      
      // Add featured field to all restaurants that don't have it
      const result = await Restaurant.updateMany(
        {
          $or: [
            { featured: { $exists: false } },
            { featured: null }
          ]
        },
        {
          $set: {
            featured: false,
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Updated ${result.modifiedCount} restaurants with featured field`);
    } else {
      console.log('✅ All restaurants already have the featured field');
    }

    // Verify the update
    const updatedCount = await Restaurant.countDocuments({
      featured: { $exists: true }
    });
    console.log(`📊 Restaurants with featured field: ${updatedCount}`);

    // Show a sample restaurant to verify
    const sampleRestaurant = await Restaurant.findOne();
    if (sampleRestaurant) {
      console.log('📝 Sample restaurant after update:');
      console.log(`   ID: ${sampleRestaurant._id}`);
      console.log(`   Name: ${sampleRestaurant.name}`);
      console.log(`   Status: ${sampleRestaurant.status}`);
      console.log(`   Featured: ${sampleRestaurant.featured}`);
      console.log(`   Has featured field: ${'featured' in sampleRestaurant}`);
      console.log(`   Updated at: ${sampleRestaurant.updatedAt}`);
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('🎉 Featured fields added successfully!');

  } catch (error) {
    console.error('❌ Error adding featured fields:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addFeaturedFields();
