import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json();
    
    if (!query) {
      return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
    }

    // Construct search query
    const searchQuery = `${query}, ${location}`;
    
    // Use Outscraper API
    const outscraperApiKey = process.env.OUTSCRAPER_API_KEY;
    
    if (!outscraperApiKey) {
      return NextResponse.json({ 
        message: 'Outscraper API key not configured',
        error: 'Please configure OUTSCRAPER_API_KEY in environment variables'
      }, { status: 500 });
    }

    // Make the search request
    const response = await fetch('https://api.outscraper.com/maps/search-v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': outscraperApiKey,
      },
      body: JSON.stringify({
        query: [searchQuery],
        limit: 1,
        language: 'en',
        region: 'us',
        async: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        message: 'Failed to search restaurants',
        error: `HTTP ${response.status}: ${errorText}`
      }, { status: response.status });
    }

    const data = await response.json();

    // Handle async results if needed
    if (response.status === 202 && data.status === 'Pending') {
      // Poll for results using the correct endpoint
      const maxAttempts = 30;
      const pollInterval = 2000; // 2 seconds
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
        
        try {
          const resultsResponse = await fetch(`https://api.outscraper.cloud/requests/${data.id}`, {
            method: 'GET',
            headers: {
              'X-API-KEY': outscraperApiKey,
            }
          });
          
          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json();
            
            if (resultsData.status === 'Success' && resultsData.data && resultsData.data.length > 0) {
              data.data = resultsData.data;
              data.status = 'Success';
              break;
            } else if (resultsData.status === 'Failed') {
              return NextResponse.json({ 
                message: 'Search failed',
                error: resultsData.error || 'Unknown error'
              }, { status: 500 });
            }
          }
        } catch (pollError) {
          // Continue polling on error
        }
      }
      
      if (attempts >= maxAttempts) {
        return NextResponse.json({ 
          message: 'Search timeout',
          error: 'Search took too long to complete'
        }, { status: 408 });
      }
    }

    if (!data.data || data.data.length === 0 || !data.data[0] || data.data[0].length === 0) {
      return NextResponse.json({ 
        message: 'No restaurants found',
        restaurants: []
      });
    }

    // Process and clean the data
    const restaurants = data.data[0].map((restaurant: any) => ({
      name: restaurant.name || 'Unknown Restaurant',
      address: restaurant.full_address || restaurant.address || 'Address not available',
      city: restaurant.city || '',
      state: restaurant.state || '',
      postal_code: restaurant.postal_code || '',
      country: restaurant.country || 'US',
      neighborhood: restaurant.neighborhood || '',
      latitude: restaurant.latitude || null,
      longitude: restaurant.longitude || null,
      phone: restaurant.phone || '',
      website: restaurant.website || '',
      rating: restaurant.rating || null,
      reviews: restaurant.reviews || null,
      category: restaurant.category || '',
      price_range: restaurant.price_range || '',
      place_id: restaurant.place_id || '',
      google_id: restaurant.google_id || '',
      business_status: restaurant.business_status || '',
      verified: restaurant.verified || false,
      logo: restaurant.logo || '',
      photo: restaurant.photo || '',
      street_view: restaurant.street_view || '',
      time_zone: restaurant.time_zone || '',
      plus_code: restaurant.plus_code || '',
      typical_time_spent: restaurant.typical_time_spent || '',
      subtypes: restaurant.subtypes || '',
      photos_count: restaurant.photos_count || 0,
      menu_link: restaurant.menu_link || '',
      booking_appointment_link: restaurant.booking_appointment_link || '',
      service_options: restaurant.service_options || '',
      highlights: restaurant.highlights || '',
      popular_for: restaurant.popular_for || '',
      accessibility: restaurant.accessibility || '',
      offerings: restaurant.offerings || '',
      dining_options: restaurant.dining_options || '',
      amenities: restaurant.amenities || '',
      atmosphere: restaurant.atmosphere || '',
      crowd: restaurant.crowd || '',
      planning: restaurant.planning || '',
      payments: restaurant.payments || '',
      parking: restaurant.parking || '',
      reviews_tags: restaurant.reviews_tags || '',
      reviews_per_score: restaurant.reviews_per_score || '',
      reservation_links: restaurant.reservation_links || '',
      order_links: restaurant.order_links || ''
    }));

    return NextResponse.json({ 
      success: true,
      restaurants: restaurants,
      count: restaurants.length,
      query: searchQuery
    });

  } catch (error) {
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}