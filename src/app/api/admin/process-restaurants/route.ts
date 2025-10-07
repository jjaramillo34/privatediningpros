import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { processPendingRestaurants, processRestaurantGeocoding, validateRestaurantData } from '@/lib/background-jobs';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // You can add admin role check here if you have user roles
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const { action, restaurantId } = await request.json();

    let result;

    switch (action) {
      case 'process-pending':
        result = await processPendingRestaurants();
        break;
        
      case 'geocode-restaurant':
        if (!restaurantId) {
          return NextResponse.json({ message: 'Restaurant ID is required' }, { status: 400 });
        }
        result = await processRestaurantGeocoding(restaurantId);
        break;
        
      case 'validate-restaurant':
        if (!restaurantId) {
          return NextResponse.json({ message: 'Restaurant ID is required' }, { status: 400 });
        }
        result = await validateRestaurantData(restaurantId);
        break;
        
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error('Error in process-restaurants route:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
