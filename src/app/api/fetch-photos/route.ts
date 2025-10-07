import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, photosLimit = 10 } = await request.json();

    if (!query) {
      return NextResponse.json({ 
        success: false, 
        message: 'Query parameter is required' 
      }, { status: 400 });
    }

    const outscraperApiKey = process.env.OUTSCRAPER_API_KEY;
    if (!outscraperApiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'Outscraper API key not configured' 
      }, { status: 500 });
    }

    // Build the URL with query parameters for Google Search Images
    const url = new URL('https://api.outscraper.cloud/google-search-images');
    url.searchParams.append('query', query);
    url.searchParams.append('async', 'false'); // Try synchronous first

    // Call Outscraper Google Search Images API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-KEY': outscraperApiKey,
      }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch photos from Outscraper API',
        error: `HTTP ${response.status}: ${response.statusText}`
      }, { status: response.status });
    }

    const data = await response.json();

    // Extract photos from Google Search Images response
    let photos: string[] = [];
    
    if (data && data.status === 'Success' && data.data && Array.isArray(data.data) && data.data.length > 0) {
      const imageArray = data.data[0]; // First (and usually only) query result
      
      photos = imageArray.map((imageObj: any, index: number) => {
        // Create rich image object with metadata
        const imageData = {
          url: imageObj.image?.url || imageObj.preview?.url || imageObj.url,
          alt: `${query} - Image ${index + 1}`,
          title: imageObj.website?.title || `${query} Restaurant`,
          source: 'Google Search Images',
          website: {
            url: imageObj.website?.url,
            title: imageObj.website?.title,
            name: imageObj.website?.name
          },
          dimensions: {
            width: imageObj.image?.width || imageObj.preview?.width,
            height: imageObj.image?.height || imageObj.preview?.height
          },
          position: imageObj.position || index + 1
        };
        
        return imageData;
      }).filter((img: any) => img.url).slice(0, photosLimit); // Limit to requested number
      
    } else if (data && Array.isArray(data)) {
      // Direct array of image objects
      photos = data.map((image: any, index: number) => {
        return image.url || image.link || image.src || image.image_url;
      }).filter(Boolean).slice(0, photosLimit);
    } else if (data && data.images && Array.isArray(data.images)) {
      // Alternative format with images array
      photos = data.images.map((image: any, index: number) => {
        return image.url || image.link || image.src || image.image_url;
      }).filter(Boolean).slice(0, photosLimit);
    } else if (data && data.results && Array.isArray(data.results)) {
      // Another possible format
      photos = data.results.map((result: any, index: number) => {
        return result.url || result.link || result.src || result.image_url;
      }).filter(Boolean).slice(0, photosLimit);
    }

    return NextResponse.json({ 
      success: true, 
      photos: photos,
      count: photos.length,
      query: query,
      source: 'google-search-images'
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch photos',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}