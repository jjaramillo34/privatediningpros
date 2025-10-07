import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    await dbConnect();
    
    // Read the restaurants2.json file
    const filePath = path.join(process.cwd(), 'src', 'data', 'restaurants2.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const restaurants = JSON.parse(fileContent);
    
    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    
    for (const restaurantData of restaurants) {
      try {
        // Check if restaurant already exists by name and address
        const existingRestaurant = await Restaurant.findOne({
          name: restaurantData.name,
          address: restaurantData.street || restaurantData.full_address
        });
        
        if (existingRestaurant) {
          skippedCount++;
          continue;
        }
        
        // Map the data to our schema
        const restaurantDoc: Record<string, unknown> = {
          name: restaurantData.name,
          address: restaurantData.street || restaurantData.full_address || '',
          full_address: restaurantData.full_address,
          city: restaurantData.city,
          state: restaurantData.state,
          postal_code: restaurantData.postal_code,
          country: restaurantData.country,
          latitude: restaurantData.latitude,
          longitude: restaurantData.longitude,
          phone: restaurantData.phone,
          website: restaurantData.site,
          description: restaurantData.description,
          image: restaurantData.photo,
          rating: restaurantData.rating,
          reviews: restaurantData.reviews,
          working_hours: restaurantData.working_hours,
          category: restaurantData.category || restaurantData.type,
          price_range: restaurantData.range,
          privateRooms: []
        };
        
        // Add default private rooms for venues that are likely to have them
        const venueTypes = ['Wedding venue', 'Event venue', 'Banquet hall', 'Hotel', 'Restaurant'];
        if (venueTypes.some(type => 
          restaurantData.type?.includes(type) || 
          restaurantData.category?.includes(type) ||
          restaurantData.subtypes?.includes(type)
        )) {
          restaurantDoc.privateRooms = [
            {
              name: 'Private Dining Room',
              capacity: 20,
              description: 'Elegant private dining space perfect for intimate gatherings'
            },
            {
              name: 'Event Hall',
              capacity: 50,
              description: 'Spacious event hall suitable for larger celebrations'
            }
          ];
        }
        
        await Restaurant.create(restaurantDoc);
        importedCount++;
        
      } catch (error) {
        errors.push(`Error importing ${restaurantData.name}: ${error}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.slice(0, 10) // Return first 10 errors
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import restaurants' },
      { status: 500 }
    );
  }
} 