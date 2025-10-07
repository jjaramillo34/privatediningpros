import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    neighborhood: string;
    boroughCode: string;
    borough: string;
    '@id': string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Load GeoJSON data
let geoData: GeoJSONData | null = null;

function loadGeoData(): GeoJSONData {
  if (!geoData) {
    try {
      const filePath = join(process.cwd(), 'src', 'data', 'newyork.geojson');
      const fileContent = readFileSync(filePath, 'utf8');
      geoData = JSON.parse(fileContent) as GeoJSONData;
    } catch (error) {
      throw new Error('Failed to load neighborhood data');
    }
  }
  return geoData;
}

// Point-in-polygon test using ray casting algorithm
function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Find neighborhood for given coordinates
function findNeighborhood(latitude: number, longitude: number, city: string): string {
  try {
    const geoData = loadGeoData();
    const point: [number, number] = [longitude, latitude]; // GeoJSON uses [lng, lat] format
    
    // Search through all features to find matching neighborhood
    for (const feature of geoData.features) {
      if (feature.geometry.type === 'Polygon') {
        const coordinates = feature.geometry.coordinates[0]; // First ring of polygon
        if (pointInPolygon(point, coordinates)) {
          return feature.properties.neighborhood;
        }
      }
    }
    
    // If no neighborhood found, return the city
    return city;
  } catch (error) {
    return city; // Fallback to city name
  }
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, city } = await request.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    const neighborhood = findNeighborhood(
      parseFloat(latitude),
      parseFloat(longitude),
      city || 'New York'
    );
    
    return NextResponse.json({ neighborhood });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to determine neighborhood' },
      { status: 500 }
    );
  }
}
