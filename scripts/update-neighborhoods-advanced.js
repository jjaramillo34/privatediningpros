const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the restaurant model
const Restaurant = require('../src/lib/restaurant.model.ts');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Point-in-polygon algorithm (Ray casting algorithm)
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

// Validate coordinates
function isValidCoordinate(lng, lat) {
  return (
    typeof lng === 'number' && 
    typeof lat === 'number' && 
    !isNaN(lng) && 
    !isNaN(lat) &&
    lng >= -180 && lng <= 180 &&
    lat >= -90 && lat <= 90
  );
}

// Check if coordinates are in NYC area (rough bounds)
function isInNYCArea(lng, lat) {
  return (
    lng >= -74.3 && lng <= -73.7 && // Longitude bounds for NYC
    lat >= 40.4 && lat <= 40.9      // Latitude bounds for NYC
  );
}

async function updateNeighborhoods(options = {}) {
  const {
    dryRun = false,
    updateCity = true,
    logFile = null,
    filterBorough = null,
    skipExisting = true
  } = options;

  let logStream = null;
  if (logFile) {
    logStream = fs.createWriteStream(logFile, { flags: 'a' });
    logStream.write(`\n=== Neighborhood Update Started at ${new Date().toISOString()} ===\n`);
  }

  const log = (message) => {
    console.log(message);
    if (logStream) {
      logStream.write(`${new Date().toISOString()}: ${message}\n`);
    }
  };

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    log('✅ Connected to MongoDB');

    // Load the GeoJSON file
    const geojsonPath = path.join(__dirname, '../src/data/newyork.geojson');
    const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    log(`📁 Loaded GeoJSON with ${geojsonData.features.length} neighborhoods`);

    // Filter neighborhoods by borough if specified
    let neighborhoods = geojsonData;
    if (filterBorough) {
      neighborhoods = {
        ...geojsonData,
        features: geojsonData.features.filter(f => 
          f.properties.borough.toLowerCase() === filterBorough.toLowerCase()
        )
      };
      log(`🔍 Filtered to ${neighborhoods.features.length} neighborhoods in ${filterBorough}`);
    }

    // Build query for restaurants
    let query = {
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null }
    };

    // Skip restaurants that already have neighborhood if skipExisting is true
    if (skipExisting) {
      query.neighborhood = { $exists: false };
    }

    const restaurants = await Restaurant.find(query);
    log(`🏪 Found ${restaurants.length} restaurants with coordinates`);

    let updated = 0;
    let notFound = 0;
    let errors = 0;
    let skipped = 0;
    let invalidCoords = 0;
    let outsideNYC = 0;

    for (const restaurant of restaurants) {
      try {
        // Validate coordinates
        if (!isValidCoordinate(restaurant.longitude, restaurant.latitude)) {
          log(`⚠️  Invalid coordinates for ${restaurant.name}: (${restaurant.longitude}, ${restaurant.latitude})`);
          invalidCoords++;
          continue;
        }

        // Check if coordinates are in NYC area
        if (!isInNYCArea(restaurant.longitude, restaurant.latitude)) {
          log(`🌍 Coordinates outside NYC area for ${restaurant.name}: (${restaurant.longitude}, ${restaurant.latitude})`);
          outsideNYC++;
          continue;
        }

        const neighborhood = findNeighborhood(
          restaurant.longitude,
          restaurant.latitude,
          neighborhoods
        );

        if (neighborhood) {
          const updateData = {
            neighborhood: neighborhood.neighborhood
          };

          // Update city with borough if specified
          if (updateCity && (restaurant.city === 'New York' || restaurant.city === 'Manhattan' || !restaurant.city)) {
            updateData.city = neighborhood.borough;
          }

          if (dryRun) {
            log(`🔍 [DRY RUN] Would update ${restaurant.name}: ${neighborhood.neighborhood}, ${neighborhood.borough}`);
          } else {
            await Restaurant.findByIdAndUpdate(restaurant._id, updateData);
            log(`✅ Updated ${restaurant.name}: ${neighborhood.neighborhood}, ${neighborhood.borough}`);
          }
          updated++;
        } else {
          log(`❌ No neighborhood found for ${restaurant.name} at (${restaurant.longitude}, ${restaurant.latitude})`);
          notFound++;
        }
      } catch (error) {
        log(`❌ Error updating ${restaurant.name}: ${error.message}`);
        errors++;
      }
    }

    log('\n📊 Summary:');
    log(`✅ Updated: ${updated} restaurants`);
    log(`❌ Not found: ${notFound} restaurants`);
    log(`⚠️  Errors: ${errors} restaurants`);
    log(`⏭️  Skipped: ${skipped} restaurants`);
    log(`🚫 Invalid coordinates: ${invalidCoords} restaurants`);
    log(`🌍 Outside NYC: ${outsideNYC} restaurants`);

    if (dryRun) {
      log('\n🔍 This was a DRY RUN - no changes were made to the database');
    }

  } catch (error) {
    log(`❌ Error: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('🔌 Disconnected from MongoDB');
    
    if (logStream) {
      logStream.write(`=== Neighborhood Update Completed at ${new Date().toISOString()} ===\n\n`);
      logStream.end();
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--dry-run':
      options.dryRun = true;
      break;
    case '--no-update-city':
      options.updateCity = false;
      break;
    case '--log-file':
      options.logFile = args[++i];
      break;
    case '--borough':
      options.filterBorough = args[++i];
      break;
    case '--force-update':
      options.skipExisting = false;
      break;
    case '--help':
      console.log(`
Usage: node update-neighborhoods-advanced.js [options]

Options:
  --dry-run              Show what would be updated without making changes
  --no-update-city       Don't update the city field with borough
  --log-file <file>      Write detailed logs to file
  --borough <name>       Only process neighborhoods in specified borough
  --force-update         Update restaurants that already have neighborhood
  --help                 Show this help message

Examples:
  node update-neighborhoods-advanced.js --dry-run
  node update-neighborhoods-advanced.js --log-file update.log
  node update-neighborhoods-advanced.js --borough Manhattan
  node update-neighborhoods-advanced.js --dry-run --borough Brooklyn
      `);
      process.exit(0);
      break;
  }
}

// Run the script
updateNeighborhoods(options);
