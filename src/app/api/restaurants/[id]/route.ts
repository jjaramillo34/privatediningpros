import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: 'Invalid restaurant ID format' }, { status: 400 });
    }
    
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    const restaurant = await Restaurant.findById(id);
    
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    
    // If user is not admin/super_admin, only show approved restaurants
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
      if (restaurant.status !== 'approved') {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
      }
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    // For partial updates (like featured toggle), we don't need to validate required fields
    // Only validate if we're doing a full update with name/address
    if (data.name && !data.address) {
      return NextResponse.json({ error: 'Address is required when updating name' }, { status: 400 });
    }
    if (data.address && !data.name) {
      return NextResponse.json({ error: 'Name is required when updating address' }, { status: 400 });
    }

    // Add approval tracking if status is being changed
    if (data.status && data.status !== 'pending') {
      data.approvedBy = session.user.id;
      data.approvedAt = new Date();
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const restaurant = await Restaurant.findByIdAndDelete(id);
    
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
  }
} 