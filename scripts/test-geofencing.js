const fs = require('fs');
const path = require('path');

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

function testGeofencing() {
  try {
    // Load the GeoJSON file
    const geojsonPath = path.join(__dirname, '../src/data/newyork.geojson');
    const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    console.log(`📁 Loaded GeoJSON with ${geojsonData.features.length} neighborhoods`);

    // Test coordinates (known locations in NYC)
    const testCoordinates = [
      { name: 'Times Square', lng: -73.9857, lat: 40.7580 },
      { name: 'Central Park', lng: -73.9654, lat: 40.7829 },
      { name: 'Brooklyn Bridge', lng: -73.9969, lat: 40.7061 },
      { name: 'JFK Airport', lng: -73.7781, lat: 40.6413 },
      { name: 'Yankee Stadium', lng: -73.9262, lat: 40.8296 },
      { name: 'Coney Island', lng: -73.9816, lat: 40.5749 },
      { name: 'Flushing Meadows', lng: -73.8407, lat: 40.7505 },
      { name: 'Staten Island Ferry', lng: -74.0445, lat: 40.6415 },
      { name: 'STK Steakhouse (from your data)', lng: -74.00727499999999, lat: 40.739793999999996 }
    ];

    console.log('\n🧪 Testing geofencing with known NYC locations:\n');

    for (const coord of testCoordinates) {
      const neighborhood = findNeighborhood(coord.lng, coord.lat, geojsonData);
      
      if (neighborhood) {
        console.log(`✅ ${coord.name} (${coord.lng}, ${coord.lat})`);
        console.log(`   → ${neighborhood.neighborhood}, ${neighborhood.borough}`);
      } else {
        console.log(`❌ ${coord.name} (${coord.lng}, ${coord.lat})`);
        console.log(`   → No neighborhood found`);
      }
      console.log('');
    }

    // Test some edge cases
    console.log('🔍 Testing edge cases:\n');
    
    const edgeCases = [
      { name: 'Outside NYC (Boston)', lng: -71.0589, lat: 42.3601 },
      { name: 'Invalid coordinates', lng: 0, lat: 0 },
      { name: 'NYC bounds (lower)', lng: -74.3, lat: 40.4 },
      { name: 'NYC bounds (upper)', lng: -73.7, lat: 40.9 }
    ];

    for (const coord of edgeCases) {
      const neighborhood = findNeighborhood(coord.lng, coord.lat, geojsonData);
      
      if (neighborhood) {
        console.log(`✅ ${coord.name} (${coord.lng}, ${coord.lat})`);
        console.log(`   → ${neighborhood.neighborhood}, ${neighborhood.borough}`);
      } else {
        console.log(`❌ ${coord.name} (${coord.lng}, ${coord.lat})`);
        console.log(`   → No neighborhood found (expected for edge cases)`);
      }
      console.log('');
    }

    // Show some sample neighborhoods
    console.log('🏘️  Sample neighborhoods in the GeoJSON:\n');
    const sampleNeighborhoods = geojsonData.features.slice(0, 10);
    for (const feature of sampleNeighborhoods) {
      console.log(`   • ${feature.properties.neighborhood} (${feature.properties.borough})`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testGeofencing();
