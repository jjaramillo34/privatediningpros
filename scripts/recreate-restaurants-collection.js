const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.PRODUCTION_MONGODB_URI || '';

// Restaurant Schema with all current fields
const privateRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  description: { type: String }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  full_address: { type: String },
  city: { type: String },
  state: { type: String },
  postal_code: { type: String },
  country: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  phone: { type: String },
  website: { type: String },
  description: { type: String },
  image: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  reviews: { type: Number },
  working_hours: { type: mongoose.Schema.Types.Mixed },
  category: { type: String },
  price_range: { type: String },
  privateRooms: { type: [privateRoomSchema], default: [] },
  // Approval and submission tracking
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  // Featured/Curated content
  featured: { type: Boolean, default: false },
  featuredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featuredAt: { type: Date }
}, {
  timestamps: true
});

const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function recreateRestaurantsCollection() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Step 1: Backup existing restaurants
    console.log('📦 Creating backup of existing restaurants...');
    const existingRestaurants = await Restaurant.find({});
    const backupData = existingRestaurants.map(restaurant => restaurant.toObject());
    
    const backupFileName = `restaurants-backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(backupFileName, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${backupFileName}`);

    // Step 2: Drop the existing collection
    console.log('🗑️  Dropping existing restaurants collection...');
    await mongoose.connection.db.collection('restaurants').drop();
    console.log('✅ Collection dropped successfully');

    // Step 3: Recreate the collection with new schema
    console.log('🔄 Recreating restaurants collection with new schema...');
    
    // Transform the backup data to include new fields
    const transformedData = backupData.map(restaurant => ({
      ...restaurant,
      featured: false, // Initialize all as not featured
      featuredBy: undefined,
      featuredAt: undefined,
      status: 'pending', // Set all to pending for admin review
      approvedBy: undefined,
      approvedAt: undefined,
      // Ensure privateRooms is properly formatted
      privateRooms: restaurant.privateRooms || [],
      // Clean up any potential issues
      createdAt: restaurant.createdAt ? new Date(restaurant.createdAt) : new Date(),
      updatedAt: new Date()
    }));

    // Step 4: Insert the transformed data
    console.log('📝 Inserting restaurants with new schema...');
    const result = await Restaurant.insertMany(transformedData, { ordered: false });
    console.log(`✅ Successfully inserted ${result.length} restaurants`);

    // Step 5: Verify the collection
    const count = await Restaurant.countDocuments();
    const sampleRestaurant = await Restaurant.findOne();
    
    console.log('📊 Verification:');
    console.log(`   Total restaurants: ${count}`);
    console.log(`   Sample restaurant ID: ${sampleRestaurant._id}`);
    console.log(`   Sample restaurant name: ${sampleRestaurant.name}`);
    console.log(`   Sample restaurant status: ${sampleRestaurant.status}`);
    console.log(`   Sample restaurant featured: ${sampleRestaurant.featured}`);
    console.log(`   Sample restaurant has privateRooms: ${Array.isArray(sampleRestaurant.privateRooms)}`);

    console.log('🎉 Restaurant collection recreated successfully!');
    console.log(`📁 Backup file: ${backupFileName}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error during recreation:', error);
    
    // Try to restore from backup if something went wrong
    if (fs.existsSync(`restaurants-backup-${new Date().toISOString().split('T')[0]}.json`)) {
      console.log('🔄 Attempting to restore from backup...');
      try {
        const backupData = JSON.parse(fs.readFileSync(`restaurants-backup-${new Date().toISOString().split('T')[0]}.json`, 'utf8'));
        await Restaurant.deleteMany({});
        await Restaurant.insertMany(backupData, { ordered: false });
        console.log('✅ Restored from backup');
      } catch (restoreError) {
        console.error('❌ Failed to restore from backup:', restoreError);
      }
    }
  } finally {
    await mongoose.disconnect();
  }
}

recreateRestaurantsCollection();
