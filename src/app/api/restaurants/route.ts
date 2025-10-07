import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    // If user is admin or super admin, show all restaurants (including pending)
    if (session && (session.user.role === 'admin' || session.user.role === 'super_admin')) {
      const restaurants = await Restaurant.find().sort({ createdAt: -1 });
      return NextResponse.json(restaurants);
    }
    
    // For public users, only show approved restaurants
    const restaurants = await Restaurant.find({ status: 'approved' }).sort({ createdAt: -1 });
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