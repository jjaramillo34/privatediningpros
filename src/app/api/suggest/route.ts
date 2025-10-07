import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const {
      name, 
      address, 
      city, 
      state, 
      country, 
      phone, 
      website, 
      description, 
      image, 
      images,
      category, 
      price_range, 
      submittedBy,
      // Additional fields from enhanced form
      neighborhood,
      postal_code,
      email,
      rating,
      reviews,
      private_rooms,
      capacity,
      special_features,
      cuisine_type,
      atmosphere,
      dress_code,
      parking,
      accessibility,
      hours,
      best_for,
      contact_person,
      notes,
      short_description,
      // Additional Outscraper API fields
      place_id,
      google_id,
      business_status,
      verified,
      logo,
      photo,
      street_view,
      time_zone,
      plus_code,
      h3,
      service_options,
      highlights,
      popular_for,
      offerings,
      dining_options,
      amenities,
      crowd,
      planning,
      payments,
      typical_time_spent,
      subtypes,
      reviews_tags,
      photos_count,
      reviews_per_score,
      reservation_links,
      booking_appointment_link,
      menu_link,
      order_links,
      latitude,
      longitude
    } = data;

    if (!name || !address) {
      return NextResponse.json({ message: 'Name and address are required.' }, { status: 400 });
    }

    // Coordinates come from Outscraper API, no need for geocoding

    // Parse working hours if provided
    let workingHours = null;
    if (hours) {
      try {
        // If it's already a JSON string, parse it
        if (typeof hours === 'string') {
          workingHours = JSON.parse(hours);
        } else {
          workingHours = hours;
        }
      } catch (parseError) {
        console.warn('Failed to parse working hours:', parseError);
        // Store as string if JSON parsing fails
        workingHours = hours;
      }
    }

    // Parse private rooms if provided
    let privateRooms = [];
    if (private_rooms) {
      try {
        // If it's a string, try to parse it
        if (typeof private_rooms === 'string') {
          const parsed = JSON.parse(private_rooms);
          if (Array.isArray(parsed)) {
            privateRooms = parsed;
          } else {
            // If it's not an array, create a single room entry
            privateRooms = [{
              name: 'Private Dining Room',
              capacity: parseInt(private_rooms) || 10,
              description: 'Private dining space'
            }];
          }
        } else if (Array.isArray(private_rooms)) {
          privateRooms = private_rooms;
        }
      } catch (parseError) {
        console.warn('Failed to parse private rooms:', parseError);
        // Create a default room entry
        privateRooms = [{
          name: 'Private Dining Room',
          capacity: parseInt(private_rooms) || 10,
          description: 'Private dining space'
        }];
      }
    }

    // Create the restaurant with all available data
    const restaurantData: any = {
      name,
      address,
      city,
      state,
      country,
      phone,
      website,
      description,
      image,
      images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : undefined,
      category,
      price_range,
      status: 'pending',
      submittedBy: submittedBy || undefined,
      // Additional fields
      neighborhood,
      postal_code,
      short_description,
      rating: rating ? parseFloat(rating) : undefined,
      reviews: reviews ? parseInt(reviews) : undefined,
      working_hours: workingHours,
      privateRooms,
      // Coordinates from Outscraper API
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      // Additional Outscraper API fields
      place_id,
      google_id,
      business_status,
      verified: verified === 'true',
      logo,
      photo,
      street_view,
      time_zone,
      plus_code,
      h3,
      // Service and amenity data (stored as JSON strings)
      service_options,
      highlights,
      popular_for,
      accessibility,
      offerings,
      dining_options,
      amenities,
      atmosphere,
      crowd,
      planning,
      payments,
      parking,
      // Additional data
      typical_time_spent,
      subtypes,
      reviews_tags,
      photos_count: photos_count ? parseInt(photos_count) : undefined,
      reviews_per_score,
      reservation_links,
      booking_appointment_link,
      menu_link,
      order_links,
      // Store additional info in description or notes
      ...(special_features && { 
        description: `${description || ''}\n\nSpecial Features: ${special_features}`.trim() 
      }),
      ...(notes && { 
        description: `${description || ''}\n\nAdditional Notes: ${notes}`.trim() 
      })
    };

    // Clean up undefined values
    Object.keys(restaurantData).forEach(key => {
      if (restaurantData[key] === undefined || restaurantData[key] === '') {
        delete restaurantData[key];
      }
    });

    const newRestaurant = await Restaurant.create(restaurantData);

    // Restaurant saved successfully

    return NextResponse.json({ 
      success: true, 
      restaurant: newRestaurant,
      message: 'Restaurant suggestion submitted successfully with verified data from Outscraper API'
    });
  } catch (error) {
    console.error('Error in suggest route:', error);
    return NextResponse.json({ message: 'Failed to submit suggestion.' }, { status: 500 });
  }
} 