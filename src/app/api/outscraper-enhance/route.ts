import { NextRequest, NextResponse } from 'next/server';

// Helper function to poll for async results
async function pollForResults(taskId: string, apiKey: string, maxAttempts = 20, delayMs = 3000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const statusResponse = await fetch(`https://api.app.outscraper.com/requests/${taskId}`, {
      headers: { 'X-API-KEY': apiKey }
    });
    
    if (!statusResponse.ok) {
      throw new Error(`Failed to check task status: ${statusResponse.status}`);
    }
    
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'Success') {
      return statusData;
    } else if (statusData.status === 'Failed') {
      throw new Error('Outscraper task failed');
    }
    // If status is still 'Pending', continue polling
  }
  
  throw new Error('Timeout waiting for Outscraper results');
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, city, state } = await request.json();

    if (!name || !address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    const outscraperApiKey = process.env.OUTSCRAPER_API_KEY;
    if (!outscraperApiKey) {
      return NextResponse.json({ error: 'Outscraper API key not configured' }, { status: 500 });
    }

    // Construct search query with exact address for better matching
    const query = `${name} ${address} ${city || ''} ${state || ''}`.trim();
    
    const outscraperResponse = await fetch('https://api.app.outscraper.com/maps/search-v3', {
      method: 'POST',
      headers: {
        'X-API-KEY': outscraperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        language: 'en',
        region: 'us',
        limit: 3, // Get top 3 results to find best match
        async: 'true'
      })
    });

    if (!outscraperResponse.ok) {
      const errorText = await outscraperResponse.text();
      throw new Error(`Outscraper API error: ${outscraperResponse.status} - ${errorText}`);
    }

    const initialData = await outscraperResponse.json();
    
    let result;
    let results: any[] = [];
    
    // Check if we got a task ID for async processing
    if (initialData.id) {
      // Poll for results
      const outscraperData = await pollForResults(initialData.id, outscraperApiKey);
      
      if (!outscraperData || !outscraperData.data || outscraperData.data.length === 0 || !outscraperData.data[0] || outscraperData.data[0].length === 0) {
        return NextResponse.json({ 
          error: 'No data found for this restaurant',
          data: null 
        }, { status: 404 });
      }

      results = outscraperData.data[0];
    } else if (initialData.data && initialData.data.length > 0 && initialData.data[0] && initialData.data[0].length > 0) {
      // If results came back immediately
      results = initialData.data[0];
    } else {
      return NextResponse.json({ 
        error: 'No data found for this restaurant',
        data: null 
      }, { status: 404 });
    }
    
    // Find best match: prioritize OPERATIONAL status and name similarity
    const nameLower = name.toLowerCase();
    const addressLower = address.toLowerCase();
    
    result = results.find((r: any) => {
      const matchesName = r.name && r.name.toLowerCase().includes(nameLower.split(' ')[0]);
      const matchesAddress = r.street && r.street.toLowerCase().includes(addressLower.split(' ')[0]);
      const isOperational = r.business_status === 'OPERATIONAL';
      return matchesName && matchesAddress && isOperational;
    });
    
    // Fallback to first OPERATIONAL result if no perfect match
    if (!result) {
      result = results.find((r: any) => r.business_status === 'OPERATIONAL');
    }
    
    // Last resort: use first result
    if (!result) {
      result = results[0];
    }
    
    if (!result) {
      return NextResponse.json({ 
        error: 'No data found for this restaurant',
        data: null 
      }, { status: 404 });
    }
    
    // Extract and format the data
    const enhancedData = {
      phone: result.phone || result.phone_number || null,
      website: result.website || result.site || null,
      rating: result.rating || null,
      reviews: result.reviews || result.reviews_count || null,
      price_range: result.price || result.price_range || result.range || null,
      category: result.category || result.type || null,
      working_hours: result.working_hours || null,
      about: result.about || null, // Pass the entire about object
      additional_features: result.amenities ? (Array.isArray(result.amenities) ? result.amenities.join(', ') : result.amenities) : null,
      privateRooms: [], // This would need to be extracted from description or other fields
      business_status: result.business_status || null,
      place_id: result.place_id || null,
      google_id: result.google_id || null,
      plus_code: result.plus_code || null,
      time_zone: result.time_zone || null,
      typical_time_spent: result.typical_time_spent || null,
      reviews_per_score: result.reviews_per_score ? (typeof result.reviews_per_score === 'string' ? result.reviews_per_score : JSON.stringify(result.reviews_per_score)) : null,
      reviews_tags: result.reviews_tags ? (typeof result.reviews_tags === 'string' ? result.reviews_tags : JSON.stringify(result.reviews_tags)) : null,
      photos_count: result.photos_count || null,
      verified: result.verified || false,
      accessibility: result.accessibility || null,
      atmosphere: result.atmosphere || null,
      parking: result.parking || null,
      menu_link: result.menu_link || null,
      reservation_links: result.reservation_links ? (typeof result.reservation_links === 'string' ? result.reservation_links : JSON.stringify(result.reservation_links)) : null,
      order_links: result.order_links ? (typeof result.order_links === 'string' ? result.order_links : JSON.stringify(result.order_links)) : null,
      booking_appointment_link: result.booking_appointment_link || null,
      logo: result.logo || null,
      subtypes: result.subtypes || null,
      description: result.description || null,
      photo: result.photo || null,
      street_view: result.street_view || null,
      popular_times: result.popular_times || null
    };

    return NextResponse.json(enhancedData);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to enhance restaurant data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
