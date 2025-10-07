import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';
import restaurantsData from '@/data/restaurants.json';

export async function POST() {
  try {
    await dbConnect();
    
    // Check if sample data already exists
    const existingRestaurants = await Restaurant.find();
    
    if (existingRestaurants.length > 0) {
      return NextResponse.json({ 
        message: 'Sample data already exists. Clear existing data first to add new samples.',
        count: existingRestaurants.length 
      });
    }

    // Starting import of restaurants

    // Import the entire dataset
    const transformedRestaurants = restaurantsData.map((restaurant: Record<string, unknown>) => {
      // Clean and validate the data
      const transformed = {
        name: restaurant.name || 'Unknown Restaurant',
        address: restaurant.street || restaurant.full_address || 'Address not available',
        full_address: restaurant.full_address || restaurant.street || 'Address not available',
        city: restaurant.city || 'Unknown City',
        state: restaurant.state || 'Unknown State',
        postal_code: restaurant.postal_code?.toString() || '00000',
        country: restaurant.country || 'United States',
        latitude: restaurant.latitude || 0,
        longitude: restaurant.longitude || 0,
        phone: restaurant.phone || '',
        website: restaurant.site || '',
        description: restaurant.description || 'No description available',
        category: restaurant.category || restaurant.type || 'Restaurant',
        price_range: restaurant.range || '$$',
        rating: restaurant.rating || 0,
        reviews: restaurant.reviews || 0,
        image: restaurant.photo || '',
        working_hours: restaurant.working_hours || {},
        privateRooms: [
          {
            name: 'Private Dining Room',
            capacity: 20,
            description: 'Private dining space available for events and special occasions.'
          }
        ]
      };

      // Validate required fields
      if (!transformed.name || transformed.name === 'Unknown Restaurant') {
        console.warn('Restaurant missing name:', restaurant);
      }

      return transformed;
    });

    // Transformed restaurants for import

    // Add restaurants
    const createdRestaurants = await Restaurant.insertMany(transformedRestaurants);

    return NextResponse.json({ 
      message: 'Restaurants from JSON file added successfully',
      count: createdRestaurants.length,
      restaurants: createdRestaurants.map(r => ({ 
        id: r._id, 
        name: r.name, 
        address: r.full_address || r.address,
        rating: r.rating,
        category: r.category
      }))
    });
  } catch (error) {
    console.error('Error adding restaurants from JSON:', error);
    return NextResponse.json({ 
      error: 'Failed to add restaurants from JSON',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    
    const result = await Restaurant.deleteMany({});
    
    return NextResponse.json({ 
      message: 'All restaurants deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting restaurants:', error);
    return NextResponse.json({ error: 'Failed to delete restaurants' }, { status: 500 });
  }
} 