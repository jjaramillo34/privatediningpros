const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function testNewFields() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Test with the same restaurant ID from the image
    const testId = '68d9620f03d6b7ca83ef0001';
    console.log(`🔍 Testing restaurant ID: ${testId}`);

    const restaurant = await Restaurant.findById(testId);
    
    if (!restaurant) {
      console.log('❌ Restaurant not found');
      return;
    }

    console.log('📄 Restaurant data with new fields:');
    console.log('=' .repeat(50));
    console.log(`Name: ${restaurant.name}`);
    console.log(`Neighborhood: ${restaurant.neighborhood || 'Not set'}`);
    console.log(`Short Description: ${restaurant.short_description || 'Not set'}`);
    console.log(`Full Description: ${restaurant.description ? restaurant.description.substring(0, 100) + '...' : 'Not set'}`);
    console.log('=' .repeat(50));

    // Check if the fields exist in the schema
    console.log('\n🔍 Field existence check:');
    console.log(`   Has neighborhood field: ${'neighborhood' in restaurant}`);
    console.log(`   Has short_description field: ${'short_description' in restaurant}`);
    console.log(`   Neighborhood value: ${restaurant.neighborhood}`);
    console.log(`   Short description value: ${restaurant.short_description}`);

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testNewFields();
