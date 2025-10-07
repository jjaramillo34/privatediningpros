import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { restaurantData, format = 'markdown' } = await request.json();

    if (!restaurantData) {
      return NextResponse.json({ 
        success: false, 
        message: 'Restaurant data is required' 
      }, { status: 400 });
    }

    // Generate description based on format
    let description = '';
    
    if (format === 'markdown') {
      description = generateMarkdownDescription(restaurantData);
    } else if (format === 'json') {
      description = generateJSONDescription(restaurantData);
    }

    return NextResponse.json({ 
      success: true, 
      description: description,
      format: format,
      length: description.length
    });

  } catch (error) {
    console.error('❌ Error generating description:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to generate description',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateMarkdownDescription(data: any): string {
  const {
    name,
    address,
    city,
    state,
    neighborhood,
    phone,
    website,
    category,
    price_range,
    rating,
    reviews,
    privateRooms = [],
    images = [],
    short_description,
    place_id,
    verified,
    business_status
  } = data;

  // Build image sources section if images exist
  let imageSourcesSection = '';
  if (images && images.length > 0) {
    const imageSources = images
      .filter((img: any) => img.website?.url)
      .map((img: any) => `- [${img.website.name || 'Source'}](${img.website.url})`)
      .join('\n');
    
    if (imageSources) {
      imageSourcesSection = `\n**Image Sources:**\n${imageSources}\n\n---\n\n`;
    }
  }

  // Build private rooms section
  let privateRoomsSection = '';
  if (privateRooms && privateRooms.length > 0) {
    const validRooms = privateRooms.filter((room: any) => room.name && room.capacity > 0);
    
    if (validRooms.length > 0) {
      privateRoomsSection = `\n### Private Dining Rooms\n\n`;
      
      validRooms.forEach((room: any, index: number) => {
        privateRoomsSection += `**${room.name}**: Up to ${room.capacity} guests`;
        if (room.description) {
          privateRoomsSection += ` - ${room.description}`;
        }
        privateRoomsSection += '\n\n';
      });
    }
  }

  // Build capacity summary
  let capacitySummary = '';
  if (privateRooms && privateRooms.length > 0) {
    const totalCapacity = privateRooms.reduce((sum: number, room: any) => sum + (room.capacity || 0), 0);
    const roomCount = privateRooms.filter((room: any) => room.name && room.capacity > 0).length;
    
    if (roomCount > 0) {
      capacitySummary = `\n#### Room Capacities at a Glance\n\n`;
      capacitySummary += `* **Total Private Rooms**: ${roomCount}\n`;
      capacitySummary += `* **Combined Capacity**: Up to ${totalCapacity} guests\n`;
      capacitySummary += `* **Perfect for**: Corporate events, private celebrations, business meetings\n\n`;
    }
  }

  // Build features section
  let featuresSection = '';
  const features = [];
  
  if (verified) features.push('**Verified Business**');
  if (business_status === 'OPERATIONAL') features.push('**Currently Operating**');
  if (rating && rating > 4) features.push(`**Highly Rated** (${rating}/5 stars)`);
  if (reviews && reviews > 100) features.push(`**Popular Choice** (${reviews} reviews)`);
  if (website) features.push('**Online Presence**');
  if (place_id) features.push('**Google Verified**');
  
  if (features.length > 0) {
    featuresSection = `\n#### Additional Features\n\n`;
    featuresSection += features.map(feature => `* ${feature}`).join('\n') + '\n\n';
  }

  // Generate the main description
  const location = [neighborhood, city, state].filter(Boolean).join(', ');
  const contactInfo = phone ? `\n\n**Contact**: ${phone}` : '';
  const websiteInfo = website ? `\n**Website**: [${website}](${website})` : '';
  
  const description = `${imageSourcesSection}### ${name} – Private Dining Overview

${name}, located at ${address}${location ? `, ${location}` : ''}, offers ${privateRooms?.length > 0 ? `a collection of **${privateRooms.filter((r: any) => r.name).length} beautifully designed private event rooms**` : '**exclusive private dining experiences**'} that cater to both business and social gatherings.${category ? ` Specializing in ${category} cuisine,` : ''} this ${price_range ? `${price_range} ` : ''}establishment provides an elegant setting for memorable private events.${contactInfo}${websiteInfo}${capacitySummary}${privateRoomsSection}${featuresSection}---

### Sample Short Description

> *Located at ${address}${location ? `, ${location}` : ''}, ${name} offers ${privateRooms?.length > 0 ? `${privateRooms.filter((r: any) => r.name).length} exquisitely designed private dining rooms` : 'exclusive private dining experiences'}, ideal for elegant gatherings${privateRooms?.length > 0 ? ` of up to ${privateRooms.reduce((sum: number, room: any) => sum + (room.capacity || 0), 0)} guests` : ''}. ${short_description || `Each space provides intimate, stylish settings with ${category ? `${category} cuisine` : 'fine dining'}, ${price_range ? `${price_range} pricing` : 'premium service'}, and flexible layouts for seated dinners, business meetings, or cocktail receptions`}, ensuring both privacy and sophistication in a modern, elegant environment.*`;

  return description;
}

function generateJSONDescription(data: any): string {
  const {
    name,
    address,
    city,
    state,
    neighborhood,
    phone,
    website,
    category,
    price_range,
    rating,
    reviews,
    privateRooms = [],
    images = [],
    short_description,
    place_id,
    verified,
    business_status
  } = data;

  const description = {
    restaurant: {
      name,
      address,
      location: {
        neighborhood,
        city,
        state,
        full_address: `${address}${neighborhood ? `, ${neighborhood}` : ''}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}`
      },
      contact: {
        phone,
        website
      },
      details: {
        category,
        price_range,
        rating,
        reviews,
        verified,
        business_status,
        place_id
      }
    },
    private_dining: {
      room_count: privateRooms?.filter((room: any) => room.name).length || 0,
      total_capacity: privateRooms?.reduce((sum: number, room: any) => sum + (room.capacity || 0), 0) || 0,
      rooms: privateRooms?.filter((room: any) => room.name && room.capacity > 0).map((room: any) => ({
        name: room.name,
        capacity: room.capacity,
        description: room.description
      })) || []
    },
    media: {
      image_count: images?.length || 0,
      images: images?.map((img: any) => ({
        url: img.url,
        alt: img.alt,
        title: img.title,
        source: img.source,
        website: img.website,
        dimensions: img.dimensions
      })) || []
    },
    content: {
      short_description,
      generated_description: `Located at ${address}${neighborhood ? `, ${neighborhood}` : ''}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}, ${name} offers ${privateRooms?.length > 0 ? `${privateRooms.filter((r: any) => r.name).length} private dining rooms` : 'exclusive private dining experiences'} with a total capacity of ${privateRooms?.reduce((sum: number, room: any) => sum + (room.capacity || 0), 0) || 'various'} guests. ${category ? `Specializing in ${category} cuisine, ` : ''}this ${price_range ? `${price_range} ` : ''}establishment provides an elegant setting for corporate events, private celebrations, and business meetings.`,
      features: [
        ...(verified ? ['Verified Business'] : []),
        ...(business_status === 'OPERATIONAL' ? ['Currently Operating'] : []),
        ...(rating && rating > 4 ? [`Highly Rated (${rating}/5 stars)`] : []),
        ...(reviews && reviews > 100 ? [`Popular Choice (${reviews} reviews)`] : []),
        ...(website ? ['Online Presence'] : []),
        ...(place_id ? ['Google Verified'] : [])
      ]
    }
  };

  return JSON.stringify(description, null, 2);
}
