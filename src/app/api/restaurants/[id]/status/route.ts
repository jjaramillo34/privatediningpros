import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/lib/restaurant.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { status, rejectionReason } = await request.json();
  const update: Record<string, unknown> = { status };
  if (status === 'approved') {
    update.approvedBy = session.user.id;
    update.approvedAt = new Date();
    update.rejectionReason = undefined;
  } else if (status === 'rejected') {
    update.approvedBy = session.user.id;
    update.approvedAt = new Date();
    update.rejectionReason = rejectionReason || '';
  }
  const restaurant = await Restaurant.findByIdAndUpdate(id, update, { new: true });
  if (!restaurant) {
    return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, restaurant });
} 