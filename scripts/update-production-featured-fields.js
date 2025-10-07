const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function updateProductionFeaturedFields() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please set MONGODB_URI in your .env.local file');
      return;
    }

    console.log('🔗 Connecting to PRODUCTION MongoDB...');
    console.log('📍 Database:', MONGODB_URI.split('@')[1]?.split('/')[0] || 'Unknown');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Check current state
    const totalCount = await Restaurant.countDocuments();
    console.log(`📊 Total restaurants in production: ${totalCount}`);

    // Check how many are missing the featured field
    const missingFeatured = await Restaurant.countDocuments({
      $or: [
        { featured: { $exists: false } },
        { featured: null }
      ]
    });
    console.log(`🔍 Restaurants missing featured field: ${missingFeatured}`);

    if (missingFeatured > 0) {
      console.log('🔧 Adding featured fields to production restaurants...');
      
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

    // Also update status to pending if needed
    const approvedCount = await Restaurant.countDocuments({ status: 'approved' });
    if (approvedCount > 0) {
      console.log(`🔄 Found ${approvedCount} restaurants with 'approved' status, updating to 'pending'...`);
      
      const statusResult = await Restaurant.updateMany(
        { status: 'approved' },
        {
          $set: {
            status: 'pending',
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ Updated ${statusResult.modifiedCount} restaurants to 'pending' status`);
    }

    // Verify the updates
    const updatedCount = await Restaurant.countDocuments({
      featured: { $exists: true }
    });
    const pendingCount = await Restaurant.countDocuments({ status: 'pending' });
    
    console.log('📊 Final verification:');
    console.log(`   Total restaurants: ${totalCount}`);
    console.log(`   Restaurants with featured field: ${updatedCount}`);
    console.log(`   Restaurants with pending status: ${pendingCount}`);

    // Show a sample restaurant to verify (the one you mentioned)
    const sampleRestaurant = await Restaurant.findById('68d9620f03d6b7ca83ef0001');
    if (sampleRestaurant) {
      console.log('📝 Sample restaurant after update:');
      console.log(`   ID: ${sampleRestaurant._id}`);
      console.log(`   Name: ${sampleRestaurant.name}`);
      console.log(`   Status: ${sampleRestaurant.status}`);
      console.log(`   Featured: ${sampleRestaurant.featured}`);
      console.log(`   Has featured field: ${'featured' in sampleRestaurant}`);
      console.log(`   Updated at: ${sampleRestaurant.updatedAt}`);
    } else {
      console.log('❌ Sample restaurant not found (this is expected if using different IDs)');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('🎉 Production database updated successfully!');

  } catch (error) {
    console.error('❌ Error updating production database:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateProductionFeaturedFields();
