const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the Restaurant model
const Restaurant = require('../src/lib/restaurant.model').default;

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please define the MONGODB_URI environment variable');
  process.exit(1);
}

async function migrateData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Read the backup file
    const backupPath = path.join(__dirname, '..', 'privatediningpros.restaurants.json');
    console.log('📖 Reading backup file:', backupPath);
    
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`📊 Found ${backupData.length} restaurants in backup`);

    // Clear existing restaurants (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('✅ Existing restaurants cleared');

    // Insert the backup data
    console.log('📥 Importing restaurants to production database...');
    
    // Process in batches to avoid memory issues
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < backupData.length; i += batchSize) {
      const batch = backupData.slice(i, i + batchSize);
      
      // Transform the data to match our schema
      const transformedBatch = batch.map(restaurant => ({
        name: restaurant.name,
        address: restaurant.address,
        full_address: restaurant.full_address,
        city: restaurant.city,
        state: restaurant.state,
        postal_code: restaurant.postal_code,
        country: restaurant.country,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        website: restaurant.website,
        description: restaurant.description,
        image: restaurant.image,
        rating: restaurant.rating,
        reviews: restaurant.reviews,
        working_hours: restaurant.working_hours,
        category: restaurant.category,
        price_range: restaurant.price_range,
        privateRooms: restaurant.privateRooms || [],
        status: 'approved', // Set all imported restaurants as approved
        createdAt: restaurant.createdAt ? new Date(restaurant.createdAt.$date) : new Date(),
        updatedAt: restaurant.updatedAt ? new Date(restaurant.updatedAt.$date) : new Date(),
      }));

      await Restaurant.insertMany(transformedBatch);
      imported += batch.length;
      
      console.log(`📊 Progress: ${imported}/${backupData.length} restaurants imported (${Math.round((imported/backupData.length)*100)}%)`);
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Total restaurants imported: ${imported}`);

    // Verify the import
    const totalCount = await Restaurant.countDocuments();
    console.log(`🔍 Verification: ${totalCount} restaurants now in production database`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
migrateData();
