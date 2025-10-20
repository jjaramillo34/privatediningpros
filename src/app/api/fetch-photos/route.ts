import { NextRequest, NextResponse } from 'next/server';

// Helper function to poll for async results
async function pollForResults(taskId: string, apiKey: string, maxAttempts = 40, delayMs = 3000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Wait before polling (except first attempt)
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    const statusUrl = `https://api.outscraper.cloud/requests/${taskId}`;
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: { 'X-API-KEY': apiKey }
    });
    
    if (!statusResponse.ok) {
      continue;
    }
    
    const statusData = await statusResponse.json();
    
    // Check if task is completed
    if (statusData.status === 'Success') {
      // Check if we got data but it's empty - might need more time
      if (statusData.data && Array.isArray(statusData.data) && statusData.data.length > 0) {
        const firstResult = statusData.data[0];
        if (Array.isArray(firstResult) && firstResult.length === 0 && attempt < 5) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 more seconds
          continue; // Check again
        }
      }
      
      return statusData;
    }
    
    // Check if task failed
    if (statusData.status === 'Failed' || statusData.status === 'Error') {
      throw new Error(`Task failed with status: ${statusData.status}`);
    }
  }
  
  throw new Error(`Timeout: Task did not complete after ${maxAttempts} attempts`);
}

// Helper function to try fetching with a specific query
async function fetchWithQuery(query: string, apiKey: string, photosLimit: number) {
  const url = new URL('https://api.outscraper.cloud/google-search-images');
  url.searchParams.append('query', query);
  url.searchParams.append('async', 'true');
  url.searchParams.append('perQuery', photosLimit.toString()); // Limit results per query
  url.searchParams.append('language', 'en'); // English language
  url.searchParams.append('region', 'US'); // US region for better results
  url.searchParams.append('fields', 'query,name,image,website,preview'); // Only get image fields

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'X-API-KEY': apiKey }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const initialData = await response.json();
  
  let data = initialData;
  if (initialData.id) {
    data = await pollForResults(initialData.id, apiKey);
  }
  
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { query, photosLimit = 5 } = await request.json();

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

    // Try primary query first
    let data = await fetchWithQuery(query, outscraperApiKey, photosLimit);
    
    // Check if we got results
    let hasResults = data?.data?.[0]?.length > 0;
    
    // If no results, try alternative query formats optimized for Google Images
    if (!hasResults) {
      // Try adding "restaurant" keyword
      const altQuery1 = `${query} restaurant`;
      data = await fetchWithQuery(altQuery1, outscraperApiKey, photosLimit);
      hasResults = data?.data?.[0]?.length > 0;
      
      // If still no results, try with "photos" keyword for better image search
      if (!hasResults) {
        const altQuery2 = `${query} photos`;
        data = await fetchWithQuery(altQuery2, outscraperApiKey, photosLimit);
        hasResults = data?.data?.[0]?.length > 0;
      }
      
      // If still no results, try simplifying to just name + city
      if (!hasResults) {
        const parts = query.split(',');
        if (parts.length >= 2) {
          const simplifiedQuery = `${parts[0].trim()} restaurant ${parts[parts.length - 1].trim()}`;
          data = await fetchWithQuery(simplifiedQuery, outscraperApiKey, photosLimit);
          hasResults = data?.data?.[0]?.length > 0;
        }
      }
      
      // Last resort: try just the restaurant name
      if (!hasResults) {
        const parts = query.split(',');
        if (parts.length >= 1) {
          const nameOnlyQuery = `${parts[0].trim()} restaurant`;
          data = await fetchWithQuery(nameOnlyQuery, outscraperApiKey, photosLimit);
          hasResults = data?.data?.[0]?.length > 0;
        }
      }
    }

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