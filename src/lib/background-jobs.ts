// Background job processing for restaurant suggestions

import { geocodeAddressWithFallback } from './geolocation';
import Restaurant from './restaurant.model';
import dbConnect from './mongodb';

export interface BackgroundJobResult {
  success: boolean;
  message: string;
  data?: any;
}

// Process pending restaurant suggestions
export async function processPendingRestaurants(): Promise<BackgroundJobResult> {
  try {
    await dbConnect();
    
    // Find restaurants that need geocoding
    const restaurants = await Restaurant.find({
      status: 'pending',
      $or: [
        { latitude: { $exists: false } },
        { longitude: { $exists: false } },
        { latitude: null },
        { longitude: null }
      ]
    }).limit(10); // Process 10 at a time

    if (restaurants.length === 0) {
      return {
        success: true,
        message: 'No pending restaurants need geocoding'
      };
    }

    let processed = 0;
    let geocoded = 0;
    let errors = 0;

    for (const restaurant of restaurants) {
      try {
        processed++;
        
        // Construct full address
        const addressParts = [
          restaurant.address,
          restaurant.city,
          restaurant.state,
          restaurant.country
        ].filter(Boolean);
        
        const fullAddress = addressParts.join(', ');
        
        if (!fullAddress) {
          console.warn(`Restaurant ${restaurant.name} has no address to geocode`);
          continue;
        }

        // Geocode the address
        const geolocationResult = await geocodeAddressWithFallback(fullAddress);
        
        if (geolocationResult) {
          // Update restaurant with geocoded data
          await Restaurant.findByIdAndUpdate(restaurant._id, {
            latitude: geolocationResult.latitude,
            longitude: geolocationResult.longitude,
            full_address: geolocationResult.formatted_address || fullAddress,
            updatedAt: new Date()
          });
          
          geocoded++;
          // Restaurant geocoded successfully
        } else {
          console.warn(`Failed to geocode restaurant: ${restaurant.name}`);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errors++;
        console.error(`Error processing restaurant ${restaurant.name}:`, error);
      }
    }

    return {
      success: true,
      message: `Processed ${processed} restaurants. Geocoded: ${geocoded}, Errors: ${errors}`,
      data: { processed, geocoded, errors }
    };
    
  } catch (error) {
    console.error('Error in processPendingRestaurants:', error);
    return {
      success: false,
      message: 'Failed to process pending restaurants',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

// Process a single restaurant for geocoding
export async function processRestaurantGeocoding(restaurantId: string): Promise<BackgroundJobResult> {
  try {
    await dbConnect();
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return {
        success: false,
        message: 'Restaurant not found'
      };
    }

    // Construct full address
    const addressParts = [
      restaurant.address,
      restaurant.city,
      restaurant.state,
      restaurant.country
    ].filter(Boolean);
    
    const fullAddress = addressParts.join(', ');
    
    if (!fullAddress) {
      return {
        success: false,
        message: 'No address available for geocoding'
      };
    }

    // Geocode the address
    const geolocationResult = await geocodeAddressWithFallback(fullAddress);
    
    if (geolocationResult) {
      // Update restaurant with geocoded data
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        latitude: geolocationResult.latitude,
        longitude: geolocationResult.longitude,
        full_address: geolocationResult.formatted_address || fullAddress,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: `Successfully geocoded ${restaurant.name}`,
        data: {
          latitude: geolocationResult.latitude,
          longitude: geolocationResult.longitude,
          formatted_address: geolocationResult.formatted_address
        }
      };
    } else {
      return {
        success: false,
        message: `Failed to geocode address for ${restaurant.name}`
      };
    }
    
  } catch (error) {
    console.error('Error in processRestaurantGeocoding:', error);
    return {
      success: false,
      message: 'Failed to process restaurant geocoding',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

// Validate and clean restaurant data
export async function validateRestaurantData(restaurantId: string): Promise<BackgroundJobResult> {
  try {
    await dbConnect();
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return {
        success: false,
        message: 'Restaurant not found'
      };
    }

    const updates: any = {};
    let hasUpdates = false;

    // Validate and clean phone number
    if (restaurant.phone) {
      const cleanPhone = restaurant.phone.replace(/\D/g, ''); // Remove non-digits
      if (cleanPhone.length >= 10) {
        updates.phone = cleanPhone;
        hasUpdates = true;
      }
    }

    // Validate website URL
    if (restaurant.website) {
      let website = restaurant.website;
      if (!website.startsWith('http://') && !website.startsWith('https://')) {
        website = 'https://' + website;
        updates.website = website;
        hasUpdates = true;
      }
    }

    // Clean and validate rating
    if (restaurant.rating) {
      const rating = parseFloat(restaurant.rating.toString());
      if (rating >= 0 && rating <= 5) {
        updates.rating = rating;
        hasUpdates = true;
      }
    }

    // Update if there are changes
    if (hasUpdates) {
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        ...updates,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: `Validated and cleaned data for ${restaurant.name}`,
        data: updates
      };
    } else {
      return {
        success: true,
        message: `No validation issues found for ${restaurant.name}`
      };
    }
    
  } catch (error) {
    console.error('Error in validateRestaurantData:', error);
    return {
      success: false,
      message: 'Failed to validate restaurant data',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}
