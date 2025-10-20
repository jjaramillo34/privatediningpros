import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const statusFilter = searchParams.get('status');
    
    // If user is admin or super admin, show all restaurants (including pending) unless status filter is specified
    if (session && (session.user.role === 'admin' || session.user.role === 'super_admin')) {
      const query: { featured?: boolean; status?: string } = {};
      if (featuredOnly) {
        query.featured = true;
      }
      if (statusFilter) {
        query.status = statusFilter;
      }
      
      // Optimize: Select only necessary fields for listing (not full description, images array, etc.)
      const restaurants = await Restaurant.find(query)
        .select('name address full_address neighborhood city state status featured rating category price_range privateRooms photo image createdAt updatedAt submittedBy approvedBy approvedAt short_description')
        .sort({ createdAt: -1 })
        .lean() // Convert to plain JavaScript objects for better performance
        .exec();
        
      return NextResponse.json(restaurants);
    }
    
    // For public users, only show approved restaurants
    const query: { status: string; featured?: boolean } = { status: 'approved' };
    if (featuredOnly) {
      query.featured = true;
    }
    
    // Optimize: Select only necessary fields for public listing
    const restaurants = await Restaurant.find(query)
      .select('name address full_address neighborhood city state rating category price_range privateRooms photo image featured short_description')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
      
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    const restaurant = await Restaurant.create(data);
    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
} 