const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

// Restaurant Schema (simplified for this script)
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

async function addNeighborhoodAndShortDescription() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }

    console.log('🔗 Connecting to PRODUCTION MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    const totalRestaurants = await Restaurant.countDocuments();
    console.log(`📊 Total restaurants in database: ${totalRestaurants}`);

    // Find restaurants that do NOT have the new fields
    const missingNeighborhood = await Restaurant.find({ neighborhood: { $exists: false } });
    const missingShortDescription = await Restaurant.find({ short_description: { $exists: false } });
    
    console.log(`🔍 Restaurants missing neighborhood field: ${missingNeighborhood.length}`);
    console.log(`🔍 Restaurants missing short_description field: ${missingShortDescription.length}`);

    if (missingNeighborhood.length > 0 || missingShortDescription.length > 0) {
      console.log('🔧 Adding new fields to restaurants...');
      
      // Add the new fields to all restaurants
      const result = await Restaurant.updateMany(
        {},
        {
          $set: {
            neighborhood: null, // Initialize as null
            short_description: null // Initialize as null
          }
        }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} restaurants with new fields`);
    } else {
      console.log('✅ All restaurants already have the new fields');
    }

    // Generate short descriptions from existing descriptions for restaurants that don't have them
    console.log('📝 Generating short descriptions from existing descriptions...');
    const restaurants = await Restaurant.find({
      short_description: null,
      description: { $exists: true, $ne: null, $ne: '' }
    });

    let shortDescriptionCount = 0;
    for (const restaurant of restaurants) {
      if (restaurant.description) {
        // Clean the description and create a short version
        let cleaned = restaurant.description
          .replace(/\[!\[.*?\]\(.*?\)\]/g, '') // Remove markdown image links
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove standalone markdown links but keep text
          .replace(/\s+/g, ' ') // Remove extra whitespace
          .trim();
        
        // Create short description (max 150 characters)
        let shortDescription = cleaned.length > 150 
          ? cleaned.substring(0, 147) + '...' 
          : cleaned;
        
        if (shortDescription.length > 10) { // Only update if we have meaningful content
          await Restaurant.updateOne(
            { _id: restaurant._id },
            { $set: { short_description: shortDescription } }
          );
          shortDescriptionCount++;
        }
      }
    }

    console.log(`✅ Generated short descriptions for ${shortDescriptionCount} restaurants`);

    // Generate neighborhoods from city data for NYC restaurants
    console.log('🏙️  Generating neighborhoods for NYC restaurants...');
    const nycRestaurants = await Restaurant.find({
      city: { $regex: /New York|NYC/i },
      neighborhood: null
    });

    let neighborhoodCount = 0;
    for (const restaurant of nycRestaurants) {
      let neighborhood = null;
      
      // Simple neighborhood detection based on address patterns
      const address = (restaurant.address || '').toLowerCase();
      const fullAddress = (restaurant.full_address || '').toLowerCase();
      
      if (address.includes('soho') || fullAddress.includes('soho')) {
        neighborhood = 'SoHo';
      } else if (address.includes('midtown') || fullAddress.includes('midtown')) {
        neighborhood = 'Midtown';
      } else if (address.includes('village') || fullAddress.includes('village')) {
        neighborhood = 'Greenwich Village';
      } else if (address.includes('upper east') || fullAddress.includes('upper east')) {
        neighborhood = 'Upper East Side';
      } else if (address.includes('upper west') || fullAddress.includes('upper west')) {
        neighborhood = 'Upper West Side';
      } else if (address.includes('tribeca') || fullAddress.includes('tribeca')) {
        neighborhood = 'TriBeCa';
      } else if (address.includes('chelsea') || fullAddress.includes('chelsea')) {
        neighborhood = 'Chelsea';
      } else if (address.includes('east village') || fullAddress.includes('east village')) {
        neighborhood = 'East Village';
      } else if (address.includes('west village') || fullAddress.includes('west village')) {
        neighborhood = 'West Village';
      } else if (address.includes('financial district') || fullAddress.includes('financial district')) {
        neighborhood = 'Financial District';
      } else if (address.includes('lower east') || fullAddress.includes('lower east')) {
        neighborhood = 'Lower East Side';
      }
      
      if (neighborhood) {
        await Restaurant.updateOne(
          { _id: restaurant._id },
          { $set: { neighborhood: neighborhood } }
        );
        neighborhoodCount++;
      }
    }

    console.log(`✅ Generated neighborhoods for ${neighborhoodCount} NYC restaurants`);

    // Final verification
    const restaurantsWithNeighborhood = await Restaurant.countDocuments({ neighborhood: { $exists: true, $ne: null } });
    const restaurantsWithShortDescription = await Restaurant.countDocuments({ short_description: { $exists: true, $ne: null } });
    
    console.log(`📊 Final verification:`);
    console.log(`   Total restaurants: ${totalRestaurants}`);
    console.log(`   Restaurants with neighborhood: ${restaurantsWithNeighborhood}`);
    console.log(`   Restaurants with short description: ${restaurantsWithShortDescription}`);

    const sampleRestaurant = await Restaurant.findOne().lean();
    if (sampleRestaurant) {
      console.log('📝 Sample restaurant after update:');
      console.log(`   ID: ${sampleRestaurant._id}`);
      console.log(`   Name: ${sampleRestaurant.name}`);
      console.log(`   Neighborhood: ${sampleRestaurant.neighborhood || 'Not set'}`);
      console.log(`   Short Description: ${sampleRestaurant.short_description ? sampleRestaurant.short_description.substring(0, 100) + '...' : 'Not set'}`);
    }

  } catch (error) {
    console.error('❌ Error adding new fields:', error);
  } finally {
    console.log('🔌 Disconnected from MongoDB');
    await mongoose.disconnect();
    console.log('🎉 Database schema update completed successfully!');
  }
}

addNeighborhoodAndShortDescription();
