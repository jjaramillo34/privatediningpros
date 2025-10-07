const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the restaurant model
const Restaurant = require('../src/lib/restaurant.model.ts');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Point-in-polygon algorithm
function pointInPolygon(point, polygon) {
  const x = point[0];
  const y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Find neighborhood for a given coordinate
function findNeighborhood(lng, lat, neighborhoods) {
  const point = [lng, lat];
  
  for (const feature of neighborhoods.features) {
    const coordinates = feature.geometry.coordinates[0]; // First ring of polygon
    if (pointInPolygon(point, coordinates)) {
      return {
        neighborhood: feature.properties.neighborhood,
        borough: feature.properties.borough,
        boroughCode: feature.properties.boroughCode
      };
    }
  }
  
  return null;
}

async function updateNeighborhoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Load the GeoJSON file
    const geojsonPath = path.join(__dirname, '../src/data/newyork.geojson');
    const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    console.log(`📁 Loaded GeoJSON with ${geojsonData.features.length} neighborhoods`);

    // Get all restaurants with coordinates
    const restaurants = await Restaurant.find({
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null }
    });

    console.log(`🏪 Found ${restaurants.length} restaurants with coordinates`);

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const restaurant of restaurants) {
      try {
        const neighborhood = findNeighborhood(
          restaurant.longitude,
          restaurant.latitude,
          geojsonData
        );

        if (neighborhood) {
          // Update the restaurant with neighborhood information
          await Restaurant.findByIdAndUpdate(restaurant._id, {
            neighborhood: neighborhood.neighborhood,
            // Also update city with borough if it's not already set or is generic
            ...(restaurant.city === 'New York' || restaurant.city === 'Manhattan' || !restaurant.city ? {
              city: neighborhood.borough
            } : {})
          });

          console.log(`✅ Updated ${restaurant.name}: ${neighborhood.neighborhood}, ${neighborhood.borough}`);
          updated++;
        } else {
          console.log(`❌ No neighborhood found for ${restaurant.name} at (${restaurant.longitude}, ${restaurant.latitude})`);
          notFound++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${restaurant.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Updated: ${updated} restaurants`);
    console.log(`❌ Not found: ${notFound} restaurants`);
    console.log(`⚠️  Errors: ${errors} restaurants`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
updateNeighborhoods();
