// Geolocation utility functions for restaurant addresses

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
  place_id?: string;
  error?: string;
}

export async function geocodeAddress(address: string): Promise<GeolocationResult | null> {
  try {
    // Use Google Geocoding API (you'll need to add your API key)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Skipping geocoding.');
      return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: result.formatted_address,
        place_id: result.place_id
      };
    } else {
      console.warn('Geocoding failed:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

export async function geocodeRestaurantAddress(
  address: string, 
  city?: string, 
  state?: string, 
  country?: string
): Promise<GeolocationResult | null> {
  try {
    // Construct full address
    let fullAddress = address;
    if (city) fullAddress += `, ${city}`;
    if (state) fullAddress += `, ${state}`;
    if (country) fullAddress += `, ${country}`;
    
    return await geocodeAddress(fullAddress);
  } catch (error) {
    console.error('Error geocoding restaurant address:', error);
    return null;
  }
}

// Alternative geocoding using OpenStreetMap Nominatim (free, no API key required)
export async function geocodeAddressNominatim(address: string): Promise<GeolocationResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PrivateDiningPros/1.0'
      }
    });
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name,
        place_id: result.place_id
      };
    } else {
      console.warn('Nominatim geocoding failed: No results found');
      return null;
    }
  } catch (error) {
    console.error('Error geocoding with Nominatim:', error);
    return null;
  }
}

// Fallback geocoding function that tries multiple services
export async function geocodeAddressWithFallback(address: string): Promise<GeolocationResult | null> {
  // Try Google Maps first (if API key is available)
  let result = await geocodeAddress(address);
  
  // If Google fails, try Nominatim as fallback
  if (!result) {
    // Google geocoding failed, trying Nominatim
    result = await geocodeAddressNominatim(address);
  }
  
  return result;
}
